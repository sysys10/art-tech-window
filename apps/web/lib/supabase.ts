import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          kakao_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          kakao_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          kakao_id?: string | null
          created_at?: string
        }
      }
      emotion_tags: {
        Row: {
          id: number
          name: string
          color_code: string | null
        }
        Insert: {
          id?: number
          name: string
          color_code?: string | null
        }
        Update: {
          id?: number
          name?: string
          color_code?: string | null
        }
      }
      user_emotion_events: {
        Row: {
          id: string
          user_id: string
          source_text: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source_text: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source_text?: string
          created_at?: string
        }
      }
      event_emotions: {
        Row: {
          id: string
          emotion_event_id: string
          emotion_id: number
        }
        Insert: {
          id?: string
          emotion_event_id: string
          emotion_id: number
        }
        Update: {
          id?: string
          emotion_event_id?: string
          emotion_id?: number
        }
      }
      user_images: {
        Row: {
          id: string
          user_id: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          created_at?: string
        }
      }
      generated_images: {
        Row: {
          id: string
          user_image_id: string
          prompt: string | null
          generated_url: string
          created_at: string
        }
        Insert: {
          id?: string
          user_image_id: string
          prompt?: string | null
          generated_url: string
          created_at?: string
        }
        Update: {
          id?: string
          user_image_id?: string
          prompt?: string | null
          generated_url?: string
          created_at?: string
        }
      }
      image_emotions: {
        Row: {
          id: string
          generated_id: string
          emotion_id: number
        }
        Insert: {
          id?: string
          generated_id: string
          emotion_id: number
        }
        Update: {
          id?: string
          generated_id?: string
          emotion_id?: number
        }
      }
      display_sessions: {
        Row: {
          id: string
          generated_id: string
          start_time: string | null
          end_time: string | null
          location: string | null
        }
        Insert: {
          id?: string
          generated_id: string
          start_time?: string | null
          end_time?: string | null
          location?: string | null
        }
        Update: {
          id?: string
          generated_id?: string
          start_time?: string | null
          end_time?: string | null
          location?: string | null
        }
      }
    }
  }
}

// 클라이언트 컴포넌트용
export const createSupabaseClient = () =>
  createClientComponentClient<Database>()

// 서비스 역할용 (관리자 작업)
export const createSupabaseServiceClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
