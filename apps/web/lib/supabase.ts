import { createClient } from '@supabase/supabase-js'

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          kakao_id: string
          nickname: string
          profile_image_url: string | null
          kakao_token: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kakao_id: string
          nickname: string
          profile_image_url?: string | null
          kakao_token: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kakao_id?: string
          nickname?: string
          profile_image_url?: string | null
          kakao_token?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          expires_at?: string | null
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

// 클라이언트용 (데이터 조회만)
const createSupabaseClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
export const supabaseClient = createSupabaseClient()
// 서버용 (모든 권한)
export const createSupabaseServerClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
