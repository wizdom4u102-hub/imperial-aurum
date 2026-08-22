import Link from 'next/link'
import { revalidatePath } from 'next/cache'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'

interface Faq {
  id: string
  question: string
  answer: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

async function updateFaq(formData: FormData) {
  'use server'

  await requireAdminPage()

  const id = formData.get('id')
  const question = formData.get('question')
  const answer = formData.get('answer')
  const displayOrder = formData.get('display_order')

  if (
    typeof id !== 'string' ||
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
    .update({
      question: cleanQuestion,
      answer: cleanAnswer,
      display_order: parsedOrder,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/faqs')
}

async function toggleFaq(formData: FormData) {
  'use server'

  await requireAdminPage()

  const id = formData.get('id')
  const currentStatus = formData.get('is_active')

  if (
    typeof id !== 'string' ||
    typeof currentStatus !== 'string'
  ) {
    throw new Error('Invalid FAQ data.')
  }

  const isActive = currentStatus === 'true'

  const { error } = await supabaseAdmin
    .from('faqs')
    .update({
      is_active: !isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/faqs')
}

async function deleteFaq(formData: FormData) {
  'use server'

  await requireAdminPage()

  const id = formData.get('id')

  if (typeof id !== 'string') {
    throw new Error('Invalid FAQ ID.')
  }

  const { error } = await supabaseAdmin
    .from('faqs')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/faqs')
}

export default async function AdminFaqsPage() {
  await requireAdminPage()

  const {
    data,
    error,
  } = await supabaseAdmin
    .from('faqs')
    .select(
      'id, question, answer, is_active, display_order, created_at, updated_at'
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

  const faqs: Faq[] = data ?? []

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
              Manage FAQs
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
              Manage the questions and answers displayed on the Imperial
              Aurum website.
            </p>
          </div>

          <Link
            href="/admin/faqs/new"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-5 font-semibold text-black transition hover:bg-yellow-300"
          >
            + Add New FAQ
          </Link>
        </div>

        {/* EMPTY STATE */}
        {faqs.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center sm:p-12">
            <h2 className="text-xl font-semibold">
              No FAQs Yet
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              Add your first FAQ to display it on the website.
            </p>

            <Link
              href="/admin/faqs/new"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-6 font-semibold text-black transition hover:bg-yellow-300"
            >
              Add FAQ
            </Link>
          </div>
        )}

        {/* FAQ LIST */}
        {faqs.length > 0 && (
          <div className="space-y-5">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 lg:p-7"
              >
                {/* TOP BAR */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-3">
                    <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-yellow-400/10 px-3 text-sm font-bold text-yellow-400">
                      #{faq.display_order}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        faq.is_active
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {faq.is_active
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    <form action={toggleFaq}>
                      <input
                        type="hidden"
                        name="id"
                        value={faq.id}
                      />

                      <input
                        type="hidden"
                        name="is_active"
                        value={String(faq.is_active)}
                      />

                      <button
                        type="submit"
                        className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-yellow-400 hover:text-yellow-400"
                      >
                        {faq.is_active
                          ? 'Disable'
                          : 'Activate'}
                      </button>
                    </form>

                    <form action={deleteFaq}>
                      <input
                        type="hidden"
                        name="id"
                        value={faq.id}
                      />

                      <button
                        type="submit"
                        className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </form>

                  </div>
                </div>

                {/* EDIT FORM */}
                <form
                  action={updateFaq}
                  className="space-y-5"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={faq.id}
                  />

                  {/* QUESTION */}
                  <div>
                    <label
                      htmlFor={`question-${faq.id}`}
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Question
                    </label>

                    <input
                      id={`question-${faq.id}`}
                      name="question"
                      type="text"
                      defaultValue={faq.question}
                      required
                      className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
                    />
                  </div>

                  {/* ANSWER */}
                  <div>
                    <label
                      htmlFor={`answer-${faq.id}`}
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Answer
                    </label>

                    <textarea
                      id={`answer-${faq.id}`}
                      name="answer"
                      defaultValue={faq.answer}
                      required
                      rows={5}
                      className="w-full resize-y rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
                    />
                  </div>

                  {/* ORDER + SAVE */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                    <div className="w-full sm:w-40">
                      <label
                        htmlFor={`order-${faq.id}`}
                        className="mb-2 block text-sm font-medium text-zinc-300"
                      >
                        Display Order
                      </label>

                      <input
                        id={`order-${faq.id}`}
                        name="display_order"
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={faq.display_order}
                        required
                        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex h-12 items-center justify-center rounded-xl bg-yellow-400 px-6 font-semibold text-black transition hover:bg-yellow-300"
                    >
                      Save Changes
                    </button>

                  </div>
                </form>

                {/* TIMESTAMP */}
                <p className="mt-5 text-xs text-zinc-600">
                  Last updated:{' '}
                  {new Date(
                    faq.updated_at
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}