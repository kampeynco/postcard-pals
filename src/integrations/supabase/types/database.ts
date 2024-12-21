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
      actblue_accounts: ActBlueAccountsTable
      addresses: AddressesTable
      default_templates: DefaultTemplatesTable
      donations: DonationsTable
      postcards: PostcardsTable
      profiles: ProfilesTable
      templates: TemplatesTable
      webhook_logs: WebhookLogsTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: DatabaseEnums
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export interface DatabaseEnums {
  committee_type: "candidate" | "political_action_committee" | "non_profit"
  postcard_status: "pending" | "in_transit" | "delivered" | "failed" | "returned"
}

export interface ActBlueAccountsTable {
  Row: {
    candidate_name: string | null
    city: string
    committee_name: string
    committee_type: Database["public"]["Enums"]["committee_type"]
    created_at: string | null
    disclaimer_text: string
    id: string
    office_sought: string | null
    state: string
    street_address: string
    user_id: string
    zip_code: string
  }
  Insert: {
    candidate_name?: string | null
    city: string
    committee_name: string
    committee_type: Database["public"]["Enums"]["committee_type"]
    created_at?: string | null
    disclaimer_text: string
    id?: string
    office_sought?: string | null
    state: string
    street_address: string
    user_id: string
    zip_code: string
  }
  Update: {
    candidate_name?: string | null
    city?: string
    committee_name?: string
    committee_type?: Database["public"]["Enums"]["committee_type"]
    created_at?: string | null
    disclaimer_text?: string
    id?: string
    office_sought?: string | null
    state?: string
    street_address?: string
    user_id?: string
    zip_code?: string
  }
  Relationships: []
}

export interface AddressesTable {
  Row: {
    address_data: Json
    created_at: string | null
    id: string
    is_verified: boolean | null
    last_verified_at: string | null
    lob_id: string
    user_id: string | null
  }
  Insert: {
    address_data: Json
    created_at?: string | null
    id?: string
    is_verified?: boolean | null
    last_verified_at?: string | null
    lob_id: string
    user_id?: string | null
  }
  Update: {
    address_data?: Json
    created_at?: string | null
    id?: string
    is_verified?: boolean | null
    last_verified_at?: string | null
    lob_id?: string
    user_id?: string | null
  }
  Relationships: []
}

export interface DefaultTemplatesTable {
  Row: {
    back_message: string
    created_at: string | null
    front_image_url: string
    id: string
    is_active: boolean | null
    user_id: string
  }
  Insert: {
    back_message: string
    created_at?: string | null
    front_image_url: string
    id?: string
    is_active?: boolean | null
    user_id: string
  }
  Update: {
    back_message?: string
    created_at?: string | null
    front_image_url?: string
    id?: string
    is_active?: boolean | null
    user_id?: string
  }
  Relationships: []
}

export interface DonationsTable {
  Row: {
    created_at: string | null
    donation_data: Json
    id: string
    postcard_sent: boolean | null
    processed: boolean | null
    source: string | null
    user_id: string | null
  }
  Insert: {
    created_at?: string | null
    donation_data: Json
    id?: string
    postcard_sent?: boolean | null
    processed?: boolean | null
    source?: string | null
    user_id?: string | null
  }
  Update: {
    created_at?: string | null
    donation_data?: Json
    id?: string
    postcard_sent?: boolean | null
    processed?: boolean | null
    source?: string | null
    user_id?: string | null
  }
  Relationships: []
}

export interface PostcardsTable {
  Row: {
    created_at: string | null
    donation_id: string
    expected_delivery_date: string | null
    id: string
    lob_id: string
    lob_webhook_id: string | null
    status: Database["public"]["Enums"]["postcard_status"]
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
    status?: Database["public"]["Enums"]["postcard_status"]
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
    status?: Database["public"]["Enums"]["postcard_status"]
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
    {
      foreignKeyName: "postcards_template_id_fkey"
      columns: ["template_id"]
      isOneToOne: false
      referencedRelation: "templates"
      referencedColumns: ["id"]
    },
  ]
}

export interface ProfilesTable {
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
    role?: string
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
    role?: string
    updated_at?: string | null
  }
  Relationships: []
}

export interface TemplatesTable {
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

export interface WebhookLogsTable {
  Row: {
    created_at: string | null
    error_message: string | null
    id: string
    payload: Json
    status: string
    webhook_type: string
  }
  Insert: {
    created_at?: string | null
    error_message?: string | null
    id?: string
    payload: Json
    status?: string
    webhook_type: string
  }
  Update: {
    created_at?: string | null
    error_message?: string | null
    id?: string
    payload?: Json
    status?: string
    webhook_type?: string
  }
  Relationships: []
}
