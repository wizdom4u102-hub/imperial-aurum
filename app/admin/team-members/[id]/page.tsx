import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminPage } from '@/lib/admin'

interface TeamMemberPageProps {
  params: Promise<{
    id: string
  }>
}

async function updateTeamMember(formData: FormData) {
  'use server'

  await requireAdminPage()

  const id = formData.get('id')
  const name = formData.get('name')
  const role = formData.get('role')
  const bio = formData.get('bio')
  const image = formData.get('image')
  const displayOrder = formData.get('display_order')
  const isActive = formData.get('is_active')

  if (
    typeof id !== 'string' ||
    typeof name !== 'string' ||
    typeof role !== 'string' ||
    typeof bio !== 'string' ||
    typeof image !== 'string' ||
    typeof displayOrder !== 'string' ||
    typeof isActive !== 'string'
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

  if (
    isActive !== 'true' &&
    isActive !== 'false'
  ) {
    throw new Error('Invalid active status.')
  }

  const { error } = await supabaseAdmin
    .from('team_members')
    .update({
      name: cleanName,
      role: cleanRole,
      bio: cleanBio || null,
      image: cleanImage || null,
      display_order: parsedOrder,
      is_active: isActive === 'true',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/team-members')
  revalidatePath(`/admin/team-members/${id}`)
  revalidatePath('/team')
  revalidatePath('/')

  redirect('/admin/team-members')
}

async function deleteTeamMember(formData: FormData) {
  'use server'

  await requireAdminPage()

  const id = formData.get('id')

  if (typeof id !== 'string') {
    throw new Error('Invalid team member ID.')
  }

  const { error } = await supabaseAdmin
    .from('team_members')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/team-members')
  revalidatePath('/team')
  revalidatePath('/')

  redirect('/admin/team-members')
}

export default async function TeamMemberPage({
  params,
}: TeamMemberPageProps) {
  await requireAdminPage()

  const { id } = await params

  const {
    data: member,
    error,
  } = await supabaseAdmin
    .from('team_members')
    .select(
      'id, name, role, bio, image, display_order, is_active, created_at, updated_at'
    )
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!member) {
    notFound()
  }

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
              Manage Team Member
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Update this team member&apos;s information, visibility,
              and display order.
            </p>
          </div>
        </div>

        {/* CURRENT IMAGE */}

        <div className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
          <div className="flex flex-col items-center gap-5 sm:flex-row">

            {member.image ? (
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-yellow-500/20 bg-black">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-black text-4xl">
                👤
              </div>
            )}

            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold">
                {member.name}
              </h2>

              <p className="mt-1 text-yellow-400">
                {member.role}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
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
        </div>

        {/* UPDATE FORM */}

        <form
          action={updateTeamMember}
          className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7 lg:p-8"
        >
          <input
            type="hidden"
            name="id"
            value={member.id}
          />

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
                defaultValue={member.name}
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
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
                defaultValue={member.role}
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
              />
            </div>

            {/* IMAGE */}

            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Image Path / URL
              </label>

              <input
                id="image"
                name="image"
                type="text"
                defaultValue={member.image ?? ''}
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
                defaultValue={member.bio ?? ''}
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
                defaultValue={member.display_order}
                required
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 sm:max-w-xs"
              />

              <p className="mt-2 text-xs text-zinc-500">
                Lower numbers appear first.
              </p>
            </div>

            {/* ACTIVE STATUS */}

            <div>
              <label
                htmlFor="is_active"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Visibility
              </label>

              <select
                id="is_active"
                name="is_active"
                defaultValue={
                  member.is_active
                    ? 'true'
                    : 'false'
                }
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 sm:max-w-xs"
              >
                <option value="true">
                  Active — Show publicly
                </option>

                <option value="false">
                  Inactive — Hide publicly
                </option>
              </select>
            </div>

            {/* METADATA */}

            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <div className="grid gap-3 text-xs text-zinc-500 sm:grid-cols-2">
                <p>
                  Created:{' '}
                  {new Date(
                    member.created_at
                  ).toLocaleString()}
                </p>

                <p>
                  Updated:{' '}
                  {new Date(
                    member.updated_at
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex flex-col gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:justify-between">

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-yellow-400 px-6 font-semibold text-black transition hover:bg-yellow-300"
              >
                Save Changes
              </button>

              <Link
                href="/admin/team-members"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-700 px-6 font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                Cancel
              </Link>

            </div>

          </div>
        </form>

        {/* DELETE */}

        <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-5 sm:p-6">

          <h2 className="text-lg font-semibold text-red-400">
            Delete Team Member
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Permanently remove this team member from the database.
            This action cannot be undone.
          </p>

          <form
            action={deleteTeamMember}
            className="mt-5"
          >
            <input
              type="hidden"
              name="id"
              value={member.id}
            />

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-red-500/30 px-5 font-semibold text-red-400 transition hover:bg-red-500/10"
            >
              Delete Team Member
            </button>
          </form>

        </div>

      </div>
    </main>
  )
}