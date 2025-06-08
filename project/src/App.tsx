import React from 'react';
import { MainMenu } from './components/MainMenu';
import { GameLobby } from './components/GameLobby';
import { AssignmentPhase } from './components/AssignmentPhase';
import { ActiveGame } from './components/ActiveGame';
import { GameFinished } from './components/GameFinished';
import { HowToPlay } from './components/HowToPlay';
import { Leaderboard } from './components/Leaderboard';
import { SupabaseSetup } from './components/SupabaseSetup';
import { useSupabaseGame } from './hooks/useSupabaseGame';

function App() {
  const {
    currentRoom,
    currentPlayer,
    assignment,
    pendingClaims,
    chatMessages,
    leaderboard,
    timeRemaining,
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
  } = useSupabaseGame();

  const [currentView, setCurrentView] = React.useState<'menu' | 'howto' | 'leaderboard'>('menu');

  // Show Supabase setup if there's a connection error
  if (connectionError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Real Cluedo</h1>
            <p className="text-red-200">Multiplayer Elimination Game</p>
          </div>
          
          <SupabaseSetup />
          
          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reload App
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game state routing
  if (currentRoom && currentPlayer) {
    if (currentRoom.gameState === 'finished') {
      return (
        <GameFinished
          room={currentRoom}
          currentPlayer={currentPlayer}
          onLeaveRoom={leaveRoom}
        />
      );
    }

    if (currentRoom.gameState === 'active') {
      return (
        <ActiveGame
          room={currentRoom}
          currentPlayer={currentPlayer}
          assignment={assignment}
          pendingClaims={pendingClaims}
          chatMessages={chatMessages}
          timeRemaining={timeRemaining}
          onSendMessage={sendMessage}
          onSubmitClaim={submitClaim}
          onRespondToClaim={respondToClaim}
          onWitnessResponse={witnessResponse}
          onLeaveRoom={leaveRoom}
        />
      );
    }

    if (currentRoom.gameState === 'assigning') {
      return (
        <AssignmentPhase
          room={currentRoom}
          currentPlayer={currentPlayer}
          assignment={assignment}
          chatMessages={chatMessages}
          onSendMessage={sendMessage}
          onConfirmAssignment={confirmAssignment}
          onLeaveRoom={leaveRoom}
        />
      );
    }

    return (
      <GameLobby
        room={currentRoom}
        currentPlayer={currentPlayer}
        chatMessages={chatMessages}
        onSendMessage={sendMessage}
        onUpdateSettings={updateSettings}
        onStartGame={startGame}
        onLeaveRoom={leaveRoom}
      />
    );
  }

  // Main menu views
  if (currentView === 'howto') {
    return <HowToPlay onBack={() => setCurrentView('menu')} />;
  }

  if (currentView === 'leaderboard') {
    return (
      <Leaderboard
        leaderboard={leaderboard}
        onBack={() => setCurrentView('menu')}
        onRefresh={fetchLeaderboard}
      />
    );
  }

  return (
    <MainMenu
      onCreateRoom={createRoom}
      onJoinRoom={joinRoom}
      onShowHowToPlay={() => setCurrentView('howto')}
      onShowLeaderboard={() => setCurrentView('leaderboard')}
    />
  );
}

export default App;