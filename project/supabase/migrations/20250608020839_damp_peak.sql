/*
  # Bang Bang Game Database Schema

  1. New Tables
    - `rooms` - Game rooms with settings and state
    - `players` - Player data and assignments  
    - `elimination_claims` - Elimination claims and verification
    - `chat_messages` - In-game chat system
    - `leaderboard` - Player statistics and rankings

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (game context)

  3. Performance
    - Add indexes for common queries
    - Trigger for automatic leaderboard updates
*/

-- Create custom types only if they don't exist
DO $$ BEGIN
    CREATE TYPE game_state AS ENUM ('lobby', 'assigning', 'active', 'finished');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE claim_status AS ENUM ('pending', 'confirmed', 'disputed', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE claim_response AS ENUM ('confirm', 'deny');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id text PRIMARY KEY,
  name text NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  game_state game_state DEFAULT 'lobby',
  start_time timestamptz,
  end_time timestamptz,
  max_players integer DEFAULT 20,
  min_players integer DEFAULT 5,
  duration bigint DEFAULT 604800000, -- 1 week in milliseconds
  settings jsonb DEFAULT '{}',
  suggested_objects text[] DEFAULT '{}',
  suggested_places text[] DEFAULT '{}'
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id text PRIMARY KEY,
  room_id text REFERENCES rooms(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_alive boolean DEFAULT true,
  is_spectator boolean DEFAULT false,
  target_id text,
  target_name text,
  assigned_object text,
  assigned_place text,
  suggested_object text,
  suggested_place text,
  points integer DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  eliminated_at timestamptz,
  confirmed_ready boolean DEFAULT false,
  games_played integer DEFAULT 0,
  games_won integer DEFAULT 0
);

-- Create elimination_claims table
CREATE TABLE IF NOT EXISTS elimination_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text REFERENCES rooms(id) ON DELETE CASCADE,
  claimer_id text NOT NULL,
  target_id text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  video_url text,
  status claim_status DEFAULT 'pending',
  target_response claim_response,
  witnesses text[],
  witness_responses jsonb DEFAULT '{}'
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text REFERENCES rooms(id) ON DELETE CASCADE,
  player_id text NOT NULL,
  player_name text NOT NULL,
  message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  is_system_message boolean DEFAULT false
);

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  player_id text PRIMARY KEY,
  player_name text NOT NULL,
  total_points integer DEFAULT 0,
  games_played integer DEFAULT 0,
  games_won integer DEFAULT 0,
  average_position numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE elimination_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Allow all operations on rooms" ON rooms;
DROP POLICY IF EXISTS "Allow all operations on players" ON players;
DROP POLICY IF EXISTS "Allow all operations on elimination_claims" ON elimination_claims;
DROP POLICY IF EXISTS "Allow all operations on chat_messages" ON chat_messages;
DROP POLICY IF EXISTS "Allow all operations on leaderboard" ON leaderboard;

CREATE POLICY "Allow all operations on rooms" ON rooms FOR ALL USING (true);
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all operations on elimination_claims" ON elimination_claims FOR ALL USING (true);
CREATE POLICY "Allow all operations on chat_messages" ON chat_messages FOR ALL USING (true);
CREATE POLICY "Allow all operations on leaderboard" ON leaderboard FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_room_id ON players(room_id);
CREATE INDEX IF NOT EXISTS idx_players_is_alive ON players(is_alive);
CREATE INDEX IF NOT EXISTS idx_elimination_claims_room_id ON elimination_claims(room_id);
CREATE INDEX IF NOT EXISTS idx_elimination_claims_status ON elimination_claims(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_points ON leaderboard(total_points DESC);

-- Create a function to automatically update leaderboard
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO leaderboard (player_id, player_name, total_points, games_played, games_won)
  VALUES (NEW.id, NEW.name, NEW.points, NEW.games_played, NEW.games_won)
  ON CONFLICT (player_id) 
  DO UPDATE SET
    player_name = NEW.name,
    total_points = NEW.points,
    games_played = NEW.games_played,
    games_won = NEW.games_won,
    average_position = CASE 
      WHEN NEW.games_played > 0 
      THEN (NEW.games_played - NEW.games_won + 1.0) 
      ELSE 0 
    END,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists, then create it
DROP TRIGGER IF EXISTS update_leaderboard_trigger ON players;
CREATE TRIGGER update_leaderboard_trigger
  AFTER UPDATE OF points, games_played, games_won ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_leaderboard();