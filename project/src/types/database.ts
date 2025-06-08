export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string;
          name: string;
          created_by: string;
          created_at: string;
          game_state: 'lobby' | 'assigning' | 'active' | 'finished';
          start_time: string | null;
          end_time: string | null;
          max_players: number;
          min_players: number;
          duration: number;
          settings: any;
          suggested_objects: string[];
          suggested_places: string[];
        };
        Insert: {
          id?: string;
          name: string;
          created_by: string;
          created_at?: string;
          game_state?: 'lobby' | 'assigning' | 'active' | 'finished';
          start_time?: string | null;
          end_time?: string | null;
          max_players?: number;
          min_players?: number;
          duration?: number;
          settings?: any;
          suggested_objects?: string[];
          suggested_places?: string[];
        };
        Update: {
          id?: string;
          name?: string;
          created_by?: string;
          created_at?: string;
          game_state?: 'lobby' | 'assigning' | 'active' | 'finished';
          start_time?: string | null;
          end_time?: string | null;
          max_players?: number;
          min_players?: number;
          duration?: number;
          settings?: any;
          suggested_objects?: string[];
          suggested_places?: string[];
        };
      };
      players: {
        Row: {
          id: string;
          room_id: string;
          name: string;
          is_alive: boolean;
          is_spectator: boolean;
          target_id: string | null;
          target_name: string | null;
          assigned_object: string | null;
          assigned_place: string | null;
          suggested_object: string | null;
          suggested_place: string | null;
          points: number;
          joined_at: string;
          eliminated_at: string | null;
          confirmed_ready: boolean;
          games_played: number;
          games_won: number;
        };
        Insert: {
          id?: string;
          room_id: string;
          name: string;
          is_alive?: boolean;
          is_spectator?: boolean;
          target_id?: string | null;
          target_name?: string | null;
          assigned_object?: string | null;
          assigned_place?: string | null;
          suggested_object?: string | null;
          suggested_place?: string | null;
          points?: number;
          joined_at?: string;
          eliminated_at?: string | null;
          confirmed_ready?: boolean;
          games_played?: number;
          games_won?: number;
        };
        Update: {
          id?: string;
          room_id?: string;
          name?: string;
          is_alive?: boolean;
          is_spectator?: boolean;
          target_id?: string | null;
          target_name?: string | null;
          assigned_object?: string | null;
          assigned_place?: string | null;
          suggested_object?: string | null;
          suggested_place?: string | null;
          points?: number;
          joined_at?: string;
          eliminated_at?: string | null;
          confirmed_ready?: boolean;
          games_played?: number;
          games_won?: number;
        };
      };
      elimination_claims: {
        Row: {
          id: string;
          room_id: string;
          claimer_id: string;
          target_id: string;
          timestamp: string;
          video_url: string | null;
          status: 'pending' | 'confirmed' | 'disputed' | 'verified' | 'rejected';
          target_response: 'confirm' | 'deny' | null;
          witnesses: string[] | null;
          witness_responses: any | null;
        };
        Insert: {
          id?: string;
          room_id: string;
          claimer_id: string;
          target_id: string;
          timestamp?: string;
          video_url?: string | null;
          status?: 'pending' | 'confirmed' | 'disputed' | 'verified' | 'rejected';
          target_response?: 'confirm' | 'deny' | null;
          witnesses?: string[] | null;
          witness_responses?: any | null;
        };
        Update: {
          id?: string;
          room_id?: string;
          claimer_id?: string;
          target_id?: string;
          timestamp?: string;
          video_url?: string | null;
          status?: 'pending' | 'confirmed' | 'disputed' | 'verified' | 'rejected';
          target_response?: 'confirm' | 'deny' | null;
          witnesses?: string[] | null;
          witness_responses?: any | null;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          room_id: string;
          player_id: string;
          player_name: string;
          message: string;
          timestamp: string;
          is_system_message: boolean;
        };
        Insert: {
          id?: string;
          room_id: string;
          player_id: string;
          player_name: string;
          message: string;
          timestamp?: string;
          is_system_message?: boolean;
        };
        Update: {
          id?: string;
          room_id?: string;
          player_id?: string;
          player_name?: string;
          message?: string;
          timestamp?: string;
          is_system_message?: boolean;
        };
      };
      leaderboard: {
        Row: {
          player_id: string;
          player_name: string;
          total_points: number;
          games_played: number;
          games_won: number;
          average_position: number;
          updated_at: string;
        };
        Insert: {
          player_id: string;
          player_name: string;
          total_points?: number;
          games_played?: number;
          games_won?: number;
          average_position?: number;
          updated_at?: string;
        };
        Update: {
          player_id?: string;
          player_name?: string;
          total_points?: number;
          games_played?: number;
          games_won?: number;
          average_position?: number;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}