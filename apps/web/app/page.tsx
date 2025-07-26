'use client'

import { useAuth } from '@/components/auth-provider'
import SpeechBtn from '@/components/speech-btn'
import { Image, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h1 className="text-lg font-semibold">Art Window</h1>
          <p className="text-sm text-gray-600">
            안녕하세요,{' '}
            {user.user_metadata?.nickname ||
              user.user_metadata?.name ||
              '사용자'}
            님
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-8">
          {/* 음성 입력 버튼 */}
          <SpeechBtn />

          {/* 이미지 업로드 버튼 */}
          <div className="flex flex-col items-center text-center">
            <button
              onClick={() => router.push('/image-upload')}
              className="bg-blue-500 hover:bg-blue-600 rounded-full p-6 transition-colors shadow-lg"
              aria-label="이미지 업로드"
            >
              <Image className="text-white w-8 h-8" />
            </button>
            <p className="text-lg mt-4 text-gray-700">사진을 입력해주세요</p>
            <p className="text-sm text-gray-500 mt-1">
              감정을 담은 배경을 생성합니다
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
