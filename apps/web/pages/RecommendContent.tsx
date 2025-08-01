'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function RecommendContent({ id }: { id: string }) {
  const [books, setBooks] = useState([])
  useEffect(() => {
    async function fetchRecommendBook() {
      const { data } = await axios.post('/api/book-recommend', { id: id })
      setBooks(data.books)
    }
    fetchRecommendBook()
  }, [])

  return <div>{JSON.stringify(books)}</div>
}
