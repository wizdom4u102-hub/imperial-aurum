export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { processReferral } from '@/lib/referral/processReferral'
import { sendEmail } from '@/lib/email/sendEmail'
import { depositApprovedEmail } from '@/lib/email/templates'

export async function POST(
  req: Request,
  context: {
    params: Promise<{ id: string }>
  }
) {
  try {
    console.log(
      '=========== APPROVE DEPOSIT =========='
    )

    // =====================================================
    // ADMIN AUTH
    // =====================================================

    const admin =
      await requireAdminApi()

    if (!admin.ok) {
      return NextResponse.json(
        {
          error: admin.error,
        },
        {
          status: admin.status,
        }
      )
    }

    // =====================================================
    // PARAMS
    // =====================================================

    const { id } =
      await context.params

    console.log(
      'DEPOSIT ID:',
      id
    )

    // =====================================================
    // GET DEPOSIT
    // =====================================================

    const {
      data: deposit,
      error: depositError,
    } =
      await supabaseAdmin
        .from('deposits')
        .select('*')
        .eq('id', id)
        .single()

    if (
      depositError ||
      !deposit
    ) {
      console.error(
        'DEPOSIT LOOKUP ERROR:',
        depositError
      )

      return NextResponse.json(
        {
          error:
            'Deposit not found',
        },
        {
          status: 404,
        }
      )
    }

    console.log(
      'DEPOSIT:',
      deposit
    )

    // =====================================================
    // PREVENT DOUBLE APPROVAL
    // =====================================================

    if (
      deposit.status ===
        'completed' ||
      deposit.status ===
        'approved'
    ) {
      return NextResponse.json(
        {
          error:
            'Deposit already approved',
        },
        {
          status: 400,
        }
      )
    }

    if (
      deposit.status !==
      'pending'
    ) {
      return NextResponse.json(
        {
          error:
            `Deposit cannot be approved because its current status is "${deposit.status}".`,
        },
        {
          status: 400,
        }
      )
    }

    // =====================================================
    // VALIDATE USER
    // =====================================================

    if (!deposit.user_id) {
      return NextResponse.json(
        {
          error:
            'Deposit has no associated user.',
        },
        {
          status: 400,
        }
      )
    }

    const userId =
      deposit.user_id

    const amount =
      Number(
        deposit.amount || 0
      )

    if (
      amount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid deposit amount.',
        },
        {
          status: 400,
        }
      )
    }

    const now =
      new Date()

    // =====================================================
    // USER EMAIL
    // =====================================================

    const {
      data: authUser,
    } =
      await supabaseAdmin.auth.admin.getUserById(
        userId
      )

    const userEmail =
      authUser.user?.email

    // =====================================================
    // SHARE PLAN DEPOSIT
    // =====================================================

    if (
      deposit.shared_plan_id
    ) {
      console.log(
        'SHARE PLAN DEPOSIT:',
        deposit.shared_plan_id
      )

      // ===================================================
      // GET SHARE PLAN
      // ===================================================

      const {
        data: plan,
        error: planError,
      } =
        await supabaseAdmin
          .from('shared_plans')
          .select('*')
          .eq(
            'id',
            deposit.shared_plan_id
          )
          .eq(
            'user_id',
            userId
          )
          .single()

      if (
        planError ||
        !plan
      ) {
        console.error(
          'SHARE PLAN NOT FOUND:',
          planError
        )

        return NextResponse.json(
          {
            error:
              'The Share Plan associated with this deposit was not found.',
          },
          {
            status: 404,
          }
        )
      }

      // ===================================================
      // PREVENT DOUBLE ACTIVATION
      // ===================================================

      if (
        plan.status ===
          'active' ||
        plan.status ===
          'completed'
      ) {
        return NextResponse.json(
          {
            error:
              'This Share Plan has already been processed.',
          },
          {
            status: 400,
          }
        )
      }

      // ===================================================
      // VERIFY AMOUNT
      // ===================================================

      if (
        Number(
          plan.amount || 0
        ) !== amount
      ) {
        return NextResponse.json(
          {
            error:
              'Deposit amount does not match the Share Plan investment amount.',
          },
          {
            status: 400,
          }
        )
      }

      // ===================================================
      // ACTIVATE SHARE PLAN
      // ===================================================

      const durationDays =
        Number(
          plan.duration_days || 30
        )

      const startedAt =
        now

      const endsAt =
        new Date(
          startedAt.getTime() +
            durationDays *
              24 *
              60 *
              60 *
              1000
        )

      const {
        data: activatedPlan,
        error: activationError,
      } =
        await supabaseAdmin
          .from('shared_plans')
          .update({
            status:
              'active',

            active:
              true,

            started_at:
              startedAt.toISOString(),

            ends_at:
              endsAt.toISOString(),

            last_profit_at:
              startedAt.toISOString(),

            days_completed:
              0,

            total_profit_generated:
              0,

            updated_at:
              startedAt.toISOString(),
          })
          .eq(
            'id',
            plan.id
          )
          .eq(
            'status',
            'pending'
          )
          .eq(
            'active',
            false
          )
          .select()
          .single()

      if (
        activationError ||
        !activatedPlan
      ) {
        console.error(
          'SHARE PLAN ACTIVATION ERROR:',
          activationError
        )

        return NextResponse.json(
          {
            error:
              activationError?.message ||
              'Failed to activate Share Plan.',
          },
          {
            status: 500,
          }
        )
      }

      // ===================================================
      // MARK DEPOSIT COMPLETED
      // ===================================================

      const {
        error: depositUpdateError,
      } =
        await supabaseAdmin
          .from('deposits')
          .update({
            status:
              'completed',

            updated_at:
              now.toISOString(),
          })
          .eq(
            'id',
            id
          )
          .eq(
            'status',
            'pending'
          )

      if (
        depositUpdateError
      ) {
        console.error(
          'SHARE PLAN DEPOSIT UPDATE ERROR:',
          depositUpdateError
        )

        return NextResponse.json(
          {
            error:
              depositUpdateError.message,
          },
          {
            status: 500,
          }
        )
      }

      // ===================================================
      // COMPLETE SHARE PLAN TRANSACTION
      // ===================================================

      const {
        data: sharePlanTransaction,
        error:
          sharePlanTransactionError,
      } =
        await supabaseAdmin
          .from('transactions')
          .select('id')
          .eq(
            'reference_id',
            id
          )
          .eq(
            'user_id',
            userId
          )
          .eq(
            'status',
            'pending'
          )
          .maybeSingle()

      if (
        sharePlanTransactionError
      ) {
        console.error(
          'SHARE PLAN TRANSACTION LOOKUP ERROR:',
          sharePlanTransactionError
        )
      }

      if (
        sharePlanTransaction
      ) {
        const {
          error:
            transactionUpdateError,
        } =
          await supabaseAdmin
            .from('transactions')
            .update({
              status:
                'completed',

              description:
                `Share Plan investment of $${amount} approved`,
            })
            .eq(
              'id',
              sharePlanTransaction.id
            )

        if (
          transactionUpdateError
        ) {
          console.error(
            'SHARE PLAN TRANSACTION UPDATE ERROR:',
            transactionUpdateError
          )
        }
      } else {
        console.log(
          'No pending Share Plan transaction found by reference.'
        )
      }

      // ===================================================
      // REFERRAL
      // ===================================================

      try {
        await processReferral({
          userId,
          depositId:
            id,
          amount,
        })
      } catch (
        referralError
      ) {
        console.error(
          'SHARE PLAN REFERRAL ERROR:',
          referralError
        )
      }

      // ===================================================
      // EMAIL
      // =====================================================

      try {
        if (userEmail) {
          await sendEmail({
            to:
              userEmail,

            subject:
              'Share Plan Activated',

            html:
              depositApprovedEmail(
                amount
              ),
          })
        }
      } catch (
        emailError
      ) {
        console.error(
          'SHARE PLAN APPROVAL EMAIL ERROR:',
          emailError
        )
      }

      console.log(
        '✅ SHARE PLAN ACTIVATED:',
        activatedPlan.id
      )

      // IMPORTANT:
      // Share Plan deposits do NOT enter balances.cash.

      return NextResponse.json({
        success:
          true,

        type:
          'shared_plan',

        plan:
          activatedPlan,
      })
    }

    // =====================================================
    // PAID MINING PLAN DEPOSIT
    // =====================================================

    if (
      deposit.mining_plan_id
    ) {
      console.log(
        'MINING PLAN DEPOSIT:',
        deposit.mining_plan_id
      )

      // ===================================================
      // GET MINING PLAN
      // ===================================================

      const {
        data: miningPlan,
        error:
          miningPlanError,
      } =
        await supabaseAdmin
          .from('mining_plans')
          .select('*')
          .eq(
            'id',
            deposit.mining_plan_id
          )
          .eq(
            'is_active',
            true
          )
          .single()

      if (
        miningPlanError ||
        !miningPlan
      ) {
        console.error(
          'MINING PLAN LOOKUP ERROR:',
          miningPlanError
        )

        return NextResponse.json(
          {
            error:
              'The Mining Plan associated with this deposit was not found or is inactive.',
          },
          {
            status: 400,
          }
        )
      }

      // ===================================================
      // VERIFY INVESTMENT RANGE
      // ===================================================

      const minimumAmount =
        Number(
          miningPlan.minimum_amount ||
            0
        )

      const maximumAmount =
        Number(
          miningPlan.maximum_amount ||
            0
        )

      if (
        amount <
          minimumAmount ||
        amount >
          maximumAmount
      ) {
        return NextResponse.json(
          {
            error:
              'Deposit amount does not match the selected Mining Plan.',
          },
          {
            status: 400,
          }
        )
      }

      // ===================================================
      // CALCULATE DAILY GOLD
      // ===================================================

      const goldPerDollar =
        Number(
          miningPlan.gold_per_dollar ||
            0
        )

      if (
        goldPerDollar <= 0
      ) {
        return NextResponse.json(
          {
            error:
              'The selected Mining Plan has an invalid mining rate.',
          },
          {
            status: 400,
          }
        )
      }

      const dailyGold =
        amount *
        goldPerDollar

      const durationDays =
  Number(miningPlan.duration_days)

if (
  !Number.isInteger(durationDays) ||
  durationDays <= 0
) {
  return NextResponse.json(
    {
      error:
        'The selected Mining Plan has an invalid duration.',
    },
    {
      status: 400,
    }
  )
}

const secondsPerDay =
  24 *
  60 *
  60

const miningSessionSeconds =
  secondsPerDay

const ratePerSecond =
  dailyGold /
  secondsPerDay

const miningStart =
  now

const miningEnd =
  new Date(
    miningStart.getTime() +
      secondsPerDay *
        1000
  )

      console.log(
        'MINING CALCULATION:',
        {
          plan:
            miningPlan.name,

          amount,

          goldPerDollar,

          dailyGold,

          ratePerSecond,

          miningStart:
            miningStart.toISOString(),

          miningEnd:
            miningEnd.toISOString(),
        }
      )

      // ===================================================
      // FIND CURRENT ACTIVE MINING SESSION
      // ===================================================

      const {
        data: existingMiningSession,
        error:
          existingMiningSessionError,
      } =
        await supabaseAdmin
          .from('mining_sessions')
          .select('*')
          .eq(
            'user_id',
            userId
          )
          .eq(
            'active',
            true
          )
          .maybeSingle()

      if (
        existingMiningSessionError
      ) {
        console.error(
          'EXISTING MINING SESSION ERROR:',
          existingMiningSessionError
        )

        return NextResponse.json(
          {
            error:
              existingMiningSessionError.message,
          },
          {
            status: 500,
          }
        )
      }

            // ===================================================
      // ADD TO EXISTING MINING SESSION OR CREATE NEW ONE
      //
      // IMPORTANT:
      // Additional approved mining deposits are added to
      // the user's existing mining power.
      //
      // The combined investment determines the highest
      // Mining Plan the user qualifies for.
      //
      // The active mining session is updated instead of
      // creating duplicate active sessions.
      //
      // When the applicable plan changes, its configured
      // duration starts again from this deposit approval.
      //
      // A user can move UP to a higher plan but can never
      // move DOWN to a lower plan while the current mining
      // position is active.
      // ===================================================

      let newMiningSession

      if (existingMiningSession) {
        // =================================================
        // CURRENT INVESTMENT
        // =================================================

        const currentInvestment =
          Number(
            existingMiningSession.investment_amount ||
              0
          )

        const combinedInvestment =
          currentInvestment +
          amount

        // =================================================
        // FIND HIGHEST ELIGIBLE PAID MINING PLAN
        // =================================================

        const {
          data: eligiblePlans,
          error: eligiblePlansError,
        } = await supabaseAdmin
          .from('mining_plans')
          .select('*')
          .eq(
            'is_active',
            true
          )
          .eq(
            'is_free',
            false
          )
          .lte(
            'minimum_amount',
            combinedInvestment
          )
          .order(
            'minimum_amount',
            {
              ascending: false,
            }
          )

        if (eligiblePlansError) {
          console.error(
            'ELIGIBLE MINING PLANS ERROR:',
            eligiblePlansError
          )

          return NextResponse.json(
            {
              error:
                eligiblePlansError.message,
            },
            {
              status: 500,
            }
          )
        }

        const eligiblePlan =
          eligiblePlans?.find(
            (plan) =>
              combinedInvestment >=
                Number(
                  plan.minimum_amount || 0
                ) &&
              combinedInvestment <=
                Number(
                  plan.maximum_amount || 0
                )
          )

        if (!eligiblePlan) {
          return NextResponse.json(
            {
              error:
                'The combined mining investment does not match any active Mining Plan.',
            },
            {
              status: 400,
            }
          )
        }

        // =================================================
        // PREVENT DOWNGRADE
        // =================================================

        const currentPlanId =
          existingMiningSession.mining_plan_id

        const currentPlan =
          currentPlanId
            ? eligiblePlans?.find(
                (plan) =>
                  plan.id ===
                  currentPlanId
              )
            : null

        const currentPlanMinimum =
          currentPlan
            ? Number(
                currentPlan.minimum_amount ||
                  0
              )
            : 0

        const selectedPlanMinimum =
          Number(
            eligiblePlan.minimum_amount ||
              0
          )

        const activePlan =
          currentPlan &&
          selectedPlanMinimum <
            currentPlanMinimum
            ? currentPlan
            : eligiblePlan

        // =================================================
        // PLAN VALUES
        // =================================================

        const activeGoldPerDollar =
          Number(
            activePlan.gold_per_dollar ||
              0
          )

        if (
          activeGoldPerDollar <= 0
        ) {
          return NextResponse.json(
            {
              error:
                'The applicable Mining Plan has an invalid mining rate.',
            },
            {
              status: 400,
            }
          )
        }

        const activeDurationDays =
          Number(
            activePlan.duration_days
          )

        if (
          !Number.isInteger(
            activeDurationDays
          ) ||
          activeDurationDays <= 0
        ) {
          return NextResponse.json(
            {
              error:
                'The applicable Mining Plan has an invalid duration.',
            },
            {
              status: 400,
            }
          )
        }

        // =================================================
        // SETTLE EARNINGS BEFORE CHANGING MINING POWER
        //
        // Earnings already accumulated since the last
        // claim remain calculated using the old rate.
        // =================================================

        const lastClaimAt =
          existingMiningSession.last_claim_at ||
          existingMiningSession.started_at

        const lastClaimTime =
          lastClaimAt
            ? new Date(
                lastClaimAt
              ).getTime()
            : now.getTime()

        const nowTime =
          now.getTime()

        const elapsedSeconds =
          Math.max(
            0,
            Math.floor(
              (nowTime -
                lastClaimTime) /
                1000
            )
          )

        const previousRate =
          Number(
            existingMiningSession.rate_per_second ||
              0
          )

        const previousEarnings =
          previousRate *
          elapsedSeconds

        if (
          previousEarnings > 0
        ) {
          const {
            data: balance,
            error: balanceError,
          } = await supabaseAdmin
            .from('balances')
            .select('*')
            .eq(
              'user_id',
              userId
            )
            .maybeSingle()

          if (balanceError) {
            console.error(
              'MINING BALANCE LOOKUP ERROR:',
              balanceError
            )

            return NextResponse.json(
              {
                error:
                  balanceError.message,
              },
              {
                status: 500,
              }
            )
          }

          if (!balance) {
            const {
              error: balanceInsertError,
            } = await supabaseAdmin
              .from('balances')
              .insert({
                user_id:
                  userId,

                gold:
                  previousEarnings,

                cash:
                  0,
              })

            if (
              balanceInsertError
            ) {
              console.error(
                'MINING BALANCE CREATE ERROR:',
                balanceInsertError
              )

              return NextResponse.json(
                {
                  error:
                    balanceInsertError.message,
                },
                {
                  status: 500,
                }
              )
            }
          } else {
            const {
              error: balanceUpdateError,
            } = await supabaseAdmin
              .from('balances')
              .update({
                gold:
                  Number(
                    balance.gold || 0
                  ) +
                  previousEarnings,
              })
              .eq(
                'user_id',
                userId
              )

            if (
              balanceUpdateError
            ) {
              console.error(
                'MINING BALANCE UPDATE ERROR:',
                balanceUpdateError
              )

              return NextResponse.json(
                {
                  error:
                    balanceUpdateError.message,
                },
                {
                  status: 500,
                }
              )
            }
          }
        }

        // =================================================
        // NEW MINING POWER
        // =================================================

        const newDailyGold =
          combinedInvestment *
          activeGoldPerDollar

        const secondsPerDay =
          24 *
          60 *
          60

        const newRatePerSecond =
          newDailyGold /
          secondsPerDay

        const newMiningStart =
          now

       const newMiningEnd =
  new Date(
    newMiningStart.getTime() +
      secondsPerDay *
        1000
  )

        const updatedTotalEarned =
          Number(
            existingMiningSession.total_earned ||
              0
          ) +
          previousEarnings

        // =================================================
        // UPDATE SAME MINING SESSION
        // =================================================

        const {
          data: updatedMiningSession,
          error: updateMiningSessionError,
        } = await supabaseAdmin
          .from('mining_sessions')
          .update({
            mining_plan_id:
              activePlan.id,

            investment_amount:
              combinedInvestment,

            active:
              true,

            status:
              'active',

            started_at:
              newMiningStart.toISOString(),

            ends_at:
              newMiningEnd.toISOString(),

            last_claim_at:
              newMiningStart.toISOString(),

            rate_per_second:
              newRatePerSecond,

            reward:
              0,

            total_earned:
              updatedTotalEarned,
          })
          .eq(
            'id',
            existingMiningSession.id
          )
          .eq(
            'user_id',
            userId
          )
          .eq(
            'active',
            true
          )
          .select()
          .single()

        if (
          updateMiningSessionError ||
          !updatedMiningSession
        ) {
          console.error(
            'MINING SESSION UPDATE ERROR:',
            updateMiningSessionError
          )

          return NextResponse.json(
            {
              error:
                updateMiningSessionError?.message ||
                'Failed to update the existing mining session.',
            },
            {
              status: 500,
            }
          )
        }

        newMiningSession =
          updatedMiningSession

        console.log(
          'MINING SESSION UPDATED:',
          {
            sessionId:
              updatedMiningSession.id,

            userId,

            previousInvestment:
              currentInvestment,

            addedInvestment:
              amount,

            combinedInvestment,

            previousPlanId:
              currentPlanId,

            activePlanId:
              activePlan.id,

            activePlanName:
              activePlan.name,

            dailyGold:
              newDailyGold,

            ratePerSecond:
              newRatePerSecond,

            durationDays:
              activeDurationDays,

            miningStart:
              newMiningStart.toISOString(),

            miningEnd:
              newMiningEnd.toISOString(),
          }
        )
      } else {
        // =================================================
        // FIRST PAID MINING DEPOSIT
        // =================================================

        const {
          data: createdMiningSession,
          error: miningSessionError,
        } = await supabaseAdmin
          .from('mining_sessions')
          .insert({
            user_id:
              userId,

            mining_plan_id:
              miningPlan.id,

            investment_amount:
              amount,

            active:
              true,

            status:
              'active',

            started_at:
              miningStart.toISOString(),

            ends_at:
              miningEnd.toISOString(),

            last_claim_at:
              miningStart.toISOString(),

            rate_per_second:
              ratePerSecond,

            reward:
              0,

            total_earned:
              0,
          })
          .select()
          .single()

        if (
          miningSessionError ||
          !createdMiningSession
        ) {
          console.error(
            'MINING SESSION CREATE ERROR:',
            miningSessionError
          )

          return NextResponse.json(
            {
              error:
                miningSessionError?.message ||
                'Failed to create the mining session.',
            },
            {
              status: 500,
            }
          )
        }

        newMiningSession =
          createdMiningSession

        console.log(
          'NEW MINING SESSION CREATED:',
          {
            sessionId:
              createdMiningSession.id,

            userId,

            planId:
              miningPlan.id,

            amount,

            dailyGold,

            ratePerSecond,

            durationDays,
          }
        )
      }

      // ===================================================
      // MARK DEPOSIT COMPLETED
      // =====================================================

      const {
        data: completedDeposit,
        error:
          miningDepositUpdateError,
      } =
        await supabaseAdmin
          .from('deposits')
          .update({
            status:
              'completed',

            updated_at:
              now.toISOString(),
          })
          .eq(
            'id',
            id
          )
          .eq(
            'status',
            'pending'
          )
          .select()
          .single()

      if (
        miningDepositUpdateError ||
        !completedDeposit
      ) {
        console.error(
          'MINING DEPOSIT UPDATE ERROR:',
          miningDepositUpdateError
        )

        // Roll back the newly created mining session.
        await supabaseAdmin
          .from('mining_sessions')
          .update({
            active:
              false,

            status:
              'cancelled',
          })
          .eq(
            'id',
            newMiningSession.id
          )

        // Restore the previous mining session
        // if one existed.
        if (
          existingMiningSession
        ) {
          await supabaseAdmin
            .from('mining_sessions')
            .update({
              active:
                true,

              status:
                existingMiningSession.status ||
                'active',
            })
            .eq(
              'id',
              existingMiningSession.id
            )
        }

        return NextResponse.json(
          {
            error:
              miningDepositUpdateError?.message ||
              'Failed to complete mining deposit.',
          },
          {
            status: 500,
          }
        )
      }

      // ===================================================
      // COMPLETE MINING TRANSACTION
      //
      // IMPORTANT:
      // We use reference_id = deposit ID so the exact
      // transaction belonging to this deposit is updated.
      // =====================================================

      const {
        data:
          miningTransaction,
        error:
          miningTransactionLookupError,
      } =
        await supabaseAdmin
          .from('transactions')
          .select('id')
          .eq(
            'reference_id',
            id
          )
          .eq(
            'user_id',
            userId
          )
          .eq(
            'status',
            'pending'
          )
          .maybeSingle()

      if (
        miningTransactionLookupError
      ) {
        console.error(
          'MINING TRANSACTION LOOKUP ERROR:',
          miningTransactionLookupError
        )
      }

      if (
        miningTransaction
      ) {
        const {
          error:
            miningTransactionUpdateError,
        } =
          await supabaseAdmin
            .from('transactions')
            .update({
              status:
                'completed',

              description:
                `Mining Plan ${miningPlan.name} investment of $${amount} approved`,

              reference_id:
                id,
            })
            .eq(
              'id',
              miningTransaction.id
            )

        if (
          miningTransactionUpdateError
        ) {
          console.error(
            'MINING TRANSACTION UPDATE ERROR:',
            miningTransactionUpdateError
          )
        }
      } else {
        console.log(
          'No pending Mining Plan transaction found by reference.'
        )

        // Fallback audit transaction.
        const {
          error:
            miningTransactionInsertError,
        } =
          await supabaseAdmin
            .from('transactions')
            .insert({
              user_id:
                userId,

              type:
                'deposit',

              amount:
                amount,

              status:
                'completed',

              description:
                `Mining Plan ${miningPlan.name} investment of $${amount} approved`,

              reference_id:
                id,

              created_at:
                now.toISOString(),
            })

        if (
          miningTransactionInsertError
        ) {
          console.error(
            'MINING TRANSACTION FALLBACK ERROR:',
            miningTransactionInsertError
          )
        }
      }

      // ===================================================
      // REFERRAL
      // =====================================================

      try {
        await processReferral({
          userId,
          depositId:
            id,
          amount,
        })
      } catch (
        referralError
      ) {
        console.error(
          'MINING PLAN REFERRAL ERROR:',
          referralError
        )
      }

      // ===================================================
      // EMAIL
      // =====================================================

      try {
  if (userEmail) {
    const emailResult =
      await sendEmail({
        to:
          userEmail,

        subject:
          'Mining Plan Activated',

        html:
          depositApprovedEmail(
            amount
          ),
      })

    if (!emailResult.success) {
      console.error(
        'MINING PLAN APPROVAL EMAIL FAILED:',
        emailResult.error
      )
    } else {
      console.log(
        'MINING PLAN APPROVAL EMAIL SENT:',
        userEmail
      )
    }
  } else {
    console.error(
      'MINING PLAN APPROVAL EMAIL SKIPPED: USER EMAIL NOT FOUND',
      {
        userId,
      }
    )
  }
} catch (
  emailError
) {
  console.error(
    'MINING PLAN APPROVAL EMAIL ERROR:',
    emailError
  )
}

      // ===================================================
      // FINAL MINING AUDIT LOG
      // =====================================================

      console.log(
        '✅ MINING PLAN ACTIVATED:',
        {
          depositId:
            id,

          userId,

          planId:
            miningPlan.id,

          planName:
            miningPlan.name,

          amount,

          dailyGold,

          ratePerSecond,

          sessionId:
            newMiningSession.id,

          replacedSessionId:
            existingMiningSession?.id ||
            null,
        }
      )

      // IMPORTANT:
      // Mining Plan deposits do NOT increase cash balance.
      // The deposited amount activates/replaces mining.

      return NextResponse.json({
        success:
          true,

        type:
          'mining_plan',

        deposit:
          completedDeposit,

        session:
          newMiningSession,

        dailyGold,

        plan:
          miningPlan,
      })
    }

    // =====================================================
    // NORMAL DEPOSIT
    //
    // Only deposits without shared_plan_id and
    // mining_plan_id reach this section.
    // =====================================================

    const {
      data: balance,
      error:
        balanceLookupError,
    } =
      await supabaseAdmin
        .from('balances')
        .select('*')
        .eq(
          'user_id',
          userId
        )
        .maybeSingle()

    if (
      balanceLookupError
    ) {
      return NextResponse.json(
        {
          error:
            balanceLookupError.message,
        },
        {
          status: 500,
        }
      )
    }

    // =====================================================
    // CREDIT NORMAL USER BALANCE
    // =====================================================

    if (balance) {
      const newCash =
        Number(
          balance.cash || 0
        ) + amount

      const {
        error:
          balanceError,
      } =
        await supabaseAdmin
          .from('balances')
          .update({
            cash:
              newCash,

            updated_at:
              now.toISOString(),
          })
          .eq(
            'user_id',
            userId
          )

      if (
        balanceError
      ) {
        return NextResponse.json(
          {
            error:
              balanceError.message,
          },
          {
            status: 500,
          }
        )
      }
    } else {
      const {
        error:
          createBalanceError,
      } =
        await supabaseAdmin
          .from('balances')
          .insert({
            user_id:
              userId,

            cash:
              amount,

            gold:
              0,

            shares:
              0,

            updated_at:
              now.toISOString(),
          })

      if (
        createBalanceError
      ) {
        return NextResponse.json(
          {
            error:
              createBalanceError.message,
          },
          {
            status: 500,
          }
        )
      }
    }

    // =====================================================
    // MARK NORMAL DEPOSIT COMPLETED
    // =====================================================

    const {
      error:
        depositUpdateError,
    } =
      await supabaseAdmin
        .from('deposits')
        .update({
          status:
            'completed',

          updated_at:
            now.toISOString(),
        })
        .eq(
          'id',
          id
        )
        .eq(
          'status',
          'pending'
        )

    if (
      depositUpdateError
    ) {
      return NextResponse.json(
        {
          error:
            depositUpdateError.message,
        },
        {
          status: 500,
        }
      )
    }

    // =====================================================
    // REFERRAL
    // =====================================================

    try {
      await processReferral({
        userId,
        depositId:
          id,
        amount,
      })
    } catch (
      referralError
    ) {
      console.error(
        'NORMAL DEPOSIT REFERRAL ERROR:',
        referralError
      )
    }

    // =====================================================
    // UPDATE EXACT NORMAL DEPOSIT TRANSACTION
    // =====================================================

    const {
      data:
        updatedTransactions,
      error:
        transactionUpdateError,
    } =
      await supabaseAdmin
        .from('transactions')
        .update({
          status:
            'completed',

          description:
            `USDT crypto deposit of $${amount} confirmed`,

          reference_id:
            id,
        })
        .eq(
          'reference_id',
          id
        )
        .eq(
          'user_id',
          userId
        )
        .eq(
          'status',
          'pending'
        )
        .select()

    if (
      transactionUpdateError
    ) {
      console.error(
        'NORMAL DEPOSIT TRANSACTION UPDATE ERROR:',
        transactionUpdateError
      )
    }

    // =====================================================
    // FALLBACK TRANSACTION
    // =====================================================

    if (
      !updatedTransactions ||
      updatedTransactions.length ===
        0
    ) {
      console.log(
        'No linked pending normal deposit transaction found. Creating audit transaction.'
      )

      const {
        error:
          transactionInsertError,
      } =
        await supabaseAdmin
          .from('transactions')
          .insert({
            user_id:
              userId,

            type:
              'deposit',

            amount:
              amount,

            status:
              'completed',

            description:
              `USDT crypto deposit of $${amount} confirmed`,

            reference_id:
              id,

            created_at:
              now.toISOString(),
          })

      if (
        transactionInsertError
      ) {
        console.error(
          'NORMAL DEPOSIT TRANSACTION INSERT ERROR:',
          transactionInsertError
        )
      }
    }

    // =====================================================
    // EMAIL
    // =====================================================

    try {
      if (userEmail) {
        await sendEmail({
          to:
            userEmail,

          subject:
            'Deposit Approved',

          html:
            depositApprovedEmail(
              amount
            ),
        })
      }
    } catch (
      emailError
    ) {
      console.error(
        'DEPOSIT APPROVAL EMAIL ERROR:',
        emailError
      )
    }

    console.log(
      '✅ NORMAL DEPOSIT APPROVED:',
      {
        depositId:
          id,

        userId,

        amount,
      }
    )

    return NextResponse.json({
      success:
        true,

      type:
        'deposit',
    })
  } catch (
    err: unknown
  ) {
    console.error(
      '❌ APPROVE DEPOSIT ERROR:',
      err
    )

    const message =
      err instanceof Error
        ? err.message
        : 'Server error'

    return NextResponse.json(
      {
        error:
          message,
      },
      {
        status: 500,
      }
    )
  }
}