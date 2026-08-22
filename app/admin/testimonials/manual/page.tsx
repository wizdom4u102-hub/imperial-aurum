import Link from 'next/link'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'

interface ManualTestimonial {
  id: string
  name: string
  country: string | null
  amount: string | null
  image: string | null
  text: string
  status: 'pending' | 'approved' | 'rejected'
  display_order: number
  created_at: string
}

export default async function ManualTestimonialsPage() {
  await requireAdminPage()

  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .select(
      'id, name, country, amount, image, text, status, display_order, created_at'
    )
    .eq('source', 'manual')
    .order('display_order', {
      ascending: true,
    })
    .order('created_at', {
      ascending: true,
    })

  if (error) {
    throw new Error(error.message)
  }

  const testimonials: ManualTestimonial[] =
    (data ?? []) as ManualTestimonial[]

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/testimonials"
              className="text-sm text-zinc-400 transition hover:text-yellow-400"
            >
              ← All Testimonials
            </Link>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Testimonials
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Manual Testimonials
            </h1>

            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              Manage testimonials created directly by the administrator.
            </p>
          </div>

          <Link
            href="/admin/testimonials/new"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-5 font-semibold text-black transition hover:bg-yellow-300"
          >
            + Add Manual Testimonial
          </Link>
        </div>

        {/* EMPTY STATE */}
        {testimonials.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center sm:p-12">
            <h2 className="text-xl font-semibold">
              No Manual Testimonials
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              You have not created any manual testimonials yet.
            </p>

            <Link
              href="/admin/testimonials/new"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-6 font-semibold text-black transition hover:bg-yellow-300"
            >
              Add Manual Testimonial
            </Link>
          </div>
        )}

        {/* LIST */}
        {testimonials.length > 0 && (
          <div className="space-y-5">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
              >
                <div className="flex flex-col gap-6 lg:flex-row">

                  {/* IMAGE */}
                  <div className="shrink-0">
                    {testimonial.image ? (
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-yellow-500/20 bg-black">
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
                        <h2 className="text-xl font-bold text-white">
                          {testimonial.name}
                        </h2>

                        {testimonial.country && (
                          <p className="mt-1 text-sm text-zinc-500">
                            {testimonial.country}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                          #{testimonial.display_order}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            testimonial.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : testimonial.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {testimonial.status}
                        </span>
                      </div>
                    </div>

                    <p className="mt-5 leading-7 text-zinc-300">
                      "{testimonial.text}"
                    </p>

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

                    <div className="mt-6 flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-zinc-600">
                        Created:{' '}
                        {new Date(
                          testimonial.created_at
                        ).toLocaleString()}
                      </p>

                      <Link
                        href="/admin/testimonials"
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-700 px-4 text-sm font-medium text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
                      >
                        Manage Testimonial
                      </Link>
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