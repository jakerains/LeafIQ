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
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          plan: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          plan?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          plan?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          category: string
          created_at: string | null
          description: string | null
          genetics: string | null
          id: string
          image_url: string | null
          name: string
          organization_id: string
          strain_type: string | null
          subcategory: string | null
          updated_at: string | null
        }
        Insert: {
          brand: string
          category: string
          created_at?: string | null
          description?: string | null
          genetics?: string | null
          id?: string
          image_url?: string | null
          name: string
          organization_id: string
          strain_type?: string | null
          subcategory?: string | null
          updated_at?: string | null
        }
        Update: {
          brand?: string
          category?: string
          created_at?: string | null
          description?: string | null
          genetics?: string | null
          id?: string
          image_url?: string | null
          name?: string
          organization_id?: string
          strain_type?: string | null
          subcategory?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          enable_demo_inventory: boolean | null
          full_name: string | null
          id: string
          location_zip: string | null
          menu_source: string | null
          organization_id: string | null
          phone_number: string | null
          referral_code: string | null
          role: string | null
          updated_at: string | null
          use_mode: string | null
          user_id: string | null
          wants_onboarding: boolean | null
        }
        Insert: {
          created_at?: string | null
          enable_demo_inventory?: boolean | null
          full_name?: string | null
          id?: string
          location_zip?: string | null
          menu_source?: string | null
          organization_id?: string | null
          phone_number?: string | null
          referral_code?: string | null
          role?: string | null
          updated_at?: string | null
          use_mode?: string | null
          user_id?: string | null
          wants_onboarding?: boolean | null
        }
        Update: {
          created_at?: string | null
          enable_demo_inventory?: boolean | null
          full_name?: string | null
          id?: string
          location_zip?: string | null
          menu_source?: string | null
          organization_id?: string | null
          phone_number?: string | null
          referral_code?: string | null
          role?: string | null
          updated_at?: string | null
          use_mode?: string | null
          user_id?: string | null
          wants_onboarding?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      search_queries: {
        Row: {
          id: string
          organization_id: string | null
          returned_product_ids: string[] | null
          search_phrase: string
          timestamp: string | null
          user_type: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          returned_product_ids?: string[] | null
          search_phrase: string
          timestamp?: string | null
          user_type: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          returned_product_ids?: string[] | null
          search_phrase?: string
          timestamp?: string | null
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_queries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          customer_id: string
          deleted_at: string | null
          id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_orders: {
        Row: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at: string | null
          currency: string
          customer_id: string
          deleted_at: string | null
          id: number
          payment_intent_id: string
          payment_status: string
          status: Database["public"]["Enums"]["stripe_order_status"]
          updated_at: string | null
        }
        Insert: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at?: string | null
          currency: string
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_intent_id: string
          payment_status: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Update: {
          amount_subtotal?: number
          amount_total?: number
          checkout_session_id?: string
          created_at?: string | null
          currency?: string
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_intent_id?: string
          payment_status?: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string
          deleted_at: string | null
          id: number
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status?: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      terpene_profiles: {
        Row: {
          bisabolol: number | null
          caryophyllene: number | null
          created_at: string | null
          humulene: number | null
          id: string
          limonene: number | null
          linalool: number | null
          myrcene: number | null
          ocimene: number | null
          pinene: number | null
          terpinolene: number | null
          updated_at: string | null
          valencene: number | null
          variant_id: string
        }
        Insert: {
          bisabolol?: number | null
          caryophyllene?: number | null
          created_at?: string | null
          humulene?: number | null
          id?: string
          limonene?: number | null
          linalool?: number | null
          myrcene?: number | null
          ocimene?: number | null
          pinene?: number | null
          terpinolene?: number | null
          updated_at?: string | null
          valencene?: number | null
          variant_id: string
        }
        Update: {
          bisabolol?: number | null
          caryophyllene?: number | null
          created_at?: string | null
          humulene?: number | null
          id?: string
          limonene?: number | null
          linalool?: number | null
          myrcene?: number | null
          ocimene?: number | null
          pinene?: number | null
          terpinolene?: number | null
          updated_at?: string | null
          valencene?: number | null
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "terpene_profiles_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variants"
            referencedColumns: ["id"]
          },
        ]
      }
      variants: {
        Row: {
          batch_number: string | null
          cbd_percentage: number | null
          created_at: string | null
          expiration_date: string | null
          harvest_date: string | null
          id: string
          inventory_level: number | null
          is_available: boolean | null
          lab_tested: boolean | null
          original_price: number | null
          price: number
          product_id: string
          size_weight: string | null
          terpene_profile: Json | null
          thc_percentage: number | null
          total_cannabinoids: number | null
          updated_at: string | null
        }
        Insert: {
          batch_number?: string | null
          cbd_percentage?: number | null
          created_at?: string | null
          expiration_date?: string | null
          harvest_date?: string | null
          id?: string
          inventory_level?: number | null
          is_available?: boolean | null
          lab_tested?: boolean | null
          original_price?: number | null
          price: number
          product_id: string
          size_weight?: string | null
          terpene_profile?: Json | null
          thc_percentage?: number | null
          total_cannabinoids?: number | null
          updated_at?: string | null
        }
        Update: {
          batch_number?: string | null
          cbd_percentage?: number | null
          created_at?: string | null
          expiration_date?: string | null
          harvest_date?: string | null
          id?: string
          inventory_level?: number | null
          is_available?: boolean | null
          lab_tested?: boolean | null
          original_price?: number | null
          price?: number
          product_id?: string
          size_weight?: string | null
          terpene_profile?: Json | null
          thc_percentage?: number | null
          total_cannabinoids?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      stripe_user_orders: {
        Row: {
          amount_subtotal: number | null
          amount_total: number | null
          checkout_session_id: string | null
          currency: string | null
          customer_id: string | null
          order_date: string | null
          order_id: number | null
          order_status:
            | Database["public"]["Enums"]["stripe_order_status"]
            | null
          payment_intent_id: string | null
          payment_status: string | null
        }
        Relationships: []
      }
      stripe_user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string | null
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          subscription_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["stripe_subscription_status"]
            | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_available_products: {
        Args: { org_id: string }
        Returns: {
          product_id: string
          product_name: string
          brand: string
          category: string
          strain_type: string
          variant_id: string
          price: number
          thc_percentage: number
          cbd_percentage: number
          inventory_level: number
          terpene_profile: Json
        }[]
      }
    }
    Enums: {
      stripe_order_status: "pending" | "completed" | "canceled"
      stripe_subscription_status:
        | "not_started"
        | "incomplete"
        | "incomplete_expired"
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never