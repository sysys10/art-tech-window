import BottomTab from '@/components/layout/BottomTab'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">{children}</div>
      <BottomTab />
    </div>
  )
}
