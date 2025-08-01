import { withAuth } from '@/lib/auth-middleware'
import { createSupabaseServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type EmotionValue = 'joy' | 'sadness' | 'anger' | 'fear'

// 감정을 한국어로 매핑
const emotionMapping: Record<EmotionValue, string> = {
  joy: '행복',
  sadness: '슬픔',
  anger: '화남',
  fear: '무서움',
}
const STORY_PROMPT = `You are a friendly AI storyteller who writes short fairy-tale stories for children.

## Your Role:
Generate a short story (around 4-5 sentences in Korean) that weaves together:
- **Space** chosen by the child (e.g., "숲속", "도서관", "바닷속", "우주")
- **Emotion** keyword chosen by the child (e.g., "용감함", "호기심", "수줍음", "슬픔", "행복")
- **Personal Experience** shared by the child (e.g., “작년 여름에 바다에서 놀았던 기억”, “첫 유치가 빠졌을 때 느꼈던 기쁨”)

## Story Guidelines:
1. **Beginning** - Introduce the main character and the space.
2. **Development** - Show the character's problem, desire, emotional state, or the child's personal experience.
3. **Climax** - Describe a challenge, turning point, or encounter.
4. **Ending** - Resolve the situation with a warm, positive outcome.
- Use warm, caring language, like a parent reading a bedtime story.
- Keep the language simple and emotionally appropriate for children aged 5-9.
- Encourage imagination, comfort, and curiosity.
- Avoid complicated vocabulary, adult expressions, or ambiguous endings.

## Output Requirements:
- Write the story in **Korean**.
- Output exactly **4 to 5 full sentences**.
- Keep the entire story under **500 characters**.
- Provide **only** the story text—no introductions, explanations, or system messages.
- Always end with a hopeful or heartwarming feeling.

## Key Instructions:
- Stick to **4-5 Korean sentences only**.
- No bullet points, no summaries—just the story text.
- Every story must be emotionally safe, positive, and imaginative.

Now create a story with:
- Space: {space}
- PersonalExperience: {experience}
- Beginning: {beginning}
- Development: {development}
- Climax: {climax}
- Ending: Resolve the situation with a warm, positive outcome`

export const POST = async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    try {
      const { myPlace, k, s, j, g, exp, character_img_url } = await req.json()
      console.log(exp)
      if (!myPlace || !k) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid request: missing required fields',
          },
          { status: 400 },
        )
      }

      const emotionInKorean = emotionMapping[k as EmotionValue] || '행복'
      const selectedSpace = myPlace

      const prompt = STORY_PROMPT.replace('{space}', selectedSpace)
        .replace('{beginning}', k)
        .replace('{development}', s) // 승
        .replace('{climax}', j) // 전
        .replace('{experience}', exp)
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.8,
      })

      const generatedStory =
        completion.choices?.[0]?.message?.content?.trim() ||
        '이야기를 생성할 수 없습니다.'

      const supabase = createSupabaseServerClient()
      const { data: inserted, error } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          space: selectedSpace,
          emotion: emotionInKorean,
          story: generatedStory,
          character_img_url,
        })
        .select('id') // ⭐️ id 컬럼만 가져오고
        .single() // ⭐️ 단일 행으로 반환

      // ──────────────────────────────────────────────────────────────
      // 2️⃣ 에러 처리
      // ──────────────────────────────────────────────────────────────
      if (error || !inserted) {
        console.error('Supabase insert error:', error)
        throw error ?? new Error('Insert failed')
      }

      // ──────────────────────────────────────────────────────────────
      // 3️⃣ 클라이언트 응답
      // ──────────────────────────────────────────────────────────────
      return NextResponse.json({
        success: true,
        id: inserted.id,
        story: generatedStory,
        space: selectedSpace,
        emotion: emotionInKorean,
        character_img_url,
      })
    } catch (err) {
      console.error('Story generation error:', err)

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate story',
          message: err instanceof Error ? err.message : JSON.stringify(err),
        },
        { status: 500 },
      )
    }
  })
}
