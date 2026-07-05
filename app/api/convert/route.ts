import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // ================= BODY =================
    const body = await req.json()

    const goldToConvert =
      Number(body.gold)

    if (
      !goldToConvert ||
      goldToConvert <= 0
    ) {
      return NextResponse.json(
        {
          error: 'Invalid amount'
        },
        {
          status: 400
        }
      )
    }

    // ================= USER =================
    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser()

    if (
      userError ||
      !user
    ) {
      return NextResponse.json(
        {
          error: 'Unauthorized'
        },
        {
          status: 401
        }
      )
    }

    // ================= BALANCE =================
    const {
      data: balance,
      error: balError
    } =
      await supabase
        .from('balances')
        .select('*')
        .eq(
          'user_id',
          user.id
        )
        .single()

    if (
      balError ||
      !balance
    ) {
      return NextResponse.json(
        {
          error: 'Balance not found'
        },
        {
          status: 404
        }
      )
    }

    // ================= VALIDATION =================
    const currentGold =
      Number(balance.gold || 0)

    const currentCash =
      Number(balance.cash || 0)

    if (
      currentGold < goldToConvert
    ) {
      return NextResponse.json(
        {
          error:
            'Insufficient gold balance'
        },
        {
          status: 400
        }
      )
    }

    // ================= CONVERSION =================
    const rate = 500

    const cashToAdd =
      goldToConvert / rate

    const newGold =
      currentGold -
      goldToConvert

    const newCash =
      currentCash +
      cashToAdd

    // ================= UPDATE WALLET =================
    const {
      error: updateError
    } =
      await supabase
        .from('balances')
        .update({

          gold: newGold,

          cash: newCash,

          updated_at:
            new Date().toISOString()

        })
        .eq(
          'user_id',
          user.id
        )

    if (updateError) {

      console.error(
        'BALANCE UPDATE ERROR:',
        updateError
      )

      return NextResponse.json(
        {
          error:
            updateError.message
        },
        {
          status: 500
        }
      )
    }

    // ================= SAVE CONVERT HISTORY =================
    // IMPORTANT:
    // DO NOT use "gold" column
    // because it does not exist
    // in transactions table

    const {
      error: txError
    } =
      await supabase
        .from('transactions')
        .insert({

          user_id:
            user.id,

          type:
            'convert',

          // CASH RECEIVED
          amount:
            cashToAdd,

          status:
            'completed',

          description:
            `Converted ${goldToConvert} GOLD into $${cashToAdd.toFixed(2)} CASH`

        })

    if (txError) {

      console.error(
        'TRANSACTION ERROR:',
        txError
      )

      return NextResponse.json(
        {
          error:
            txError.message
        },
        {
          status: 500
        }
      )
    }

    // ================= RESPONSE =================
    return NextResponse.json({

      success: true,

      goldDeducted:
        goldToConvert,

      cashAdded:
        cashToAdd,

      balances: {

        gold:
          newGold,

        cash:
          newCash

      }

    })

  } catch (err: any) {

    console.error(
      'CONVERT API ERROR:',
      err
    )

    return NextResponse.json(
      {
        error:
          err.message ||
          'Server error'
      },
      {
        status: 500
      }
    )
  }
}