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
      issues: {
        Row: {
          category: string
          con_arguments: string[]
          created_at: string
          empirical_studies: Json
          id: string
          impact_details: Json
          pro_arguments: string[]
          slug: string
          summary: string
          title: string
          vote_options: string[]
        }
        Insert: {
          category: string
          con_arguments?: string[]
          created_at?: string
          empirical_studies?: Json
          id?: string
          impact_details?: Json
          pro_arguments?: string[]
          slug: string
          summary: string
          title: string
          vote_options?: string[]
        }
        Update: {
          category?: string
          con_arguments?: string[]
          created_at?: string
          empirical_studies?: Json
          id?: string
          impact_details?: Json
          pro_arguments?: string[]
          slug?: string
          summary?: string
          title?: string
          vote_options?: string[]
        }
        Relationships: []
      }
      member_documents: {
        Row: {
          document_type: string
          file_path: string | null
          file_url: string
          id: string
          is_public: boolean
          profile_id: string
          title: string | null
          uploaded_at: string
        }
        Insert: {
          document_type: string
          file_path?: string | null
          file_url: string
          id?: string
          is_public?: boolean
          profile_id: string
          title?: string | null
          uploaded_at?: string
        }
        Update: {
          document_type?: string
          file_path?: string | null
          file_url?: string
          id?: string
          is_public?: boolean
          profile_id?: string
          title?: string | null
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_documents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "admin_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_documents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_applications: {
        Row: {
          address: string | null
          captured_by: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string
          gender: string | null
          id: string
          id_number: string | null
          marital_status: string | null
          marketing_consent: boolean
          member_signature: string | null
          mobile_no: string
          municipality: string | null
          nationality: string | null
          postal_code: string | null
          province: string | null
          religion: string | null
          residence_status: string | null
          status: string
          suburb: string | null
          updated_at: string
          voter_registration_status: string | null
          ward: string | null
          ward_leader: string | null
        }
        Insert: {
          address?: string | null
          captured_by?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name: string
          gender?: string | null
          id?: string
          id_number?: string | null
          marital_status?: string | null
          marketing_consent?: boolean
          member_signature?: string | null
          mobile_no: string
          municipality?: string | null
          nationality?: string | null
          postal_code?: string | null
          province?: string | null
          religion?: string | null
          residence_status?: string | null
          status?: string
          suburb?: string | null
          updated_at?: string
          voter_registration_status?: string | null
          ward?: string | null
          ward_leader?: string | null
        }
        Update: {
          address?: string | null
          captured_by?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          id_number?: string | null
          marital_status?: string | null
          marketing_consent?: boolean
          member_signature?: string | null
          mobile_no?: string
          municipality?: string | null
          nationality?: string | null
          postal_code?: string | null
          province?: string | null
          religion?: string | null
          residence_status?: string | null
          status?: string
          suburb?: string | null
          updated_at?: string
          voter_registration_status?: string | null
          ward?: string | null
          ward_leader?: string | null
        }
        Relationships: []
      }
      personal_bottlenecks: {
        Row: {
          category: string
          created_at: string
          detailed_description: string
          geographical_node: string
          has_supporting_doc: boolean
          headline: string
          id: string
          profile_id: string
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          detailed_description: string
          geographical_node: string
          has_supporting_doc?: boolean
          headline: string
          id?: string
          profile_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          detailed_description?: string
          geographical_node?: string
          has_supporting_doc?: boolean
          headline?: string
          id?: string
          profile_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_bottlenecks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "admin_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_bottlenecks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_attributes: {
        Row: {
          attribute_type: string
          attribute_value: string
          created_at: string
          id: string
          profile_id: string
        }
        Insert: {
          attribute_type: string
          attribute_value: string
          created_at?: string
          id?: string
          profile_id: string
        }
        Update: {
          attribute_type?: string
          attribute_value?: string
          created_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_attributes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "admin_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_attributes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          consent_given_at: string | null
          consent_version: string | null
          created_at: string
          ekurhuleni_ward: number | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          industry_sector: string | null
          is_registered_voter: boolean
          manifesto_alignment: number | null
          member_number: string | null
          phone: string | null
          primary_role: Database["public"]["Enums"]["primary_role"] | null
          province: string | null
          rsa_id: string | null
          rsa_id_last4: string | null
          skills_keywords: string[]
          street_address: string | null
          structural_sector: string | null
          surname: string | null
          updated_at: string
          voting_district: string | null
        }
        Insert: {
          city?: string | null
          consent_given_at?: string | null
          consent_version?: string | null
          created_at?: string
          ekurhuleni_ward?: number | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          industry_sector?: string | null
          is_registered_voter?: boolean
          manifesto_alignment?: number | null
          member_number?: string | null
          phone?: string | null
          primary_role?: Database["public"]["Enums"]["primary_role"] | null
          province?: string | null
          rsa_id?: string | null
          rsa_id_last4?: string | null
          skills_keywords?: string[]
          street_address?: string | null
          structural_sector?: string | null
          surname?: string | null
          updated_at?: string
          voting_district?: string | null
        }
        Update: {
          city?: string | null
          consent_given_at?: string | null
          consent_version?: string | null
          created_at?: string
          ekurhuleni_ward?: number | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          industry_sector?: string | null
          is_registered_voter?: boolean
          manifesto_alignment?: number | null
          member_number?: string | null
          phone?: string | null
          primary_role?: Database["public"]["Enums"]["primary_role"] | null
          province?: string | null
          rsa_id?: string | null
          rsa_id_last4?: string | null
          skills_keywords?: string[]
          street_address?: string | null
          structural_sector?: string | null
          surname?: string | null
          updated_at?: string
          voting_district?: string | null
        }
        Relationships: []
      }
      town_hall_comments: {
        Row: {
          comment_as_persona: string
          comment_text: string
          created_at: string
          id: string
          issue_id: string
          profile_id: string
          upvotes: number
        }
        Insert: {
          comment_as_persona: string
          comment_text: string
          created_at?: string
          id?: string
          issue_id: string
          profile_id: string
          upvotes?: number
        }
        Update: {
          comment_as_persona?: string
          comment_text?: string
          created_at?: string
          id?: string
          issue_id?: string
          profile_id?: string
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "town_hall_comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "town_hall_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "admin_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "town_hall_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      votes: {
        Row: {
          created_at: string
          id: string
          issue_id: string
          profile_id: string
          updated_at: string
          verification_hash: string
          vote_choice: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_id: string
          profile_id: string
          updated_at?: string
          verification_hash: string
          vote_choice: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_id?: string
          profile_id?: string
          updated_at?: string
          verification_hash?: string
          vote_choice?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "admin_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_members: {
        Row: {
          city: string | null
          consent_given_at: string | null
          created_at: string | null
          ekurhuleni_ward: number | null
          email: string | null
          first_name: string | null
          id: string | null
          is_registered_voter: boolean | null
          member_number: string | null
          phone: string | null
          province: string | null
          rsa_id_masked: string | null
          street_address: string | null
          surname: string | null
          voting_district: string | null
        }
        Insert: {
          city?: string | null
          consent_given_at?: string | null
          created_at?: string | null
          ekurhuleni_ward?: number | null
          email?: string | null
          first_name?: string | null
          id?: string | null
          is_registered_voter?: boolean | null
          member_number?: string | null
          phone?: string | null
          province?: string | null
          rsa_id_masked?: never
          street_address?: string | null
          surname?: string | null
          voting_district?: string | null
        }
        Update: {
          city?: string | null
          consent_given_at?: string | null
          created_at?: string | null
          ekurhuleni_ward?: number | null
          email?: string | null
          first_name?: string | null
          id?: string | null
          is_registered_voter?: boolean | null
          member_number?: string | null
          phone?: string | null
          province?: string | null
          rsa_id_masked?: never
          street_address?: string | null
          surname?: string | null
          voting_district?: string | null
        }
        Relationships: []
      }
      crisis_tracker: {
        Row: {
          category: string | null
          created_at: string | null
          geographical_node: string | null
          id: string | null
          status: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          geographical_node?: string | null
          id?: string | null
          status?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          geographical_node?: string | null
          id?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_vote_tallies: {
        Args: { _issue_id?: string }
        Returns: {
          issue_id: string
          total: number
          vote_choice: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member"
      primary_role:
        | "Business"
        | "Student"
        | "Senior Citizen"
        | "Youth Member"
        | "Religious Person"
        | "Non-Religious Person"
        | "Content Creator"
        | "Content Consumer"
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
      app_role: ["admin", "member"],
      primary_role: [
        "Business",
        "Student",
        "Senior Citizen",
        "Youth Member",
        "Religious Person",
        "Non-Religious Person",
        "Content Creator",
        "Content Consumer",
      ],
    },
  },
} as const
