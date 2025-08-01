// EmotionPage.tsx (with speech recognition)
'use client'
import { supabaseClient } from '@/lib/supabase'
import axios from 'axios'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import { Mic, MicOff } from 'lucide-react'

type EmotionValue = 'joy' | 'sadness' | 'anger' | 'fear'

type QuestionType = 'text' | 'choice' | 'speechText'

interface Option {
  text: string
  value: EmotionValue
}

interface Question {
  id: number
  question: string
  type: QuestionType
  options?: Option[]
}

const questions: Question[] = [
  {
    id: 0,
    question: '너만의 특별한 장소는 어디야?',
    type: 'text',
  },
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
  {
    id: 5,
    question:
      '너만의 경험을 말해줘! (마이크를 눌러 이야기하거나 글로 입력해도 좋아요)',
    type: 'speechText',
  },
]

export default function EmotionPage() {
  /* ─────────────────────────────── Hooks */
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
  const [isLoading, setIsLoading] = useState(false)
  const { transcript, listening, resetTranscript } = useSpeechRecognition()

  /* ─────────────────────────────── Side‑effects */
  useEffect(() => {
    async function fetchImgUrl() {
      try {
        const { data } = await supabaseClient
          .from('user_images')
          .select('image_url')
          .eq('id', userImageId)
          .single()
        if (!data) throw new Error()
        setImgUrl(data.image_url)
      } catch (err) {
        console.error(err)
      }
    }
    fetchImgUrl()
  }, [userImageId])

  // Keep textarea in sync with STT transcript during speechText question
  useEffect(() => {
    if (questions[currentQuestion]?.type === 'speechText') {
      setTextInput(transcript)
      setAnswers((prev) => ({ ...prev, [currentQuestion]: transcript }))
    }
  }, [transcript, currentQuestion])

  /* ─────────────────────────────── Handlers */
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!textInput.trim()) return
    saveAnswer(textInput)
  }

  const handleOptionSelect = (value: EmotionValue) => saveAnswer(value)

  const saveAnswer = (value: string | EmotionValue) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }))
    setTextInput('')
    resetTranscript()
    setIsMicActive(false)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.post('/api/save-qna', {
        myPlace: answers[0],
        k: answers[1],
        s: answers[2],
        j: answers[3],
        g: answers[4],
        exp: answers[5], // new experience answer
        character_img_url: imgUrl,
      })
      setIsLoading(false)
      if (data.success) router.push('/result/' + data.id)
    } catch (err) {
      setIsLoading(false)
      toast('패치 중 에러')
    }
  }

  // Speech‑recognition toggle
  const [isMicActive, setIsMicActive] = useState(false)
  const toggleMic = () => {
    if (listening) {
      SpeechRecognition.stopListening()
      setIsMicActive(false)
    } else {
      resetTranscript()
      SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' })
      setIsMicActive(true)
    }
  }

  const currentQ = questions[currentQuestion]
  const progressBarWidth = ((currentQuestion + 1) / questions.length) * 100

  /* ─────────────────────────────── Animation variants */
  const questionVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } },
  }

  /* ─────────────────────────────── Render */
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 pt-8"
        >
          <h1 className="text-3xl font-cafe24 font-bold text-[#46b5ff] mb-2">
            {name}
            <span className="text-gray-600">의 마음 알아보기</span>
          </h1>
          <p className="text-gray-600">솔직하게 대답해주면 도움이 될 거예요!</p>
        </motion.div>

        {/* 진행 바 */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-400 to-purple-400 h-3"
            animate={{ width: progressBarWidth + '%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>

        {/* 메인 컨텐츠 */}
        <div className="relative flex items-center justify-center">
          <div className="relative">
            {/* 캐릭터 */}
            <motion.div
              className="absolute -left-32 top-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt="캐릭터"
                  className="w-28 h-auto object-contain"
                />
              ) : (
                <div className="w-28 h-28 bg-gray-200 rounded-full animate-pulse" />
              )}
            </motion.div>

            {/* 말풍선 & 질문/답변 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                variants={questionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative bg-white rounded-3xl shadow-lg p-8 ml-12 min-w-[300px] sm:min-w-[400px]"
              >
                {/* 말풍선 꼬리 */}
                <div className="absolute -left-4 top-8 w-0 h-0 border-t-[15px] border-t-transparent border-r-[20px] border-r-white border-b-[15px] border-b-transparent" />

                {/* 질문 */}
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  {currentQ?.question}
                </h2>

                {/* 답변 입력/선택 */}
                {currentQ?.type === 'text' && (
                  <form onSubmit={handleTextSubmit} className="space-y-4">
                    <motion.input
                      key="text-input"
                      type="text"
                      value={textInput}
                      onChange={(e) => {
                        setTextInput(e.target.value)
                      }}
                      placeholder="여기에 답을 써주세요..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                      autoFocus
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                    <SubmitButton
                      disabled={!textInput.trim()}
                      label="다음으로"
                    />
                  </form>
                )}

                {currentQ?.type === 'choice' && (
                  <div className="space-y-3">
                    {currentQ.options?.map((option, i) => (
                      <ChoiceButton
                        key={i}
                        option={option}
                        onSelect={handleOptionSelect}
                      />
                    ))}
                  </div>
                )}

                {currentQ?.type === 'speechText' && (
                  <form onSubmit={handleTextSubmit} className="space-y-4">
                    {/* Mic control */}
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={toggleMic}
                        className={`p-3 rounded-full border-2 ${isMicActive ? 'bg-purple-100 border-purple-300' : 'bg-gray-50 border-gray-200'} transition-all hover:scale-105`}
                      >
                        {isMicActive ? (
                          <MicOff className="w-5 h-5" />
                        ) : (
                          <Mic className="w-5 h-5" />
                        )}
                      </button>
                      <span className="text-gray-600 text-sm">
                        {isMicActive
                          ? '말씀하시는 중...'
                          : '마이크를 눌러 이야기해보세요'}
                      </span>
                    </div>

                    {/* Textarea bound to STT/transcript */}
                    <motion.textarea
                      value={textInput}
                      onChange={(e) => {
                        setTextInput(e.target.value)
                        setAnswers((prev) => ({
                          ...prev,
                          [currentQuestion]: e.target.value,
                        }))
                      }}
                      placeholder="목소리 또는 글로 너의 경험을 들려줘..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors resize-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    />
                    <SubmitButton
                      disabled={!textInput.trim()}
                      label="모두 완료"
                    />
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 이전 버튼 */}
        {currentQuestion > 0 && (
          <motion.button
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="mt-8 px-6 py-2 text-gray-600 hover:text-gray-800 underline underline-offset-4 transition-colors"
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            이전 질문으로
          </motion.button>
        )}
      </div>

      {/* 로딩 오버레이 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────── UI sub‑components */
interface SubmitButtonProps {
  disabled: boolean
  label: string
}
const SubmitButton = ({ disabled, label }: SubmitButtonProps) => (
  <motion.button
    type="submit"
    disabled={disabled}
    className="w-full py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.97 }}
  >
    {label}
  </motion.button>
)

interface ChoiceButtonProps {
  option: Option
  onSelect: (v: EmotionValue) => void
}
const ChoiceButton = ({ option, onSelect }: ChoiceButtonProps) => (
  <motion.button
    onClick={() => onSelect(option.value)}
    className="w-full p-4 text-left bg-gray-50 hover:bg-purple-100 rounded-xl transition-colors duration-200 border-2 border-transparent hover:border-purple-300"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
  >
    <span className="text-lg">{option.text}</span>
  </motion.button>
)
