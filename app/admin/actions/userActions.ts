'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ================= BLOCK USER =================
export async function blockUser(userId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({
      status: 'blocked',
      suspended: true,
    })
    .eq('id', userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/users')
}

// ================= SUSPEND USER =================
export async function suspendUser(userId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({
      status: 'suspended',
      suspended: true,
    })
    .eq('id', userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/users')
}

// ================= UNSUSPEND USER =================
export async function unsuspendUser(userId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({
      status: 'active',
      suspended: false,
    })
    .eq('id', userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/users')
}

// ================= DELETE USER =================
export async function deleteUser(userId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/users')
}