'use client'
import axios from 'axios'
import { ArrowLeft, Trash } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useEffect, useState } from 'react'
import CanvasDraw from 'react-canvas-draw'

export default function DrawingPage() {
  const searchParams = useSearchParams()
  const name = searchParams?.get('name')
  const canvasRef = useRef<CanvasDraw>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 })
  const router = useRouter()
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setCanvasSize({
          width: rect.width,
          height: rect.height,
        })
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  const clearCanvas = () => {
    canvasRef.current?.clear()
  }

  const undoLast = () => {
    canvasRef.current?.undo()
  }
  const [isLoading, setIsLoading] = useState(false)
  const saveDrawingAndNext = async () => {
    if (!canvasRef.current) return

    setIsLoading(true)
    try {
      // CanvasDraw에서 캔버스 접근
      // @ts-ignore - CanvasDraw 내부 속성 접근
      const canvasElement = canvasRef.current.canvas.drawing

      if (!canvasElement) {
        throw new Error('Canvas element not found')
      }

      // 캔버스를 이미지로 변환
      const imageDataUrl = canvasElement.toDataURL('image/png')

      // base64 데이터 추출
      const base64Data = imageDataUrl.split(',')[1]

      // // API 호출
      // const response = await fetch('/api/save-drawing', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     imageBase64: base64Data,
      //     mimeType: 'image/png',
      //     name: name,
      //   }),
      // })
      const result = await axios.post('/api/save-drawing', {
        imageBase64: base64Data,
        mimeType: 'image/png',
        name: name,
      })

      const data = result.data

      // emotion 페이지로 이동 (userImageId를 쿼리 파라미터로 전달)
      router.push(`/emotion?userImageId=${data.userImageId}&name=${name}`)
    } catch (error) {
      console.error('Error saving drawing:', error)
      alert('그림 저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex justify-center items-center pt-20">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h2 className="text-3xl font-cafe24 mb-8 text-center text-[#46b5ff]">
          {name}
          <span className="text-gray-500">님만의 캐릭터를 그려봐요!</span>
        </h2>

        {/* 컨트롤 버튼들 */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={undoLast}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft />
          </button>
          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash />
          </button>
          <button onClick={saveDrawingAndNext}>저장하기</button>
        </div>

        {/* 캔버스 영역 */}
        <div
          ref={containerRef}
          className="flex-1 bg-white w-full max-w-3xl rounded-3xl border-yellow-400 border-4 overflow-hidden"
          style={{ minHeight: '400px' }}
        >
          <CanvasDraw
            ref={canvasRef}
            brushColor="#000000"
            brushRadius={3}
            canvasWidth={canvasSize.width}
            canvasHeight={canvasSize.height}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>
    </div>
  )
}
