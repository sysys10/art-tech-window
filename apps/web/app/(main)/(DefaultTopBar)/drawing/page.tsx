'use client'

import { Suspense } from 'react'
import DrawingContent from '@/pages/DrawingContent'

export default function DrawingPage() {
  return (
    <Suspense fallback={<SkeletonUI />}>
      <DrawingContent />
    </Suspense>
  )
}

function SkeletonUI() {
  return (
    <div className="w-full h-full flex justify-center items-center pt-20">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="flex gap-4 mb-4">
          <div className="w-10 h-10 bg-gray-300 rounded-lg animate-pulse" />
          <div className="w-10 h-10 bg-gray-300 rounded-lg animate-pulse" />
          <div className="w-20 h-10 bg-gray-300 rounded-lg animate-pulse" />
        </div>
        <div
          className="flex-1 bg-gray-100 w-full max-w-3xl rounded-3xl border-4 border-yellow-200 animate-pulse"
          style={{ minHeight: '400px' }}
        />
      </div>
    </div>
  )
}
