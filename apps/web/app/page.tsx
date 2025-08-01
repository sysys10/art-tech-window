'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // 사용자 인증 상태 확인
        const { data } = await axios.get('/api/auth/me')

        if (data.user) {
          // 로그인된 사용자는 /home으로 리다이렉트
          router.push('/home')
        } else {
          // 이론적으로는 middleware에서 이미 처리했지만, 혹시 모르니 로그인 페이지로
          router.push('/login')
        }
      } catch (error) {
        // API 에러가 발생하면 로그인 페이지로
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndRedirect()
  }, [router])

  // 로딩 중일 때 보여줄 스피너
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="text-3xl font-cafe24 text-blue-300 mb-4">
            안녕하세요!
          </div>
        </div>
      </div>
    )
  }

  return null
}
