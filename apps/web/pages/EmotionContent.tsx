'use client'
import { supabaseClient } from '@/lib/supabase'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
type EmotionValue = 'joy' | 'sadness' | 'anger' | 'fear'

interface Option {
  text: string
  value: EmotionValue
}

interface Question {
  id: number
  question: string
  type: 'text' | 'choice'
  options?: Option[]
}

const questions: Question[] = [
  {
    id: 0,
    question: '너만의 특별한 장소는 어디야?',
    type: 'text',
  },

  // 기 - 그 공간에서의 일상적 감정
  {
    id: 1,
    question: '그곳에 있으면 어떤 기분이 들어?',
    type: 'choice',
    options: [
      { text: '마음이 편안하고 행복해져요 😊', value: 'joy' },
      { text: '왠지 쓸쓸하고 외로워요', value: 'sadness' },
      { text: '답답한 마음이 풀리지 않아요', value: 'anger' },
      { text: '조금 불안하고 무서워요', value: 'fear' },
    ],
  },

  // 승 - 그 공간에서의 특별한 순간
  {
    id: 2,
    question: '그곳에서 가장 기억에 남는 순간은?',
    type: 'choice',
    options: [
      { text: '신나게 놀거나 웃었던 때가 생각나요! ✨', value: 'joy' },
      { text: '울고 싶을 때 혼자 있었어요 😢', value: 'sadness' },
      { text: '화가 나서 소리지르고 싶었어요', value: 'anger' },
      { text: '무서운 일이 있어서 숨었어요', value: 'fear' },
    ],
  },

  // 전 - 그 공간을 떠나야 할 때의 감정
  {
    id: 3,
    question: '그곳을 떠나야 할 때는 어떤 마음이야?',
    type: 'choice',
    options: [
      { text: '다음에 또 올 생각에 설레요! 🌈', value: 'joy' },
      { text: '떠나기 아쉽고 그리울 것 같아요 😔', value: 'sadness' },
      { text: '왜 벌써 가야 하는지 짜증나요', value: 'anger' },
      { text: '밖으로 나가는 게 걱정돼요', value: 'fear' },
    ],
  },

  // 결 - 그 공간이 주는 의미
  {
    id: 4,
    question: '그곳은 너에게 어떤 곳이야?',
    type: 'choice',
    options: [
      { text: '힘이 나고 기분 좋아지는 곳! 💪', value: 'joy' },
      { text: '혼자 있고 싶을 때 가는 곳', value: 'sadness' },
      { text: '억울한 마음을 달래는 곳', value: 'anger' },
      { text: '안전하게 숨을 수 있는 곳', value: 'fear' },
    ],
  },
]

export default function EmotionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [imgUrl, setImgUrl] = useState<string>()
  const name: string = searchParams?.get('name') || '친구'
  const userImageId: string =
    searchParams?.get('userImageId') || 'defaultImgUrl'
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [answers, setAnswers] = useState<Record<number, string | EmotionValue>>(
    {},
  )
  const [textInput, setTextInput] = useState<string>('')

  useEffect(() => {
    async function fetchImgUrl() {
      try {
        const { data, error } = await supabaseClient
          .from('user_images')
          .select('image_url')
          .eq('id', userImageId)
          .single()
        if (!data) {
          throw new Error()
        }
        setImgUrl(data.image_url)
      } catch (err) {
        console.log(err)
      }
    }
    fetchImgUrl()
  }, [userImageId])

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (textInput.trim()) {
      setAnswers({ ...answers, [currentQuestion]: textInput })
      setTextInput('')
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // 완료 처리
        handleComplete()
      }
    }
  }

  const handleOptionSelect = (value: EmotionValue) => {
    setAnswers({ ...answers, [currentQuestion]: value })
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // 완료 처리
      handleComplete()
    }
  }

  const handleComplete = async () => {
    // 결과 저장 및 다음 페이지로 이동

    console.log('완료된 답변:', answers)
    // router.push('/result') // 결과 페이지로 이동
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="w-full pt-20 h-full bg-gradient-to-b from-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
        {/* 헤더 */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {name}의 마음 알아보기
          </h1>
          <p className="text-gray-600">솔직하게 대답해주면 도움이 될 거예요!</p>
        </div>

        {/* 진행 바 */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-12">
          <div
            className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        {/* 메인 컨텐츠 */}
        <div className="relative flex items-center justify-center">
          {/* 캐릭터와 말풍선 */}
          <div className="relative">
            {/* 캐릭터 */}
            <div className="absolute -left-32 top-0">
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt="캐릭터"
                  className="w-28 h-auto object-contain"
                />
              ) : (
                <div className="w-28 h-28 bg-gray-200 rounded-full animate-pulse" />
              )}
            </div>

            {/* 말풍선 */}
            <div className="relative bg-white rounded-3xl shadow-lg p-8 ml-12 min-w-[400px]">
              {/* 말풍선 꼬리 */}
              <div
                className="absolute -left-4 top-8 w-0 h-0 
                border-t-[15px] border-t-transparent
                border-r-[20px] border-r-white
                border-b-[15px] border-b-transparent"
              ></div>

              {/* 질문 */}
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {currentQ?.question}
              </h2>

              {/* 답변 입력/선택 */}
              {currentQ?.type === 'text' ? (
                <form onSubmit={handleTextSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="여기에 답을 써주세요..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
                      focus:border-purple-400 focus:outline-none transition-colors"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!textInput.trim()}
                    className="w-full py-3 bg-gradient-to-r from-blue-400 to-purple-400 
                      text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 
                      disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    다음으로
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  {currentQ?.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(option.value)}
                      className="w-full p-4 text-left bg-gray-50 hover:bg-purple-100 
                        rounded-xl transition-colors duration-200 hover:scale-[1.02] 
                        transform border-2 border-transparent hover:border-purple-300"
                    >
                      <span className="text-lg">{option.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 이전 버튼 (첫 질문이 아닐 때만) */}
        {currentQuestion > 0 && (
          <button
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="mt-8 w-full text-left px-6 py-2 text-gray-600 hover:text-gray-800 
              underline underline-offset-4 transition-colors"
          >
            이전 질문으로
          </button>
        )}
      </div>
    </div>
  )
}
