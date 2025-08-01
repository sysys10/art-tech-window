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
  useEffect(() => {
    const fecthUser = async () => {
      const { data } = await axios.get('/api/auth/me')
      console.log(data)
      setName(data.user.nickname)
    }
    fecthUser()
  }, [])
  const router = useRouter()
  return (
    <div className="w-full h-full flex justify-center items-center bg-no-repeat bg-bottom bg-contain bg-[url('/images/bottom_sheet.svg')]">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h2 className="text-3xl font-cafe24 mb-8 text-center text-[#46b5ff]">
          이름을 알려주세요!
        </h2>
        <div className="flex items-center max-w-xl w-full gap-2">
          <Input
            className="flex-1 h-10 text-gray-500 text-lg font-cafe24 font-light"
            onChange={(e) => {
              setName(e.target.value)
            }}
            value={name}
          />
          <button className="w-10 h-10 bg-[#46b5ff] rounded-full flex items-center justify-center">
            <ArrowRight
              onClick={() => router.push(`/drawing?name=${name}`)}
              className="text-white"
            />
          </button>
        </div>
      </div>
    </div>
  )
}
