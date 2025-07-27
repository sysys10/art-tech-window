'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function KakaoCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      // 인가 코드를 백엔드로 전송
      fetch('/api/auth/kakao/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      }).then(() => {
        router.push('/')
      })
    }
  }, [])

  return <div>로그인 처리 중...</div>
}
