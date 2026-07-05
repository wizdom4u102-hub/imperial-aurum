import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: NextRequest) {
  try {
    console.log(
      '================ SHARED PLAN BUY ================'
    )

    const supabase = await createClient()

    // ================= USER =================
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('USER:', user.id)

    // ================= REQUEST =================
    const body = await req.json()

    console.log(
      'REQUEST BODY:',
      body
    )

    const amount =
      Number(body?.amount || 0)

    if (
      !amount ||
      amount < 1000
    ) {
      return NextResponse.json(
        {
          error:
            'Minimum investment is $1000',
        },
        {
          status: 400,
        }
      )
    }

    // ================= BALANCE =================
    const {
      data: balance,
      error: balanceError,
    } = await supabase
      .from('balances')
      .select('*')
      .eq(
        'user_id',
        user.id
      )
      .single()

    if (
      balanceError ||
      !balance
    ) {
      console.error(
        balanceError
      )

      return NextResponse.json(
        {
          error:
            'Balance not found',
        },
        {
          status: 400,
        }
      )
    }

    console.log(
      'ACTIVE BALANCE:',
      balance
    )

    const currentCash =
      Number(
        balance.cash || 0
      )

    if (
      currentCash <
      amount
    ) {
      return NextResponse.json(
        {
          error:
            'Insufficient cash balance',
        },
        {
          status: 400,
        }
      )
    }

   // ================= UPDATE BALANCE =================

const newCash =
  Number(balance.cash || 0) - amount

const newShares =
  Number(balance.shares || 0) + amount

console.log(
  'BEFORE UPDATE:',
  {
    cash: balance.cash,
    shares: balance.shares
  }
)

const {
  data: updatedBalance,
  error: updateError
} = await supabase
.from('balances')
.update({
   cash:newCash,
   shares:newShares,
   updated_at:
   new Date().toISOString()
})
.eq(
   'id',
   balance.id
)
.select(`
 id,
 cash,
 shares,
 updated_at
`)
.single()

console.log(
'AFTER UPDATE:',
updatedBalance
)

if(updateError){

console.error(
'UPDATE ERROR:',
updateError
)

return NextResponse.json(
{
error:updateError.message
},
{
status:500
})
}

    // ================= DATES =================
    const now =
      new Date()

    const endDate =
      new Date()

    endDate.setDate(
      endDate.getDate() + 30
    )

    // ================= CREATE PLAN =================
    const {
      data: plan,
      error: shareError,
    } = await supabase
      .from(
        'shared_plans'
      )
      .insert({
        user_id:
          user.id,

        amount,

        daily_roi: 5,

        duration_days: 30,

        days_completed: 0,

        total_profit_generated: 0,

        status: 'active',

        started_at:
          now.toISOString(),

        ends_at:
          endDate.toISOString(),

        last_profit_at:
          now.toISOString(),

        monthly_roi:150,

        minimum_amount:1000,

        total_invested:
          amount,

        active:true,

        title:
          'Imperial Gold Fund',

        description:
          'Buy company shares and earn monthly returns',

        created_at:
          now.toISOString(),

        updated_at:
          now.toISOString(),
      })
      .select()
      .single()

    // rollback balance if plan fails
    if (shareError) {

      console.error(
        'PLAN ERROR:',
        shareError
      )

      await supabase
        .from(
          'balances'
        )
        .update({
          cash:
            currentCash,

          shares:
            Number(
              balance.shares || 0
            )
        })
        .eq(
          'user_id',
          user.id
        )

      return NextResponse.json(
        {
          error:
            shareError.message,
        },
        {
          status:500
        }
      )
    }

    // ================= TRANSACTION =================
    const {
  data: txData,
  error: txError
} = await supabase
.from('transactions')
.insert({

   user_id:user.id,

   type:'shared_plan',

   amount:amount,

   status:'completed',

   description:
   `Purchased company shares worth $${amount}`,

   created_at: now.toISOString()

})
.select()
.single()

console.log(
'TRANSACTION:',
txData
)

if(txError){

console.error(
'TX ERROR:',
txError
)

}

    return NextResponse.json({
      success:true,

      balance:
        newCash,

      shares:
        newShares,

      investment:
        plan,
    })

  } catch (err:any) {

    console.error(
      'SHARED PLAN ERROR:',
      err
    )

    return NextResponse.json(
      {
        error:
          err.message ||
          'Server error',
      },
      {
        status:500,
      }
    )
  }
}