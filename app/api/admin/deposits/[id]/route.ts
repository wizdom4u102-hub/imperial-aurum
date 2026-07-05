import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id: depositId } = await params

    // ✅ 1. GET DEPOSIT
    const { data: deposit, error: depositError } = await supabase
      .from('deposits')
      .select('*')
      .eq('id', depositId)
      .single()

    if (depositError || !deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 })
    }

    // ❗ IMPORTANT: PREVENT DOUBLE CREDIT
    if (
  deposit.status === 'completed' ||
  deposit.status === 'approved'
) 
      {
      return NextResponse.json({
        error: 'Deposit already processed',
      }, { status: 400 })
    }

    // ✅ 2. GET USER BALANCE
    const { data: balance } = await supabase
      .from('balances')
      .select('*')
      .eq('user_id', deposit.user_id)
      .maybeSingle()

    const amount = Number(deposit.amount)

    // ✅ 3. UPDATE OR CREATE BALANCE
    if (balance) {
      const { error: updateError } = await supabase
        .from('balances')
        .update({
          cash: Number(balance.cash || 0) + amount,
        })
        .eq('user_id', deposit.user_id)

      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase
        .from('balances')
        .insert({
          user_id: deposit.user_id,
          cash: amount,
          gold: 0,
        })

      if (insertError) throw insertError
    }

    // ✅ 4. MARK DEPOSIT COMPLETED (CRITICAL)
    const { error: statusError } = await supabase
      .from('deposits')
      .update({
        status: 'completed',
      })
      .eq('id', depositId)

    if (statusError) throw statusError

    // ✅ 5. LOG TRANSACTION (ALWAYS)
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: deposit.user_id,
        type: 'deposit',
        amount: amount,
        status: 'completed',
        description: 'Deposit approved by admin',
      })

    if (txError) throw txError

    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.error('DEPOSIT APPROVAL ERROR:', err)

    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}