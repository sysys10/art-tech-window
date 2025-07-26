'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { MessageCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createSupabaseClient()

  const handleKakaoLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
          scopes: 'profile_nickname profile_image', // 이메일 제외하고 닉네임과 프로필 이미지만 요청
        },
      })

      if (error) {
        console.error('Login error:', error)
        alert('로그인 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Art Window</h2>
          <p className="text-gray-600">
            감정을 담은 나만의 창문을 만들어보세요
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleKakaoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-gray-900 bg-[#FEE500] hover:bg-[#FADA0A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3C7.03 3 3 6.14 3 10.1c0 2.75 1.8 5.15 4.47 6.46l-1.22 4.47c-.09.35.29.63.58.41L12 17.7c4.97 0 9-3.14 9-7.1S16.97 3 12 3z" />
              </svg>
            )}
            카카오로 시작하기
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>로그인하여 개인화된 감정 분석과</p>
          <p>이미지 생성 서비스를 이용하세요</p>
        </div>
      </div>
    </div>
  )
}
