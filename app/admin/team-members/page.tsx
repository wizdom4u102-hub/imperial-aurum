import Link from 'next/link'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string | null
  image: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default async function TeamMembersPage() {
  await requireAdminPage()

  const { data, error } = await supabaseAdmin
    .from('team_members')
    .select(
      'id, name, role, bio, image, display_order, is_active, created_at, updated_at'
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

  const members: TeamMember[] =
    (data ?? []) as TeamMember[]

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
              Team Members
            </h1>

            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              Manage the people displayed on the public team section.
            </p>
          </div>

          <Link
            href="/admin/team-members/new"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-5 font-semibold text-black transition hover:bg-yellow-300"
          >
            + Add Team Member
          </Link>
        </div>

        {/* EMPTY STATE */}
        {members.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-2xl">
              👥
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No Team Members
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              No team members have been added yet.
            </p>

            <Link
              href="/admin/team-members/new"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-6 font-semibold text-black transition hover:bg-yellow-300"
            >
              Add Team Member
            </Link>
          </div>
        )}

        {/* TEAM MEMBERS */}
        {members.length > 0 && (
          <div className="space-y-5">
            {members.map((member) => (
              <div
                key={member.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
              >
                <div className="flex flex-col gap-6 md:flex-row">

                  {/* IMAGE */}
                  <div className="shrink-0">
                    {member.image ? (
                      <div className="h-28 w-28 overflow-hidden rounded-2xl border border-yellow-500/20 bg-black">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-zinc-800 bg-black text-4xl">
                        👤
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div>
                        <h2 className="text-2xl font-bold">
                          {member.name}
                        </h2>

                        <p className="mt-1 text-yellow-400">
                          {member.role}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                          #{member.display_order}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            member.is_active
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-zinc-700 text-zinc-400'
                          }`}
                        >
                          {member.is_active
                            ? 'Active'
                            : 'Inactive'}
                        </span>
                      </div>

                    </div>

                    {member.bio && (
                      <p className="mt-5 max-w-3xl leading-7 text-zinc-400">
                        {member.bio}
                      </p>
                    )}

                    <div className="mt-6 flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">

                      <p className="text-xs text-zinc-600">
                        Created:{' '}
                        {new Date(
                          member.created_at
                        ).toLocaleString()}
                      </p>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={`/admin/team-members/${member.id}`}
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-700 px-5 text-sm font-medium text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
                        >
                          Manage
                        </Link>
                      </div>

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