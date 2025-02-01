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
      actblue_accounts: {
        Row: {
          candidate_first_name: string | null
          candidate_last_name: string | null
          candidate_middle_name: string | null
          candidate_suffix: Database["public"]["Enums"]["suffix_type"] | null
          city: string
          committee_type: Database["public"]["Enums"]["committee_type"]
          created_at: string | null
          disclaimer_text: string
          id: string
          is_active: boolean | null
          is_created: boolean | null
          is_onboarded: boolean | null
          legal_committee_name: string
          office_sought: string | null
          organization_name: string | null
          state: string
          street_address: string
          updated_at: string | null
          user_id: string
          zip_code: string
        }
        Insert: {
          candidate_first_name?: string | null
          candidate_last_name?: string | null
          candidate_middle_name?: string | null
          candidate_suffix?: Database["public"]["Enums"]["suffix_type"] | null
          city: string
          committee_type: Database["public"]["Enums"]["committee_type"]
          created_at?: string | null
          disclaimer_text: string
          id?: string
          is_active?: boolean | null
          is_created?: boolean | null
          is_onboarded?: boolean | null
          legal_committee_name: string
          office_sought?: string | null
          organization_name?: string | null
          state: string
          street_address: string
          updated_at?: string | null
          user_id: string
          zip_code: string
        }
        Update: {
          candidate_first_name?: string | null
          candidate_last_name?: string | null
          candidate_middle_name?: string | null
          candidate_suffix?: Database["public"]["Enums"]["suffix_type"] | null
          city?: string
          committee_type?: Database["public"]["Enums"]["committee_type"]
          created_at?: string | null
          disclaimer_text?: string
          id?: string
          is_active?: boolean | null
          is_created?: boolean | null
          is_onboarded?: boolean | null
          legal_committee_name?: string
          office_sought?: string | null
          organization_name?: string | null
          state?: string
          street_address?: string
          updated_at?: string | null
          user_id?: string
          zip_code?: string
        }
        Relationships: []
      }
      addresses: {
        Row: {
          actblue_account_id: string | null
          address_data: Json
          created_at: string | null
          id: string
          is_verified: boolean | null
          last_verified_at: string | null
          lob_id: string
          updated_at: string | null
        }
        Insert: {
          actblue_account_id?: string | null
          address_data: Json
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          last_verified_at?: string | null
          lob_id: string
          updated_at?: string | null
        }
        Update: {
          actblue_account_id?: string | null
          address_data?: Json
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          last_verified_at?: string | null
          lob_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_actblue_account_id_fkey"
            columns: ["actblue_account_id"]
            isOneToOne: false
            referencedRelation: "actblue_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      default_templates: {
        Row: {
          back_message: string
          created_at: string | null
          front_image_url: string
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          back_message: string
          created_at?: string | null
          front_image_url: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          back_message?: string
          created_at?: string | null
          front_image_url?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          created_at: string | null
          donation_data: Json
          error_message: string | null
          id: string
          last_attempt_at: string | null
          postcard_sent: boolean | null
          processed: boolean | null
          processing_attempts: number | null
          queue_date: string | null
          queue_status: Database["public"]["Enums"]["queue_status"] | null
          source: string | null
          timezone: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          donation_data: Json
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          postcard_sent?: boolean | null
          processed?: boolean | null
          processing_attempts?: number | null
          queue_date?: string | null
          queue_status?: Database["public"]["Enums"]["queue_status"] | null
          source?: string | null
          timezone?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          donation_data?: Json
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          postcard_sent?: boolean | null
          processed?: boolean | null
          processing_attempts?: number | null
          queue_date?: string | null
          queue_status?: Database["public"]["Enums"]["queue_status"] | null
          source?: string | null
          timezone?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      postcards: {
        Row: {
          created_at: string | null
          donation_id: string
          expected_delivery_date: string | null
          id: string
          lob_id: string
          lob_webhook_id: string | null
          status: Database["public"]["Enums"]["postcard_status"] | null
          template_id: string
          tracking_number: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          donation_id: string
          expected_delivery_date?: string | null
          id?: string
          lob_id: string
          lob_webhook_id?: string | null
          status?: Database["public"]["Enums"]["postcard_status"] | null
          template_id: string
          tracking_number?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          donation_id?: string
          expected_delivery_date?: string | null
          id?: string
          lob_id?: string
          lob_webhook_id?: string | null
          status?: Database["public"]["Enums"]["postcard_status"] | null
          template_id?: string
          tracking_number?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "postcards_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          first_name: string | null
          id: string
          is_confirmed: boolean | null
          last_name: string | null
          phone_number: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          first_name?: string | null
          id: string
          is_confirmed?: boolean | null
          last_name?: string | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          first_name?: string | null
          id?: string
          is_confirmed?: boolean | null
          last_name?: string | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          name: string
          template_data: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          name: string
          template_data: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          template_data?: Json
          user_id?: string
        }
        Relationships: []
      }
      usps_holidays: {
        Row: {
          created_at: string | null
          holiday_date: string
          holiday_name: string
          id: string
        }
        Insert: {
          created_at?: string | null
          holiday_date: string
          holiday_name: string
          id?: string
        }
        Update: {
          created_at?: string | null
          holiday_date?: string
          holiday_name?: string
          id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          last_retry_at: string | null
          payload: Json
          retry_count: number | null
          status: string
          webhook_type: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_retry_at?: string | null
          payload: Json
          retry_count?: number | null
          status: string
          webhook_type: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_retry_at?: string | null
          payload?: Json
          retry_count?: number | null
          status?: string
          webhook_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          user_id: string
          action_type: string
          max_requests: number
          window_minutes: number
        }
        Returns: boolean
      }
    }
    Enums: {
      committee_type: "candidate" | "organization"
      postcard_status:
        | "pending"
        | "in_transit"
        | "delivered"
        | "failed"
        | "returned"
      queue_status:
        | "pending_verification"
        | "verification_failed"
        | "verification_complete"
        | "pending_postcard"
        | "postcard_queued"
        | "processing_complete"
        | "failed"
      suffix_type: "Jr." | "Sr." | "II" | "III" | "IV" | "V"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
