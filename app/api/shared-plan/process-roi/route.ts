import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // =====================================================
    // CRON AUTH
    // =====================================================

    const authHeader =
      request.headers.get('authorization')

    if (
      authHeader !==
      `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    console.log(
      '===== SHARE PLAN ROI PROCESSOR START ====='
    )

    // =====================================================
    // GET ACTIVE PLANS
    // =====================================================

    const {
      data: plans,
      error: plansError,
    } = await supabaseAdmin
      .from('shared_plans')
      .select('*')
      .eq('status', 'active')
      .eq('active', true)

    if (plansError) {
      throw new Error(
        plansError.message
      )
    }

    if (
      !plans ||
      plans.length === 0
    ) {
      return NextResponse.json({
        success: true,
        message: 'No active plans',
      })
    }

    // =====================================================
    // PROCESS EACH PLAN
    // =====================================================

    for (const plan of plans) {
      try {
        console.log(
          'PROCESSING PLAN:',
          plan.id
        )

        const amount =
          Number(
            plan.amount || 0
          )

        const roiPercent =
          Number(
            plan.daily_roi || 0
          )

        const durationDays =
          Number(
            plan.duration_days || 30
          )

        const daysCompleted =
          Number(
            plan.days_completed || 0
          )

        if (
          amount <= 0 ||
          roiPercent <= 0 ||
          durationDays <= 0
        ) {
          console.error(
            'INVALID PLAN:',
            plan.id
          )

          continue
        }

        // =================================================
        // TIME CHECK
        // =================================================

        const now =
          new Date()

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

        // =================================================
        // DO NOT PROCESS MORE THAN ONCE PER 24 HOURS
        // =================================================

        if (
          lastProfit &&
          hoursPassed < 24
        ) {
          console.log(
            'LESS THAN 24 HOURS:',
            plan.id
          )

          continue
        }

        // =================================================
        // DETERMINE THIS IS THE FINAL DAY
        // =================================================

        const nextDay =
          daysCompleted + 1

        const isFinalDay =
          nextDay >= durationDays

        console.log(
          'PLAN DAY:',
          {
            planId: plan.id,
            currentDay:
              daysCompleted,
            nextDay,
            durationDays,
            isFinalDay,
          }
        )

        // =================================================
        // CALCULATE DAILY ROI
        // =================================================

        const profit =
          (
            amount *
            roiPercent
          ) / 100

        console.log(
          'DAILY PROFIT:',
          profit
        )

        // =================================================
        // GET USER BALANCE
        // =================================================

        const {
          data: balance,
          error: balanceError,
        } =
          await supabaseAdmin
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
            'BALANCE ERROR:',
            balanceError
          )

          continue
        }

        const currentCash =
          Number(
            balance.cash || 0
          )

        const currentShares =
          Number(
            balance.shares || 0
          )

        // =================================================
        // CREDIT TODAY'S ROI
        // =================================================

        const cashAfterProfit =
          currentCash +
          profit

        const {
          error:
            profitBalanceError,
        } =
          await supabaseAdmin
            .from('balances')
            .update({
              cash:
                cashAfterProfit,

              updated_at:
                now.toISOString(),
            })
            .eq(
              'user_id',
              plan.user_id
            )

        if (
          profitBalanceError
        ) {
          console.error(
            'PROFIT BALANCE ERROR:',
            profitBalanceError
          )

          continue
        }

        // =================================================
        // PROFIT HISTORY
        // =================================================

        const {
          error:
            profitHistoryError,
        } =
          await supabaseAdmin
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

              credited:
                true,

              created_at:
                now.toISOString(),
            })

        if (
          profitHistoryError
        ) {
          console.error(
            'PROFIT HISTORY ERROR:',
            profitHistoryError
          )
        }

        // =================================================
        // ROI TRANSACTION
        // =================================================

        const {
          error:
            roiTransactionError,
        } =
          await supabaseAdmin
            .from('transactions')
            .insert({
              user_id:
                plan.user_id,

              type:
                'roi',

              amount:
                profit,

              status:
                'completed',

              description:
                `Share Plan daily ROI - Day ${nextDay}/${durationDays}`,

              created_at:
                now.toISOString(),
            })

        if (
          roiTransactionError
        ) {
          console.error(
            'ROI TRANSACTION ERROR:',
            roiTransactionError
          )
        }

        // =================================================
        // FINAL DAY
        //
        // The final day's ROI has now been paid.
        // Return the original investment immediately.
        // =================================================

        if (
          isFinalDay
        ) {
          console.log(
            'FINAL DAY REACHED:',
            plan.id
          )

          const principal =
            amount

          const finalCash =
            cashAfterProfit +
            principal

          const finalShares =
            Math.max(
              0,
              currentShares -
                principal
            )

          // ===============================================
          // RETURN PRINCIPAL
          // ===============================================

          const {
            error:
              principalError,
          } =
            await supabaseAdmin
              .from('balances')
              .update({
                cash:
                  finalCash,

                shares:
                  finalShares,

                updated_at:
                  now.toISOString(),
              })
              .eq(
                'user_id',
                plan.user_id
              )

          if (
            principalError
          ) {
            console.error(
              'PRINCIPAL RETURN ERROR:',
              principalError
            )

            continue
          }

          // ===============================================
          // COMPLETE PLAN
          // ===============================================

          const {
            error:
              completeError,
          } =
            await supabaseAdmin
              .from('shared_plans')
              .update({
                status:
                  'completed',

                active:
                  false,

                days_completed:
                  nextDay,

                total_profit_generated:
                  Number(
                    plan.total_profit_generated ||
                      0
                  ) + profit,

                last_profit_at:
                  now.toISOString(),

                updated_at:
                  now.toISOString(),
              })
              .eq(
                'id',
                plan.id
              )
              .eq(
                'status',
                'active'
              )

          if (
            completeError
          ) {
            console.error(
              'PLAN COMPLETION ERROR:',
              completeError
            )

            continue
          }

          // ===============================================
          // PRINCIPAL RETURN TRANSACTION
          // ===============================================

          const {
            error:
              principalTransactionError,
          } =
            await supabaseAdmin
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
                  'Share Plan investment principal returned',

                created_at:
                  now.toISOString(),
              })

          if (
            principalTransactionError
          ) {
            console.error(
              'PRINCIPAL TRANSACTION ERROR:',
              principalTransactionError
            )
          }

          console.log(
            '✅ SHARE PLAN COMPLETED:',
            plan.id
          )

          continue
        }

        // =================================================
        // NORMAL DAY
        // =================================================

        const {
          error:
            planUpdateError,
        } =
          await supabaseAdmin
            .from('shared_plans')
            .update({
              total_profit_generated:
                Number(
                  plan.total_profit_generated ||
                    0
                ) + profit,

              days_completed:
                nextDay,

              last_profit_at:
                now.toISOString(),

              updated_at:
                now.toISOString(),
            })
            .eq(
              'id',
              plan.id
            )
            .eq(
              'status',
              'active'
            )

        if (
          planUpdateError
        ) {
          console.error(
            'PLAN UPDATE ERROR:',
            planUpdateError
          )

          continue
        }

        console.log(
          '✅ ROI CREDITED:',
          {
            planId:
              plan.id,
            day:
              nextDay,
            profit,
          }
        )
      } catch (
        planError
      ) {
        console.error(
          'PLAN PROCESSING ERROR:',
          plan.id,
          planError
        )
      }
    }

    // =====================================================
    // SUCCESS
    // =====================================================

    console.log(
      '===== SHARE PLAN ROI PROCESSOR COMPLETE ====='
    )

    return NextResponse.json({
      success: true,
    })
  } catch (
    err: unknown
  ) {
    console.error(
      'SHARE PLAN ROI PROCESSOR ERROR:',
      err
    )

    const message =
      err instanceof Error
        ? err.message
        : 'Server error'

    return NextResponse.json(
      {
        success: false,
        error:
          message,
      },
      {
        status: 500,
      }
    )
  }
}