import { createSupabaseServerClient } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json()

    const supabase = await createSupabaseServerClient()
  } catch (err) {}
}
