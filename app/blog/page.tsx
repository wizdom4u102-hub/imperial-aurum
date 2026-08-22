import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  category: string | null
  author: string | null
  published_at: string | null
}

export default async function BlogPage() {
  const supabase = await createClient()

  const {
    data: posts,
    error,
  } = await supabase
    .from('blog_posts')
    .select(
      'id, title, slug, excerpt, featured_image, category, author, published_at'
    )
    .eq('status', 'published')
    .order('published_at', {
      ascending: false,
      nullsFirst: false,
    })

  if (error) {
    console.error('BLOG POSTS LOAD ERROR:', error)
  }

  const publishedPosts: BlogPost[] =
    (posts ?? []) as BlogPost[]

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}

      <section className="border-b border-zinc-900 bg-zinc-950">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
              Imperial Aurum
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Our Blog
            </h1>

            <p className="mt-6 text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
              Discover mining insights, platform updates, educational
              articles, and the latest news from Imperial Aurum.
            </p>

          </div>

        </div>
      </section>

      {/* BLOG POSTS */}

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          {error && (
            <div className="mx-auto max-w-2xl rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <h2 className="text-xl font-semibold text-red-400">
                Unable to Load Blog
              </h2>

              <p className="mt-3 text-sm text-zinc-500">
                Please try again later.
              </p>
            </div>
          )}

          {!error && publishedPosts.length === 0 && (
            <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center sm:p-12">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400/10 text-3xl">
                📝
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                No Articles Yet
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Our latest articles and updates will appear here soon.
              </p>

              <Link
                href="/"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-6 font-semibold text-black transition hover:bg-yellow-300"
              >
                Back to Home
              </Link>

            </div>
          )}

          {!error && publishedPosts.length > 0 && (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

              {publishedPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-yellow-500/10 bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:shadow-[0_0_35px_rgba(234,179,8,0.12)]"
                >

                  {/* IMAGE */}

                  <Link
                    href={`/blog/${post.slug}`}
                    className="block"
                  >
                    {post.featured_image ? (
                      <div className="aspect-[16/9] overflow-hidden bg-black">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/9] items-center justify-center bg-zinc-950 text-5xl">
                        📰
                      </div>
                    )}
                  </Link>

                  {/* CONTENT */}

                  <div className="flex flex-1 flex-col p-6 sm:p-7">

                    {/* META */}

                    <div className="flex flex-wrap items-center gap-3 text-xs">

                      {post.category && (
                        <span className="rounded-full bg-yellow-400/10 px-3 py-1 font-medium text-yellow-400">
                          {post.category}
                        </span>
                      )}

                      {post.published_at && (
                        <span className="text-zinc-600">
                          {new Date(
                            post.published_at
                          ).toLocaleDateString()}
                        </span>
                      )}

                    </div>

                    {/* TITLE */}

                    <h2 className="mt-5 text-xl font-bold leading-7 transition group-hover:text-yellow-400 sm:text-2xl">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    {/* EXCERPT */}

                    {post.excerpt && (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-400">
                        {post.excerpt}
                      </p>
                    )}

                    {/* FOOTER */}

                    <div className="mt-auto flex items-center justify-between border-t border-zinc-800 pt-5">

                      {post.author ? (
                        <span className="text-xs text-zinc-500">
                          By {post.author}
                        </span>
                      ) : (
                        <span />
                      )}

                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-semibold text-yellow-400 transition hover:text-yellow-300"
                      >
                        Read Article →
                      </Link>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* BACK TO HOME */}

      <div className="pb-16 text-center">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition hover:text-yellow-400"
        >
          ← Back to Home
        </Link>
      </div>

    </main>
  )
}