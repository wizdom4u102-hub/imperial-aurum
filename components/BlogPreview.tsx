import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

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

export default async function BlogPreview() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      'id, title, slug, excerpt, featured_image, category, author, published_at'
    )
    .eq('status', 'published')
    .order('published_at', {
      ascending: false,
      nullsFirst: false,
    })
    .limit(3)

  if (error) {
    console.error('BLOG PREVIEW LOAD ERROR:', error)
  }

  const posts: BlogPost[] = (data ?? []) as BlogPost[]

  return (
    <section className="bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}

        <div className="mb-16 text-center">
          <span className="text-sm uppercase tracking-[6px] text-yellow-400">
            From Our Blog
          </span>

          <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
            Latest Articles
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
            Explore the latest Imperial Aurum news, mining insights,
            educational resources, and platform updates.
          </p>
        </div>

        {/* POSTS */}

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {posts.map((post) => (
              <article
                key={post.id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-yellow-500/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/50 hover:shadow-[0_0_40px_rgba(234,179,8,0.2)]"
              >

                {/* IMAGE */}

                <Link
                  href={`/blog/${post.slug}`}
                  className="block overflow-hidden"
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
                    <div className="flex aspect-[16/9] items-center justify-center bg-zinc-900 text-5xl">
                      📰
                    </div>
                  )}
                </Link>

                {/* CONTENT */}

                <div className="flex flex-1 flex-col p-7">

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

                  <h3 className="mt-5 text-xl font-bold leading-7 transition group-hover:text-yellow-400">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  {post.excerpt && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-400">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-auto pt-6">
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
        ) : (
          <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
            <p className="text-zinc-500">
              Our latest articles will appear here soon.
            </p>
          </div>
        )}

        {/* VIEW ALL */}

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-yellow-400 px-7 font-semibold text-black transition hover:bg-yellow-300"
          >
            View All Articles
          </Link>
        </div>

      </div>
    </section>
  )
}