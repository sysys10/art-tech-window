'use client'

import { useAuth } from '@/components/auth-provider'
import { supabaseClient } from '@/lib/supabase'
import { Input } from '@workspace/ui/components/input'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Settings, Baby, ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MyPage() {
  const [name, setName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fecthUser = async () => {
      const { data } = await axios.get('/api/auth/me')
      console.log(data)
      setName(data.user.nickname)
    }
    fecthUser()
  }, [])

  return (
    <motion.div
      className="w-full h-full flex justify-center items-center bg-no-repeat bg-bottom bg-contain bg-[url('/images/bottom_sheet.svg')]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        className="w-full h-full flex flex-col justify-center items-center"
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <motion.h2
          className="text-4xl font-cafe24 mb-8 text-center text-[#46b5ff]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          이름을 알려주세요!
        </motion.h2>

        <motion.div
          className="flex items-center max-w-xl w-full gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Input
            className="flex-1 h-10 text-gray-500 text-lg font-cafe24 font-light"
            onChange={(e) => {
              setName(e.target.value)
            }}
            value={name}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-[#46b5ff] rounded-full flex items-center justify-center shadow-md"
            onClick={() => router.push(`/drawing?name=${name}`)}
          >
            <ArrowRight className="text-white" />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
