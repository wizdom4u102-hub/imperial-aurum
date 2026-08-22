import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'

async function createManualTestimonial(formData: FormData) {
  'use server'

  await requireAdminPage()

  const name = formData.get('name')
  const country = formData.get('country')
  const amount = formData.get('amount')
  const text = formData.get('text')
  const displayOrder = formData.get('display_order')
  const image = formData.get('image')

  if (
    typeof name !== 'string' ||
    typeof country !== 'string' ||
    typeof amount !== 'string' ||
    typeof text !== 'string' ||
    typeof displayOrder !== 'string'
  ) {
    throw new Error('Invalid testimonial data.')
  }

  const cleanName = name.trim()
  const cleanCountry = country.trim()
  const cleanAmount = amount.trim()
  const cleanText = text.trim()
  const parsedOrder = Number(displayOrder)

  if (!cleanName) {
    throw new Error('Name is required.')
  }

  if (!cleanText) {
    throw new Error('Testimonial text is required.')
  }

  if (!Number.isInteger(parsedOrder) || parsedOrder < 0) {
    throw new Error('Display order must be a valid number.')
  }

  let imageUrl: string | null = null

  /*
   * ============================================================
   * IMAGE UPLOAD
   * ============================================================
   */

  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith('image/')) {
      throw new Error('Please upload a valid image.')
    }

    const maxFileSize = 5 * 1024 * 1024

    if (image.size > maxFileSize) {
      throw new Error('Image must be smaller than 5MB.')
    }

    const extension =
      image.name.split('.').pop()?.toLowerCase() || 'jpg'

    const allowedExtensions = [
      'jpg',
      'jpeg',
      'png',
      'webp',
      'gif',
    ]

    if (!allowedExtensions.includes(extension)) {
      throw new Error(
        'Only JPG, JPEG, PNG, WEBP, and GIF images are allowed.'
      )
    }

    const fileName = `${crypto.randomUUID()}.${extension}`

    const filePath = `manual/${fileName}`

    const { error: uploadError } =
      await supabaseAdmin.storage
        .from('testimonial-images')
        .upload(filePath, image, {
          contentType: image.type,
          upsert: false,
        })

    if (uploadError) {
      throw new Error(
        `Image upload failed: ${uploadError.message}`
      )
    }

    const {
      data: publicUrlData,
    } = supabaseAdmin.storage
      .from('testimonial-images')
      .getPublicUrl(filePath)

    imageUrl = publicUrlData.publicUrl
  }

  /*
   * ============================================================
   * CREATE TESTIMONIAL
   * ============================================================
   */

  const { error } = await supabaseAdmin
    .from('testimonials')
    .insert({
      name: cleanName,
      country: cleanCountry || null,
      amount: cleanAmount || null,
      image: imageUrl,
      text: cleanText,
      source: 'manual',
      user_id: null,
      status: 'approved',
      display_order: parsedOrder,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    /*
     * If the database insert fails after the image was uploaded,
     * remove the uploaded image so we do not leave an orphaned
     * file in Storage.
     */

    if (imageUrl) {
      const url = new URL(imageUrl)
      const marker =
        '/storage/v1/object/public/testimonial-images/'

      const markerIndex =
        url.pathname.indexOf(marker)

      if (markerIndex !== -1) {
        const uploadedPath =
          url.pathname.slice(
            markerIndex + marker.length
          )

        await supabaseAdmin.storage
          .from('testimonial-images')
          .remove([uploadedPath])
      }
    }

    throw new Error(error.message)
  }

  revalidatePath('/admin/testimonials')
  revalidatePath('/admin/testimonials/manual')
  revalidatePath('/testimonials')
  revalidatePath('/')

  redirect('/admin/testimonials')
}

export default async function AddManualTestimonialPage() {
  await requireAdminPage()

  const {
    data: latestTestimonial,
    error,
  } = await supabaseAdmin
    .from('testimonials')
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
    typeof latestTestimonial?.display_order === 'number'
      ? latestTestimonial.display_order + 1
      : 1

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/admin/testimonials"
            className="text-sm text-zinc-400 transition hover:text-yellow-400"
          >
            ← Back to All Testimonials
          </Link>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Add Manual Testimonial
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
              Add a testimonial that will be displayed as an approved
              testimonial on the public website.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          action={createManualTestimonial}
          encType="multipart/form-data"
          className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7 lg:p-8"
        >
          <div className="space-y-6">

            {/* PICTURE */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Testimonial Picture
              </label>

              <div className="rounded-2xl border border-dashed border-zinc-700 bg-black p-5">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-xl file:border-0 file:bg-yellow-400 file:px-4 file:py-2.5 file:font-semibold file:text-black hover:file:bg-yellow-300"
                />

                <p className="mt-3 text-xs text-zinc-500">
                  JPG, JPEG, PNG, WEBP, or GIF. Maximum size: 5MB.
                </p>
              </div>
            </div>

            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Michael Anderson"
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            {/* COUNTRY */}
            <div>
              <label
                htmlFor="country"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Country
              </label>

              <input
                id="country"
                name="country"
                type="text"
                placeholder="🇺🇸 United States"
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            {/* EARNINGS */}
            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Total Earnings
              </label>

              <input
                id="amount"
                name="amount"
                type="text"
                placeholder="$48,500"
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            {/* TESTIMONIAL */}
            <div>
              <label
                htmlFor="text"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Testimonial
              </label>

              <textarea
                id="text"
                name="text"
                required
                rows={8}
                placeholder="Enter the customer's testimonial..."
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

            {/* STATUS */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-sm font-medium text-emerald-400">
                Manual testimonial
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                This testimonial will be created as approved and can
                appear on the public website immediately.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                href="/admin/testimonials"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-700 px-6 font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-yellow-400 px-6 font-semibold text-black transition hover:bg-yellow-300"
              >
                Add Testimonial
              </button>
            </div>

          </div>
        </form>
      </div>
    </main>
  )
}