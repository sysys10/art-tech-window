'use client'
import { LogOutIcon, User } from 'lucide-react'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { useRouter } from 'next/navigation'

export default function TopBar() {
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  return (
    <header className="w-full max-w-lg mx-auto fixed top-0 left-1/2 -translate-x-1/2 h-16 py-4 shadow-bottom bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="w-full h-full flex items-center justify-between px-4">
        {/* 로고 영역 */}
        <div
          onClick={() => router.push('/')}
          className="relative w-32 h-8 flex-shrink-0"
        >
          <Image
            src={'/images/ART_TECT_WINDOW_LOGO.png'}
            fill
            alt="logo"
            className="object-contain"
            priority
          />
        </div>

        {/* 사용자 메뉴 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-white rounded-full shadow-sm border border-gray-200 p-2 hover:shadow-md transition-shadow flex items-center justify-center outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
              <User className="text-gray-600" size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            className="w-36 bg-white border-none p-2"
            sideOffset={5}
          >
            <DropdownMenuItem className="cursor-pointer">
              마이페이지
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              로그아웃
              <LogOutIcon size={16} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
