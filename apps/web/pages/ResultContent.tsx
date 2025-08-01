// components/ResultContent.tsx
'use client'

import { supabaseClient } from '@/lib/supabase'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type Story = { content: string; character_img_url: string }

export default function ResultContent({ id }: { id: string }) {
  const [story, setStory] = useState<Story | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [captions, setCaptions] = useState<
    { start: number; end: number; text: string }[]
  >([])
  const [activeIdx, setActiveIdx] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  // 스토리 조회
  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabaseClient
        .from('stories')
        .select('story,character_img_url')
        .eq('id', id)
        .single()

      if (error) {
        toast('스토리 조회 실패')
        return
      }
      setStory({
        content: data.story,
        character_img_url: data.character_img_url,
      })
    })()
  }, [id])

  // TTS 생성
  useEffect(() => {
    if (!story) return
    ;(async () => {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: story.content }),
        })
        const blob = await res.blob()
        setAudioUrl(URL.createObjectURL(blob))
      } catch {
        toast('TTS 실패')
      }
    })()
  }, [story])

  // audioUrl 변경될 때 자동 재생
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
  }, [audioUrl])

  // 자막 타임코드
  const onLoadedMetadata = () => {
    if (!story || !audioRef.current) return
    const duration = audioRef.current.duration
    const sentences = story.content.match(/[^.!?]+[.!?]?/g) ?? [story.content]
    const totalLen = sentences.reduce((t, s) => t + s.length, 0)
    let acc = 0
    const caps = sentences.map((s) => {
      const lenRatio = s.length / totalLen
      const start = acc
      const end = acc + duration * lenRatio
      acc = end
      return { start, end, text: s.trim() }
    })
    setCaptions(caps)
  }

  // 재생 위치 자막 인덱스
  const onTimeUpdate = () => {
    if (!audioRef.current) return
    const t = audioRef.current.currentTime
    const idx = captions.findIndex((c) => t >= c.start && t < c.end)
    if (idx !== -1 && idx !== activeIdx) setActiveIdx(idx)
  }

  if (!story) return null

  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src={story.character_img_url}
        alt="character"
        className={`w-56 h-56 rounded-full object-cover ${
          audioUrl ? 'animate-pulse' : ''
        }`}
      />

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          autoPlay
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
        />
      )}

      <div className="w-full max-w-3xl mt-3 text-center text-lg leading-8">
        {captions.length === 0
          ? story.content
          : captions.map((c, i) => (
              <span
                key={i}
                className={
                  i === activeIdx ? 'text-emerald-500 font-semibold' : ''
                }
              >
                {c.text + ' '}
              </span>
            ))}
      </div>
    </div>
  )
}
