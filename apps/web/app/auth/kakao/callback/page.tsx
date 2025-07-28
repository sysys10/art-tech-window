'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function KakaoCallback() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const errorParam = urlParams.get('error')

    if (errorParam) {
      setIsLoading(false)
      setTimeout(() => router.push('/'), 2000)
      return
    }

    if (code) {
      fetch('/api/auth/kakao/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Login failed')
          return res.json()
        })
        .then(() => {
          setIsLoading(false)
          router.push('/')
        })
        .catch((err) => {
          console.error('Login error:', err)
          //   setError('로그인 처리 중 오류가 발생했습니다.')
          setIsLoading(false)
          setTimeout(() => router.push('/'), 2000)
        })
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (error) {
    return <div>{error}</div>
  }

  return (
    <article>
      <p>로그인 처리 중입니다...</p>
    </article>
  )
}
