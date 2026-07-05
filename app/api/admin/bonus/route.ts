import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdminApi } from "@/lib/admin";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

async function handler(req: NextRequest) {
  try {
    const { userId, amount, description } = await req.json()

    const bonusAmount = Number(amount)

    if (!userId || bonusAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid userId or amount' },
        { status: 400 }
      )
    }

    // ================= BALANCE =================
    const { data: balance, error: balanceError } = await supabaseAdmin
      .from('balances')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (balanceError) {
      return NextResponse.json(
        { error: balanceError.message },
        { status: 500 }
      )
    }

    if (!balance) {
      const { error: createError } = await supabaseAdmin
        .from('balances')
        .insert({
          user_id: userId,
          cash: bonusAmount,
          gold: 0,
          shares: 0,
          updated_at: new Date().toISOString(),
        })

      if (createError) {
        return NextResponse.json(
          { error: createError.message },
          { status: 500 }
        )
      }
    } else {
      const { error: updateError } = await supabaseAdmin
        .from('balances')
        .update({
          cash: Number(balance.cash || 0) + bonusAmount,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        )
      }
    }

    // ================= TRANSACTION =================
    await supabaseAdmin.from('transactions').insert({
      user_id: userId,
      type: 'bonus',
      amount: bonusAmount,
      status: 'completed',
      description: description || 'Bonus credited by admin',
    })

    return NextResponse.json({
      success: true,
      message: 'Bonus credited successfully',
    })

  } catch (err: any) {
    console.error(err)

    return NextResponse.json(
      { error: err.message || 'Failed to credit bonus' },
      { status: 500 }
    )
  }
}

// ✅ FIX: remove withAdminAuth completely
export const POST = async (req: NextRequest) => {
  const admin = await requireAdminApi()

  if (!admin.ok) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return handler(req)
}