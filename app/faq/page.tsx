import FaqPreview from '@/components/FaqPreview'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <FaqPreview />
    </main>
  )
}