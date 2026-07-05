import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminMessagesPage({
  params,
}: {
  params: Promise<{ Id: string }>
}) {
  const { Id } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', Id)
    .single()

  const { data: messages } = await supabase
    .from('admin_messages')
    .select('*')
    .eq('user_id', Id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          User Messages
        </h1>

        <p className="text-zinc-400 mb-8">
          {profile?.email}
        </p>

        <form
          action="/api/admin/messages/send"
          method="POST"
          className="bg-zinc-900 rounded-3xl p-8 mb-8 space-y-4"
        >
          <input
            type="hidden"
            name="user_id"
            value={Id}
          />

          <input
            name="subject"
            placeholder="Subject"
            className="w-full bg-zinc-800 rounded-xl p-4"
          />

          <textarea
            name="message"
            rows={6}
            required
            placeholder="Message"
            className="w-full bg-zinc-800 rounded-xl p-4"
          />

          <button
            type="submit"
            className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold"
          >
            Send Message
          </button>
        </form>

        <div className="space-y-4">
          {messages?.map((msg: any) => (
            <div
              key={msg.id}
              className="bg-zinc-900 rounded-2xl p-6"
            >
              <h3 className="font-bold text-lg">
                {msg.subject || 'No Subject'}
              </h3>

              <p className="mt-3 text-zinc-300">
                {msg.message}
              </p>

              <p className="mt-3 text-xs text-zinc-500">
                {new Date(msg.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}