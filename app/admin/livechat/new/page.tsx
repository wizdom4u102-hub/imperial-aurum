import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'

async function createLiveChat(formData: FormData) {
  'use server'

  await requireAdminPage()

  const title = formData.get('title')
  const description = formData.get('description')
  const icon = formData.get('icon')
  const url = formData.get('url')
  const displayOrder = formData.get('display_order')
  const isActive = formData.get('is_active')

  if (
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    typeof icon !== 'string' ||
    typeof url !== 'string' ||
    typeof displayOrder !== 'string' ||
    typeof isActive !== 'string'
  ) {
    throw new Error('Invalid live chat data.')
  }

  const cleanTitle = title.trim()
  const cleanDescription = description.trim()
  const cleanIcon = icon.trim()
  const cleanUrl = url.trim()

  if (!cleanTitle) {
    throw new Error('Live chat title is required.')
  }

  const parsedDisplayOrder = Number(displayOrder)

  if (
    !Number.isInteger(parsedDisplayOrder) ||
    parsedDisplayOrder < 0
  ) {
    throw new Error(
      'Display order must be a valid number greater than or equal to 0.'
    )
  }

  const active = isActive === 'true'

  const { error } = await supabaseAdmin
    .from('live_chat')
    .insert({
      title: cleanTitle,
      description: cleanDescription || null,
      icon: cleanIcon || null,
      url: cleanUrl || null,
      display_order: parsedDisplayOrder,
      is_active: active,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/livechat')
  revalidatePath('/')

  redirect('/admin/livechat')
}

export default async function NewLiveChatPage() {
  await requireAdminPage()

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* HEADER */}

        <div className="mb-8">

          <Link
            href="/admin/livechat"
            className="text-sm text-zinc-400 transition hover:text-yellow-400"
          >
            ← Back to Live Chat
          </Link>

          <div className="mt-6">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              New Live Chat
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
              Add a support or communication channel that can be
              displayed to visitors on the website.
            </p>

          </div>

        </div>

        {/* FORM */}

        <form
          action={createLiveChat}
          className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7 lg:p-8"
        >

          <div className="space-y-6">

            {/* TITLE */}

            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="WhatsApp Support"
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Chat directly with our support team."
                className="w-full resize-y rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            {/* ICON */}

            <div>
              <label
                htmlFor="icon"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Icon
              </label>

              <input
                id="icon"
                name="icon"
                type="text"
                placeholder="💬"
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />

              <p className="mt-2 text-xs text-zinc-500">
                You can use an emoji such as 💬, 📱, ✈️, or 🎧.
              </p>
            </div>

            {/* URL */}

            <div>
              <label
                htmlFor="url"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Chat URL
              </label>

              <input
                id="url"
                name="url"
                type="url"
                placeholder="https://..."
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />

              <p className="mt-2 text-xs text-zinc-500">
                The visitor will be taken to this address when they
                select the chat option.
              </p>
            </div>

            {/* DISPLAY ORDER */}

            <div>
              <label
                htmlFor="display_order"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Display Order
              </label>

              <input
                id="display_order"
                name="display_order"
                type="number"
                min="0"
                step="1"
                defaultValue="0"
                required
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 sm:max-w-xs"
              />

              <p className="mt-2 text-xs text-zinc-500">
                Lower numbers appear first.
              </p>
            </div>

            {/* ACTIVE */}

            <div className="rounded-2xl border border-zinc-800 bg-black p-5">

              <label className="flex cursor-pointer items-center justify-between gap-4">

                <div>
                  <p className="font-medium text-white">
                    Active
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Active chat options can be displayed on the public
                    website.
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="is_active"
                  value="true"
                  defaultChecked
                  className="h-5 w-5 accent-yellow-400"
                />

              </label>

            </div>

            {/* INFO */}

            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">

              <p className="text-sm font-medium text-yellow-400">
                Live Chat
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                You can add multiple support channels. Each active
                channel can have its own title, icon, description,
                and destination URL.
              </p>

            </div>

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:justify-end">

              <Link
                href="/admin/livechat"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-700 px-6 font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-yellow-400 px-6 font-semibold text-black transition hover:bg-yellow-300"
              >
                Create Live Chat
              </button>

            </div>

          </div>

        </form>

      </div>
    </main>
  )
}