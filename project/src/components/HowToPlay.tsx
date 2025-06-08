import React from 'react';
import { ArrowLeft, Target, Users, Clock, Trophy, AlertTriangle, Eye, Zap } from 'lucide-react';

interface HowToPlayProps {
  onBack: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ onBack }) => {
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
                How to Play Real Cluedo
              </span>
            </h1>
            <p className="text-yellow-300">Master the art of cunning elimination</p>
          </div>

          {/* Game Overview */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-8 border border-red-500/30">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Target size={24} />
              The Art of Deception
            </h2>
            <p className="text-red-200 text-lg leading-relaxed">
              Your mission: eliminate your target by catching them holding a specific object in a specific location. But beware - someone has you in their sights too.
            </p>
          </div>

          {/* What Counts as an Elimination */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-8 border border-red-500/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap size={24} />
              Valid Eliminations
            </h2>
            <div className="space-y-4">
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-400/30">
                <h3 className="text-green-300 font-bold mb-2">✅ What Counts</h3>
                <ul className="text-green-200 space-y-2">
                  <li>• <strong>Holding the object:</strong> Target must be actively holding the required object in their hands</li>
                  <li>• <strong>Correct location:</strong> The elimination must occur in the specified place</li>
                  <li>• <strong>Clear "Real Cluedo!"</strong> It needs to be loud enough that your target and witnesses can hear it.</li>
                  <li>• <strong>Thrown and caught:</strong> If you throw the object and they catch it, that counts! (but be careful - no head injuries please)</li>
                  <li>• <strong>Real-time only:</strong> Must happen in the moment, not retroactively</li>
                </ul>
              </div>
              <div className="bg-red-900/20 rounded-lg p-4 border border-red-400/30">
                <h3 className="text-red-300 font-bold mb-2">❌ Invalid Eliminations</h3>
                <ul className="text-red-200 space-y-2">
                  <li>• <strong>Just touching:</strong> Object merely touching them doesn't count</li>
                  <li>• <strong>In pockets/bags:</strong> Object must be visible and in their hands</li>
                  <li>• <strong>Wrong location:</strong> Even if they have the object, location must match</li>
                  <li>• <strong>Silent eliminations:</strong> You must clearly announce "Real Cluedo!"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* The Art of Cunning */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-8 border border-red-500/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Eye size={24} />
              Deception Tactics
            </h2>
            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/30">
              <h3 className="text-purple-300 font-bold mb-2">🎭 Master the Art of Cunning</h3>
              <ul className="text-purple-200 space-y-1">
                <li>• <strong>The Helpful Friend:</strong> Ask a friend to carry something for you while your hands are full.</li>
                <li>• <strong>The Distraction:</strong> Create a situation where they naturally reach for the object</li>
                <li>• <strong>The Setup:</strong> Casually leave the object where they'll pick it up</li>
                <li>• <strong>The Social Engineer:</strong> Use conversation to manipulate them into the right location</li>
              </ul>
            </div>
          </div>

          {/* Verification System */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-8 border border-red-500/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Users size={24} />
              The Witness System
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-400/30">
                <h3 className="text-blue-300 font-bold mb-2">How Verification Works</h3>
                <div className="text-blue-200 space-y-2">
                  <p>1. <strong>Make your claim:</strong> Hit "Real Cluedo!" in the app immediately after elimination</p>
                  <p>2. <strong>Target responds:</strong> They can confirm (instant elimination) or deny the claim</p>
                  <p>3. <strong>Witness voting:</strong> If denied, all other players vote on what they saw</p>
                  <p>4. <strong>One witness confirms:</strong> That's enough - the elimination is valid</p>
                  <p>5. <strong>No witnesses:</strong> The claim is rejected, target stays alive</p>
                </div>
              </div>
              <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-400/30">
                <h3 className="text-yellow-300 font-bold mb-2">⚖️ The Honor System</h3>
                <p className="text-yellow-200">
                  Real Cluedo relies on honesty and fair play. Only confirm eliminations you actually witnessed. 
                  The game's fun comes from the challenge, not from cheating. Be a good sport!
                </p>
              </div>
            </div>
          </div>

          {/* Victory Conditions & Scoring */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-8 border border-red-500/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Trophy size={24} />
              Victory & Scoring
            </h2>
            <div className="space-y-4">
              <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-400/30">
                <h3 className="text-yellow-300 font-bold mb-2">🏆 Solo Victory</h3>
                <p className="text-yellow-200 mb-2">
                  Eliminate all other players to claim ultimate victory and earn <strong>100 points</strong>!
                </p>
              </div>
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-400/30">
                <h3 className="text-green-300 font-bold mb-2">🤝 Shared Victory</h3>
                <p className="text-green-200">
                  Survive the full game duration (customizable from 1 day to 2 weeks) alongside other players. 
                  The 100 points are shared equally between all survivors. Sometimes the best strategy is simply not to die.
                </p>
              </div>
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-400/30">
                <h3 className="text-blue-300 font-bold mb-2">⏰ Game Duration</h3>
                <p className="text-blue-200">
                  The host can set the game duration anywhere from 1 day to 2 weeks. Longer games create more opportunities 
                  for cunning strategies and unexpected alliances, while shorter games are intense and fast-paced.
                </p>
              </div>
            </div>
          </div>

          {/* Safety & Fair Play */}
          <div className="bg-red-600/20 border border-red-400/50 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle size={24} />
              Safety & Fair Play
            </h2>
            <div className="space-y-3 text-red-200">
              <p>• <strong>Safety First:</strong> No dangerous throws, especially near heads or faces</p>
              <p>• <strong>Respect Boundaries:</strong> Don't enter private spaces or restricted areas</p>
              <p>• <strong>Be Honest:</strong> Only confirm eliminations you actually witnessed</p>
              <p>• <strong>Keep It Fun:</strong> Remember this is a game - don't take it too seriously</p>
              <p>• <strong>No Harassment:</strong> Respect other players and their personal space</p>
              <p>• <strong>Fair Timing:</strong> Eliminations must happen in real-time, not retroactively</p>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
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