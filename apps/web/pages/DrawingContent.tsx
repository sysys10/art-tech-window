'use client'
import axios from 'axios'
import {
  ArrowLeft,
  Trash,
  Upload,
  Image as ImageIcon,
  Save,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useEffect, useState } from 'react'
import CanvasDraw from 'react-canvas-draw'

export default function DrawingPage() {
  const searchParams = useSearchParams()
  const name = searchParams?.get('name') || '친구'
  const canvasRef = useRef<CanvasDraw>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 })
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [mode, setMode] = useState<'draw' | 'upload'>('draw')
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setUploadedImage(result)
      setMode('upload')
    }
    reader.readAsDataURL(file)
  }

  const saveDrawingAndNext = async () => {
    setIsLoading(true)
    try {
      let base64Data: string

      if (mode === 'draw' && canvasRef.current) {
        // 그리기 모드: 캔버스에서 이미지 가져오기
        // @ts-ignore - CanvasDraw 내부 속성 접근
        const canvasElement = canvasRef.current.canvas.drawing

        if (!canvasElement) {
          throw new Error('Canvas element not found')
        }

        const imageDataUrl = canvasElement.toDataURL('image/png')
        base64Data = imageDataUrl.split(',')[1]
      } else if (mode === 'upload' && uploadedImage) {
        // 업로드 모드: 업로드된 이미지 사용
        base64Data = uploadedImage.split(',')[1]!
      } else {
        alert('저장할 이미지가 없습니다.')
        return
      }

      // API 호출
      const result = await axios.post('/api/save-drawing', {
        imageBase64: base64Data,
        mimeType: 'image/png',
        name: name,
      })

      const data = result.data

      // emotion 페이지로 이동
      router.push(
        `/emotion?userImageId=${data.userImageId}&name=${encodeURIComponent(name)}`,
      )
    } catch (error) {
      console.error('Error saving drawing:', error)
      alert('그림 저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const resetUpload = () => {
    setUploadedImage(null)
    setMode('draw')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full h-full flex justify-center items-center pt-20 bg-no-repeat bg-bottom bg-contain bg-[url('/images/bottom_sheet.svg')]">
      <div className="w-full h-full flex flex-col justify-center items-center max-w-4xl">
        <h2 className="text-3xl font-cafe24 mb-8 text-center text-[#46b5ff]">
          {name}
          <span className="text-gray-600">님만의 캐릭터를 그려봐요!</span>
        </h2>

        {/* 컨트롤 버튼들 */}
        <div className="flex gap-4 mb-4">
          {mode === 'draw' ? (
            <>
              <button
                onClick={undoLast}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={clearCanvas}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash size={20} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={triggerFileUpload}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
              >
                <Upload size={20} />
                다른 사진 선택
              </button>
              <button
                onClick={resetUpload}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <Trash size={20} />
                취소
              </button>
            </>
          )}

          <button
            onClick={saveDrawingAndNext}
            disabled={isLoading || (mode === 'upload' && !uploadedImage)}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isLoading || (mode === 'upload' && !uploadedImage)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <Save />
          </button>
          <div className="flex gap-2 bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setMode('draw')}
              className={`px-6 py-2 rounded-full transition-all ${
                mode === 'draw'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              직접 그리기
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`px-6 py-2 rounded-full transition-all ${
                mode === 'upload'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              사진 업로드
            </button>
          </div>
        </div>

        {/* 캔버스/이미지 영역 */}
        <div
          ref={containerRef}
          className="flex-1 bg-white w-full max-w-3xl rounded-3xl border-4 overflow-hidden shadow-xl"
          style={{
            minHeight: '400px',
            borderColor: mode === 'draw' ? '#facc15' : '#a855f7',
          }}
        >
          {mode === 'draw' ? (
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
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="업로드된 이미지"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div
                  onClick={triggerFileUpload}
                  className="cursor-pointer text-center p-12 border-2 border-dashed border-gray-300 rounded-2xl hover:border-purple-500 transition-colors"
                >
                  <ImageIcon size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg mb-2">
                    클릭하여 이미지를 선택하세요
                  </p>
                  <p className="text-gray-400 text-sm">
                    JPG, PNG, GIF (최대 5MB)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* 도움말 */}
        <div className="mt-4 text-center text-sm text-gray-600">
          {mode === 'draw' ? (
            <p>캔버스에 마우스나 터치로 그림을 그려보세요!</p>
          ) : (
            <p>업로드한 이미지가 캐릭터로 사용됩니다.</p>
          )}
        </div>
      </div>
    </div>
  )
}
