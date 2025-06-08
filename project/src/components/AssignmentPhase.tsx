import React, { useState } from 'react';
import { Eye, EyeOff, RefreshCw, Check, X } from 'lucide-react';
import { Player, Assignment } from '../types/game';

interface AssignmentPhaseProps {
  currentPlayer: Player;
  assignment: Assignment;
  onConfirmAssignment: () => void;
  onRejectObject: () => void;
  onRejectPlace: () => void;
  canRejectObject: boolean;
  canRejectPlace: boolean;
  allPlayersReady: boolean;
}

export const AssignmentPhase: React.FC<AssignmentPhaseProps> = ({
  currentPlayer,
  assignment,
  onConfirmAssignment,
  onRejectObject,
  onRejectPlace,
  canRejectObject,
  canRejectPlace,
  allPlayersReady
}) => {
  const [showAssignment, setShowAssignment] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-yellow-300">ASSIGNMENT PHASE</h2>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                Your Assignment
              </span>
            </h1>
            <p className="text-yellow-300">Keep this secret from other players</p>
          </div>

          {/* Assignment Card */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 mb-6 shadow-2xl">
            <div className="text-center mb-6">
              <button
                onClick={() => setShowAssignment(!showAssignment)}
                className="flex items-center gap-2 mx-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg transition-colors border border-yellow-400/30"
              >
                {showAssignment ? <EyeOff size={20} /> : <Eye size={20} />}
                {showAssignment ? 'Hide Assignment' : 'Reveal Assignment'}
              </button>
            </div>

            {showAssignment && (
              <div className="space-y-6">
                {/* Target */}
                <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-4">
                  <h3 className="text-red-300 font-medium mb-2">Your Target</h3>
                  <p className="text-white text-xl font-bold">
                    {assignment.targetName}
                  </p>
                </div>

                {/* Object */}
                <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-yellow-300 font-medium">Required Object</h3>
                    {canRejectObject && !assignment.objectRejected && (
                      <button
                        onClick={onRejectObject}
                        className="text-yellow-300 hover:text-yellow-100 transition-colors"
                        title="Reject this object"
                      >
                        <RefreshCw size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-white text-xl font-bold">{assignment.object}</p>
                  {assignment.objectRejected && (
                    <p className="text-yellow-300 text-sm mt-1">Object rejection used</p>
                  )}
                </div>

                {/* Place */}
                <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-green-300 font-medium">Required Location</h3>
                    {canRejectPlace && !assignment.placeRejected && (
                      <button
                        onClick={onRejectPlace}
                        className="text-green-300 hover:text-green-100 transition-colors"
                        title="Reject this place"
                      >
                        <RefreshCw size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-white text-xl font-bold">{assignment.place}</p>
                  {assignment.placeRejected && (
                    <p className="text-green-300 text-sm mt-1">Place rejection used</p>
                  )}
                </div>

                {/* Instructions */}
                <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
                  <h3 className="text-blue-300 font-medium mb-2">Mission</h3>
                  <p className="text-white">
                    Catch your target <strong>{assignment.targetName}</strong> holding <strong>{assignment.object}</strong> while at <strong>{assignment.place}</strong>, 
                    then shout "Bang Bang!"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Confirmation */}
          <div className="text-center">
            {!currentPlayer.confirmedReady ? (
              <button
                onClick={onConfirmAssignment}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors flex items-center gap-2 mx-auto border border-green-400/30"
              >
                <Check size={20} />
                Confirm Assignment
              </button>
            ) : (
              <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-green-300 mb-2">
                  <Check size={20} />
                  <span className="font-medium">Assignment Confirmed</span>
                </div>
                <p className="text-white">
                  {allPlayersReady 
                    ? "All players ready! Game starting..." 
                    : "Waiting for other players to confirm their assignments..."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};