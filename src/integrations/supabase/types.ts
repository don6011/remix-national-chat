export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          display_name: string | null
          home_state: string
          rank: string
          influence_points: number
          messages_sent: number
          reactions_received: number
          referrals_count: number
          citizen_report_filed: boolean
          streak_days: number
          last_active: string
          is_founding_citizen: boolean
          is_patriot_plus: boolean
          avatar_url: string | null
          bio: string | null
          created_at: string
          onboarded: boolean
        }
        Insert: {
          id: string
          username: string
          email: string
          display_name?: string | null
          home_state: string
          rank?: string
          influence_points?: number
          messages_sent?: number
          reactions_received?: number
          referrals_count?: number
          citizen_report_filed?: boolean
          streak_days?: number
          last_active?: string
          is_founding_citizen?: boolean
          is_patriot_plus?: boolean
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          onboarded?: boolean
        }
        Update: {
          id?: string
          username?: string
          email?: string
          display_name?: string | null
          home_state?: string
          rank?: string
          influence_points?: number
          messages_sent?: number
          reactions_received?: number
          referrals_count?: number
          citizen_report_filed?: boolean
          streak_days?: number
          last_active?: string
          is_founding_citizen?: boolean
          is_patriot_plus?: boolean
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          onboarded?: boolean
        }
        Relationships: []
      }
      rooms: {
        Row: {
          id: string
          state: string
          room_type: string
          display_name: string
          description: string | null
          active_users: number
          is_flagship: boolean
          created_at: string
        }
        Insert: {
          id?: string
          state: string
          room_type: string
          display_name: string
          description?: string | null
          active_users?: number
          is_flagship?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          state?: string
          room_type?: string
          display_name?: string
          description?: string | null
          active_users?: number
          is_flagship?: boolean
          created_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          user_id: string | null
          room_id: string | null
          state: string
          is_national: boolean
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          room_id?: string | null
          state: string
          is_national?: boolean
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          room_id?: string | null
          state?: string
          is_national?: boolean
          content?: string
          created_at?: string
        }
        Relationships: []
      }
      reactions: {
        Row: {
          id: string
          message_id: string | null
          user_id: string | null
          reaction_type: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id?: string | null
          user_id?: string | null
          reaction_type: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string | null
          user_id?: string | null
          reaction_type?: string
          created_at?: string
        }
        Relationships: []
      }
      passport_stamps: {
        Row: {
          id: string
          user_id: string | null
          state_visited: string
          time_spent_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          state_visited: string
          time_spent_minutes?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          state_visited?: string
          time_spent_minutes?: number
          created_at?: string
        }
        Relationships: []
      }
      room_visits: {
        Row: {
          id: string
          user_id: string | null
          room_id: string | null
          state: string
          room_type: string
          total_minutes: number
          last_visited: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          room_id?: string | null
          state: string
          room_type: string
          total_minutes?: number
          last_visited?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          room_id?: string | null
          state?: string
          room_type?: string
          total_minutes?: number
          last_visited?: string
        }
        Relationships: []
      }
      elections: {
        Row: {
          id: string
          state: string
          status: string
          start_date: string | null
          end_date: string | null
          winner_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          state: string
          status?: string
          start_date?: string | null
          end_date?: string | null
          winner_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          state?: string
          status?: string
          start_date?: string | null
          end_date?: string | null
          winner_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      candidates: {
        Row: {
          id: string
          election_id: string | null
          user_id: string | null
          platform: string | null
          vote_count: number
          declared_at: string
        }
        Insert: {
          id?: string
          election_id?: string | null
          user_id?: string | null
          platform?: string | null
          vote_count?: number
          declared_at?: string
        }
        Update: {
          id?: string
          election_id?: string | null
          user_id?: string | null
          platform?: string | null
          vote_count?: number
          declared_at?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          id: string
          election_id: string | null
          candidate_id: string | null
          voter_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          election_id?: string | null
          candidate_id?: string | null
          voter_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          election_id?: string | null
          candidate_id?: string | null
          voter_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      governors: {
        Row: {
          id: string
          state: string
          user_id: string | null
          election_id: string | null
          term_start: string
          term_end: string | null
          decree: string | null
          decree_set_at: string | null
        }
        Insert: {
          id?: string
          state: string
          user_id?: string | null
          election_id?: string | null
          term_start?: string
          term_end?: string | null
          decree?: string | null
          decree_set_at?: string | null
        }
        Update: {
          id?: string
          state?: string
          user_id?: string | null
          election_id?: string | null
          term_start?: string
          term_end?: string | null
          decree?: string | null
          decree_set_at?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string | null
          referred_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          referrer_id?: string | null
          referred_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string | null
          referred_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
