import React from 'react';
import { ArrowLeft, Trophy, Medal, Award, Crown } from 'lucide-react';
import { Leaderboard as LeaderboardType } from '../types/game';

interface LeaderboardProps {
  leaderboard: LeaderboardType[];
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard, onBack }) => {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown size={20} className="text-yellow-400" />;
      case 2:
        return <Medal size={20} className="text-gray-400" />;
      case 3:
        return <Award size={20} className="text-orange-600" />;
      default:
        return <Trophy size={16} className="text-red-400" />;
    }
  };

  const getPositionStyles = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-400/50 ring-2 ring-yellow-400/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-400/50';
      default:
        return 'bg-red-900/20 border-red-400/20';
    }
  };

  const calculateWinRate = (gamesWon: number, gamesPlayed: number) => {
    if (gamesPlayed === 0) return 0;
    return Math.round((gamesWon / gamesPlayed) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-yellow-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                Leaderboard
              </span>
            </h1>
            <p className="text-yellow-300">Top Bang Bang Champions</p>
          </div>

          {/* Leaderboard */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-red-500/30">
            {leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Trophy size={48} className="text-red-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">No Champions Yet</h3>
                <p className="text-red-200">Play some games to see your stats here!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => {
                  const position = index + 1;
                  const winRate = calculateWinRate(entry.gamesWon, entry.gamesPlayed);
                  
                  return (
                    <div
                      key={entry.playerId}
                      className={`
                        flex items-center gap-4 p-4 rounded-lg border transition-all hover:scale-[1.02]
                        ${getPositionStyles(position)}
                      `}
                    >
                      {/* Position */}
                      <div className="flex items-center justify-center w-12 h-12">
                        {position <= 3 ? (
                          getPositionIcon(position)
                        ) : (
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {position}
                          </div>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold text-lg">
                            {entry.playerName}
                          </span>
                          {position === 1 && (
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                              CHAMPION
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-yellow-200">
                            <strong>{entry.totalPoints}</strong> points
                          </span>
                          <span className="text-green-300">
                            {entry.gamesWon}/{entry.gamesPlayed} wins
                          </span>
                          <span className="text-blue-300">
                            {winRate}% win rate
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        <div className="text-white font-bold text-xl">
                          #{position}
                        </div>
                        <div className="text-red-200 text-sm">
                          Avg. {entry.averagePosition.toFixed(1)} place
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats Summary */}
          {leaderboard.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-red-500/30 text-center">
                <Trophy size={32} className="text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {leaderboard[0]?.playerName || 'N/A'}
                </div>
                <div className="text-yellow-300">Current Champion</div>
                <div className="text-red-200 text-sm mt-1">
                  {leaderboard[0]?.totalPoints || 0} points
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-red-500/30 text-center">
                <Medal size={32} className="text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {leaderboard.reduce((sum, entry) => sum + entry.gamesPlayed, 0)}
                </div>
                <div className="text-blue-300">Total Games</div>
                <div className="text-red-200 text-sm mt-1">
                  Across all players
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-red-500/30 text-center">
                <Award size={32} className="text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {Math.round(
                    leaderboard.reduce((sum, entry) => 
                      sum + calculateWinRate(entry.gamesWon, entry.gamesPlayed), 0
                    ) / leaderboard.length
                  )}%
                </div>
                <div className="text-green-300">Avg. Win Rate</div>
                <div className="text-red-200 text-sm mt-1">
                  Community average
                </div>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="text-center mt-8">
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-lg font-medium transition-colors border border-yellow-400/30"
            >
              Back to Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};