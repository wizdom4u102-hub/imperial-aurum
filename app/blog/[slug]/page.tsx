import Link from 'next/link'
import { notFound } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  category: string | null
  author: string | null
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
}

export default async function BlogPostPage({
  params,
}: BlogPostPageProps) {
  const { slug } = await params

  const supabase = await createClient()

  const {
    data,
    error,
  } = await supabase
    .from('blog_posts')
    .select(
      'id, title, slug, excerpt, content, featured_image, category, author, status, published_at, created_at'
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) {
    console.error('BLOG POST LOAD ERROR:', error)
  }

  if (error || !data) {
    notFound()
  }

  const post = data as BlogPost

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}

      <section className="border-b border-zinc-900 bg-zinc-950">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

          <Link
            href="/blog"
            className="text-sm text-zinc-500 transition hover:text-yellow-400"
          >
            ← Back to Blog
          </Link>

          <div className="mt-8">

            {/* CATEGORY */}

            {post.category && (
              <span className="inline-flex rounded-full bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-yellow-400">
                {post.category}
              </span>
            )}

            {/* TITLE */}

            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* EXCERPT */}

            {post.excerpt && (
              <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
                {post.excerpt}
              </p>
            )}

            {/* META */}

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">

              {post.author && (
                <span>
                  By {post.author}
                </span>
              )}

              {post.published_at && (
                <span>
                  {new Date(
                    post.published_at
                  ).toLocaleDateString()}
                </span>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* FEATURED IMAGE */}

      {post.featured_image && (
        <section className="bg-black">
          <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">

            <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
              <img
                src={post.featured_image}
                alt={post.title}
                className="max-h-[600px] w-full object-cover"
              />
            </div>

          </div>
        </section>
      )}

      {/* ARTICLE */}

      <article className="bg-black py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">

          <div className="whitespace-pre-wrap text-base leading-8 text-zinc-300 sm:text-lg sm:leading-9">
            {post.content}
          </div>

        </div>
      </article>

      {/* FOOTER NAVIGATION */}

      <div className="border-t border-zinc-900 bg-zinc-950">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">

          <Link
            href="/blog"
            className="text-sm text-zinc-500 transition hover:text-yellow-400"
          >
            ← More Articles
          </Link>

          <Link
            href="/"
            className="text-sm text-yellow-400 transition hover:text-yellow-300"
          >
            Back to Imperial Aurum →
          </Link>

        </div>
      </div>

    </main>
  )
}