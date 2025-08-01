import TopBar from '@/components/layout/TopBar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full h-full flex flex-col">
      <TopBar />
      <div className="w-full h-full flex justify-center items-center bg-no-repeat bg-bottom bg-contain bg-[url('/images/bottom_sheet.svg')]">
        {children}
      </div>
      {/* <BottomTab /> */}
    </div>
  )
}
