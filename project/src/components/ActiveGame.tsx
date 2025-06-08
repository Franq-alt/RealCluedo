import React, { useState } from 'react';
import { Target, Clock, Users, MessageCircle, AlertTriangle } from 'lucide-react';
import { Player, GameRoom, EliminationClaim, ChatMessage } from '../types/game';
import { Chat } from './Chat';
import { PlayerList } from './PlayerList';

interface ActiveGameProps {
  room: GameRoom;
  currentPlayer: Player;
  timeRemaining: number;
  onSubmitClaim: (targetId: string) => void;
  onRespondToClaim: (claimId: string, response: 'confirm' | 'deny') => void;
  onWitnessResponse: (claimId: string, response: 'confirm' | 'deny') => void;
  pendingClaims: EliminationClaim[];
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export const ActiveGame: React.FC<ActiveGameProps> = ({
  room,
  currentPlayer,
  timeRemaining,
  onSubmitClaim,
  onRespondToClaim,
  onWitnessResponse,
  pendingClaims,
  chatMessages,
  onSendMessage
}) => {
  const [showChat, setShowChat] = useState(false);

  const alivePlayers = room.players.filter(p => p.isAlive);
  
  const formatTimeRemaining = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleClaimElimination = () => {
    if (!currentPlayer.targetId) return;
    onSubmitClaim(currentPlayer.targetId);
  };

  // Claims that need current player's response
  const claimsForResponse = pendingClaims.filter(claim => 
    claim.targetId === currentPlayer.id && claim.status === 'pending'
  );
  
  const claimsForWitness = pendingClaims.filter(claim => 
    claim.witnesses?.includes(currentPlayer.id) && 
    claim.status === 'disputed' &&
    !claim.witnessResponses?.[currentPlayer.id]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-300">ACTIVE GAME</h2>
        </div>

        {/* Header */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-6 border border-red-500/30">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white drop-shadow-2xl">
              <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                Bang Bang
              </span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-yellow-200">
                <Clock size={20} />
                <span className="font-medium">{formatTimeRemaining(timeRemaining)}</span>
              </div>
              <div className="flex items-center gap-2 text-green-300">
                <Users size={20} />
                <span className="font-medium">{alivePlayers.length} alive</span>
              </div>
            </div>
          </div>

          {/* Player Status */}
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg font-medium ${
              currentPlayer.isAlive 
                ? 'bg-green-600/20 text-green-300 border border-green-400/30'
                : 'bg-red-600/20 text-red-300 border border-red-400/30'
            }`}>
              {currentPlayer.isAlive ? 'Alive' : 'Eliminated'}
            </div>
            <div className="text-white">
              <span className="text-yellow-200">Points: </span>
              <span className="font-bold">{currentPlayer.points}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Display (for alive players) */}
            {currentPlayer.isAlive && (
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-red-500/30">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target size={20} />
                  Your Mission
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-4">
                    <h3 className="text-red-300 font-medium mb-1">Target</h3>
                    <p className="text-white font-bold">{currentPlayer.targetName}</p>
                  </div>
                  <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-4">
                    <h3 className="text-yellow-300 font-medium mb-1">Object</h3>
                    <p className="text-white font-bold">{currentPlayer.assignedObject}</p>
                  </div>
                  <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4">
                    <h3 className="text-green-300 font-medium mb-1">Location</h3>
                    <p className="text-white font-bold">{currentPlayer.assignedPlace}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Elimination Claims */}
            {currentPlayer.isAlive && (
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-red-500/30">
                <h2 className="text-xl font-bold text-white mb-4">Make a Claim</h2>
                <div className="space-y-4">
                  <button
                    onClick={handleClaimElimination}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-lg font-bold text-xl transition-all transform hover:scale-105 shadow-lg border border-yellow-400/30"
                  >
                    🎯 BANG BANG! 🎯
                  </button>
                  <p className="text-red-200 text-sm text-center">
                    Claim elimination of <strong>{currentPlayer.targetName}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Pending Claims for Response */}
            {claimsForResponse.map(claim => (
              <div key={claim.id} className="bg-red-600/20 border border-red-400/30 rounded-2xl p-6">
                <h3 className="text-red-300 font-bold mb-2">Elimination Claim Against You</h3>
                <p className="text-white mb-4">
                  {room.players.find(p => p.id === claim.claimerId)?.name} claims to have eliminated you.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => onRespondToClaim(claim.id, 'confirm')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors border border-green-400/30"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => onRespondToClaim(claim.id, 'deny')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors border border-red-400/30"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}

            {/* Witness Requests */}
            {claimsForWitness.map(claim => (
              <div key={claim.id} className="bg-yellow-600/20 border border-yellow-400/30 rounded-2xl p-6">
                <h3 className="text-yellow-300 font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Witness Request
                </h3>
                <p className="text-white mb-4">
                  <strong>{room.players.find(p => p.id === claim.claimerId)?.name}</strong> claims to have eliminated{' '}
                  <strong>{room.players.find(p => p.id === claim.targetId)?.name}</strong>, but the target denied it.
                </p>
                <p className="text-yellow-200 mb-4 text-sm">
                  Did you witness this elimination? Your vote matters - if any witness confirms, the elimination is valid.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => onWitnessResponse(claim.id, 'confirm')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors border border-green-400/30"
                  >
                    Yes, I witnessed it
                  </button>
                  <button
                    onClick={() => onWitnessResponse(claim.id, 'deny')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors border border-red-400/30"
                  >
                    No, I didn't see it
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PlayerList players={room.players} currentPlayerId={currentPlayer.id} />
            
            <button
              onClick={() => setShowChat(!showChat)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 border border-blue-400/30"
            >
              <MessageCircle size={20} />
              {showChat ? 'Hide Chat' : 'Show Chat'}
            </button>
            
            {showChat && (
              <Chat
                messages={chatMessages}
                onSendMessage={onSendMessage}
                currentPlayerId={currentPlayer.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};