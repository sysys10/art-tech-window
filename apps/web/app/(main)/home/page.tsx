'use client'
import { motion } from 'framer-motion'
import { Settings, Baby, ArrowLeft, ArrowRight } from 'lucide-react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

export default function MyPage() {
  return (
    <div
      className="w-full pt-20 h-full flex flex-col p-4 "
      style={{
        backgroundImage:
          'linear-gradient(to bottom, white 0%, white 80%, #E9D5FF 100%)',
      }}
    >
      <div className="h-full overflow-auto">
        <MainBanner />
        <MainReportHexagon />
        <MainBottomMenu />
      </div>
    </div>
  )
}

export function MainBottomMenu() {
  return (
    <div className="w-full h-20 bg-white mt-4 rounded-2xl shadow-lg">
      대충 배너
    </div>
  )
}
const data = [
  { subject: '감정', A: 85, fullMark: 100 },
  { subject: '스트레스', A: 60, fullMark: 100 },
  { subject: '상태1', A: 75, fullMark: 100 },
  { subject: '상태2', A: 90, fullMark: 100 },
  { subject: '상태3', A: 50, fullMark: 100 },
  { subject: '상태4', A: 70, fullMark: 100 },
]

export function MainReportHexagon() {
  return (
    <div className="mt-10">
      <div className="w-full flex justify-between text-sm">
        <h2 className="font-bold pl-2">현재 심리 점수 : 80/100</h2>
        <p className="text-blue-600 flex items-center">
          과거 기록 살펴보기 <ArrowRight className="text-sm" size={12} />
        </p>
      </div>
      <div className="w-full h-52">
        <div className="bg-white rounded-2xl shadow-md p-4 h-full">
          <p className="leading-0 mt-2 text-gray-600">신지수 아기 심리상태</p>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar
                name="아기 상태"
                dataKey="A"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function MainBanner() {
  return (
    <motion.div
      className="h-52 w-full overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-8 w-16 h-16 bg-pink-300 rounded-full"></div>
        <div className="absolute top-12 right-12 w-8 h-8 bg-purple-300 rounded-full"></div>
        <div className="absolute bottom-8 left-16 w-12 h-12 bg-indigo-300 rounded-full"></div>
        <div className="absolute bottom-4 right-8 w-6 h-6 bg-blue-300 rounded-full"></div>
      </div>

      <div className="flex w-full h-full relative z-10">
        <motion.div
          className="h-full flex-1 p-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            className="h-full w-full bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-white opacity-10" />

            <div className="mb-3 p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full shadow-lg">
              <Baby />
            </div>

            <motion.h3
              className="text-lg font-semibold text-gray-800 mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              대화 기록 보기
            </motion.h3>

            <motion.p
              className="text-xs text-gray-500 text-center px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              우리 아기의 대화와 <br />
              심리 상태를 한눈에
            </motion.p>

            <motion.div
              className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-blue-400 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>
        </motion.div>
        <motion.div
          className="h-full flex-1 p-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            className="h-full w-full bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Robot Icon Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 opacity-10"
              animate={{
                background: [
                  'linear-gradient(45deg, #818cf8, #a855f7)',
                  'linear-gradient(45deg, #a855f7, #ec4899)',
                  'linear-gradient(45deg, #ec4899, #818cf8)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />

            {/* Settings Icon */}
            <motion.div className="mb-3 p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full shadow-lg">
              <Settings className="w-8 h-8" />
            </motion.div>

            <motion.h3
              className="text-lg font-semibold text-gray-800 mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              AI 설정
            </motion.h3>

            <motion.p
              className="text-xs text-gray-500 text-center px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              AI 대화 규칙과
              <br />
              보안 설정 관리
            </motion.p>

            {/* Floating Elements */}
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-blue-400 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
