import { loginOrCreateUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { code } = await req.json()

  // 1. 인가 코드로 토큰 요청
  const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
      redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/kakao/callback`,
      code,
    }),
  })

  const { access_token } = await tokenResponse.json()

  // 2. 기존 로그인 로직 실행
  const { user, sessionToken } = await loginOrCreateUser(access_token)

  // 3. 세션 설정 후 응답
  const response = NextResponse.json({ success: true })
  response.cookies.set('session_token', sessionToken, {
    /* ... */
  })
  return response
}
