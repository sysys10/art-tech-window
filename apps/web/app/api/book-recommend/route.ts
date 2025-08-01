// /app/api/recommend-books/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import OpenAI from 'openai'
import axios from 'axios'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const GOOGLE_BOOKS = 'https://www.googleapis.com/books/v1/volumes'

type Book = { title: string; thumbnail_img: string; book_url: string }

export async function POST(req: NextRequest) {
  try {
    // 1) 전달받은 story row 조회 ─────────────────────────────────────────
    const { id } = await req.json()
    const supabase = await createSupabaseServerClient()

    const { data: row, error } = await supabase
      .from('stories')
      .select('story, space')
      .eq('id', id)
      .single()

    if (error || !row) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    // 2) GPT-4o에게 "제목만" 뽑아달라고 구조화 출력 요청 ──────────────
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      // JSON Mode → 무조건 valid JSON 만들어 줌
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: [
            '너는 동화책 추천 엔진이야.',
            '반드시 다음 형식의 **JSON 객체**만 출력해.',
            '{ "titles": ["책 제목1", "책 제목2", "책 제목3"] }',
            '다른 아무 문자도 넣지 마라.',
          ].join('\n'),
        },
        {
          role: 'user',
          content: `스토리: ${row.story}\n공간: ${row.space}\n비슷한 어린이/청소년 책 3권만 추천해 줘.`,
        },
      ],
    })

    if (!completion.choices[0]) {
      return
    }
    const { titles } = JSON.parse(
      completion.choices[0].message.content as string,
    ) as {
      titles: string[]
    }

    // 3) 각 제목을 Google Books API로 조회해 썸네일·링크 확보 ──────────
    const books: Book[] = await Promise.all(
      titles.map(async (title) => {
        const { data } = await axios.get(GOOGLE_BOOKS, {
          params: { q: `intitle:${title}`, maxResults: 1, langRestrict: 'ko' },
        })
        const item = data.items?.[0]
        return {
          title,
          thumbnail_img:
            item?.volumeInfo?.imageLinks?.thumbnail?.replace(
              'http:',
              'https:',
            ) ?? '/book-placeholder.png',
          book_url:
            item?.volumeInfo?.infoLink ??
            `https://www.google.com/search?q=${encodeURIComponent(title)}`,
        }
      }),
    )

    // 4) [{ title, thumbnail_img, book_url }, ...] 형태로 응답 ───────────
    return NextResponse.json(books)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
