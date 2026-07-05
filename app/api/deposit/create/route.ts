import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // ================= AUTH =================
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    // ================= BODY =================
    const body = await req.json()

    const {
      amount,
      method_id,
    } = body

    // ================= VALIDATION =================
    if (
      !amount ||
      Number(amount) <= 0
    ) {
      return NextResponse.json(
        {
          error: 'Invalid amount',
        },
        {
          status: 400,
        }
      )
    }

    if (!method_id) {
      return NextResponse.json(
        {
          error: 'Payment method required',
        },
        {
          status: 400,
        }
      )
    }

    // ================= CREATE DEPOSIT =================
    const {
      data: deposit,
      error: depositError,
    } = await supabase
      .from('deposits')
      .insert({
        user_id: user.id,

        amount: Number(amount),

        method_id,

        status: 'pending',

        created_at:
          new Date().toISOString(),
      })
      .select()
      .single()

    if (depositError) {
      console.error(
        'DEPOSIT INSERT ERROR:',
        depositError
      )

      return NextResponse.json(
        {
          error:
            depositError.message,
        },
        {
          status: 500,
        }
      )
    }

    // ================= TRANSACTION HISTORY =================

const {
  error: txError,
} = await supabase
  .from('transactions')
  .insert({

    // IMPORTANT
    // link transaction to deposit
    deposit_id:
      deposit.id,

    user_id:
      user.id,

    type:
      'deposit',

    amount:
      Number(amount),

    status:
      'pending',

    description:
      `Deposit request of $${Number(amount)} submitted`,

    created_at:
      new Date().toISOString(),

  })

if (txError) {

  console.error(
    'TRANSACTION INSERT ERROR:',
    txError
  )

}

    // ================= SUCCESS =================
    return NextResponse.json({
      success: true,
      deposit,
    })

  } catch (err: any) {

    console.error(
      'DEPOSIT API ERROR:',
      err
    )

    return NextResponse.json(
      {
        error:
          err.message ||
          'Server error',
      },
      {
        status: 500,
      }
    )
  }
}