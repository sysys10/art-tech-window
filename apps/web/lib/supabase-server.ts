import {
  createServerComponentClient,
  createRouteHandlerClient,
} from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from './supabase'

// 서버 컴포넌트용
export const createSupabaseServerClient = () =>
  createServerComponentClient<Database>({ cookies })

// API 라우트 핸들러용
export const createSupabaseRouteHandlerClient = () =>
  createRouteHandlerClient<Database>({ cookies })
