import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'

async function createTeamMember(formData: FormData) {
  'use server'

  await requireAdminPage()

  const name = formData.get('name')
  const role = formData.get('role')
  const bio = formData.get('bio')
  const image = formData.get('image')
  const displayOrder = formData.get('display_order')

  if (
    typeof name !== 'string' ||
    typeof role !== 'string' ||
    typeof bio !== 'string' ||
    typeof image !== 'string' ||
    typeof displayOrder !== 'string'
  ) {
    throw new Error('Invalid team member data.')
  }

  const cleanName = name.trim()
  const cleanRole = role.trim()
  const cleanBio = bio.trim()
  const cleanImage = image.trim()
  const parsedOrder = Number(displayOrder)

  if (!cleanName) {
    throw new Error('Name is required.')
  }

  if (!cleanRole) {
    throw new Error('Role is required.')
  }

  if (!Number.isInteger(parsedOrder) || parsedOrder < 0) {
    throw new Error('Display order must be a valid number.')
  }

  const { error } = await supabaseAdmin
    .from('team_members')
    .insert({
      name: cleanName,
      role: cleanRole,
      bio: cleanBio || null,
      image: cleanImage || null,
      display_order: parsedOrder,
      is_active: true,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/team-members')
  revalidatePath('/team')
  revalidatePath('/')

  redirect('/admin/team-members')
}

export default async function AddTeamMemberPage() {
  await requireAdminPage()

  const {
    data: latestMember,
    error,
  } = await supabaseAdmin
    .from('team_members')
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
    typeof latestMember?.display_order === 'number'
      ? latestMember.display_order + 1
      : 1

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/admin/team-members"
            className="text-sm text-zinc-400 transition hover:text-yellow-400"
          >
            ← Back to Team Members
          </Link>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Add Team Member
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
              Add a team member to the Imperial Aurum public team section.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          action={createTeamMember}
          className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7 lg:p-8"
        >
          <div className="space-y-6">

            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Full Name
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

            {/* ROLE */}
            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Role
              </label>

              <input
                id="role"
                name="role"
                type="text"
                required
                placeholder="Chief Executive Officer"
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />
            </div>

            {/* IMAGE */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Image
              </label>

              <input
                id="image"
                name="image"
                type="text"
                placeholder="/images/team/member.jpg"
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400"
              />

              <p className="mt-2 text-xs text-zinc-500">
                Enter the public image path or URL.
              </p>
            </div>

            {/* BIO */}
            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Biography
              </label>

              <textarea
                id="bio"
                name="bio"
                rows={7}
                placeholder="Write a short biography or introduction..."
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
                Active
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                This team member will be active and available to the
                public team section immediately after creation.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                href="/admin/team-members"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-700 px-6 font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-yellow-400 px-6 font-semibold text-black transition hover:bg-yellow-300"
              >
                Add Team Member
              </button>
            </div>

          </div>
        </form>
      </div>
    </main>
  )
}