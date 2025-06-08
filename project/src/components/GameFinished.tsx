import React from 'react';
import { Trophy, Medal, Users, Clock, Skull } from 'lucide-react';
import { GameRoom, Player, Leaderboard } from '../types/game';

interface GameFinishedProps {
  room: GameRoom;
  currentPlayer: Player;
  leaderboard: Leaderboard[];
  onPlayAgain: () => void;
  onLeaveRoom: () => void;
}

export const GameFinished: React.FC<GameFinishedProps> = ({
  room,
  currentPlayer,
  leaderboard,
  onPlayAgain,
  onLeaveRoom
}) => {
  const winner = room.players.find(p => p.isAlive);
  const survivors = room.players.filter(p => p.isAlive);
  const gameDuration = room.endTime && room.startTime 
    ? room.endTime - room.startTime 
    : 0;

  const formatDuration = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours`;
    if (hours > 0) return `${hours} hours, ${minutes} minutes`;
    return `${minutes} minutes`;
  };

  const getPositionSuffix = (position: number) => {
    if (position === 1) return 'st';
    if (position === 2) return 'nd';
    if (position === 3) return 'rd';
    return 'th';
  };

  const sortedPlayers = [...room.players].sort((a, b) => {
    // Alive players first, then by elimination time (later = better)
    if (a.isAlive && !b.isAlive) return -1;
    if (!a.isAlive && b.isAlive) return 1;
    if (!a.isAlive && !b.isAlive) {
      return (b.eliminatedAt || 0) - (a.eliminatedAt || 0);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-300">GAME FINISHED</h2>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
              Game Over!
            </span>
          </h1>
          <div className="flex items-center justify-center gap-4 text-red-200">
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>Duration: {formatDuration(gameDuration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>{room.players.length} players</span>
            </div>
          </div>
        </div>

        {/* Winner Announcement */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-8 mb-8 text-center">
          {survivors.length === 1 ? (
            <>
              <Trophy size={48} className="text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                🎉 {winner?.name} Wins! 🎉
              </h2>
              <p className="text-yellow-200">
                Last player standing after eliminating all opponents!
              </p>
            </>
          ) : survivors.length > 1 ? (
            <>
              <Medal size={48} className="text-blue-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                Multiple Survivors!
              </h2>
              <p className="text-blue-200">
                {survivors.map(s => s.name).join(', ')} survived the full week!
              </p>
            </>
          ) : (
            <>
              <Skull size={48} className="text-red-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                Everyone Eliminated!
              </h2>
              <p className="text-red-200">
                No survivors remain - what a battle!
              </p>
            </>
          )}
        </div>

        {/* Final Rankings */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-8 border border-red-500/30">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Final Rankings</h3>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => {
              const position = index + 1;
              const isCurrentPlayer = player.id === currentPlayer.id;
              
              return (
                <div
                  key={player.id}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    isCurrentPlayer
                      ? 'bg-red-600/30 border border-red-400/50'
                      : 'bg-red-900/20'
                  } ${
                    position === 1 ? 'ring-2 ring-yellow-400/50' : ''
                  }`}
                >
                  {/* Position */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    position === 1 ? 'bg-yellow-500 text-black' :
                    position === 2 ? 'bg-gray-400 text-black' :
                    position === 3 ? 'bg-orange-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {position}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-lg">
                        {player.name}
                      </span>
                      {isCurrentPlayer && (
                        <span className="text-yellow-300 text-sm">(You)</span>
                      )}
                      {position === 1 && <Trophy size={20} className="text-yellow-400" />}
                    </div>
                    <div className="text-red-200 text-sm">
                      {player.isAlive ? 'Survivor' : 'Eliminated'} • {player.points} points earned
                    </div>
                  </div>

                  {/* Position Suffix */}
                  <div className="text-white/60 text-sm">
                    {position}{getPositionSuffix(position)} place
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-8 border border-red-500/30">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Overall Leaderboard</h3>
            <div className="space-y-2">
              {leaderboard.slice(0, 10).map((entry, index) => (
                <div
                  key={entry.playerId}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    entry.playerId === currentPlayer.id
                      ? 'bg-red-600/30 border border-red-400/50'
                      : 'bg-red-900/10'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {entry.playerName}
                      {entry.playerId === currentPlayer.id && ' (You)'}
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {entry.totalPoints} total points • {entry.gamesWon}/{entry.gamesPlayed} wins
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onLeaveRoom}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors border border-gray-500/30"
          >
            Leave Room
          </button>
          <button
            onClick={onPlayAgain}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-colors border border-green-400/30"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};