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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_evaluations: {
        Row: {
          ai_conclusions: string | null
          created_at: string | null
          id: string
          level: string | null
          professor_focus_points: Json | null
          raw_responses: Json | null
          recommended_path: Json | null
          student_id: string
          suggested_drills: Json | null
          teaching_style: string | null
          weak_points: Json | null
        }
        Insert: {
          ai_conclusions?: string | null
          created_at?: string | null
          id?: string
          level?: string | null
          professor_focus_points?: Json | null
          raw_responses?: Json | null
          recommended_path?: Json | null
          student_id: string
          suggested_drills?: Json | null
          teaching_style?: string | null
          weak_points?: Json | null
        }
        Update: {
          ai_conclusions?: string | null
          created_at?: string | null
          id?: string
          level?: string | null
          professor_focus_points?: Json | null
          raw_responses?: Json | null
          recommended_path?: Json | null
          student_id?: string
          suggested_drills?: Json | null
          teaching_style?: string | null
          weak_points?: Json | null
        }
        Relationships: []
      }
      ai_session_reports: {
        Row: {
          confidence_score: number | null
          created_at: string
          fluency_score: number | null
          grammar_score: number | null
          id: string
          learning_style_detected: string | null
          next_session_suggestions: Json | null
          overall_score: number | null
          professor_prep_notes: string | null
          raw_conversation: Json | null
          recommendations: Json | null
          session_title: string
          session_type: string | null
          strengths: Json | null
          student_id: string
          vocabulary_score: number | null
          weaknesses: Json | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          fluency_score?: number | null
          grammar_score?: number | null
          id?: string
          learning_style_detected?: string | null
          next_session_suggestions?: Json | null
          overall_score?: number | null
          professor_prep_notes?: string | null
          raw_conversation?: Json | null
          recommendations?: Json | null
          session_title: string
          session_type?: string | null
          strengths?: Json | null
          student_id: string
          vocabulary_score?: number | null
          weaknesses?: Json | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          fluency_score?: number | null
          grammar_score?: number | null
          id?: string
          learning_style_detected?: string | null
          next_session_suggestions?: Json | null
          overall_score?: number | null
          professor_prep_notes?: string | null
          raw_conversation?: Json | null
          recommendations?: Json | null
          session_title?: string
          session_type?: string | null
          strengths?: Json | null
          student_id?: string
          vocabulary_score?: number | null
          weaknesses?: Json | null
        }
        Relationships: []
      }
      assignments: {
        Row: {
          assignment_type: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          professor_id: string
          status: string | null
          student_id: string
          title: string
        }
        Insert: {
          assignment_type?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          professor_id: string
          status?: string | null
          student_id: string
          title: string
        }
        Update: {
          assignment_type?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          professor_id?: string
          status?: string | null
          student_id?: string
          title?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booked_date: string
          cancellation_reason: string | null
          created_at: string | null
          end_time: string
          id: string
          professor_id: string
          start_time: string
          status: string | null
          student_id: string
        }
        Insert: {
          booked_date: string
          cancellation_reason?: string | null
          created_at?: string | null
          end_time: string
          id?: string
          professor_id: string
          start_time: string
          status?: string | null
          student_id: string
        }
        Update: {
          booked_date?: string
          cancellation_reason?: string | null
          created_at?: string | null
          end_time?: string
          id?: string
          professor_id?: string
          start_time?: string
          status?: string | null
          student_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number | null
          amount_cents: number | null
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          pack: string | null
          payment_method: string | null
          plan_id: string | null
          status: string | null
          stripe_payment_intent: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          amount_cents?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          pack?: string | null
          payment_method?: string | null
          plan_id?: string | null
          status?: string | null
          stripe_payment_intent?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          amount_cents?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          pack?: string | null
          payment_method?: string | null
          plan_id?: string | null
          status?: string | null
          stripe_payment_intent?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          ai_sessions: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          live_sessions: number | null
          name: string
          price_cents: number
          slug: string
          sort_order: number | null
          stripe_price_id: string | null
          stripe_product_id: string | null
        }
        Insert: {
          ai_sessions?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          live_sessions?: number | null
          name: string
          price_cents: number
          slug: string
          sort_order?: number | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
        }
        Update: {
          ai_sessions?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          live_sessions?: number | null
          name?: string
          price_cents?: number
          slug?: string
          sort_order?: number | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
        }
        Relationships: []
      }
      professor_availability: {
        Row: {
          buffer_minutes: number | null
          day_of_week: number | null
          end_time: string
          id: string
          is_active: boolean | null
          professor_id: string
          slot_duration_minutes: number | null
          start_time: string
          timezone: string | null
        }
        Insert: {
          buffer_minutes?: number | null
          day_of_week?: number | null
          end_time: string
          id?: string
          is_active?: boolean | null
          professor_id: string
          slot_duration_minutes?: number | null
          start_time: string
          timezone?: string | null
        }
        Update: {
          buffer_minutes?: number | null
          day_of_week?: number | null
          end_time?: string
          id?: string
          is_active?: boolean | null
          professor_id?: string
          slot_duration_minutes?: number | null
          start_time?: string
          timezone?: string | null
        }
        Relationships: []
      }
      professor_notes: {
        Row: {
          action_plan: string | null
          id: string
          next_session_focus: Json | null
          private_notes: string | null
          professor_id: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          action_plan?: string | null
          id?: string
          next_session_focus?: Json | null
          private_notes?: string | null
          professor_id: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          action_plan?: string | null
          id?: string
          next_session_focus?: Json | null
          private_notes?: string | null
          professor_id?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          pack: string | null
          paid_at: string | null
          payment_status: string | null
          sessions_remaining: number | null
          stripe_customer_id: string | null
          stripe_session_id: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          pack?: string | null
          paid_at?: string | null
          payment_status?: string | null
          sessions_remaining?: number | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          pack?: string | null
          paid_at?: string | null
          payment_status?: string | null
          sessions_remaining?: number | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      student_learning_profiles: {
        Row: {
          ai_teaching_notes: string | null
          avg_score: number | null
          best_response_format: string | null
          communication_tone: string | null
          created_at: string
          id: string
          last_session_at: string | null
          preferred_learning_style: string | null
          progress_velocity: string | null
          strong_areas: Json | null
          student_id: string
          total_sessions: number | null
          updated_at: string
          weak_areas: Json | null
        }
        Insert: {
          ai_teaching_notes?: string | null
          avg_score?: number | null
          best_response_format?: string | null
          communication_tone?: string | null
          created_at?: string
          id?: string
          last_session_at?: string | null
          preferred_learning_style?: string | null
          progress_velocity?: string | null
          strong_areas?: Json | null
          student_id: string
          total_sessions?: number | null
          updated_at?: string
          weak_areas?: Json | null
        }
        Update: {
          ai_teaching_notes?: string | null
          avg_score?: number | null
          best_response_format?: string | null
          communication_tone?: string | null
          created_at?: string
          id?: string
          last_session_at?: string | null
          preferred_learning_style?: string | null
          progress_velocity?: string | null
          strong_areas?: Json | null
          student_id?: string
          total_sessions?: number | null
          updated_at?: string
          weak_areas?: Json | null
        }
        Relationships: []
      }
      student_professor_assignments: {
        Row: {
          assigned_at: string | null
          id: string
          pack: string | null
          professor_id: string
          student_id: string
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          pack?: string | null
          professor_id: string
          student_id: string
        }
        Update: {
          assigned_at?: string | null
          id?: string
          pack?: string | null
          professor_id?: string
          student_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      book_professor_session:
        | {
            Args: {
              p_date: string
              p_end_time: string
              p_professor_id: string
              p_start_time: string
              p_student_id: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_date: string
              p_end_time: string
              p_professor_id: string
              p_start_time: string
              p_student_id: string
            }
            Returns: Json
          }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "student" | "professor" | "company_admin" | "admin"
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
      app_role: ["student", "professor", "company_admin", "admin"],
    },
  },
} as const
