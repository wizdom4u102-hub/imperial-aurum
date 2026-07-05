import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireActiveUser() {
  try {
    console.log('================ REQUIRE USER ================')

    const supabase = await createClient()

    // ================= GET USER =================
    const {
  data: { user },
  error: authError
} = await supabase.auth.getUser()

console.log('USER ID:', user?.id)

if (authError || !user) {
  console.error('USER AUTH ERROR:', authError)
  redirect('/login')
}

    // ================= PROFILE =================
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    console.log('USER PROFILE:', profile)

    if (profileError || !profile) {
      console.error(
        'PROFILE ERROR:',
        JSON.stringify(profileError, null, 2)
      )

      redirect('/login')
    }

    // ================= BLOCK ADMIN =================
    if (profile.is_admin) {
      console.error(
        'ADMIN TRIED TO ACCESS USER DASHBOARD'
      )

      redirect('/admin')
    }

    // ================= BLOCKED =================
    if (profile.status === 'blocked') {
      redirect('/blocked')
    }

    // ================= SUSPENDED =================
    if (profile.status === 'suspended') {
      redirect('/suspended')
    }

    return {
      user,
      profile,
    }

  } catch (err: any) {
    console.error(
      'REQUIRE USER ERROR:',
      JSON.stringify(err, null, 2)
    )

    redirect('/login')
  }
}