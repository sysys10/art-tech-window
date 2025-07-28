'use client'

import { supabaseClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

function useImageDetail(id: string) {
  const [originalImage, setOriginalImage] = useState<string>('')
  const [processedImage, setProcessedImage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = (await supabaseClient
        .from('generated_images')
        .select(
          `
        user_image_id,
        generated_url,
        user_images!user_image_id(image_url)
      `,
        )
        .eq('id', id)
        .single()) as any
      if (error) {
        console.error('Error fetching data:', error)
      } else {
        console.log('Data:', data)
        setOriginalImage(data.user_images.image_url)
        setProcessedImage(data.generated_url)
      }
    }

    fetchData()
  }, [])
  return { originalImage, processedImage, loading }
}

export default function GalleryPageDetail({ id }: { id: string }) {
  const { originalImage, processedImage, loading } = useImageDetail(id)
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <img src={originalImage ? originalImage : ''} alt="Original" />
          <img src={processedImage ? processedImage : ''} alt="Processed" />
        </>
      )}
    </div>
  )
}
