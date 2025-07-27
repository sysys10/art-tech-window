import { createSupabaseServerClient } from './supabase'
import jwt from 'jsonwebtoken'

export interface User {
  id: string
  kakao_id: string
  nickname: string
  profile_image_url?: string
}

export interface KakaoUserInfo {
  id: number
  connected_at: string
  properties: {
    nickname: string
    profile_image?: string
    thumbnail_image?: string
  }
  kakao_account?: {
    profile_nickname_needs_agreement?: boolean
    profile_image_needs_agreement?: boolean
    profile?: {
      nickname?: string
      thumbnail_image_url?: string
      profile_image_url?: string
      is_default_image?: boolean
    }
  }
}

// 카카오 사용자 정보 가져오기
export async function getKakaoUserInfo(
  kakaoToken: string,
): Promise<KakaoUserInfo> {
  const response = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${kakaoToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Kakao user info')
  }

  return response.json()
}

// 사용자 로그인 또는 회원가입 처리
export async function loginOrCreateUser(
  kakaoToken: string,
): Promise<{ user: User; sessionToken: string }> {
  const supabase = createSupabaseServerClient()

  // 카카오 사용자 정보 가져오기
  const kakaoUser = await getKakaoUserInfo(kakaoToken)
  const kakaoId = kakaoUser.id.toString()
  const nickname =
    kakaoUser.properties?.nickname ||
    kakaoUser.kakao_account?.profile?.nickname ||
    '사용자'
  const profileImageUrl =
    kakaoUser.properties?.profile_image ||
    kakaoUser.kakao_account?.profile?.profile_image_url

  // 기존 사용자 확인
  let { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('kakao_id', kakaoId)
    .single()

  let user: User

  if (existingUser) {
    // 기존 사용자 - 카카오 토큰 업데이트
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        kakao_token: kakaoToken,
        nickname,
        profile_image_url: profileImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingUser.id)
      .select()
      .single()

    if (error) throw error
    user = updatedUser
  } else {
    // 새 사용자 생성
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        kakao_id: kakaoId,
        nickname,
        profile_image_url: profileImageUrl,
        kakao_token: kakaoToken,
      })
      .select()
      .single()

    if (error) throw error
    user = newUser
  }

  // 세션 토큰 생성
  const sessionToken = jwt.sign(
    { userId: user.id, kakaoId: user.kakao_id },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '30d' }, // 30일 유효
  )

  // 세션 저장
  await supabase.from('user_sessions').insert({
    user_id: user.id,
    session_token: sessionToken,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30일 후
  })

  return { user, sessionToken }
}

// 세션 토큰으로 사용자 정보 가져오기
export async function getUserFromSessionToken(
  sessionToken: string,
): Promise<User | null> {
  try {
    const supabase = createSupabaseServerClient()

    // JWT 토큰 검증
    const decoded = jwt.verify(
      sessionToken,
      process.env.JWT_SECRET || 'fallback-secret',
    ) as any

    // 세션 유효성 확인
    const { data: session } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .eq('user_id', decoded.userId)
      .single()

    if (!session) return null

    // 만료 시간 확인
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      // 만료된 세션 삭제
      await supabase.from('user_sessions').delete().eq('id', session.id)
      return null
    }

    // 사용자 정보 가져오기
    const { data: user } = await supabase
      .from('users')
      .select('id, kakao_id, nickname, profile_image_url')
      .eq('id', session.user_id)
      .single()

    return user
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

// 로그아웃 (세션 삭제)
export async function logout(sessionToken: string): Promise<void> {
  const supabase = createSupabaseServerClient()

  await supabase
    .from('user_sessions')
    .delete()
    .eq('session_token', sessionToken)
}

// 카카오 토큰 갱신 (필요시)
export async function refreshKakaoToken(
  userId: string,
): Promise<string | null> {
  const supabase = createSupabaseServerClient()

  const { data: user } = await supabase
    .from('users')
    .select('kakao_token')
    .eq('id', userId)
    .single()

  if (!user) return null

  // 카카오 토큰 유효성 검사 (간단한 API 호출로 확인)
  try {
    await getKakaoUserInfo(user.kakao_token)
    return user.kakao_token // 토큰이 유효하면 그대로 반환
  } catch (error) {
    console.error('Kakao token validation failed:', error)
    return null
  }
}
