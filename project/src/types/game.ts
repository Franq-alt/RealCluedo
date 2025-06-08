export interface Player {
  id: string;
  name: string;
  isAlive: boolean;
  isSpectator: boolean;
  targetId?: string; // ID of target player
  targetName?: string; // Name of target player for display
  assignedObject?: string;
  assignedPlace?: string;
  suggestedObject?: string;
  suggestedPlace?: string;
  points: number;
  joinedAt: number;
  eliminatedAt?: number;
  confirmedReady: boolean;
  gamesPlayed: number;
  gamesWon: number;
}

export interface GameRoom {
  id: string;
  name: string;
  players: Player[];
  gameState: 'lobby' | 'assigning' | 'active' | 'finished';
  startTime?: number;
  endTime?: number;
  maxPlayers: number;
  minPlayers: number;
  duration: number; // in milliseconds
  createdBy: string;
  settings: GameSettings;
  suggestedObjects: string[];
  suggestedPlaces: string[];
}

export interface GameSettings {
  allowObjectRejection: boolean;
  allowPlaceRejection: boolean;
  videoRequired: boolean;
  maxVideoLength: number; // in seconds
  customObjects: string[];
  customPlaces: string[];
  locationContext?: 'office' | 'school' | 'general';
  gameDuration: number; // in days (1-21)
  geolocation?: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
}

export interface Assignment {
  playerId: string;
  targetId: string;
  targetName: string;
  object: string;
  place: string;
  objectRejected?: boolean;
  placeRejected?: boolean;
}

export interface EliminationClaim {
  id: string;
  claimerId: string;
  targetId: string;
  timestamp: number;
  videoUrl?: string;
  status: 'pending' | 'confirmed' | 'disputed' | 'verified' | 'rejected';
  targetResponse?: 'confirm' | 'deny';
  witnesses?: string[]; // Player IDs
  witnessResponses?: { [playerId: string]: 'confirm' | 'deny' };
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  isSystemMessage?: boolean;
}

export interface Leaderboard {
  playerId: string;
  playerName: string;
  totalPoints: number;
  gamesPlayed: number;
  gamesWon: number;
  averagePosition: number;
}