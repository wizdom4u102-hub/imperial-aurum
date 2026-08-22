import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'

interface LiveChatOption {
  id: string
  title: string
  description: string | null
  icon: string | null
  url: string | null
  display_order: number
}

export default async function LiveChat() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('live_chat')
    .select(
      'id, title, description, icon, url, display_order'
    )
    .eq('is_active', true)
    .order('display_order', {
      ascending: true,
    })

  if (error) {
    console.error('LIVE CHAT LOAD ERROR:', error)
    return null
  }

  const chatOptions: LiveChatOption[] =
    (data ?? []) as LiveChatOption[]

  if (chatOptions.length === 0) {
    return null
  }

  return (
    <section className="fixed bottom-6 right-6 z-50">
      <div className="group relative">

        {/* CHAT BUTTON */}

        <button
          type="button"
          aria-label="Open live chat"
          className="flex h-16 w-16 items-center justify-center rounded-full border border-yellow-300/40 bg-yellow-400 text-2xl text-black shadow-[0_0_30px_rgba(234,179,8,0.35)] transition-all duration-300 hover:scale-110 hover:bg-yellow-300"
        >
          💬
        </button>

        {/* CHAT OPTIONS */}

        <div className="pointer-events-none absolute bottom-20 right-0 w-80 translate-y-3 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">

          <div className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-zinc-950 p-3 shadow-2xl">

            <div className="px-4 pb-3 pt-2">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
                Live Support
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Choose a support channel
              </p>

            </div>

            <div className="space-y-2">

              {chatOptions.map((chat) => (
                <Link
                  key={chat.id}
                  href={chat.url || '#'}
                  target={chat.url ? '_blank' : undefined}
                  rel={chat.url ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-yellow-400/50 hover:bg-zinc-800"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-xl">
                    {chat.icon || '💬'}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {chat.title}
                    </p>

                    {chat.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
                        {chat.description}
                      </p>
                    )}
                  </div>

                </Link>
              ))}

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}