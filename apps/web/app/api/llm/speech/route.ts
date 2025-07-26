import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    const supabase = createRouteHandlerClient<Database>({ cookies })

    // 사용자 인증 확인
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    const prompt = `
다음 문장에서 느껴지는 감정을 키워드로 1~3개 추출해 주세요.
감정 키워드는 '기쁨', '슬픔', '분노', '불안', '놀람', '혐오', '평온함', '만족', '후회', '설렘' 등의 단어 중에서 선택해주세요.
문장: "${text}"
결과:
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    })

    const raw = completion.choices[0]!.message.content?.trim() || ''
    const tags = raw
      .replace(/[^가-힣,]/g, '') // 한글, 쉼표만 남김
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    // 감정 이벤트를 데이터베이스에 저장
    const { data: emotionEvent, error: eventError } = await supabase
      .from('user_emotion_events')
      .insert({
        user_id: session.user.id,
        source_text: text,
      })
      .select()
      .single()

    if (eventError) {
      console.error('감정 이벤트 저장 실패:', eventError)
      return NextResponse.json(
        { error: '감정 이벤트 저장 실패' },
        { status: 500 },
      )
    }

    // 감정 태그들을 emotion_tags 테이블에서 찾거나 생성
    for (const tag of tags) {
      // 감정 태그 존재 확인
      let { data: emotionTag } = await supabase
        .from('emotion_tags')
        .select('id')
        .eq('name', tag)
        .single()

      // 태그가 없으면 생성
      if (!emotionTag) {
        const { data: newTag } = await supabase
          .from('emotion_tags')
          .insert({ name: tag })
          .select('id')
          .single()
        emotionTag = newTag
      }

      // 이벤트와 감정 태그 매핑
      if (emotionTag) {
        await supabase.from('event_emotions').insert({
          emotion_event_id: emotionEvent.id,
          emotion_id: emotionTag.id,
        })
      }
    }

    return NextResponse.json({ tags, eventId: emotionEvent.id })
  } catch (error) {
    console.error('OpenAI 요청 실패:', error)
    return NextResponse.json({ error: 'OpenAI 요청 실패' }, { status: 500 })
  }
}
