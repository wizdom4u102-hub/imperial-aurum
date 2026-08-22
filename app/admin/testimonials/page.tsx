import Link from 'next/link'
import { revalidatePath } from 'next/cache'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'

interface Testimonial {
  id: string
  name: string
  country: string | null
  amount: string | null
  image: string | null
  text: string
  source: 'manual' | 'user'
  user_id: string | null
  status: 'pending' | 'approved' | 'rejected'
  display_order: number
  created_at: string
  updated_at: string
}

async function updateTestimonial(formData: FormData) {
  'use server'

  await requireAdminPage()

  const id = formData.get('id')
  const name = formData.get('name')
  const country = formData.get('country')
  const amount = formData.get('amount')
  const image = formData.get('image')
  const text = formData.get('text')
  const displayOrder = formData.get('display_order')

  if (
    typeof id !== 'string' ||
    typeof name !== 'string' ||
    typeof country !== 'string' ||
    typeof amount !== 'string' ||
    typeof image !== 'string' ||
    typeof text !== 'string' ||
    typeof displayOrder !== 'string'
  ) {
    throw new Error('Invalid testimonial data.')
  }

  const parsedOrder = Number(displayOrder)

  if (!name.trim()) {
    throw new Error('Name is required.')
  }

  if (!text.trim()) {
    throw new Error('Testimonial text is required.')
  }

  if (!Number.isInteger(parsedOrder) || parsedOrder < 0) {
    throw new Error('Display order must be a valid number.')
  }

  const { error } = await supabaseAdmin
    .from('testimonials')
    .update({
      name: name.trim(),
      country: country.trim() || null,
      amount: amount.trim() || null,
      image: image.trim() || null,
      text: text.trim(),
      display_order: parsedOrder,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/testimonials')
}

async function updateStatus(formData: FormData) {
  'use server'

  await requireAdminPage()

  const id = formData.get('id')
  const status = formData.get('status')

  if (typeof id !== 'string' || typeof status !== 'string') {
    throw new Error('Invalid testimonial data.')
  }

  if (
    status !== 'pending' &&
    status !== 'approved' &&
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

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/admin/testimonials/pending')
  revalidatePath('/admin/testimonials/approved')
}

async function deleteTestimonial(formData: FormData) {
  'use server'

  await requireAdminPage()

  const id = formData.get('id')

  if (typeof id !== 'string') {
    throw new Error('Invalid testimonial ID.')
  }

  const { error } = await supabaseAdmin
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/testimonials')
}

export default async function AdminTestimonialsPage() {
  await requireAdminPage()

  const {
    data,
    error,
  } = await supabaseAdmin
    .from('testimonials')
    .select(
      'id, name, country, amount, image, text, source, user_id, status, display_order, created_at, updated_at'
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

  const testimonials: Testimonial[] =
    (data ?? []) as Testimonial[]

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
              All Testimonials
            </h1>

            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              Manage manual and user-submitted testimonials.
            </p>
          </div>

          <Link
            href="/admin/testimonials/new"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-5 font-semibold text-black transition hover:bg-yellow-300"
          >
            + Add Manual Testimonial
          </Link>
        </div>

        {/* EMPTY */}
        {testimonials.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center sm:p-12">
            <h2 className="text-xl font-semibold">
              No Testimonials Yet
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              Add a manual testimonial or wait for a user submission.
            </p>
          </div>
        )}

        {/* LIST */}
        {testimonials.length > 0 && (
          <div className="space-y-5">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 lg:p-7"
              >
                {/* META */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                      #{testimonial.display_order}
                    </span>

                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold capitalize text-blue-400">
                      {testimonial.source}
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

                  <form action={deleteTestimonial}>
                    <input
                      type="hidden"
                      name="id"
                      value={testimonial.id}
                    />

                    <button
                      type="submit"
                      className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </form>
                </div>

                {/* EDIT */}
                <form
                  action={updateTestimonial}
                  className="space-y-5"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={testimonial.id}
                  />

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {/* NAME */}
                    <div>
                      <label
                        htmlFor={`name-${testimonial.id}`}
                        className="mb-2 block text-sm font-medium text-zinc-300"
                      >
                        Name
                      </label>

                      <input
                        id={`name-${testimonial.id}`}
                        name="name"
                        type="text"
                        defaultValue={testimonial.name}
                        required
                        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
                      />
                    </div>

                    {/* COUNTRY */}
                    <div>
                      <label
                        htmlFor={`country-${testimonial.id}`}
                        className="mb-2 block text-sm font-medium text-zinc-300"
                      >
                        Country
                      </label>

                      <input
                        id={`country-${testimonial.id}`}
                        name="country"
                        type="text"
                        defaultValue={testimonial.country ?? ''}
                        placeholder="🇺🇸 United States"
                        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
                      />
                    </div>

                    {/* AMOUNT */}
                    <div>
                      <label
                        htmlFor={`amount-${testimonial.id}`}
                        className="mb-2 block text-sm font-medium text-zinc-300"
                      >
                        Total Earnings
                      </label>

                      <input
                        id={`amount-${testimonial.id}`}
                        name="amount"
                        type="text"
                        defaultValue={testimonial.amount ?? ''}
                        placeholder="$48,500"
                        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
                      />
                    </div>

                    {/* IMAGE */}
                    <div>
                      <label
                        htmlFor={`image-${testimonial.id}`}
                        className="mb-2 block text-sm font-medium text-zinc-300"
                      >
                        Image Path / URL
                      </label>

                      <input
                        id={`image-${testimonial.id}`}
                        name="image"
                        type="text"
                        defaultValue={testimonial.image ?? ''}
                        placeholder="/images/testimonials/example.jpg"
                        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  {/* TEXT */}
                  <div>
                    <label
                      htmlFor={`text-${testimonial.id}`}
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Testimonial
                    </label>

                    <textarea
                      id={`text-${testimonial.id}`}
                      name="text"
                      defaultValue={testimonial.text}
                      required
                      rows={5}
                      className="w-full resize-y rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm leading-6 text-white outline-none focus:border-yellow-400"
                    />
                  </div>

                  {/* ORDER */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="w-full sm:w-40">
                      <label
                        htmlFor={`order-${testimonial.id}`}
                        className="mb-2 block text-sm font-medium text-zinc-300"
                      >
                        Display Order
                      </label>

                      <input
                        id={`order-${testimonial.id}`}
                        name="display_order"
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={testimonial.display_order}
                        required
                        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
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

                {/* STATUS ACTIONS */}
                <div className="mt-6 flex flex-wrap gap-2 border-t border-zinc-800 pt-5">
                  {testimonial.status !== 'approved' && (
                    <form action={updateStatus}>
                      <input
                        type="hidden"
                        name="id"
                        value={testimonial.id}
                      />

                      <input
                        type="hidden"
                        name="status"
                        value="approved"
                      />

                      <button
                        type="submit"
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
                      >
                        Approve
                      </button>
                    </form>
                  )}

                  {testimonial.status !== 'pending' && (
                    <form action={updateStatus}>
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
                        className="rounded-xl border border-amber-500/30 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-500/10"
                      >
                        Mark Pending
                      </button>
                    </form>
                  )}

                  {testimonial.status !== 'rejected' && (
                    <form action={updateStatus}>
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
                        className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                      >
                        Reject
                      </button>
                    </form>
                  )}
                </div>

                <p className="mt-5 text-xs text-zinc-600">
                  Created:{' '}
                  {new Date(
                    testimonial.created_at
                  ).toLocaleString()}
                  {' • '}
                  Updated:{' '}
                  {new Date(
                    testimonial.updated_at
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