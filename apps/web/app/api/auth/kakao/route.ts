import { NextRequest, NextResponse } from 'next/server'
import { loginOrCreateUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { kakao_token } = await req.json()

    if (!kakao_token) {
      return NextResponse.json(
        { error: '카카오 토큰이 필요합니다.' },
        { status: 400 },
      )
    }

    // 사용자 로그인/회원가입 처리
    const { user, sessionToken } = await loginOrCreateUser(kakao_token)

    // 세션 토큰을 쿠키에 설정
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        kakao_id: user.kakao_id,
        nickname: user.nickname,
        profile_image_url: user.profile_image_url,
      },
    })

    // HTTP-only 쿠키로 세션 토큰 저장 (보안상 안전)
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30일
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Kakao login error:', error)
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    )
  }
}
