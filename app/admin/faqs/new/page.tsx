import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'

async function createFaq(formData: FormData) {
  'use server'

  await requireAdminPage()

  const question = formData.get('question')
  const answer = formData.get('answer')
  const displayOrder = formData.get('display_order')

  if (
    typeof question !== 'string' ||
    typeof answer !== 'string' ||
    typeof displayOrder !== 'string'
  ) {
    throw new Error('Invalid FAQ data.')
  }

  const cleanQuestion = question.trim()
  const cleanAnswer = answer.trim()
  const parsedOrder = Number(displayOrder)

  if (!cleanQuestion) {
    throw new Error('FAQ question is required.')
  }

  if (!cleanAnswer) {
    throw new Error('FAQ answer is required.')
  }

  if (!Number.isInteger(parsedOrder) || parsedOrder < 0) {
    throw new Error('Display order must be a valid number.')
  }

  const { error } = await supabaseAdmin
    .from('faqs')
    .insert({
      question: cleanQuestion,
      answer: cleanAnswer,
      is_active: true,
      display_order: parsedOrder,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/faqs')

  redirect('/admin/faqs')
}

export default async function NewFaqPage() {
  await requireAdminPage()

  const { data: latestFaq, error } = await supabaseAdmin
    .from('faqs')
    .select('display_order')
    .order('display_order', {
      ascending: false,
    })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  const nextDisplayOrder =
    typeof latestFaq?.display_order === 'number'
      ? latestFaq.display_order + 1
      : 1

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/admin/faqs"
            className="text-sm text-zinc-400 transition hover:text-yellow-400"
          >
            ← Back to All FAQs
          </Link>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Add New FAQ
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
              Create a new question and answer for the website FAQ section.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          action={createFaq}
          className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7 lg:p-8"
        >
          <div className="space-y-6">

            {/* QUESTION */}
            <div>
              <label
                htmlFor="question"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Question
              </label>

              <input
                id="question"
                name="question"
                type="text"
                required
                placeholder="Enter the FAQ question"
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            {/* ANSWER */}
            <div>
              <label
                htmlFor="answer"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Answer
              </label>

              <textarea
                id="answer"
                name="answer"
                required
                rows={8}
                placeholder="Enter the answer to this question"
                className="w-full resize-y rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
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
                defaultValue={nextDisplayOrder}
                required
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 sm:max-w-xs"
              />

              <p className="mt-2 text-xs text-zinc-500">
                Lower numbers appear first.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                href="/admin/faqs"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-700 px-6 font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-yellow-400 px-6 font-semibold text-black transition hover:bg-yellow-300"
              >
                Add FAQ
              </button>
            </div>

          </div>
        </form>
      </div>
    </main>
  )
}