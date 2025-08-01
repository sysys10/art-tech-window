'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function RecommendContent({ id }: { id: string }) {
  const [books, setBooks] = useState<any>([])

  useEffect(() => {
    async function fetchRecommendBook() {
      const { data } = await axios.post('/api/book-recommend', { id: id })
      setBooks(data)
    }
    fetchRecommendBook()
  }, [])

  return (
    <div className="flex flex-col justify-center min-w-4xl max-w-4xl mx-auto h-full items-center">
      <h1 className="text-4xl text-sky-300 font-cafe24">
        다른 책들도 추천해줄게요!
      </h1>
      <div className="grid grid-cols-1 w-full md:grid-cols-3 gap-6 p-6">
        {books.map((book: any, index: number) => (
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
