/*
  # Initial Bang Bang Game Schema

  1. New Tables
    - `rooms`
      - `id` (text, primary key) - Room code
      - `name` (text) - Room display name
      - `created_by` (text) - Player ID who created the room
      - `created_at` (timestamp)
      - `game_state` (enum) - Current game phase
      - `start_time` (timestamp) - When game started
      - `end_time` (timestamp) - When game ended
      - `max_players` (integer) - Maximum players allowed
      - `min_players` (integer) - Minimum players to start
      - `duration` (bigint) - Game duration in milliseconds
      - `settings` (jsonb) - Game configuration
      - `suggested_objects` (text[]) - Objects suggested by players
      - `suggested_places` (text[]) - Places suggested by players

    - `players`
      - `id` (text, primary key) - Player ID
      - `room_id` (text, foreign key) - Room they're in
      - `name` (text) - Player display name
      - `is_alive` (boolean) - Whether player is still alive
      - `is_spectator` (boolean) - Whether player is spectating
      - `target_id` (text) - ID of player they're hunting
      - `target_name` (text) - Name of target for display
      - `assigned_object` (text) - Object they need to catch target with
      - `assigned_place` (text) - Place where elimination must occur
      - `suggested_object` (text) - Object they suggested
      - `suggested_place` (text) - Place they suggested
      - `points` (integer) - Points earned
      - `joined_at` (timestamp) - When they joined
      - `eliminated_at` (timestamp) - When they were eliminated
      - `confirmed_ready` (boolean) - Whether they confirmed assignment
      - `games_played` (integer) - Total games played
      - `games_won` (integer) - Total games won

    - `elimination_claims`
      - `id` (uuid, primary key)
      - `room_id` (text, foreign key) - Room where claim occurred
      - `claimer_id` (text) - Player making the claim
      - `target_id` (text) - Player being claimed as eliminated
      - `timestamp` (timestamp) - When claim was made
      - `video_url` (text) - Optional video evidence
      - `status` (enum) - Claim status
      - `target_response` (enum) - Target's response
      - `witnesses` (text[]) - List of witness player IDs
      - `witness_responses` (jsonb) - Witness responses

    - `chat_messages`
      - `id` (uuid, primary key)
      - `room_id` (text, foreign key) - Room where message was sent
      - `player_id` (text) - Player who sent message
      - `player_name` (text) - Player name for display
      - `message` (text) - Message content
      - `timestamp` (timestamp) - When message was sent
      - `is_system_message` (boolean) - Whether it's a system message

    - `leaderboard`
      - `player_id` (text, primary key) - Player ID
      - `player_name` (text) - Player display name
      - `total_points` (integer) - Total points across all games
      - `games_played` (integer) - Total games played
      - `games_won` (integer) - Total games won
      - `average_position` (numeric) - Average finishing position
      - `updated_at` (timestamp) - Last update time

  2. Security
    - Enable RLS on all tables
    - Add policies for public read/write access (since this is a game)
*/

-- Create custom types
CREATE TYPE game_state AS ENUM ('lobby', 'assigning', 'active', 'finished');
CREATE TYPE claim_status AS ENUM ('pending', 'confirmed', 'disputed', 'verified', 'rejected');
CREATE TYPE claim_response AS ENUM ('confirm', 'deny');

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

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE elimination_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a game, we allow public access)
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