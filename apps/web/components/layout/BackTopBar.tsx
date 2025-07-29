'use client'
import { ArrowLeft } from 'lucide-react'

import { useRouter } from 'next/navigation'

export default function BackTopBar() {
  const router = useRouter()
  const handleGoBack = () => {
    router.back()
  }
  return (
    <header className="w-full max-w-lg pl-4 items-center flex mx-auto fixed top-0 left-1/2 -translate-x-1/2 h-16 py-4 shadow-bottom bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
      <ArrowLeft onClick={handleGoBack} />
    </header>
  )
}
