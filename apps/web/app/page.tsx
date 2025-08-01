'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 사용자 인증 상태 확인
        const { data } = await axios.get('/api/auth/me')

        if (data.user) {
          // 로그인된 사용자는 /home으로 리다이렉트
          router.push('/home')
        } else {
          // 로그인되지 않은 사용자는 /login으로 리다이렉트
          router.push('/login')
        }
      } catch (error) {
        // API 에러 (401, 500 등)가 발생하면 로그인 페이지로
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // 로딩 중일 때 보여줄 스피너
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-3xl font-cafe24 text-blue-300">안녕하세요!</div>
      </div>
    )
  }

  return null
}
