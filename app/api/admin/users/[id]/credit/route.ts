import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const adminDb = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ GET USER ID
    const { id: userId } = await params

    // ✅ AUTH CHECK
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.email !== 'admin@imperialaurum.com') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // ✅ REQUEST BODY
    const body = await req.json()

    const amount = Number(body.amount)

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // ✅ GET USER BALANCE
    const { data: balance, error: balanceError } =
      await adminDb
        .from('balances')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

    if (balanceError) {
      console.error('BALANCE FETCH ERROR:', balanceError)

      return NextResponse.json(
        { error: balanceError.message },
        { status: 500 }
      )
    }

    // ✅ UPDATE EXISTING BALANCE
    if (balance) {
      const newCash =
        Number(balance.cash || 0) + amount

      const { error: updateError } =
        await adminDb
          .from('balances')
          .update({
            cash: newCash,
          })
          .eq('user_id', userId)

      if (updateError) {
        console.error('BALANCE UPDATE ERROR:', updateError)

        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        )
      }

    } else {

      // ✅ CREATE BALANCE ROW
      const { error: insertError } =
        await adminDb
          .from('balances')
          .insert({
            user_id: userId,
            cash: amount,
            gold: 0,
            shares: 0,
          })

      if (insertError) {
        console.error('BALANCE INSERT ERROR:', insertError)

        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        )
      }
    }

    // ✅ INSERT TRANSACTION
    const { error: txError } =
      await adminDb
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'credit',
          amount,
          status: 'completed',
          description: 'Admin credited account',
        })

    if (txError) {
      console.error('TRANSACTION ERROR:', txError)

      return NextResponse.json(
        { error: txError.message },
        { status: 500 }
      )
    }

    // ✅ SUCCESS
    return NextResponse.json({
      success: true,
    })

  } catch (err: any) {
    console.error('CREDIT ERROR:', err)

    return NextResponse.json(
      {
        error: err.message || 'Server error',
      },
      {
        status: 500,
      }
    )
  }
}