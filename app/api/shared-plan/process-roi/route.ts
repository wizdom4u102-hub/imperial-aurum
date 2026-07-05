import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('===== ROI PROCESSOR START =====')

    const supabase = supabaseAdmin

    const {
      data: plans,
      error: plansError,
    } = await supabase
      .from('shared_plans')
      .select('*')
      .eq('status', 'active')

    if (plansError) {
      throw new Error(plansError.message)
    }

    if (!plans || plans.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active plans',
      })
    }

    for (const plan of plans) {

  console.log(
    'PROCESSING PLAN:',
    plan.id,
    {
      status: plan.status,
      days_completed: plan.days_completed,
      duration_days: plan.duration_days,
      amount: plan.amount,
    }
  )

      try {
        const amount = Number(
          plan.amount || 0
        )

        const roiPercent = Number(
          plan.daily_roi || 0
        )

        if (
          amount <= 0 ||
          roiPercent <= 0
        ) {
          continue
        }

        const now = new Date()

        const lastProfit =
          plan.last_profit_at
            ? new Date(
                plan.last_profit_at
              )
            : null

        const hoursPassed =
          lastProfit
            ? (
                now.getTime() -
                lastProfit.getTime()
              ) /
              (1000 * 60 * 60)
            : 999999

       

        // ==========================
        // GET BALANCE
        // ==========================

        const {
          data: balance,
          error: balanceError,
        } = await supabase
          .from('balances')
          .select('*')
          .eq(
            'user_id',
            plan.user_id
          )
          .single()

        if (
          balanceError ||
          !balance
        ) {
          console.error(
            'Balance error:',
            balanceError
          )

          continue
        }

        // ==========================
// PLAN COMPLETION
// ==========================

if (
  Number(plan.days_completed || 0) >=
  Number(plan.duration_days || 30)
) {
  console.log(
    'ENTERING COMPLETION BLOCK',
    {
      planId: plan.id,
      days_completed:
        plan.days_completed,
      duration_days:
        plan.duration_days,
      amount:
        plan.amount,
    }
  )

  const principal =
    Number(plan.amount || 0)

  const currentCash =
    Number(balance.cash || 0)

  const currentShares =
    Number(balance.shares || 0)

  const {
    data: returnedBalance,
    error: returnError,
  } = await supabase
    .from('balances')
    .update({
      cash:
        currentCash +
        principal,

      shares: Math.max(
        0,
        currentShares -
          principal
      ),

      updated_at:
        new Date().toISOString(),
    })
    .eq(
      'user_id',
      plan.user_id
    )
    .select()

  console.log(
    'BALANCE RETURN RESULT:',
    returnedBalance
  )

  console.log(
    'BALANCE RETURN ERROR:',
    returnError
  )

  if (returnError) {
    continue
  }

  const {
    data: completedPlan,
    error: completeError,
  } = await supabase
    .from('shared_plans')
    .update({
      status: 'completed',
      active: false,
      updated_at:
        new Date().toISOString(),
    })
    .eq('id', plan.id)
    .select()

  console.log(
    'COMPLETE UPDATE RESULT:',
    completedPlan
  )

  console.log(
    'COMPLETE UPDATE ERROR:',
    completeError
  )

  if (completeError) {
    continue
  }

  await supabase
    .from('transactions')
    .insert({
      user_id:
        plan.user_id,

      type:
        'shared_plan_completed',

      amount:
        principal,

      status:
        'completed',

      description:
        'Investment principal returned',

      created_at:
        new Date().toISOString(),
    })

  console.log(
    'PLAN COMPLETED:',
    plan.id
  )

  continue
   }

    // ==========================
        // ONLY ONCE EVERY 24 HOURS
        // ==========================

        if (
          lastProfit &&
          hoursPassed < 24
        ) {
          continue
        }
        

        // ==========================
        // CALCULATE PROFIT
        // ==========================

        const profit =
          (amount *
            roiPercent) /
          100

        console.log(
          'PROFIT:',
          profit
        )

        // ==========================
        // CREDIT CASH
        // ==========================

        const {
          error: walletError,
        } = await supabase
          .from('balances')
          .update({
            cash:
              Number(
                balance.cash || 0
              ) + profit,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            'user_id',
            plan.user_id
          )

        if (walletError) {
          console.error(
            walletError
          )

          continue
        }

        // ==========================
        // PROFIT HISTORY
        // ==========================

        const {
          error: profitError,
        } = await supabase
          .from(
            'shared_plan_profits'
          )
          .insert({
            user_id:
              plan.user_id,

            shared_plan_id:
              plan.id,

            amount:
              profit,

            roi_percent:
              roiPercent,

            credited: true,

            created_at:
              new Date().toISOString(),
          })

        if (profitError) {
          console.error(
            profitError
          )
        }

        // ==========================
        // UPDATE PLAN
        // ==========================

        await supabase
          .from('shared_plans')
          .update({
            total_profit_generated:
              Number(
                plan.total_profit_generated ||
                  0
              ) + profit,

            days_completed:
              Number(
                plan.days_completed ||
                  0
              ) + 1,

            last_profit_at:
              new Date().toISOString(),

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            'id',
            plan.id
          )

        // ==========================
        // TRANSACTION
        // ==========================

        await supabase
          .from('transactions')
          .insert({
            user_id:
              plan.user_id,

            type: 'roi',

            amount:
              profit,

            status:
              'completed',

            description:
              'Shared plan ROI credited',

            created_at:
              new Date().toISOString(),
          })

        console.log(
          'ROI CREDITED:',
          plan.id
        )
      } catch (planError) {
        console.error(
          'PLAN ERROR:',
          plan.id,
          planError
        )
      }
    }

    return NextResponse.json({
      success: true,
    })
  } catch (err: any) {
    console.error(
      'ROI PROCESSOR ERROR:',
      err
    )

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    )
  }
}