import {
  AppWindow,
  Grid2X2,
  HomeIcon,
  Image,
  PlusCircleIcon,
  PlusSquareIcon,
  User,
} from 'lucide-react'

export default function BottomTab() {
  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className="max-w-lg mx-auto bg-white border-t border-gray-200 shadow-md">
        <div className="flex justify-around p-4">
          <a href="/" className="text-gray-600 hover:text-blue-500">
            <HomeIcon />
          </a>
          <a href="/gallery" className="text-gray-600 hover:text-blue-500">
            <Image />
          </a>
          <a href="/upload" className="text-gray-600 hover:text-blue-500">
            <PlusSquareIcon size={24} />
          </a>
          <a href="/window" className="text-gray-600 hover:text-blue-500">
            <Grid2X2 />
          </a>
          <a href="/profile" className="text-gray-600 hover:text-blue-500">
            <User />
          </a>
        </div>
      </div>
    </div>
  )
}
