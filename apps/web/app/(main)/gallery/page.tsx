'use client'

import { supabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Heart,
  Share2,
  Download,
  Calendar,
  Sparkles,
} from 'lucide-react'

function useGallery() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchImages() {
      setLoading(true)
      const { data, error } = await supabaseClient
        .from('generated_images')
        .select('generated_url, created_at, id')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Error fetching images:', error)
      } else {
        setImages(data)
      }
      setLoading(false)
    }
    fetchImages()
  }, [])

  return { images, loading }
}

export default function GalleryPage() {
  const { images, loading } = useGallery()
  const router = useRouter()

  const [selectedImage, setSelectedImage] = useState<any>(null)

  const handleImageClick = (image: any) => {
    setSelectedImage(image)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  감정 갤러리
                </h1>
                <p className="text-sm text-gray-500">
                  당신의 감정이 담긴 작품들
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-purple-100 px-3 py-1 rounded-full">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">
                {images.length}개
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full p-6">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
              <div
                className="w-16 h-16 border-4 border-purple-500 rounded-full animate-spin absolute top-0 left-0"
                style={{
                  clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)',
                }}
              ></div>
            </div>
            <p className="mt-4 text-gray-600 animate-pulse">
              아름다운 작품들을 불러오는 중...
            </p>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              아직 작품이 없어요
            </h3>
            <p className="text-gray-500">
              감정을 담은 첫 번째 작품을 만들어보세요!
            </p>
          </div>
        ) : (
          <>
            {/* 이미지 그리드 */}
            <div className="grid grid-cols-2 gap-6">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  onClick={() => handleImageClick(image)}
                  className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border border-white/50">
                    {/* 이미지 */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={image.generated_url}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* 오버레이 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between">
                            <div className="text-white">
                              <p className="text-sm font-medium">
                                감정 작품 #{index + 1}
                              </p>
                              <p className="text-xs opacity-75">
                                {dateFormat(image.created_at)}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                                <Heart className="w-4 h-4 text-white" />
                              </button>
                              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                                <Share2 className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 카드 하단 */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            {dateFormat(image.created_at)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/gallery/${image.id}`)
                          }}
                          className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
                        >
                          자세히 보기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 모달 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedImage.generated_url}
                alt="Selected image"
                className="w-full h-auto max-h-[70vh] object-contain"
              />

              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">감정 작품</h3>
                    <p className="text-sm text-gray-600">
                      {dateFormat(selectedImage.created_at)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-3 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-full transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-full transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function dateFormat(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
