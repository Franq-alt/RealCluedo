import React, { useState } from 'react';
import { Play, Users, HelpCircle, Trophy } from 'lucide-react';

interface MainMenuProps {
  onCreateRoom: (roomName: string, playerName: string, suggestedObject: string, suggestedPlace: string) => void;
  onJoinRoom: (roomId: string, playerName: string, suggestedObject: string, suggestedPlace: string) => void;
  onShowLeaderboard: () => void;
  onShowHowToPlay: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onCreateRoom,
  onJoinRoom,
  onShowLeaderboard,
  onShowHowToPlay
}) => {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [suggestedObject, setSuggestedObject] = useState('');
  const [suggestedPlace, setSuggestedPlace] = useState('');

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim() && playerName.trim() && suggestedObject.trim() && suggestedPlace.trim()) {
      onCreateRoom(roomName.trim(), playerName.trim(), suggestedObject.trim(), suggestedPlace.trim());
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim() && playerName.trim() && suggestedObject.trim() && suggestedPlace.trim()) {
      onJoinRoom(roomId.trim(), playerName.trim(), suggestedObject.trim(), suggestedPlace.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo and Title */}
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl">
              <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                Real Cluedo
              </span>
            </h1>
            <p className="text-xl text-yellow-300 mb-2 font-medium">
              Use your cunning. Trust no one.
            </p>
            <p className="text-red-200">
              Be the last one standing
            </p>
          </div>

          {/* Main Menu */}
          {!showCreateRoom && !showJoinRoom && (
            <div className="space-y-4">
              <button
                onClick={() => setShowCreateRoom(true)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 border border-yellow-400/30 shadow-lg shadow-red-900/50"
              >
                <Play size={24} />
                Create New Game
              </button>
              
              <button
                onClick={() => setShowJoinRoom(true)}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 border border-red-400/30 shadow-lg shadow-gray-900/50"
              >
                <Users size={24} />
                Join Game
              </button>
              
              <button
                onClick={onShowHowToPlay}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 border border-orange-400/30 shadow-lg shadow-orange-900/50"
              >
                <HelpCircle size={24} />
                How to Play
              </button>
              
              <button
                onClick={onShowLeaderboard}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black py-4 px-8 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 border border-yellow-300/50 shadow-lg shadow-yellow-900/50"
              >
                <Trophy size={24} />
                Leaderboard
              </button>
            </div>
          )}

          {/* Create Room Form */}
          {showCreateRoom && (
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Game</h2>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-red-900/20 text-white placeholder-red-200/60 rounded-lg px-4 py-3 border border-red-400/30 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Group Name</label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full bg-red-900/20 text-white placeholder-red-200/60 rounded-lg px-4 py-3 border border-red-400/30 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                    placeholder="Enter group name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Suggest an Object</label>
                  <input
                    type="text"
                    value={suggestedObject}
                    onChange={(e) => setSuggestedObject(e.target.value)}
                    className="w-full bg-red-900/20 text-white placeholder-red-200/60 rounded-lg px-4 py-3 border border-red-400/30 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                    placeholder="e.g., Coffee cup, Phone, Keys"
                    required
                  />
                  <p className="text-yellow-200 text-sm mt-1">This object will be added to the pool for assignments</p>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Suggest a Place</label>
                  <input
                    type="text"
                    value={suggestedPlace}
                    onChange={(e) => setSuggestedPlace(e.target.value)}
                    className="w-full bg-red-900/20 text-white placeholder-red-200/60 rounded-lg px-4 py-3 border border-red-400/30 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                    placeholder="e.g., Kitchen, Coffee shop, Park"
                    required
                  />
                  <p className="text-yellow-200 text-sm mt-1">This place will be added to the pool for assignments</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateRoom(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors border border-gray-500/30"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg font-medium transition-colors border border-yellow-400/30"
                  >
                    Create Room
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Join Room Form */}
          {showJoinRoom && (
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Join Game</h2>
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-red-900/20 text-white placeholder-red-200/60 rounded-lg px-4 py-3 border border-red-400/30 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Room Code</label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    className="w-full bg-red-900/20 text-white placeholder-red-200/60 rounded-lg px-4 py-3 border border-red-400/30 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 font-mono"
                    placeholder="Enter room code"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Suggest an Object</label>
                  <input
                    type="text"
                    value={suggestedObject}
                    onChange={(e) => setSuggestedObject(e.target.value)}
                    className="w-full bg-red-900/20 text-white placeholder-red-200/60 rounded-lg px-4 py-3 border border-red-400/30 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                    placeholder="e.g., Coffee cup, Phone, Keys"
                    required
                  />
                  <p className="text-yellow-200 text-sm mt-1">This object will be added to the pool for assignments</p>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Suggest a Place</label>
                  <input
                    type="text"
                    value={suggestedPlace}
                    onChange={(e) => setSuggestedPlace(e.target.value)}
                    className="w-full bg-red-900/20 text-white placeholder-red-200/60 rounded-lg px-4 py-3 border border-red-400/30 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                    placeholder="e.g., Kitchen, Coffee shop, Park"
                    required
                  />
                  <p className="text-yellow-200 text-sm mt-1">This place will be added to the pool for assignments</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowJoinRoom(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors border border-gray-500/30"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 rounded-lg font-medium transition-colors border border-red-400/30"
                  >
                    Join Room
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};