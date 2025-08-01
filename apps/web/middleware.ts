import { NextRequest, NextResponse } from 'next/server'

// JWT 토큰의 페이로드를 디코딩하는 간단한 함수 (검증은 서버에서)
function decodeJWT(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1]!))

    // 토큰 만료 시간 확인
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null // 만료됨
    }

    return payload
  } catch (error) {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 인증이 필요하지 않은 페이지들 (공개 페이지)
  const publicPaths = [
    '/login',
    '/auth/kakao/callback',
    '/_next',
    '/favicon.ico',
    '/api/auth/kakao',
    '/api/auth/kakao/callback',
    '/images', // 이미지 파일들
    '/icons', // 아이콘 파일들
  ]

  // 현재 경로가 공개 페이지인지 확인
  const isPublicPath = publicPaths.some(
    (path) => pathname.startsWith(path) || pathname === '/',
  )

  // 공개 페이지는 인증 검사 없이 통과
  if (isPublicPath) {
    return NextResponse.next()
  }

  // 세션 토큰 확인
  const sessionToken = request.cookies.get('session_token')?.value

  if (!sessionToken) {
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    console.log(`No session token found for ${pathname}, redirecting to login`)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // JWT 토큰 간단 검증 (만료 시간만 확인)
  const payload = decodeJWT(sessionToken)

  if (!payload) {
    // 토큰이 유효하지 않으면 쿠키 삭제하고 로그인 페이지로 리다이렉트
    console.log(`Invalid session token for ${pathname}, redirecting to login`)
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // 즉시 만료
      path: '/',
    })
    return response
  }

  // 토큰이 유효하면 요청 계속 진행
  return NextResponse.next()
}

export const config = {
  // 미들웨어가 실행될 경로 패턴 지정
  matcher: [
    /*
     * 다음 경로들을 제외한 모든 경로에서 실행:
     * - api (API routes는 자체 인증 처리)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (.png, .jpg, .svg 등)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
