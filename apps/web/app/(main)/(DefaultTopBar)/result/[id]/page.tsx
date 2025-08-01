import ResultContent from '@/pages/ResultContent'

export default async function ResultPage({
  params,
}: {
  // ⬅️  Next 15: params 는 Promise
  params: Promise<{ id: string }>
}) {
  // 반드시 await 해서 실제 id 값을 얻습니다
  const { id } = await params

  return (
    <div>
      <ResultContent id={id} />
    </div>
  )
}
