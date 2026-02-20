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
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          organization: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          organization?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          organization?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: string
          email_notifications: boolean
          analysis_notifications: boolean
          auto_save_results: boolean
          default_view: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          email_notifications?: boolean
          analysis_notifications?: boolean
          auto_save_results?: boolean
          default_view?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          email_notifications?: boolean
          analysis_notifications?: boolean
          auto_save_results?: boolean
          default_view?: string
          created_at?: string
          updated_at?: string
        }
      }
      analysis_history: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_size: number
          total_accounts: number
          suspicious_accounts: number
          fraud_rings_detected: number
          processing_time_ms: number
          analysis_data: Json
          tags: string[]
          notes: string | null
          is_favorite: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_size: number
          total_accounts: number
          suspicious_accounts: number
          fraud_rings_detected: number
          processing_time_ms: number
          analysis_data: Json
          tags?: string[]
          notes?: string | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_size?: number
          total_accounts?: number
          suspicious_accounts?: number
          fraud_rings_detected?: number
          processing_time_ms?: number
          analysis_data?: Json
          tags?: string[]
          notes?: string | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      saved_filters: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          filter_config: Json
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          filter_config: Json
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          filter_config?: Json
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      shared_analyses: {
        Row: {
          id: string
          analysis_id: string
          owner_id: string
          shared_with_email: string
          permission: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          analysis_id: string
          owner_id: string
          shared_with_email: string
          permission?: string
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          analysis_id?: string
          owner_id?: string
          shared_with_email?: string
          permission?: string
          expires_at?: string | null
          created_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          user_id: string
          action: string
          resource_type: string | null
          resource_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          resource_type?: string | null
          resource_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          resource_type?: string | null
          resource_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      user_statistics: {
        Row: {
          user_id: string
          total_analyses: number
          total_suspicious: number
          total_rings: number
          avg_processing_time: number
          last_analysis_date: string
          favorite_count: number
        }
      }
    }
  }
}
