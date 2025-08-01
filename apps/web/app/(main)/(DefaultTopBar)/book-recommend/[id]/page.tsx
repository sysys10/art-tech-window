import RecommendContent from '@/pages/RecommendContent'

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div>
      <RecommendContent id={id} />
    </div>
  )
}
