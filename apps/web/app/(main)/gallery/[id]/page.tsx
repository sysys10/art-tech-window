import GalleryPageDetail from '@/pages/GalleryPage'

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="w-full h-screen bg-gray-200">
      <GalleryPageDetail id={id} />
    </div>
  )
}
