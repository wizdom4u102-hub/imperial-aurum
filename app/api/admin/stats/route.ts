import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdminApi } from "@/lib/admin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function handler() {
  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { 
        persistSession: false, 
        autoRefreshToken: false 
      },
    })

    const { data: finances, error } = await supabaseAdmin
      .from('balances')
      .select('*')

    if (error) {
      console.error('❌ STATS QUERY ERROR:', error)

      return NextResponse.json(
        {
          error: error.message,
          details: error,
        },
        { status: 500 }
      )
    }

    const stats = {
      totalBalance: finances?.reduce((s, f) => s + Number(f.total_balance || 0), 0) || 0,
      totalPaidPlan: finances?.reduce((s, f) => s + Number(f.total_paid_plan || 0), 0) || 0,
      totalSharedPlan: finances?.reduce((s, f) => s + Number(f.total_shared_plan || 0), 0) || 0,
      totalInvestment: finances?.reduce((s, f) => s + Number(f.total_investment || 0), 0) || 0,
      currentInvestment: finances?.reduce((s, f) => s + Number(f.current_investment || 0), 0) || 0,
      totalInterest: finances?.reduce((s, f) => s + Number(f.total_interest || 0), 0) || 0,
      totalBonus: finances?.reduce((s, f) => s + Number(f.total_bonus || 0), 0) || 0,
      confirmedWithdrawals: finances?.reduce((s, f) => s + Number(f.confirmed_withdrawals || 0), 0) || 0,
      pendingWithdrawals: finances?.reduce((s, f) => s + Number(f.pending_withdrawals || 0), 0) || 0,
    }

    return NextResponse.json(stats)
  } catch (err: any) {
    console.error('❌ STATS CRASH:', err)

    return NextResponse.json(
      {
        error: err?.message || 'Failed to load stats',
      },
      { status: 500 }
    )
  }
}

// ✅ FIXED EXPORT
export async function GET() {
  const auth = await requireAdminApi();

  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error || 'Unauthorized' },
      { status: auth.status || 401 }
    );
  }

  return handler();
}