import Link from 'next/link'
import { revalidatePath } from 'next/cache'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'

interface ApprovedTestimonial {
  id: string
  name: string
  country: string | null
  amount: string | null
  image: string | null
  text: string
  user_id: string | null
  display_order: number
  created_at: string
  updated_at: string
}

async function changeTestimonialStatus(formData: FormData) {
  'use server'

  await requireAdminPage()

  const id = formData.get('id')
  const status = formData.get('status')

  if (
    typeof id !== 'string' ||
    typeof status !== 'string'
  ) {
    throw new Error('Invalid testimonial data.')
  }

  if (
    status !== 'pending' &&
    status !== 'rejected'
  ) {
    throw new Error('Invalid testimonial status.')
  }

  const { error } = await supabaseAdmin
    .from('testimonials')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('source', 'user')
    .eq('status', 'approved')

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/admin/testimonials/pending')
  revalidatePath('/admin/testimonials/approved')
  revalidatePath('/')
}

export default async function ApprovedTestimonialsPage() {
  await requireAdminPage()

  const {
    data,
    error,
  } = await supabaseAdmin
    .from('testimonials')
    .select(
      'id, name, country, amount, image, text, user_id, display_order, created_at, updated_at'
    )
    .eq('source', 'user')
    .eq('status', 'approved')
    .order('display_order', {
      ascending: true,
    })
    .order('created_at', {
      ascending: true,
    })

  if (error) {
    throw new Error(error.message)
  }

  const testimonials: ApprovedTestimonial[] =
    (data ?? []) as ApprovedTestimonial[]

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/admin/testimonials"
            className="text-sm text-zinc-400 transition hover:text-yellow-400"
          >
            ← All Testimonials
          </Link>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Testimonials
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Approved User Testimonials
            </h1>

            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              User testimonials currently approved for public display.
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {testimonials.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-2xl">
              💬
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No Approved User Testimonials
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              Approved user testimonials will appear here.
            </p>
          </div>
        )}

        {/* APPROVED TESTIMONIALS */}
        {testimonials.length > 0 && (
          <div className="space-y-5">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-3xl border border-emerald-500/20 bg-zinc-900 p-5 sm:p-6 lg:p-7"
              >
                <div className="flex flex-col gap-6 lg:flex-row">

                  {/* IMAGE */}
                  <div className="shrink-0">
                    {testimonial.image ? (
                      <div className="h-24 w-24 overflow-hidden rounded-2xl border border-yellow-500/20 bg-black">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-zinc-800 bg-black text-3xl">
                        👤
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div>
                        <h2 className="text-xl font-bold">
                          {testimonial.name}
                        </h2>

                        {testimonial.country && (
                          <p className="mt-1 text-sm text-zinc-500">
                            {testimonial.country}
                          </p>
                        )}

                        {testimonial.user_id && (
                          <p className="mt-1 break-all text-xs text-zinc-600">
                            User ID: {testimonial.user_id}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                          Approved
                        </span>

                        <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                          #{testimonial.display_order}
                        </span>
                      </div>
                    </div>

                    {/* TESTIMONIAL */}
                    <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/40 p-5">
                      <p className="leading-7 text-zinc-300">
                        "{testimonial.text}"
                      </p>
                    </div>

                    {/* EARNINGS */}
                    {testimonial.amount && (
                      <div className="mt-5">
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Total Earnings
                        </p>

                        <p className="mt-1 text-2xl font-bold text-yellow-400">
                          {testimonial.amount}
                        </p>
                      </div>
                    )}

                    {/* META */}
                    <div className="mt-5 space-y-1 text-xs text-zinc-600">
                      <p>
                        Submitted:{' '}
                        {new Date(
                          testimonial.created_at
                        ).toLocaleString()}
                      </p>

                      <p>
                        Last updated:{' '}
                        {new Date(
                          testimonial.updated_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-6 flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row">

                      <form
                        action={changeTestimonialStatus}
                        className="flex-1"
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={testimonial.id}
                        />

                        <input
                          type="hidden"
                          name="status"
                          value="pending"
                        />

                        <button
                          type="submit"
                          className="w-full rounded-xl border border-amber-500/30 px-5 py-3 font-semibold text-amber-400 transition hover:bg-amber-500/10"
                        >
                          Move to Pending
                        </button>
                      </form>

                      <form
                        action={changeTestimonialStatus}
                        className="flex-1"
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={testimonial.id}
                        />

                        <input
                          type="hidden"
                          name="status"
                          value="rejected"
                        />

                        <button
                          type="submit"
                          className="w-full rounded-xl border border-red-500/30 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-500/10"
                        >
                          Reject
                        </button>
                      </form>

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