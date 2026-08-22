import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'

async function createBlogPost(formData: FormData) {
  'use server'

  await requireAdminPage()

  const title = formData.get('title')
  const slug = formData.get('slug')
  const excerpt = formData.get('excerpt')
  const content = formData.get('content')
  const featuredImage = formData.get('featured_image')
  const category = formData.get('category')
  const author = formData.get('author')
  const status = formData.get('status')

  if (
    typeof title !== 'string' ||
    typeof slug !== 'string' ||
    typeof excerpt !== 'string' ||
    typeof content !== 'string' ||
    typeof category !== 'string' ||
    typeof author !== 'string' ||
    typeof status !== 'string'
  ) {
    throw new Error('Invalid blog post data.')
  }

  const cleanTitle = title.trim()

  const cleanSlug = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  const cleanExcerpt = excerpt.trim()
  const cleanContent = content.trim()
  const cleanCategory = category.trim()
  const cleanAuthor = author.trim()

  if (!cleanTitle) {
    throw new Error('Title is required.')
  }

  if (!cleanSlug) {
    throw new Error('Slug is required.')
  }

  if (!cleanContent) {
    throw new Error('Blog content is required.')
  }

  if (
    status !== 'draft' &&
    status !== 'published'
  ) {
    throw new Error('Invalid blog status.')
  }

  let featuredImageUrl: string | null = null
  let uploadedImagePath: string | null = null

  /*
   * ============================================================
   * FEATURED IMAGE UPLOAD
   * ============================================================
   */

  if (
    featuredImage instanceof File &&
    featuredImage.size > 0
  ) {
    if (!featuredImage.type.startsWith('image/')) {
      throw new Error('Please upload a valid image.')
    }

    const maxFileSize = 5 * 1024 * 1024

    if (featuredImage.size > maxFileSize) {
      throw new Error(
        'Featured image must be smaller than 5MB.'
      )
    }

    const extension =
      featuredImage.name
        .split('.')
        .pop()
        ?.toLowerCase() || 'jpg'

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

    const fileName =
      `${crypto.randomUUID()}.${extension}`

    uploadedImagePath = `posts/${fileName}`

    const { error: uploadError } =
      await supabaseAdmin.storage
        .from('blog-images')
        .upload(
          uploadedImagePath,
          featuredImage,
          {
            contentType: featuredImage.type,
            upsert: false,
          }
        )

    if (uploadError) {
      throw new Error(
        `Featured image upload failed: ${uploadError.message}`
      )
    }

    const {
      data: publicUrlData,
    } = supabaseAdmin.storage
      .from('blog-images')
      .getPublicUrl(uploadedImagePath)

    featuredImageUrl =
      publicUrlData.publicUrl
  }

  /*
   * ============================================================
   * PUBLISH DATE
   * ============================================================
   */

  const publishedAt =
    status === 'published'
      ? new Date().toISOString()
      : null

  /*
   * ============================================================
   * CREATE BLOG POST
   * ============================================================
   */

  const { error } = await supabaseAdmin
    .from('blog_posts')
    .insert({
      title: cleanTitle,
      slug: cleanSlug,
      excerpt: cleanExcerpt || null,
      content: cleanContent,
      featured_image: featuredImageUrl,
      category: cleanCategory || null,
      author: cleanAuthor || null,
      status,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    /*
     * If database insertion fails after image upload,
     * remove the uploaded image so Storage does not
     * contain an orphaned file.
     */

    if (uploadedImagePath) {
      await supabaseAdmin.storage
        .from('blog-images')
        .remove([uploadedImagePath])
    }

    throw new Error(error.message)
  }

  /*
   * ============================================================
   * REVALIDATE
   * ============================================================
   */

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  revalidatePath(`/blog/${cleanSlug}`)
  revalidatePath('/')

  redirect('/admin/blog')
}

export default async function NewBlogPostPage() {
  await requireAdminPage()

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* HEADER */}

        <div className="mb-8">
          <Link
            href="/admin/blog"
            className="text-sm text-zinc-400 transition hover:text-yellow-400"
          >
            ← Back to Blog Posts
          </Link>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Post New Blog
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Create an article for the Imperial Aurum blog.
              You can save it as a draft or publish it immediately.
            </p>
          </div>
        </div>

        {/* FORM */}

        <form
          action={createBlogPost}
          encType="multipart/form-data"
          className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7 lg:p-8"
        >
          <div className="space-y-6">

            {/* TITLE */}

            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Blog Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="How Cloud Mining Works"
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            {/* SLUG */}

            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                URL Slug
              </label>

              <input
                id="slug"
                name="slug"
                type="text"
                required
                placeholder="how-cloud-mining-works"
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />

              <p className="mt-2 text-xs text-zinc-500">
                The article will be available at /blog/your-slug.
              </p>
            </div>

            {/* FEATURED IMAGE */}

            <div>
              <label
                htmlFor="featured_image"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Featured Image
              </label>

              <div className="rounded-2xl border border-dashed border-zinc-700 bg-black p-5">

                <input
                  id="featured_image"
                  name="featured_image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-xl file:border-0 file:bg-yellow-400 file:px-4 file:py-2.5 file:font-semibold file:text-black hover:file:bg-yellow-300"
                />

                <p className="mt-3 text-xs text-zinc-500">
                  JPG, JPEG, PNG, WEBP, or GIF. Maximum size: 5MB.
                </p>

              </div>
            </div>

            {/* CATEGORY + AUTHOR */}

            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="Mining Education"
                  className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
                />
              </div>

              <div>
                <label
                  htmlFor="author"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Author
                </label>

                <input
                  id="author"
                  name="author"
                  type="text"
                  placeholder="Imperial Aurum"
                  className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
                />
              </div>

            </div>

            {/* EXCERPT */}

            <div>
              <label
                htmlFor="excerpt"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Short Excerpt
              </label>

              <textarea
                id="excerpt"
                name="excerpt"
                rows={4}
                placeholder="A short summary that will appear before readers open the full article..."
                className="w-full resize-y rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />

              <p className="mt-2 text-xs text-zinc-500">
                Keep this short. It is used as the article preview.
              </p>
            </div>

            {/* CONTENT */}

            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Blog Content
              </label>

              <textarea
                id="content"
                name="content"
                required
                rows={18}
                placeholder="Write your full blog article here..."
                className="w-full resize-y rounded-xl border border-zinc-700 bg-black px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />

              <p className="mt-2 text-xs text-zinc-500">
                Your article content will be stored exactly as entered.
              </p>
            </div>

            {/* STATUS */}

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Publication Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue="draft"
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 sm:max-w-sm"
              >
                <option value="draft">
                  Draft — Save without publishing
                </option>

                <option value="published">
                  Published — Publish immediately
                </option>
              </select>
            </div>

            {/* INFORMATION */}

            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
              <p className="text-sm font-medium text-yellow-400">
                Publication
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Draft posts remain hidden from the public website.
                Published posts become publicly visible.
              </p>
            </div>

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:justify-end">

              <Link
                href="/admin/blog"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-700 px-6 font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-yellow-400 px-6 font-semibold text-black transition hover:bg-yellow-300"
              >
                Create Blog Post
              </button>

            </div>

          </div>
        </form>
      </div>
    </main>
  )
}