import { NextRequest, NextResponse } from 'next/server'
import { getUserFromSessionToken } from './auth'

// API 라우트에서 사용할 인증 미들웨어
export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>,
) {
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

    return handler(req, user)
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.json(
      { error: '인증 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    )
  }
}
