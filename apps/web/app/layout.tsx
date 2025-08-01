import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { cafe24ssurround } from './fonts'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Art Window',
  description: '감정을 담은 나만의 창문',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="bg-gray-50">
      <body
        className={`${cafe24ssurround.variable} ${geistSans.variable} ${geistMono.variable} h-screen w-full antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
