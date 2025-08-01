import { Suspense } from 'react'
import EmotionPage from '@/pages/EmotionContent'

export default function EmotionRoute() {
  return (
    <Suspense fallback={<EmotionSkeleton />}>
      <EmotionPage />
    </Suspense>
  )
}

function EmotionSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br pt-16 p-4 animate-pulse">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="h-8 w-2/3 bg-gray-300 rounded mx-auto mb-2" />
          <div className="h-4 w-1/2 bg-gray-200 rounded mx-auto" />
        </div>

        <div className="bg-white/50 rounded-full h-4 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-300 to-gray-200 h-full w-1/2" />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="h-6 w-1/4 bg-purple-100 rounded-full mx-auto mb-4" />
            <div className="h-6 w-2/3 bg-gray-300 rounded mx-auto" />
          </div>

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full h-14 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}
