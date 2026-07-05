import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireAdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login/admin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/login/admin')
  }

  return { user, supabase }
}

export async function requireAdminApi() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      ok: false,
      status: 401,
      error: 'Unauthorized',
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return {
      ok: false,
      status: 403,
      error: 'Forbidden',
    }
  }

  return {
    ok: true,
    user,
    supabase,
  }
}