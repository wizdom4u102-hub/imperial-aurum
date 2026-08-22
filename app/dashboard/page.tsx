// app/dashboard/page.tsx

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { unstable_noStore } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import ClientDashboard from './ClientDashboard'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'


export default async function DashboardPage() {
  unstable_noStore()

  try {
    // ================= CREATE CLIENT =================

    const supabase =
      await createClient()


    // ================= GET USER =================

    let user: any = null

    try {
      const result =
        await supabase.auth.getUser()


      // Missing session

      if (
        result.error?.name ===
        'AuthSessionMissingError'
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


      user =
        result.data.user


    } catch (err: any) {

      if (
        err?.digest &&
        String(
          err.digest
        ).includes(
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
    } =
      await supabase
        .from('profiles')
        .select('*')
        .eq(
          'id',
          user.id
        )
        .single()


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


    // ================= REFERRAL LINK =================

    const appUrl =
      process.env
        .NEXT_PUBLIC_APP_URL
        ?.replace(
          /\/$/,
          ''
        )


    const referralLink =
      profile?.username &&
      appUrl
        ? `${appUrl}/signup?ref=${encodeURIComponent(
            profile.username
          )}`
        : ''


    // ================= BLOCK ADMIN FROM USER DASHBOARD =================

    if (
      profile?.role === 'admin' ||
      profile?.is_admin === true
    ) {
      redirect('/admin')
    }


    // ================= BLOCK BAD ACCOUNT STATUS =================

    if (
      profile?.status ===
      'blocked'
    ) {
      redirect('/blocked')
    }


    if (
      profile?.status ===
      'suspended'
    ) {
      redirect('/suspended')
    }


    // ================= FETCH BALANCES =================

    const {
      data: balances,
      error: balanceError,
    } =
      await supabase
        .from('balances')
        .select('*')
        .eq(
          'user_id',
          user.id
        )


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


    const balance =
      balances?.[0] ||
      null


    // ================= ENSURE BALANCE EXISTS =================

    let finalBalance =
      balance


    if (!balance) {

      const {
        data: newBalance,
        error:
          createBalanceError,
      } =
        await supabase
          .from('balances')
          .insert({
            user_id:
              user.id,

            cash: 0,

            gold: 1000,

            shares: 0,

            updated_at:
              new Date().toISOString(),
          })
          .select()
          .single()


      if (
        createBalanceError
      ) {
        console.error(
          '❌ CREATE BALANCE ERROR:',
          JSON.stringify(
            createBalanceError,
            null,
            2
          )
        )
      } else {
        finalBalance =
          newBalance
      }
    }


    // ================= MINING SESSION =================

    const {
      data: session,
      error: sessionError,
    } =
      await supabase
        .from(
          'mining_sessions'
        )
        .select('*')
        .eq(
          'user_id',
          user.id
        )
        .eq(
          'status',
          'active'
        )
        .order(
          'started_at',
          {
            ascending:
              false,
          }
        )
        .limit(1)
        .maybeSingle()


    if (sessionError) {
      console.error(
        '❌ SESSION ERROR:',
        JSON.stringify(
          sessionError,
          null,
          2
        )
      )
    }

        // ================= CURRENT MINING PLAN =================

    let currentMiningPlan = null

    if (session?.mining_plan_id) {
      const {
        data: miningPlan,
        error: miningPlanError,
      } = await supabase
        .from('mining_plans')
        .select('id, name, is_free')
        .eq(
          'id',
          session.mining_plan_id
        )
        .maybeSingle()

      if (miningPlanError) {
        console.error(
          '❌ MINING PLAN ERROR:',
          JSON.stringify(
            miningPlanError,
            null,
            2
          )
        )
      } else {
        currentMiningPlan =
          miningPlan
      }
    }


    // ================= DEPOSITS =================

    const {
      data: deposits,
      error: depositsError,
    } =
      await supabase
        .from('deposits')
        .select('*')
        .eq(
          'user_id',
          user.id
        )
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        )


    if (depositsError) {
      console.error(
        '❌ DEPOSITS ERROR:',
        JSON.stringify(
          depositsError,
          null,
          2
        )
      )
    }


    // ================= WITHDRAWALS =================

    const {
      data: withdrawals,
      error:
        withdrawalsError,
    } =
      await supabase
        .from('withdrawals')
        .select('*')
        .eq(
          'user_id',
          user.id
        )
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        )


    if (withdrawalsError) {
      console.error(
        '❌ WITHDRAWALS ERROR:',
        JSON.stringify(
          withdrawalsError,
          null,
          2
        )
      )
    }


    // ================= TRANSACTIONS =================

    const {
      data: transactions,
      error:
        transactionsError,
    } =
      await supabase
        .from('transactions')
        .select('*')
        .eq(
          'user_id',
          user.id
        )
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        )


    if (transactionsError) {
      console.error(
        '❌ TRANSACTIONS ERROR:',
        JSON.stringify(
          transactionsError,
          null,
          2
        )
      )
    }


    // ================= RETURN UI =================

    return (
      <>
        <DashboardNavbar />

        <ClientDashboard
          profile={{
            ...profile,

            cash:
              Number(
                finalBalance?.cash ||
                  0
              ),

            gold:
              Number(
                finalBalance?.gold ||
                  0
              ),

            shares:
              Number(
                finalBalance?.shares ||
                  0
              ),

            total_balance:
              Number(
                finalBalance?.cash ||
                  0
              ),

            balances: {
              cash:
                Number(
                  finalBalance?.cash ||
                    0
                ),

              gold:
                Number(
                  finalBalance?.gold ||
                    0
                ),

              shares:
                Number(
                  finalBalance?.shares ||
                    0
                ),
            },
          }}

          deposits={
            deposits ?? []
          }

          withdrawals={
            withdrawals ?? []
          }

          transactions={
            transactions ?? []
          }

          session={
            session ?? null
          }

            currentMiningPlan={
            currentMiningPlan
          }

          referralLink={
            referralLink
          }
        />
      </>
    )

  } catch (err: any) {

    if (
      err?.digest &&
      String(
        err.digest
      ).includes(
        'NEXT_REDIRECT'
      )
    ) {
      throw err
    }


    console.error(
      '❌ DASHBOARD SERVER ERROR:',
      JSON.stringify(
        err,
        null,
        2
      )
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
            {
              err?.message ||
              'Unknown server error'
            }
          </pre>

        </div>

      </div>
    )
  }
}