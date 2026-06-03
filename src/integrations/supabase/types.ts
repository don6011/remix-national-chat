export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_user_id: string
          created_at: string
          details: Json
          id: string
          target_id: string | null
          target_type: string
        }
        Insert: {
          action_type: string
          admin_user_id: string
          created_at?: string
          details?: Json
          id?: string
          target_id?: string | null
          target_type: string
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          created_at?: string
          details?: Json
          id?: string
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      citizen_reports: {
        Row: {
          activity: string | null
          ai_tags: string[]
          caption: string
          city: string | null
          created_at: string
          id: string
          is_featured: boolean
          mood: string | null
          state_code: string | null
          status: Database["public"]["Enums"]["report_status"]
          thumbnail_url: string | null
          updated_at: string
          user_id: string
          venue_type: string | null
          video_url: string | null
          views: number
        }
        Insert: {
          activity?: string | null
          ai_tags?: string[]
          caption: string
          city?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          mood?: string | null
          state_code?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
          venue_type?: string | null
          video_url?: string | null
          views?: number
        }
        Update: {
          activity?: string | null
          ai_tags?: string[]
          caption?: string
          city?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          mood?: string | null
          state_code?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
          venue_type?: string | null
          video_url?: string | null
          views?: number
        }
        Relationships: []
      }
      live_signals: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string
          metric_value: string | null
          room_id: string | null
          signal_type: string
          sort_order: number
          state_code: string | null
          subtitle: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          metric_value?: string | null
          room_id?: string | null
          signal_type: string
          sort_order?: number
          state_code?: string | null
          subtitle?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          metric_value?: string | null
          room_id?: string | null
          signal_type?: string
          sort_order?: number
          state_code?: string | null
          subtitle?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_signals_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          room_id: string
          status: Database["public"]["Enums"]["message_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          room_id: string
          status?: Database["public"]["Enums"]["message_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          room_id?: string
          status?: Database["public"]["Enums"]["message_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_flags: {
        Row: {
          created_at: string
          id: string
          reason: string
          reporter_user_id: string
          resolution_notes: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["flag_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["flag_target_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          reporter_user_id: string
          resolution_notes?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["flag_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["flag_target_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          reporter_user_id?: string
          resolution_notes?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["flag_status"]
          target_id?: string
          target_type?: Database["public"]["Enums"]["flag_target_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          current_state: string | null
          display_name: string | null
          home_state: string | null
          host_rank: string
          id: string
          influence_score: number
          interests: string[]
          is_verified: boolean
          onboarded: boolean
          rank: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_state?: string | null
          display_name?: string | null
          home_state?: string | null
          host_rank?: string
          id?: string
          influence_score?: number
          interests?: string[]
          is_verified?: boolean
          onboarded?: boolean
          rank?: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_state?: string | null
          display_name?: string | null
          home_state?: string | null
          host_rank?: string
          id?: string
          influence_score?: number
          interests?: string[]
          is_verified?: boolean
          onboarded?: boolean
          rank?: string
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      report_comments: {
        Row: {
          body: string
          created_at: string
          id: string
          report_id: string
          status: Database["public"]["Enums"]["message_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          report_id: string
          status?: Database["public"]["Enums"]["message_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          report_id?: string
          status?: Database["public"]["Enums"]["message_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_comments_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "citizen_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          report_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji?: string
          id?: string
          report_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          report_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_reactions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "citizen_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          description: string | null
          host_user_id: string | null
          id: string
          is_archived: boolean
          is_featured: boolean
          name: string
          slug: string
          state_code: string | null
          updated_at: string
          venue_type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          host_user_id?: string | null
          id?: string
          is_archived?: boolean
          is_featured?: boolean
          name: string
          slug: string
          state_code?: string | null
          updated_at?: string
          venue_type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          host_user_id?: string | null
          id?: string
          is_archived?: boolean
          is_featured?: boolean
          name?: string
          slug?: string
          state_code?: string | null
          updated_at?: string
          venue_type?: string | null
        }
        Relationships: []
      }
      state_intelligence: {
        Row: {
          activity_level: string
          momentum_score: number
          mood: string
          primary_topic: string
          rival_state: string | null
          secondary_topic: string | null
          state_code: string
          top_venue: string | null
          trending_reason: string | null
          updated_at: string
        }
        Insert: {
          activity_level: string
          momentum_score?: number
          mood: string
          primary_topic: string
          rival_state?: string | null
          secondary_topic?: string | null
          state_code: string
          top_venue?: string | null
          trending_reason?: string | null
          updated_at?: string
        }
        Update: {
          activity_level?: string
          momentum_score?: number
          mood?: string
          primary_topic?: string
          rival_state?: string | null
          secondary_topic?: string | null
          state_code?: string
          top_venue?: string | null
          trending_reason?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      states: {
        Row: {
          active_topic: string | null
          code: string
          created_at: string
          hero_image_url: string | null
          id: string
          is_featured: boolean
          name: string
          tagline: string | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          active_topic?: string | null
          code: string
          created_at?: string
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean
          name: string
          tagline?: string | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          active_topic?: string | null
          code?: string
          created_at?: string
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean
          name?: string
          tagline?: string | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          username: string
          email: string
          home_state: string
          display_name: string | null
          rank: string | null
          influence_points: number | null
          messages_sent: number | null
          reactions_received: number | null
          referrals_count: number | null
          citizen_report_filed: boolean | null
          streak_days: number | null
          last_active: string | null
          is_founding_citizen: boolean | null
          is_patriot_plus: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          onboarded: boolean
        }
        Insert: {
          id: string
          username: string
          email: string
          home_state: string
          display_name?: string | null
          rank?: string | null
          influence_points?: number | null
          messages_sent?: number | null
          reactions_received?: number | null
          referrals_count?: number | null
          citizen_report_filed?: boolean | null
          streak_days?: number | null
          last_active?: string | null
          is_founding_citizen?: boolean | null
          is_patriot_plus?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          onboarded?: boolean
        }
        Update: {
          id?: string
          username?: string
          email?: string
          home_state?: string
          display_name?: string | null
          rank?: string | null
          influence_points?: number | null
          messages_sent?: number | null
          reactions_received?: number | null
          referrals_count?: number | null
          citizen_report_filed?: boolean | null
          streak_days?: number | null
          last_active?: string | null
          is_founding_citizen?: boolean | null
          is_patriot_plus?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          onboarded?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_moderator_or_above: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "user"
        | "verified_user"
        | "host"
        | "state_reporter"
        | "moderator"
        | "admin"
        | "super_admin"
      flag_status: "open" | "reviewing" | "resolved" | "dismissed"
      flag_target_type: "message" | "report" | "user" | "room" | "comment"
      message_status: "visible" | "hidden" | "flagged" | "removed"
      report_status: "pending" | "approved" | "rejected" | "flagged" | "removed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "user",
        "verified_user",
        "host",
        "state_reporter",
        "moderator",
        "admin",
        "super_admin",
      ],
      flag_status: ["open", "reviewing", "resolved", "dismissed"],
      flag_target_type: ["message", "report", "user", "room", "comment"],
      message_status: ["visible", "hidden", "flagged", "removed"],
      report_status: ["pending", "approved", "rejected", "flagged", "removed"],
    },
  },
} as const
