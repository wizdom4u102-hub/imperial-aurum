// app/dashboard/page.tsx

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { unstable_noStore } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import ClientDashboard from './ClientDashboard'

export default async function DashboardPage() {
  unstable_noStore()

  console.log('================ USER DASHBOARD =================')

  try {
  // ================= CREATE CLIENT =================
  const supabase = await createClient()

  // ================= GET USER =================
  let user: any = null

  try {
    const result = await supabase.auth.getUser()

    // missing session
    if (
      result.error?.name === 'AuthSessionMissingError'
    ) {
      redirect('/login')
    }

    if (
      result.error ||
      !result.data?.user
    ) {
      console.error(
        '❌ AUTH ERROR:',
        result.error
      )

      redirect('/login')
    }

    user = result.data.user

    console.log(
      'AUTH USER:',
      user?.id
    )

  } catch (err: any) {

    if (
      err?.digest &&
      String(err.digest).includes(
        'NEXT_REDIRECT'
      )
    ) {
      throw err
    }

    console.error(
      '❌ INVALID SESSION:',
      err
    )

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

    const referralLink =
  profile?.username
    ? `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${profile.username}`
    : ''

  console.log(
    'PROFILE:',
    profile
  )

  if (profileError) {
    console.error(
      '❌ PROFILE ERROR:',
      JSON.stringify(
        profileError,
        null,
        2
      )
    )

    redirect('/login')
  }

    // ================= BLOCK ADMIN FROM USER DASHBOARD =================
    if (
  profile?.role === 'admin' ||
  profile?.is_admin === true
) {
  console.log('ADMIN DETECTED → REDIRECT TO ADMIN');

  redirect('/admin');
}

    // ================= BLOCK BAD ACCOUNT STATUS =================
    if (profile?.status === 'blocked') {
      redirect('/blocked')
    }

    if (profile?.status === 'suspended') {
      redirect('/suspended')
    }


    // ================= FETCH BALANCES =================
const {
  data: balances,
  error: balanceError,
} = await supabase
  .from('balances')
  .select('*')
  .eq('user_id', user.id)

if (balanceError) {
  console.error(
    '❌ BALANCE ERROR:',
    JSON.stringify(
      balanceError,
      null,
      2
    )
  )
}

// raw debugging first
console.log(
  'ALL USER BALANCES:',
  balances
)

const balance =
  balances?.[0] || null

console.log(
  'DASHBOARD BALANCE:',
  balance
)
    // ================= ENSURE BALANCE EXISTS =================
    let finalBalance = balance

    if (!balance) {
      console.log('⚠️ NO BALANCE FOUND — CREATING')

      const {
        data: newBalance,
        error: createBalanceError,
      } = await supabase
        .from('balances')
        .insert({
  user_id: user.id,

  cash: 0,

    gold: 1000,   

  shares: 0,

  updated_at:
    new Date().toISOString(),
})
        .select()
        .single()

      if (createBalanceError) {
        console.error(
          '❌ CREATE BALANCE ERROR:',
          JSON.stringify(createBalanceError, null, 2)
        )
      } else {
        console.log('✅ BALANCE CREATED')

        finalBalance = newBalance
      }
    }

    // ================= MINING SESSION =================
    const {
      data: session,
      error: sessionError,
    } = await supabase
      .from('mining_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (sessionError) {
      console.error(
        '❌ SESSION ERROR:',
        JSON.stringify(sessionError, null, 2)
      )
    }

    console.log('MINING SESSION:', session)

    // ================= DEPOSITS =================
    const {
      data: deposits,
      error: depositsError,
    } = await supabase
      .from('deposits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (depositsError) {
      console.error(
        '❌ DEPOSITS ERROR:',
        JSON.stringify(depositsError, null, 2)
      )
    }

    // ================= WITHDRAWALS =================
    const {
      data: withdrawals,
      error: withdrawalsError,
    } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (withdrawalsError) {
      console.error(
        '❌ WITHDRAWALS ERROR:',
        JSON.stringify(withdrawalsError, null, 2)
      )
    }

    // ================= TRANSACTIONS =================
    const {
      data: transactions,
      error: transactionsError,
    } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (transactionsError) {
      console.error(
        '❌ TRANSACTIONS ERROR:',
        JSON.stringify(transactionsError, null, 2)
      )
    }

    // ================= FINAL DEBUG =================
    console.log('================ FINAL DASHBOARD DATA =================')

    console.log('USER ID:', user.id)

    console.log('PROFILE ID:', profile?.id)

    console.log(
 'BALANCE ID:',
 finalBalance?.id
)

console.log(
 'BALANCE USER:',
 finalBalance?.user_id
)

    console.log('TOTAL CASH:', finalBalance?.cash)

    console.log('TOTAL GOLD:', finalBalance?.gold)

    console.log('TOTAL SHARES:', finalBalance?.shares)

    console.log('DEPOSITS COUNT:', deposits?.length || 0)

    console.log('WITHDRAWALS COUNT:', withdrawals?.length || 0)

    console.log('TRANSACTIONS COUNT:', transactions?.length || 0)

    // ================= RETURN UI =================
    return (
      <ClientDashboard
        profile={{
          ...profile,

          cash: Number(finalBalance?.cash || 0),

          gold: Number(finalBalance?.gold || 0),

          shares: Number(finalBalance?.shares || 0),

          total_balance: Number(finalBalance?.cash || 0),

          balances: {
            cash: Number(finalBalance?.cash || 0),

            gold: Number(finalBalance?.gold || 0),

            shares: Number(finalBalance?.shares || 0),
          },
        }}
        deposits={deposits ?? []}
        withdrawals={withdrawals ?? []}
        transactions={transactions ?? []}
        session={session ?? null}
        referralLink={referralLink}
      />
    )
  } 
   catch (err: any) {

  if (
    err?.digest &&
    String(err.digest).includes('NEXT_REDIRECT')
  ) {
    throw err
  }

  console.error(
    '❌ DASHBOARD SERVER ERROR:',
    JSON.stringify(err, null, 2)
  )

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 lg:p-10">
        <div className="bg-zinc-900 border border-red-500 rounded-3xl p-4 lg:p-10 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-red-500 mb-6">
            Dashboard Error
          </h1>

          <p className="text-zinc-300 mb-4">
            Failed to load dashboard.
          </p>

          <pre className="bg-black p-6 rounded-2xl overflow-auto text-sm text-red-400">
            {err?.message || 'Unknown server error'}
          </pre>
        </div>
      </div>
    )
  }
}