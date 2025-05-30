export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          plan: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          plan?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          plan?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      search_queries: {
        Row: {
          id: string
          search_phrase: string
          user_type: string
          returned_product_ids: string[]
          timestamp: string
          organization_id: string | null
        }
        Insert: {
          id?: string
          search_phrase: string
          user_type: string
          returned_product_ids: string[]
          timestamp?: string
          organization_id?: string | null
        }
        Update: {
          id?: string
          search_phrase?: string
          user_type?: string
          returned_product_ids?: string[]
          timestamp?: string
          organization_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}