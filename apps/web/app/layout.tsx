import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { cafe24ssurround } from './fonts'
import { Toaster } from '@workspace/ui/components/sonner'

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
        className={`${cafe24ssurround.variable} h-screen w-full antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
