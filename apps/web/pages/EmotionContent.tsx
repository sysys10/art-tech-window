'use client'
import { supabaseClient } from '@/lib/supabase'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type EmotionValue = 'positive' | 'neutral' | 'negative'

interface Option {
  text: string
  value: EmotionValue
}

interface Question {
  id: number
  question: string
  options: Option[]
}

interface EmotionCounts {
  positive?: number
  neutral?: number
  negative?: number
}

export default function EmotionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [imgUrl, setImgUrl] = useState()
  const name: string = searchParams?.get('name') || '친구'
  const userImageId: string =
    searchParams?.get('userImageId') || 'defaultImgUrl'
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [answers, setAnswers] = useState<EmotionValue[]>([])
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
        console.log(data)
        setImgUrl(data.image_url)
      } catch (err) {
        console.log(err)
      }
    }
    fetchImgUrl()
  }, [])
  const questions: Question[] = [
    {
      id: 1,
      question: '오늘 아침에 일어났을 때 기분이 어땠어?',
      options: [
        { text: '😊 기분이 좋았어요', value: 'positive' },
        { text: '😐 그냥 그랬어요', value: 'neutral' },
        { text: '😢 별로였어요', value: 'negative' },
      ],
    },
    {
      id: 2,
      question: '요즘 친구들과 놀 때 어때?',
      options: [
        { text: '🎉 정말 재미있어요', value: 'positive' },
        { text: '🤔 가끔 재미있어요', value: 'neutral' },
        { text: '😔 재미없어요', value: 'negative' },
      ],
    },
    {
      id: 3,
      question: '새로운 것을 배울 때 어떤 기분이 들어?',
      options: [
        { text: '✨ 신나고 궁금해요', value: 'positive' },
        { text: '😕 조금 어려워요', value: 'neutral' },
        { text: '😰 너무 힘들어요', value: 'negative' },
      ],
    },
    {
      id: 4,
      question: '혼자 있을 때는 무엇을 하고 싶어?',
      options: [
        { text: '🎨 재미있는 놀이를 해요', value: 'positive' },
        { text: '📱 그냥 쉬고 싶어요', value: 'neutral' },
        { text: '😴 아무것도 하기 싫어요', value: 'negative' },
      ],
    },
    {
      id: 5,
      question: '가족들과 함께 있을 때 기분이 어때?',
      options: [
        { text: '🏠 편하고 행복해요', value: 'positive' },
        { text: '🤷 보통이에요', value: 'neutral' },
        { text: '😣 불편해요', value: 'negative' },
      ],
    },
    {
      id: 6,
      question: '요즘 잠은 잘 자고 있어?',
      options: [
        { text: '😴 푹 잘 자요', value: 'positive' },
        { text: '🌙 가끔 잘 못 자요', value: 'neutral' },
        { text: '😫 자주 못 자요', value: 'negative' },
      ],
    },
    {
      id: 7,
      question: '학교나 유치원에 가는 게 어때?',
      options: [
        { text: '🎒 가고 싶어요', value: 'positive' },
        { text: '😐 그냥 가요', value: 'neutral' },
        { text: '😟 가기 싫어요', value: 'negative' },
      ],
    },
    {
      id: 8,
      question: '요즘 가장 많이 드는 감정은 뭐야?',
      options: [
        { text: '😊 행복하고 즐거워요', value: 'positive' },
        { text: '😌 평범해요', value: 'neutral' },
        { text: '😢 슬프거나 화나요', value: 'negative' },
      ],
    },
  ]

  const handleAnswer = (value: EmotionValue): void => {
    const newAnswers: EmotionValue[] = [...answers, value]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // 감정 분석 완료
      analyzeEmotion(newAnswers)
    }
  }

  const analyzeEmotion = (allAnswers: EmotionValue[]): void => {
    const emotionCounts: EmotionCounts = allAnswers.reduce<EmotionCounts>(
      (acc, answer) => {
        acc[answer] = (acc[answer] || 0) + 1
        return acc
      },
      {},
    )

    let dominantEmotion: EmotionValue = 'neutral'
    let maxCount: number = 0

    const entries = Object.entries(emotionCounts) as [EmotionValue, number][]
    entries.forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count
        dominantEmotion = emotion
      }
    })

    // 결과 페이지로 이동
    router.push(
      `/result?name=${encodeURIComponent(name)}&emotion=${dominantEmotion}&score=${maxCount}`,
    )
  }

  const progress: number = ((currentQuestion + 1) / questions.length) * 100
  const currentQuestionData: any = questions[currentQuestion]

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-cafe24 font-bold text-gray-800 mb-2">
            {name}의 마음 알아보기
          </h1>
          <p className="text-gray-600">솔직하게 대답해주면 도움이 될 거예요!</p>
        </div>
        <div className="w-full relative">
          <div className="">
            {/* 진행 바 */}
            <div className="bg-white/50 rounded-full h-4 mb-8 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* 질문 카드 */}
            <div className="bg-white rounded-3xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.02]">
              <div className="text-center mb-8">
                <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  질문 {currentQuestion + 1} / {questions.length}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
                  {currentQuestionData.question}
                </h2>
              </div>

              {/* 선택지 */}
              <div className="space-y-3">
                {currentQuestionData.options.map(
                  (option: Option, index: number) => {
                    const [emoji, ...textParts] = option.text.split(' ')
                    const buttonText = textParts.join(' ')

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option.value)}
                        className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-2xl border-2 border-transparent hover:border-purple-300 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                        type="button"
                        aria-label={`선택: ${option.text}`}
                      >
                        <span className="text-lg font-medium text-gray-700 flex items-center justify-center gap-3">
                          <span className="text-2xl" aria-hidden="true">
                            {emoji}
                          </span>
                          <span>{buttonText}</span>
                        </span>
                      </button>
                    )
                  },
                )}
              </div>
            </div>
          </div>
          {/* 캐릭터 일러스트 */}
          <div className="mt-8 w-100 absolute -top-24 -right-30 text-center">
            <div className="inline-block animate-bounce">
              {imgUrl ? <img src={imgUrl} alt="캐릭터" /> : <div />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
