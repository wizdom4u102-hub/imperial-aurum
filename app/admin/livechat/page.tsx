import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'

interface LiveChat {
  id: string
  title: string
  description: string | null
  icon: string | null
  url: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

async function deleteLiveChat(formData: FormData) {
  'use server'

  await requireAdminPage()

  const id = formData.get('id')

  if (typeof id !== 'string' || !id) {
    throw new Error('Invalid live chat ID.')
  }

  const { error } = await supabaseAdmin
    .from('live_chat')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/livechat')
  revalidatePath('/')

  redirect('/admin/livechat')
}

export default async function AllLiveChatPage() {
  await requireAdminPage()

  const {
    data,
    error,
  } = await supabaseAdmin
    .from('live_chat')
    .select(
      'id, title, description, icon, url, is_active, display_order, created_at, updated_at'
    )
    .order('display_order', {
      ascending: true,
    })
    .order('created_at', {
      ascending: true,
    })

  if (error) {
    throw new Error(error.message)
  }

  const chats: LiveChat[] =
    (data ?? []) as LiveChat[]

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              All Live Chat
            </h1>

            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              Manage the live-chat options available to your visitors.
            </p>
          </div>

          <Link
            href="/admin/livechat/new"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-5 font-semibold text-black transition hover:bg-yellow-300"
          >
            + New Live Chat
          </Link>

        </div>

        {/* EMPTY STATE */}

        {chats.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center sm:p-12">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-2xl">
              💬
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No Live Chat Options
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              Add your first live-chat option to make it available on
              the website.
            </p>

            <Link
              href="/admin/livechat/new"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-6 font-semibold text-black transition hover:bg-yellow-300"
            >
              New Live Chat
            </Link>

          </div>
        )}

        {/* LIVE CHAT OPTIONS */}

        {chats.length > 0 && (
          <div className="space-y-5">

            {chats.map((chat) => (
              <div
                key={chat.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
              >

                <div className="flex flex-col gap-6 md:flex-row md:items-center">

                  {/* ICON */}

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-yellow-500/20 bg-black text-3xl">
                    {chat.icon || '💬'}
                  </div>

                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div className="min-w-0">

                        <h2 className="text-xl font-bold sm:text-2xl">
                          {chat.title}
                        </h2>

                        {chat.description && (
                          <p className="mt-2 text-sm leading-6 text-zinc-400">
                            {chat.description}
                          </p>
                        )}

                      </div>

                      <div className="flex flex-wrap gap-2">

                        <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                          #{chat.display_order}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            chat.is_active
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-zinc-700 text-zinc-400'
                          }`}
                        >
                          {chat.is_active
                            ? 'Active'
                            : 'Inactive'}
                        </span>

                      </div>

                    </div>

                    {/* URL */}

                    {chat.url && (
                      <a
                        href={chat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 block break-all text-xs text-zinc-600 transition hover:text-yellow-400"
                      >
                        {chat.url}
                      </a>
                    )}

                    {/* ACTIONS */}

                    <div className="mt-6 flex flex-col gap-4 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">

                      <p className="text-xs text-zinc-600">
                        Created:{' '}
                        {new Date(
                          chat.created_at
                        ).toLocaleString()}
                      </p>

                      <div className="flex flex-col gap-3 sm:flex-row">

                        {/* EDIT */}

                        <Link
                          href={`/admin/livechat/${chat.id}`}
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-700 px-5 text-sm font-medium text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
                        >
                          Edit
                        </Link>

                        {/* DELETE */}

                        <form action={deleteLiveChat}>
                          <input
                            type="hidden"
                            name="id"
                            value={chat.id}
                          />

                          <button
                            type="submit"
                            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-red-500/30 px-5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 sm:w-auto"
                          >
                            Delete
                          </button>
                        </form>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  )
}