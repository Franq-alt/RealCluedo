import React, { useState } from 'react';
import { Users, Settings, Play, Copy, Check, Share2, Link, Clock } from 'lucide-react';
import { GameRoom, Player } from '../types/game';

interface GameLobbyProps {
  room: GameRoom;
  currentPlayer: Player;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onUpdateSettings: (settings: Partial<GameRoom['settings']>) => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({
  room,
  currentPlayer,
  onStartGame,
  onLeaveRoom,
  onUpdateSettings
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const isHost = room.createdBy === currentPlayer.id;
  const canStart = room.players.length >= room.minPlayers && room.players.length <= room.maxPlayers;

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareInvite = async () => {
    const inviteText = `Join my Bang Bang game! Room code: ${room.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bang Bang Game Invite',
          text: inviteText,
          url: window.location.origin
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(inviteText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(inviteText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDuration = (days: number) => {
    if (days === 1) return '1 day';
    if (days === 7) return '1 week';
    if (days === 14) return '2 weeks';
    return `${days} days`;
  };

  const handleDurationChange = (value: number) => {
    onUpdateSettings({ gameDuration: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-300">GAME LOBBY</h2>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
              Bang Bang
            </span>
          </h1>
          <p className="text-yellow-300">Multiplayer Elimination Game</p>
        </div>

        {/* Room Info */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-6 border border-red-500/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{room.name}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={copyRoomCode}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-colors border border-yellow-400/30"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : room.id}
              </button>
              <button
                onClick={() => setShowInvite(!showInvite)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-colors border border-blue-400/30"
              >
                <Share2 size={16} />
                Invite
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-red-200">
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{room.players.length}/{room.maxPlayers} players</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Duration: {formatDuration(room.settings.gameDuration)}</span>
            </div>
          </div>

          {/* Invite Section */}
          {showInvite && (
            <div className="mt-4 p-4 bg-blue-600/20 border border-blue-400/30 rounded-lg">
              <h4 className="text-blue-300 font-medium mb-3">Invite Players</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-blue-900/20 rounded-lg p-3">
                  <Link size={16} className="text-blue-300" />
                  <span className="text-white text-sm flex-1">Room Code: <strong>{room.id}</strong></span>
                  <button
                    onClick={copyRoomCode}
                    className="text-blue-300 hover:text-blue-100 transition-colors text-sm"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <button
                  onClick={shareInvite}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 size={16} />
                  Share Invite
                </button>
                <p className="text-blue-200 text-sm">
                  Share the room code with friends or use the share button to send an invite message.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        {isHost && (
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-6 border border-red-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Game Settings</h3>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-yellow-300 hover:text-white transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
            
            {showSettings && (
              <div className="space-y-6">
                <div>
                  <label className="text-white block mb-3">
                    Game Duration: <span className="text-yellow-300 font-medium">{formatDuration(room.settings.gameDuration)}</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="14"
                      value={room.settings.gameDuration}
                      onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-red-900/40 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${((room.settings.gameDuration - 1) / 13) * 100}%, #7f1d1d ${((room.settings.gameDuration - 1) / 13) * 100}%, #7f1d1d 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-red-300">
                      <span>1 day</span>
                      <span>1 week</span>
                      <span>2 weeks</span>
                    </div>
                  </div>
                  <p className="text-red-200 text-sm mt-2">
                    How long the game will last before survivors share victory
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-white">Allow object rejection</label>
                  <input
                    type="checkbox"
                    checked={room.settings.allowObjectRejection}
                    onChange={(e) => onUpdateSettings({ allowObjectRejection: e.target.checked })}
                    className="w-4 h-4 accent-red-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-white">Allow place rejection</label>
                  <input
                    type="checkbox"
                    checked={room.settings.allowPlaceRejection}
                    onChange={(e) => onUpdateSettings({ allowPlaceRejection: e.target.checked })}
                    className="w-4 h-4 accent-red-600"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Players List */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-6 border border-red-500/30">
          <h3 className="text-xl font-bold text-white mb-4">Players</h3>
          <div className="space-y-3">
            {room.players.map((player) => (
              <div
                key={player.id}
                className="bg-red-900/20 rounded-lg p-4 border border-red-400/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-medium">{player.name}</div>
                    <div className="text-yellow-200 text-sm">
                      {player.id === room.createdBy && 'Host • '}
                      {player.points} points
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onLeaveRoom}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors border border-gray-500/30"
          >
            Leave Room
          </button>
          
          {isHost && (
            <button
              onClick={onStartGame}
              disabled={!canStart}
              className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                canStart
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border border-yellow-400/30'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed border border-gray-500/30'
              }`}
            >
              <Play size={20} />
              Start Game
            </button>
          )}
        </div>

        {!canStart && (
          <p className="text-center text-yellow-200 mt-4">
            Need {room.minPlayers}-{room.maxPlayers} players to start
          </p>
        )}
      </div>
    </div>
  );
};