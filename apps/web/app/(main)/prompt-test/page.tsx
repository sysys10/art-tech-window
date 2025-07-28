'use client'

import React, { useState, useRef, ChangeEvent, useEffect } from 'react'
import { Upload, ArrowLeft, Loader2, Wand2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Input } from '@workspace/ui/components/input'

interface User {
  id: string
  kakao_id: string
  nickname: string
  profile_image_url?: string
}

interface ProcessResponse {
  imageUrl?: string
  success?: boolean
  error?: string
  generatedImageId?: string
}

interface UploadResponse {
  publicUrl: string
  userImageId: string
}

export default function PromptTestPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 이미지
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  // 프롬프트
  const [prompt, setPrompt] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    // 최근 프롬프트/태그 복원
    const savedPrompt = localStorage.getItem('lastPrompt')
    if (savedPrompt) setPrompt(savedPrompt)
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('올바른 이미지 파일을 선택해주세요')
        return
      }

      setSelectedImage(file)
      setError('')
      setResult('')

      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) setImagePreview(e.target.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1]
          resolve(base64 as any)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const uploadImage = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    return response.json()
  }

  const processImage = async (): Promise<void> => {
    if (!selectedImage) {
      setError('먼저 이미지를 선택해주세요')
      return
    }
    if (!prompt.trim()) {
      setError('프롬프트를 입력해주세요')
      return
    }

    setIsProcessing(true)
    setError('')
    setResult('')

    try {
      // 1) 업로드
      const uploadResult = await uploadImage(selectedImage)

      // 2) Base64
      const imageBase64 = await convertToBase64(selectedImage)

      // 3) 저장된 감정 태그
      const savedTags = localStorage.getItem('lastEmotionTags')
      const emotionTags = savedTags ? JSON.parse(savedTags) : []

      // 4) 프롬프트 저장
      localStorage.setItem('lastPrompt', prompt)

      // 5) 처리 API 호출 (프롬프트 포함)
      const response = await fetch('/api/gemini-img2img', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType: selectedImage.type,
          userImageId: uploadResult.userImageId,
          emotionTags,
          prompt, // <<< 프롬프트 전달
        }),
      })

      const data: ProcessResponse = await response.json()
      if (!response.ok) {
        throw new Error(data.error || '이미지 처리에 실패했습니다')
      }

      setResult(data.imageUrl || '')
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : '이미지 처리 중 오류가 발생했습니다'
      setError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full mr-3"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">
            이미지 변환 (프롬프트 테스트)
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            감정 + 프롬프트 기반 변환
          </h2>
          <p className="text-gray-600 text-sm">
            이미지를 업로드하고 프롬프트를 입력하면, 평온한 자연 배경 등 원하는
            스타일로 변환됩니다.
          </p>
        </div>

        <div className="space-y-6">
          {/* 프롬프트 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="prompt"
              className="text-sm font-medium text-gray-700"
            >
              프롬프트
            </label>
            {/* @workspace/ui Input 사용 예시 (짧은 타이틀/한 줄 프롬프트) */}
            <Input
              id="prompt"
              value={prompt}
              className="px-1"
              onChange={(e: any) => setPrompt(e.target.value)}
              placeholder="prompts"
            />
            <p className="text-xs text-gray-500">
              프롬프트는 로컬 스토리지에 저장됩니다. (키:{' '}
              <code>lastPrompt</code>)
            </p>
          </div>

          {/* 이미지 업로드 영역 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-lg font-medium text-gray-700 mb-2">
                사진 선택하기
              </span>
              <span className="text-sm text-gray-500">
                JPG, PNG 파일 업로드
              </span>
            </label>
          </div>

          {/* 선택된 이미지 미리보기 + 실행 버튼 */}
          {imagePreview && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="선택된 이미지"
                  className="w-full h-64 object-cover rounded-lg border"
                />
              </div>

              <button
                onClick={processImage}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    변환 중...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    프롬프트로 이미지 변환하기
                  </>
                )}
              </button>
            </div>
          )}

          {/* 에러 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* 결과 */}
          {result && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 text-center">
                ✨ 변환 완료!
              </h3>
              <div className="bg-white border rounded-lg p-4">
                <Image
                  alt="변환된 이미지"
                  src={result}
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          )}

          {/* 처리 중 안내 */}
          {isProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin mr-3" />
                <div className="text-center">
                  <h3 className="font-medium text-blue-900">이미지 변환 중</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    잠시만 기다려주세요...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 디버그 영역 (선택 사항) */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-600">
              디버그 정보
            </summary>
            <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-md overflow-auto">
              {JSON.stringify(
                {
                  hasUser: !!user,
                  promptLength: prompt.length,
                  hasImage: !!selectedImage,
                  imageType: selectedImage?.type,
                },
                null,
                2,
              )}
            </pre>
          </details>
        </div>
      </div>
    </div>
  )
}
