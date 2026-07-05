import WithdrawClient from './WithdrawClient'
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()

  // ✅ GET LOGGED-IN USER (THIS WAS MISSING)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // 🔒 Handle not logged in
  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Please login to continue</p>
      </div>
    )
  }

  // ✅ NOW user is defined
  const { data: methods } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)

  return (
    <WithdrawClient methods={methods || []} />
  )
}