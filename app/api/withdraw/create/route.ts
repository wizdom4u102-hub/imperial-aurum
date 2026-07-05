import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // 🔐 AUTH
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 📦 BODY
    const body = await req.json()
    const { amount, method_id } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    if (!method_id) {
      return NextResponse.json(
        { error: 'Select withdrawal method' },
        { status: 400 }
      )
    }

    // ✅ FIXED BALANCE CHECK
    const { data: balance } = await supabase
      .from('balances')
      .select('cash')
      .eq('user_id', user.id)
      .single()

    const currentBalance = Number(balance?.cash || 0)

    if (currentBalance < Number(amount)) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    // 🧾 CREATE WITHDRAWAL
    const { error } = await supabase.from('withdrawals').insert({
      user_id: user.id,
      amount,
      method_id,
      status: 'pending',
    })

    if (error) {
      console.error('WITHDRAW ERROR:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted',
    })
  } catch (err: any) {
    console.error('WITHDRAW API ERROR:', err)

    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}