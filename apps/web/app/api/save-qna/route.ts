import { createSupabaseServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const POST = async (req: NextRequest) => {
  try {
    // const { myPlace, emotion } = req.body
    // 여기서 공간, emoion가지고 openai 줄거리 생성,

    //
    const supabase = createSupabaseServerClient()
  } catch (err) {
    NextResponse.next({})
  }
}
