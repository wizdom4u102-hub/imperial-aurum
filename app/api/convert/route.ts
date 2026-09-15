import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/sendEmail'
import { goldConversionEmail } from '@/lib/email/templates'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // ================= BODY =================

    const body = await req.json()

    const goldToConvert = Number(body.gold)

    if (!Number.isFinite(goldToConvert) || goldToConvert <= 0) {
      return NextResponse.json(
        {
          error: 'Invalid amount',
        },
        {
          status: 400,
        }
      )
    }

    // ================= MINIMUM CONVERSION =================

    if (goldToConvert < 1000) {
      return NextResponse.json(
        {
          error: 'Minimum conversion amount is 1,000 Gold',
        },
        {
          status: 400,
        }
      )
    }

    // ================= USER =================

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

    // ================= BALANCE =================

    const {
      data: balance,
      error: balError,
    } = await supabase
      .from('balances')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (balError || !balance) {
      return NextResponse.json(
        {
          error: 'Balance not found',
        },
        {
          status: 404,
        }
      )
    }

    // ================= CURRENT BALANCES =================

    const currentGold = Number(balance.gold || 0)

    const currentCash = Number(balance.cash || 0)

    // ================= VALIDATION =================

    if (currentGold < goldToConvert) {
      return NextResponse.json(
        {
          error: 'Insufficient gold balance',
        },
        {
          status: 400,
        }
      )
    }

    // ================= CONVERSION =================
    //
    // 1,000 GOLD = $1
    //

    const rate = 1000

    const cashToAdd = goldToConvert / rate

    const newGold = currentGold - goldToConvert

    const newCash = currentCash + cashToAdd

    // ================= UPDATE BALANCE =================

    const {
      error: updateError,
    } = await supabase
      .from('balances')
      .update({
        gold: newGold,
        cash: newCash,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (updateError) {
      console.error(
        'BALANCE UPDATE ERROR:',
        updateError
      )

      return NextResponse.json(
        {
          error: updateError.message,
        },
        {
          status: 500,
        }
      )
    }

    // ================= SAVE TRANSACTION =================

    const {
      error: txError,
    } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'convert',
        amount: cashToAdd,
        status: 'completed',
        description:
          `Converted ${goldToConvert} GOLD into $${cashToAdd.toFixed(2)} CASH`,
      })

    if (txError) {
      console.error(
        'TRANSACTION ERROR:',
        txError
      )

      return NextResponse.json(
        {
          error: txError.message,
        },
        {
          status: 500,
        }
      )
    }

    // ================= USER EMAIL =================

    const email = user.email

    if (email) {
      const name =
        typeof user.user_metadata?.username === 'string'
          ? user.user_metadata.username
          : typeof user.user_metadata?.name === 'string'
            ? user.user_metadata.name
            : email

      const emailHtml = goldConversionEmail({
        name,
        goldConverted: goldToConvert,
        cashAdded: cashToAdd,
        remainingGold: newGold,
        newCashBalance: newCash,
      })

      const emailResult = await sendEmail({
        to: email,
        subject: 'Gold Conversion Successful - Imperial Aurum Mining',
        html: emailHtml,
      })

      if (!emailResult.success) {
        console.error(
          'GOLD CONVERSION EMAIL ERROR:',
          emailResult.error
        )
      }
    }

    // ================= RESPONSE =================

    return NextResponse.json({
      success: true,

      goldDeducted: goldToConvert,

      cashAdded: cashToAdd,

      balances: {
        gold: newGold,
        cash: newCash,
      },
    })
  } catch (err: unknown) {
    console.error(
      'CONVERT API ERROR:',
      err
    )

    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Server error'

    return NextResponse.json(
      {
        error: errorMessage,
      },
      {
        status: 500,
      }
    )
  }
}