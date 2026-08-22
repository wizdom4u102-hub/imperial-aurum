import Link from 'next/link'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'

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
  updated_at: string
}

export default async function AdminBlogPage() {
  await requireAdminPage()

  const {
    data,
    error,
  } = await supabaseAdmin
    .from('blog_posts')
    .select(
      'id, title, slug, excerpt, content, featured_image, category, author, status, published_at, created_at, updated_at'
    )
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  const posts: BlogPost[] =
    (data ?? []) as BlogPost[]

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
              All Blog Posts
            </h1>

            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              Manage your published articles and saved drafts.
            </p>
          </div>

          <Link
            href="/admin/blog/new"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-5 font-semibold text-black transition hover:bg-yellow-300"
          >
            + Post New Blog
          </Link>
        </div>

        {/* EMPTY STATE */}

        {posts.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center sm:p-12">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-2xl">
              📝
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No Blog Posts
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              You have not created any blog posts yet.
            </p>

            <Link
              href="/admin/blog/new"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-6 font-semibold text-black transition hover:bg-yellow-300"
            >
              Post New Blog
            </Link>

          </div>
        )}

        {/* POSTS */}

        {posts.length > 0 && (
          <div className="space-y-5">

            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
              >

                <div className="flex flex-col gap-6 md:flex-row">

                  {/* FEATURED IMAGE */}

                  <div className="shrink-0">

                    {post.featured_image ? (
                      <div className="h-32 w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black md:h-28 md:w-44">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-zinc-800 bg-black text-4xl md:h-28 md:w-44">
                        📰
                      </div>
                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div className="min-w-0">

                        <h2 className="text-xl font-bold text-white sm:text-2xl">
                          {post.title}
                        </h2>

                        <p className="mt-1 break-all text-xs text-zinc-600">
                          /blog/{post.slug}
                        </p>

                      </div>

                      <span
                        className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          post.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {post.status}
                      </span>

                    </div>

                    {post.excerpt && (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-400">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500">

                      {post.category && (
                        <span>
                          Category: {post.category}
                        </span>
                      )}

                      {post.author && (
                        <span>
                          Author: {post.author}
                        </span>
                      )}

                      <span>
                        Created:{' '}
                        {new Date(
                          post.created_at
                        ).toLocaleString()}
                      </span>

                      {post.published_at && (
                        <span>
                          Published:{' '}
                          {new Date(
                            post.published_at
                          ).toLocaleString()}
                        </span>
                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-6 flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">

                      {post.status === 'published' ? (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-700 px-5 text-sm font-medium text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
                        >
                          View Published Post
                        </Link>
                      ) : (
                        <span className="text-sm text-zinc-600">
                          Draft — not publicly visible
                        </span>
                      )}

                    </div>

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}

      </div>
    </main>
  )
}