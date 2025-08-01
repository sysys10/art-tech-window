import BackTopBar from '@/components/layout/BackTopBar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full h-full flex flex-col">
      <BackTopBar />
      <div className="fixed max-w-lg w-full inset-0 mx-auto">{children}</div>
    </div>
  )
}
