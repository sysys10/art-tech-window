// ChatHistoryPage.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

type ChatHistoryBlockProps = {
  id: string
  time: string
  emotion: 'happy' | 'sad' | 'angry' | 'neutral' | 'excited'
  summary: string
}

const emotionMap: Record<
  ChatHistoryBlockProps['emotion'],
  { label: string; emoji: string; color: string }
> = {
  happy: { label: '행복', emoji: '😊', color: 'bg-yellow-100 text-yellow-700' },
  sad: { label: '슬픔', emoji: '😢', color: 'bg-blue-100 text-blue-700' },
  angry: { label: '화남', emoji: '😠', color: 'bg-red-100 text-red-700' },
  neutral: { label: '무표정', emoji: '😐', color: 'bg-gray-100 text-gray-700' },
  excited: { label: '신남', emoji: '🤩', color: 'bg-pink-100 text-pink-700' },
}

function ChatHistoryBlock({
  id,
  time,
  emotion,
  summary,
}: ChatHistoryBlockProps) {
  const emotionInfo = emotionMap[emotion]
  const router = useRouter()
  return (
    <div
      className="w-full"
      onClick={() => {
        router.push(`/chat/history/${id}`)
      }}
    >
      <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100 flex flex-col gap-2 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{time}</span>
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-medium flex items-center gap-1 ${emotionInfo.color}`}
          >
            <span>{emotionInfo.emoji}</span>
            {emotionInfo.label}
          </span>
        </div>
        <p className="text-gray-800 text-sm leading-relaxed line-clamp-2">
          {summary}
        </p>
      </div>
    </div>
  )
}

export default function ChatHistoryPage() {
  const chatData: ChatHistoryBlockProps[] = useMemo(
    () => [
      {
        id: '1',
        time: '오전 9:15',
        emotion: 'happy',
        summary:
          '엄마와의 놀이 시간에 활발히 반응하고 웃는 모습이 자주 보였어요.',
      },
      {
        id: '2',
        time: '오전 11:00',
        emotion: 'sad',
        summary:
          '장난감을 떨어뜨리고 울음을 보였어요. 잠시 안정을 취한 후 괜찮아졌습니다.',
      },
      {
        id: '3',
        time: '오후 1:30',
        emotion: 'neutral',
        summary: '조용히 책을 보며 시간을 보내는 모습이 관찰됐어요.',
      },
      {
        id: '4',
        time: '오후 3:45',
        emotion: 'excited',
        summary: '새로운 장난감에 큰 흥미를 보이며 손을 흔들고 웃었습니다!',
      },
    ],
    [],
  )

  return (
    <div className="pt-20 pb-10 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold px-4 mb-6">우리 아이 기록 보기</h1>
      <div className="grid-cols-2 gap-2 px-2 grid">
        {chatData.map((chat, idx) => (
          <ChatHistoryBlock key={idx} {...chat} />
        ))}
      </div>
    </div>
  )
}
