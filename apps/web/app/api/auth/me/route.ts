import { NextRequest, NextResponse } from 'next/server'
import { getUserFromSessionToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    const user = await getUserFromSessionToken(sessionToken)

    if (!user) {
      return NextResponse.json(
        { error: '유효하지 않은 세션입니다.' },
        { status: 401 },
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        kakao_id: user.kakao_id,
        nickname: user.nickname,
        profile_image_url: user.profile_image_url,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: '사용자 정보를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 },
    )
  }
}
