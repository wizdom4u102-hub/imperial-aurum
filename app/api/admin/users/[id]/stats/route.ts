export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdminApi  } from '@/lib/admin'

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    console.log(
      '================ USER STATS API ================'
    )

    // ================= ADMIN =================
    const admin = await requireAdminApi()

    if (!admin.ok) {
      return NextResponse.json(
        {
          error: admin.error,
        },
        {
          status: admin.status,
        }
      )
    }

    // ================= ADMIN CLIENT =================
    const supabase = supabaseAdmin

    // ================= PARAMS =================
    const params = await context.params

    const userId = params?.id

    if (!userId) {
      return NextResponse.json(
        {
          error: 'User ID missing',
        },
        {
          status: 400,
        }
      )
    }

    console.log('USER:', userId)

    // ================= BALANCE =================
    const {
      data: balance,
      error: balanceError,
    } = await supabase
      .from('balances')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    console.log('BALANCE:', balance)
    console.log('BALANCE ERROR:', balanceError)

    // ================= DEPOSITS =================
    const {
      data: deposits,
      error: depositsError,
    } = await supabase
      .from('deposits')
      .select('*')
      .eq('user_id', userId)

    console.log('DEPOSITS:', deposits?.length)
    console.log('DEPOSITS ERROR:', depositsError)

    // ================= WITHDRAWALS =================
    const {
      data: withdrawals,
      error: withdrawalsError,
    } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)

    console.log('WITHDRAWALS:', withdrawals?.length)
    console.log('WITHDRAWALS ERROR:', withdrawalsError)

    // ================= SHARED PLANS =================
    const {
      data: plans,
      error: plansError,
    } = await supabase
      .from('shared_plans')
      .select('*')
      .eq('user_id', userId)

    console.log('PLANS:', plans?.length)
    console.log('PLANS ERROR:', plansError)

    // ================= TRANSACTIONS =================
    const {
      data: transactions,
      error: txError,
    } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)

    console.log('TRANSACTIONS:', transactions?.length)
    console.log('TX ERROR:', txError)

    // ================= CALCULATIONS (FIXED) =================

// helper: safe number
const num = (v: any) => Number(v || 0)

// ================= DEPOSITS =================
const totalDeposits =
  deposits?.reduce((sum: number, item: any) => {
    const status = item.status?.toLowerCase()

    if (
      status === 'approved' ||
      status === 'completed'
    ) {
      return sum + num(item.amount)
    }

    return sum
  }, 0) || 0

// ================= WITHDRAWALS =================
const totalWithdrawals =
  withdrawals?.reduce((sum: number, item: any) => {
    const status = item.status?.toLowerCase()

    if (
      status === 'completed' ||
      status === 'approved' ||
      status === 'success'
    ) {
      return sum + num(item.amount)
    }

    return sum
  }, 0) || 0

// ================= INVESTMENTS =================
const totalInvestments =
  plans?.reduce((sum: number, item: any) => {
    return sum + num(item.amount)
  }, 0) || 0

// ================= ACTIVE SHARES =================
const activeShares =
  plans?.reduce((sum: number, item: any) => {
    const status = item.status?.toLowerCase()

    if (status === 'active') {
      return sum + num(item.amount)
    }

    return sum
  }, 0) || 0

const { data: profile } = await supabase
  .from('profiles')
  .select('status')
  .eq('id', userId)
  .maybeSingle()

// ================= TRANSACTIONS =================
const totalTransactions = transactions?.length || 0


    const stats = {
  cash: num(balance?.cash),
  gold: num(balance?.gold),
  shares: num(balance?.shares),

  totalDeposits,
  totalWithdrawals,
  investments: totalInvestments,
  transactions: totalTransactions,
  activeShares,

  status: profile?.status || 'active',
}

    console.log('FINAL STATS:', stats)

    return NextResponse.json(stats)
  } catch (err: any) {
    console.error(
      'STATS API ERROR:',
      err
    )

    return NextResponse.json(
      {
        error:
          err?.message ||
          'Internal server error',
      },
      {
        status: 500,
      }
    )
  }
}