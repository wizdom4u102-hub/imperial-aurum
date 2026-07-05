import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdminApi } from "@/lib/admin";
import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

async function handler(req: NextRequest) {
  try {
    const { userId, amount } = await req.json()

    if (!userId || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: 'userId and amount > 0 required' },
        { status: 400 }
      )
    }

    const creditAmount = Number(amount)

    // ================= GET BALANCE =================
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

    // ================= UPDATE / INSERT =================
    if (balance) {
      const { error: updateError } = await supabaseAdmin
        .from('balances')
        .update({
          cash: Number(balance.cash || 0) + creditAmount,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        )
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('balances')
        .insert({
          user_id: userId,
          cash: creditAmount,
          gold: 0,
          shares: 0,
          updated_at: new Date().toISOString(),
        })

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        )
      }
    }

    // ================= TRANSACTION =================
    const { error: txError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'credit',
        amount: creditAmount,
        status: 'completed',
        description: `Admin credited $${creditAmount}`,
        created_at: new Date().toISOString(),
      })

    if (txError) {
      console.error('TX ERROR:', txError)
    }

    // ================= REFRESH =================
    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidatePath(`/admin/users/${userId}`)

    return NextResponse.json({
      success: true,
      message: `$${creditAmount} credited successfully`,
    })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}

// ✅ FIX: remove withAdminAuth completely
export const POST = async (req: NextRequest) => {
  const admin = await requireAdminApi()

  if (!admin.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return handler(req)
}