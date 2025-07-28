'use client'

import { supabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function useGallery() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchImages() {
      setLoading(true)
      //   const { data, error } = await supabaseClient
      //     .from('user_images')
      //     .select('id, image_url, created_at')
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
  return (
    <div className="w-full h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">갤러리</h1>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                onClick={() => router.push(`/gallery/${image.id}`)}
                key={index}
                className="relative w-full h-64"
              >
                <img
                  src={image.generated_url}
                  alt={`Gallery image ${index + 1}`}
                  className="object-cover w-full h-full rounded-lg shadow-md"
                />
                <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 px-2 py-1 rounded text-sm">
                  {dateFormat(image.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
