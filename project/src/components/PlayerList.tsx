import React from 'react';
import { Crown, Skull, Eye } from 'lucide-react';
import { Player } from '../types/game';

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  currentPlayerId
}) => {
  const alivePlayers = players.filter(p => p.isAlive);
  const eliminatedPlayers = players.filter(p => !p.isAlive);

  const getPlayerIcon = (player: Player) => {
    if (!player.isAlive) return <Skull size={16} className="text-red-400" />;
    if (player.isSpectator) return <Eye size={16} className="text-blue-400" />;
    return null;
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-red-500/30">
      <h3 className="text-xl font-bold text-white mb-4">Players</h3>
      
      {/* Alive Players */}
      {alivePlayers.length > 0 && (
        <div className="mb-6">
          <h4 className="text-green-300 font-medium mb-3 flex items-center gap-2">
            <Crown size={16} />
            Alive ({alivePlayers.length})
          </h4>
          <div className="space-y-2">
            {alivePlayers.map((player) => (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  player.id === currentPlayerId
                    ? 'bg-red-600/30 border border-red-400/50'
                    : 'bg-red-900/20'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">
                    {player.name}
                    {player.id === currentPlayerId && ' (You)'}
                  </div>
                  <div className="text-yellow-200 text-sm">
                    {player.points} points
                  </div>
                </div>
                {getPlayerIcon(player)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Eliminated Players */}
      {eliminatedPlayers.length > 0 && (
        <div>
          <h4 className="text-red-300 font-medium mb-3 flex items-center gap-2">
            <Skull size={16} />
            Eliminated ({eliminatedPlayers.length})
          </h4>
          <div className="space-y-2">
            {eliminatedPlayers.map((player) => (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-lg opacity-60 ${
                  player.id === currentPlayerId
                    ? 'bg-red-600/20 border border-red-400/30'
                    : 'bg-gray-800/20'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">
                    {player.name}
                    {player.id === currentPlayerId && ' (You)'}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {player.points} points • Eliminated
                  </div>
                </div>
                {getPlayerIcon(player)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};