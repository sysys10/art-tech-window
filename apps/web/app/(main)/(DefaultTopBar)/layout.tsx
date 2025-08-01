import BottomTab from '@/components/layout/BottomTab'
import TopBar from '@/components/layout/TopBar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full h-full flex flex-col">
      <TopBar />
      <div className="w-full h-full">{children}</div>
      {/* <BottomTab /> */}
    </div>
  )
}
