import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GameRoom, Player, Assignment, EliminationClaim, ChatMessage, Leaderboard } from '../types/game';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useSupabaseGame = () => {
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [pendingClaims, setPendingClaims] = useState<EliminationClaim[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(7 * 24 * 60 * 60 * 1000);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const generatePlayerId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Subscribe to room changes
  const subscribeToRoom = useCallback((roomId: string) => {
    if (!isSupabaseConfigured()) {
      console.warn('Cannot subscribe to room - Supabase not configured');
      setConnectionError('Supabase not configured. Please set up your environment variables.');
      return;
    }

    if (channel) {
      supabase.removeChannel(channel);
    }

    const newChannel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          console.log('Room updated:', payload);
          fetchRoomData(roomId);
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` },
        (payload) => {
          console.log('Players updated:', payload);
          fetchRoomData(roomId);
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${roomId}` },
        (payload) => {
          console.log('Chat updated:', payload);
          fetchChatMessages(roomId);
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'elimination_claims', filter: `room_id=eq.${roomId}` },
        (payload) => {
          console.log('Claims updated:', payload);
          fetchEliminationClaims(roomId);
        }
      )
      .subscribe();

    setChannel(newChannel);
  }, []);

  // Fetch room data
  const fetchRoomData = async (roomId: string) => {
    if (!isSupabaseConfigured()) {
      setConnectionError('Supabase not configured. Please set up your environment variables.');
      return;
    }

    try {
      console.log('Fetching room data for:', roomId);
      
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) {
        console.error('Room fetch error:', roomError);
        throw roomError;
      }

      console.log('Room data fetched:', roomData);

      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomId)
        .order('joined_at');

      if (playersError) {
        console.error('Players fetch error:', playersError);
        throw playersError;
      }

      console.log('Players data fetched:', playersData);

      // Convert database format to app format
      const room: GameRoom = {
        id: roomData.id,
        name: roomData.name,
        players: playersData.map(p => ({
          id: p.id,
          name: p.name,
          isAlive: p.is_alive,
          isSpectator: p.is_spectator,
          targetId: p.target_id || undefined,
          targetName: p.target_name || undefined,
          assignedObject: p.assigned_object || undefined,
          assignedPlace: p.assigned_place || undefined,
          suggestedObject: p.suggested_object || undefined,
          suggestedPlace: p.suggested_place || undefined,
          points: p.points,
          joinedAt: new Date(p.joined_at).getTime(),
          eliminatedAt: p.eliminated_at ? new Date(p.eliminated_at).getTime() : undefined,
          confirmedReady: p.confirmed_ready,
          gamesPlayed: p.games_played,
          gamesWon: p.games_won
        })),
        gameState: roomData.game_state,
        startTime: roomData.start_time ? new Date(roomData.start_time).getTime() : undefined,
        endTime: roomData.end_time ? new Date(roomData.end_time).getTime() : undefined,
        maxPlayers: roomData.max_players,
        minPlayers: roomData.min_players,
        duration: roomData.duration,
        createdBy: roomData.created_by,
        settings: roomData.settings,
        suggestedObjects: roomData.suggested_objects,
        suggestedPlaces: roomData.suggested_places
      };

      console.log('Setting room state:', room);
      setCurrentRoom(room);

      // Update current player if they're in this room
      if (currentPlayer) {
        const updatedPlayer = room.players.find(p => p.id === currentPlayer.id);
        if (updatedPlayer) {
          console.log('Updating current player:', updatedPlayer);
          setCurrentPlayer(updatedPlayer);
          
          // Update assignment if player has one
          if (updatedPlayer.targetId) {
            setAssignment({
              playerId: updatedPlayer.id,
              targetId: updatedPlayer.targetId,
              targetName: updatedPlayer.targetName || '',
              object: updatedPlayer.assignedObject || '',
              place: updatedPlayer.assignedPlace || ''
            });
          }
        }
      }

      // Update time remaining if game is active
      if (room.gameState === 'active' && room.startTime) {
        const elapsed = Date.now() - room.startTime;
        const remaining = Math.max(0, room.duration - elapsed);
        setTimeRemaining(remaining);
        setGameStartTime(room.startTime);
      }

      // Clear any previous connection errors on successful fetch
      setConnectionError(null);

    } catch (error: any) {
      console.error('Error fetching room data:', error);
      if (error.message.includes('Failed to fetch')) {
        setConnectionError('Cannot connect to Supabase. Please check your configuration and internet connection.');
      } else {
        setConnectionError(`Failed to fetch room data: ${error.message}`);
      }
    }
  };

  // Fetch chat messages
  const fetchChatMessages = async (roomId: string) => {
    if (!isSupabaseConfigured()) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('timestamp');

      if (error) throw error;

      const messages: ChatMessage[] = data.map(msg => ({
        id: msg.id,
        playerId: msg.player_id,
        playerName: msg.player_name,
        message: msg.message,
        timestamp: new Date(msg.timestamp).getTime(),
        isSystemMessage: msg.is_system_message
      }));

      setChatMessages(messages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  // Fetch elimination claims
  const fetchEliminationClaims = async (roomId: string) => {
    if (!isSupabaseConfigured()) return;

    try {
      const { data, error } = await supabase
        .from('elimination_claims')
        .select('*')
        .eq('room_id', roomId)
        .in('status', ['pending', 'disputed']);

      if (error) throw error;

      const claims: EliminationClaim[] = data.map(claim => ({
        id: claim.id,
        claimerId: claim.claimer_id,
        targetId: claim.target_id,
        timestamp: new Date(claim.timestamp).getTime(),
        videoUrl: claim.video_url || undefined,
        status: claim.status,
        targetResponse: claim.target_response || undefined,
        witnesses: claim.witnesses || undefined,
        witnessResponses: claim.witness_responses || undefined
      }));

      setPendingClaims(claims);
    } catch (error) {
      console.error('Error fetching elimination claims:', error);
    }
  };

  // Fetch leaderboard with improved error handling
  const fetchLeaderboard = async () => {
    if (!isSupabaseConfigured()) {
      setConnectionError('Supabase not configured. Please set up your environment variables.');
      setLeaderboard([]);
      return;
    }

    try {
      setConnectionError(null);
      
      // Test basic connectivity first with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
      );

      const testPromise = supabase
        .from('leaderboard')
        .select('count')
        .limit(1);

      const { error: testError } = await Promise.race([testPromise, timeoutPromise]) as any;

      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }

      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('total_points', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Leaderboard query error:', error);
        throw new Error(`Failed to fetch leaderboard: ${error.message}`);
      }

      const leaderboardData: Leaderboard[] = data.map(entry => ({
        playerId: entry.player_id,
        playerName: entry.player_name,
        totalPoints: entry.total_points,
        gamesPlayed: entry.games_played,
        gamesWon: entry.games_won,
        averagePosition: entry.average_position
      }));

      setLeaderboard(leaderboardData);
      console.log('Leaderboard fetched successfully:', leaderboardData.length, 'entries');
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      
      // Set specific error messages based on error type
      if (error.message.includes('Failed to fetch') || error.message.includes('TypeError: Failed to fetch')) {
        setConnectionError('Cannot connect to Supabase. Please check your Supabase configuration and internet connection.');
      } else if (error.message.includes('Connection timeout')) {
        setConnectionError('Connection to Supabase timed out. Please check your network connection.');
      } else if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
        setConnectionError('Invalid Supabase API key. Please check your environment variables.');
      } else if (error.message.includes('relation') || error.message.includes('does not exist')) {
        setConnectionError('Database tables not found. Please run the migration SQL in your Supabase SQL Editor.');
      } else {
        setConnectionError(`Database error: ${error.message}`);
      }
      
      // Set empty leaderboard on error to prevent app crash
      setLeaderboard([]);
    }
  };

  // Create room
  const createRoom = async (roomName: string, playerName: string, suggestedObject: string, suggestedPlace: string) => {
    if (!isSupabaseConfigured()) {
      setConnectionError('Supabase not configured. Please set up your environment variables.');
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      setConnectionError(null);
      const roomId = generateRoomId();
      const playerId = generatePlayerId();

      console.log('Creating room:', { roomId, roomName, playerName });

      // Create room
      const { error: roomError } = await supabase
        .from('rooms')
        .insert({
          id: roomId,
          name: roomName,
          created_by: playerId,
          max_players: 20,
          min_players: 5,
          duration: 7 * 24 * 60 * 60 * 1000,
          settings: {
            allowObjectRejection: true,
            allowPlaceRejection: true,
            videoRequired: false,
            maxVideoLength: 15,
            customObjects: [],
            customPlaces: [],
            locationContext: 'general',
            gameDuration: 7
          },
          suggested_objects: [suggestedObject],
          suggested_places: [suggestedPlace]
        });

      if (roomError) {
        console.error('Room creation error:', roomError);
        throw roomError;
      }

      // Create player
      const { error: playerError } = await supabase
        .from('players')
        .insert({
          id: playerId,
          room_id: roomId,
          name: playerName,
          suggested_object: suggestedObject,
          suggested_place: suggestedPlace
        });

      if (playerError) {
        console.error('Player creation error:', playerError);
        throw playerError;
      }

      // Add welcome message
      await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          player_id: 'system',
          player_name: 'System',
          message: `${playerName} created the room`,
          is_system_message: true
        });

      // Set current player
      const newPlayer: Player = {
        id: playerId,
        name: playerName,
        isAlive: true,
        isSpectator: false,
        points: 0,
        joinedAt: Date.now(),
        confirmedReady: false,
        suggestedObject,
        suggestedPlace,
        gamesPlayed: 0,
        gamesWon: 0
      };
      
      console.log('Setting current player:', newPlayer);
      setCurrentPlayer(newPlayer);

      // Subscribe to room updates
      subscribeToRoom(roomId);
      
      // Fetch initial data
      await fetchRoomData(roomId);
      await fetchChatMessages(roomId);

      console.log('Room created successfully');
      return { success: true, roomId };
    } catch (error: any) {
      console.error('Error creating room:', error);
      if (error.message.includes('Failed to fetch')) {
        setConnectionError('Cannot connect to Supabase. Please check your configuration and internet connection.');
      } else {
        setConnectionError(`Failed to create room: ${error.message}`);
      }
      return { success: false, error: error.message };
    }
  };

  // Join room - COMPLETELY REWRITTEN to fix the issue
  const joinRoom = async (roomId: string, playerName: string, suggestedObject: string, suggestedPlace: string) => {
    if (!isSupabaseConfigured()) {
      setConnectionError('Supabase not configured. Please set up your environment variables.');
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      setConnectionError(null);
      const normalizedRoomId = roomId.toUpperCase();
      
      console.log('Attempting to join room:', { normalizedRoomId, playerName });
      
      // Check if room exists and get room data
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', normalizedRoomId)
        .single();

      if (roomError || !roomData) {
        console.error('Room not found:', roomError);
        return { success: false, error: 'Room not found' };
      }

      console.log('Found room:', roomData);

      // Check if room is full
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('id')
        .eq('room_id', normalizedRoomId);

      if (playersError) {
        console.error('Error checking players:', playersError);
        throw playersError;
      }

      if (playersData.length >= roomData.max_players) {
        return { success: false, error: 'Room is full' };
      }

      // Check if game has already started
      if (roomData.game_state !== 'lobby') {
        return { success: false, error: 'Game has already started' };
      }

      const playerId = generatePlayerId();

      console.log('Creating player:', { playerId, playerName, normalizedRoomId });

      // Create player
      const { error: playerError } = await supabase
        .from('players')
        .insert({
          id: playerId,
          room_id: normalizedRoomId,
          name: playerName,
          suggested_object: suggestedObject,
          suggested_place: suggestedPlace
        });

      if (playerError) {
        console.error('Player creation error:', playerError);
        throw playerError;
      }

      // Update room's suggested objects and places
      const updatedObjects = [...roomData.suggested_objects, suggestedObject];
      const updatedPlaces = [...roomData.suggested_places, suggestedPlace];

      await supabase
        .from('rooms')
        .update({
          suggested_objects: updatedObjects,
          suggested_places: updatedPlaces
        })
        .eq('id', normalizedRoomId);

      // Add join message
      await supabase
        .from('chat_messages')
        .insert({
          room_id: normalizedRoomId,
          player_id: 'system',
          player_name: 'System',
          message: `${playerName} joined the room`,
          is_system_message: true
        });

      // Set current player FIRST
      const newPlayer: Player = {
        id: playerId,
        name: playerName,
        isAlive: true,
        isSpectator: false,
        points: 0,
        joinedAt: Date.now(),
        confirmedReady: false,
        suggestedObject,
        suggestedPlace,
        gamesPlayed: 0,
        gamesWon: 0
      };
      
      console.log('Setting current player:', newPlayer);
      setCurrentPlayer(newPlayer);

      // Subscribe to room updates BEFORE setting room state
      subscribeToRoom(normalizedRoomId);
      
      // Wait a moment for subscription to be established
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Fetch complete room data (this will set the correct room state)
      await fetchRoomData(normalizedRoomId);
      await fetchChatMessages(normalizedRoomId);
      await fetchEliminationClaims(normalizedRoomId);

      console.log('Successfully joined room');
      return { success: true, roomId: normalizedRoomId };
    } catch (error: any) {
      console.error('Error joining room:', error);
      if (error.message.includes('Failed to fetch')) {
        setConnectionError('Cannot connect to Supabase. Please check your configuration and internet connection.');
      } else {
        setConnectionError(`Failed to join room: ${error.message}`);
      }
      return { success: false, error: error.message };
    }
  };

  // Send chat message
  const sendMessage = async (message: string) => {
    if (!currentRoom || !currentPlayer || !isSupabaseConfigured()) return;

    try {
      await supabase
        .from('chat_messages')
        .insert({
          room_id: currentRoom.id,
          player_id: currentPlayer.id,
          player_name: currentPlayer.name,
          message: message
        });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Update room settings
  const updateSettings = async (settings: Partial<GameRoom['settings']>) => {
    if (!currentRoom || !currentPlayer || currentRoom.createdBy !== currentPlayer.id || !isSupabaseConfigured()) return;

    try {
      const updatedSettings = { ...currentRoom.settings, ...settings };
      let updateData: any = { settings: updatedSettings };

      // If game duration changed, update the room duration
      if (settings.gameDuration !== undefined) {
        const newDurationMs = settings.gameDuration * 24 * 60 * 60 * 1000;
        updateData.duration = newDurationMs;
      }

      await supabase
        .from('rooms')
        .update(updateData)
        .eq('id', currentRoom.id);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  // Start game
  const startGame = async () => {
    if (!currentRoom || !currentPlayer || currentRoom.createdBy !== currentPlayer.id || !isSupabaseConfigured()) return;

    try {
      // Generate assignments
      const assignments = generateAssignments(
        currentRoom.players,
        currentRoom.suggestedObjects,
        currentRoom.suggestedPlaces
      );

      // Update all players with their assignments
      for (const assignment of assignments) {
        await supabase
          .from('players')
          .update({
            target_id: assignment.targetId,
            target_name: assignment.targetName,
            assigned_object: assignment.object,
            assigned_place: assignment.place
          })
          .eq('id', assignment.playerId);
      }

      // Update room state
      await supabase
        .from('rooms')
        .update({
          game_state: 'assigning',
          start_time: new Date().toISOString()
        })
        .eq('id', currentRoom.id);

      // Add system message
      await supabase
        .from('chat_messages')
        .insert({
          room_id: currentRoom.id,
          player_id: 'system',
          player_name: 'System',
          message: 'Game starting! Check your assignments.',
          is_system_message: true
        });

    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  // Generate assignments (same logic as before)
  const generateAssignments = (players: Player[], suggestedObjects: string[], suggestedPlaces: string[]) => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const shuffledObjects = [...suggestedObjects].sort(() => Math.random() - 0.5);
    const shuffledPlaces = [...suggestedPlaces].sort(() => Math.random() - 0.5);
    
    const assignments: Assignment[] = shuffledPlayers.map((player, index) => {
      const targetIndex = (index + 1) % shuffledPlayers.length;
      const targetPlayer = shuffledPlayers[targetIndex];
      
      return {
        playerId: player.id,
        targetId: targetPlayer.id,
        targetName: targetPlayer.name,
        object: shuffledObjects[index % shuffledObjects.length],
        place: shuffledPlaces[index % shuffledPlaces.length]
      };
    });

    return assignments;
  };

  // Confirm assignment
  const confirmAssignment = async () => {
    if (!currentPlayer || !currentRoom || !isSupabaseConfigured()) return;

    try {
      await supabase
        .from('players')
        .update({ confirmed_ready: true })
        .eq('id', currentPlayer.id);

      // Check if all players are ready
      const { data: playersData } = await supabase
        .from('players')
        .select('confirmed_ready')
        .eq('room_id', currentRoom.id);

      const allReady = playersData?.every(p => p.confirmed_ready) || false;

      if (allReady) {
        // All players ready, start the active game
        await supabase
          .from('rooms')
          .update({ game_state: 'active' })
          .eq('id', currentRoom.id);

        await supabase
          .from('chat_messages')
          .insert({
            room_id: currentRoom.id,
            player_id: 'system',
            player_name: 'System',
            message: 'All players confirmed! Game is now active!',
            is_system_message: true
          });
      }
    } catch (error) {
      console.error('Error confirming assignment:', error);
    }
  };

  // Submit elimination claim
  const submitClaim = async (targetId: string) => {
    if (!currentPlayer || !currentRoom || !isSupabaseConfigured()) return;

    try {
      await supabase
        .from('elimination_claims')
        .insert({
          room_id: currentRoom.id,
          claimer_id: currentPlayer.id,
          target_id: targetId,
          status: 'pending'
        });

      // Add system message
      const targetPlayer = currentRoom.players.find(p => p.id === targetId);
      await supabase
        .from('chat_messages')
        .insert({
          room_id: currentRoom.id,
          player_id: 'system',
          player_name: 'System',
          message: `${currentPlayer.name} claims to have eliminated ${targetPlayer?.name}!`,
          is_system_message: true
        });
    } catch (error) {
      console.error('Error submitting claim:', error);
    }
  };

  // Respond to elimination claim
  const respondToClaim = async (claimId: string, response: 'confirm' | 'deny') => {
    if (!currentPlayer || !currentRoom || !isSupabaseConfigured()) return;

    try {
      if (response === 'confirm') {
        // Update claim status
        await supabase
          .from('elimination_claims')
          .update({
            status: 'confirmed',
            target_response: response
          })
          .eq('id', claimId);

        // Eliminate the target
        const claim = pendingClaims.find(c => c.id === claimId);
        if (claim) {
          await supabase
            .from('players')
            .update({
              is_alive: false,
              eliminated_at: new Date().toISOString()
            })
            .eq('id', claim.targetId);

          // Add elimination message
          const targetPlayer = currentRoom.players.find(p => p.id === claim.targetId);
          const claimerPlayer = currentRoom.players.find(p => p.id === claim.claimerId);
          await supabase
            .from('chat_messages')
            .insert({
              room_id: currentRoom.id,
              player_id: 'system',
              player_name: 'System',
              message: `${targetPlayer?.name} has been eliminated by ${claimerPlayer?.name}!`,
              is_system_message: true
            });
        }
      } else {
        // Target denied - need witnesses
        const alivePlayers = currentRoom.players.filter(p => 
          p.isAlive && p.id !== currentPlayer.id && p.id !== claimId
        );
        const witnesses = alivePlayers.map(p => p.id);

        await supabase
          .from('elimination_claims')
          .update({
            status: 'disputed',
            target_response: response,
            witnesses: witnesses,
            witness_responses: {}
          })
          .eq('id', claimId);

        // Add system message
        await supabase
          .from('chat_messages')
          .insert({
            room_id: currentRoom.id,
            player_id: 'system',
            player_name: 'System',
            message: `${currentPlayer.name} denied the elimination claim. We are seeking witnesses!`,
            is_system_message: true
          });
      }
    } catch (error) {
      console.error('Error responding to claim:', error);
    }
  };

  // Witness response
  const witnessResponse = async (claimId: string, response: 'confirm' | 'deny') => {
    if (!currentPlayer || !currentRoom || !isSupabaseConfigured()) return;

    try {
      const claim = pendingClaims.find(c => c.id === claimId);
      if (!claim) return;

      const witnessResponses = { ...claim.witnessResponses, [currentPlayer.id]: response };

      if (response === 'confirm') {
        // Any witness confirmation eliminates the target
        await supabase
          .from('elimination_claims')
          .update({
            status: 'verified',
            witness_responses: witnessResponses
          })
          .eq('id', claimId);

        // Eliminate the target
        await supabase
          .from('players')
          .update({
            is_alive: false,
            eliminated_at: new Date().toISOString()
          })
          .eq('id', claim.targetId);

        // Add elimination message
        const targetPlayer = currentRoom.players.find(p => p.id === claim.targetId);
        const claimerPlayer = currentRoom.players.find(p => p.id === claim.claimerId);
        await supabase
          .from('chat_messages')
          .insert({
            room_id: currentRoom.id,
            player_id: 'system',
            player_name: 'System',
            message: `${targetPlayer?.name} has been eliminated by ${claimerPlayer?.name} (confirmed by witness ${currentPlayer.name})!`,
            is_system_message: true
          });
      } else {
        // Check if all witnesses have responded
        const totalWitnesses = claim.witnesses?.length || 0;
        const responseCount = Object.keys(witnessResponses).length;

        if (responseCount === totalWitnesses) {
          // All witnesses denied - claim rejected
          await supabase
            .from('elimination_claims')
            .update({
              status: 'rejected',
              witness_responses: witnessResponses
            })
            .eq('id', claimId);

          await supabase
            .from('chat_messages')
            .insert({
              room_id: currentRoom.id,
              player_id: 'system',
              player_name: 'System',
              message: 'Elimination claim rejected - no witnesses confirmed the elimination.',
              is_system_message: true
            });
        } else {
          // Update witness responses
          await supabase
            .from('elimination_claims')
            .update({
              witness_responses: witnessResponses
            })
            .eq('id', claimId);
        }
      }
    } catch (error) {
      console.error('Error submitting witness response:', error);
    }
  };

  // Leave room
  const leaveRoom = async () => {
    if (channel) {
      supabase.removeChannel(channel);
      setChannel(null);
    }

    if (currentPlayer && currentRoom && isSupabaseConfigured()) {
      try {
        // Remove player from room
        await supabase
          .from('players')
          .delete()
          .eq('id', currentPlayer.id);

        // Add leave message
        await supabase
          .from('chat_messages')
          .insert({
            room_id: currentRoom.id,
            player_id: 'system',
            player_name: 'System',
            message: `${currentPlayer.name} left the room`,
            is_system_message: true
          });
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    }

    setCurrentRoom(null);
    setCurrentPlayer(null);
    setAssignment(null);
    setPendingClaims([]);
    setChatMessages([]);
    setGameStartTime(null);
    setConnectionError(null);
  };

  // Initialize leaderboard on mount with improved retry logic
  useEffect(() => {
    const initializeLeaderboard = async () => {
      // Skip if Supabase is not configured
      if (!isSupabaseConfigured()) {
        setConnectionError('Supabase not configured. Please set up your environment variables.');
        setLeaderboard([]);
        return;
      }

      let retries = 2; // Reduced retries to avoid long delays
      let delay = 1000; // Start with 1 second delay
      
      while (retries > 0) {
        try {
          await fetchLeaderboard();
          break; // Success, exit retry loop
        } catch (error) {
          retries--;
          if (retries > 0) {
            console.log(`Retrying leaderboard fetch... ${retries} attempts remaining`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
          } else {
            console.error('Failed to fetch leaderboard after all retries');
            setConnectionError('Unable to connect to database. Please check your Supabase configuration.');
          }
        }
      }
    };

    initializeLeaderboard();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (currentRoom?.gameState === 'active' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1000));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentRoom?.gameState, timeRemaining]);

  return {
    currentRoom,
    currentPlayer,
    assignment,
    pendingClaims,
    chatMessages,
    leaderboard,
    timeRemaining,
    gameStartTime,
    connectionError,
    createRoom,
    joinRoom,
    sendMessage,
    updateSettings,
    startGame,
    confirmAssignment,
    submitClaim,
    respondToClaim,
    witnessResponse,
    leaveRoom,
    fetchLeaderboard
  };
};