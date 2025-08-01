'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Book {
  title: string
  thumbnail_img: string
  book_url: string
}

export default function RecommendContent({ id }: { id: string }) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecommendBook() {
      try {
        const { data } = await axios.post<Book[]>('/api/book-recommend', { id })
        setBooks(data)
      } finally {
        setLoading(false)
      }
    }
    fetchRecommendBook()
  }, [id])

  /** Skeleton 카드: books 로딩 중일 때 사용할 더미 컴포넌트 */
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  )

  return (
    <div className="flex flex-col items-center min-w-4xl max-w-4xl mx-auto h-full">
      <h1 className="text-4xl text-sky-300 font-cafe24 mb-6">
        다른 책들도 추천해줄게요!
      </h1>

      <div className="grid grid-cols-1 w-full md:grid-cols-3 gap-6 p-6">
        {loading
          ? // ✨ 로딩 상태: Skeleton 3개 표시
            Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : // ✅ 데이터 도착 후 실제 카드 표시
            books.map((book, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                onClick={() => window.open(book.book_url, '_blank')}
              >
                <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                  <img
                    src={book.thumbnail_img}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = '/book-placeholder.png'
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 text-sm leading-tight">
                    {book.title}
                  </h3>
                </div>
              </motion.div>
            ))}
      </div>
    </div>
  )
}
