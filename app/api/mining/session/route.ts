export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const CLAIM_CYCLE_SECONDS = 24 * 60 * 60

export async function GET() {
  try {
    const supabase = await createClient()

    // =====================================================
    // AUTHENTICATED USER
    // =====================================================

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
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

    // =====================================================
    // GET LATEST MINING SESSION
    // =====================================================

    const {
      data: session,
      error: sessionError,
    } = await supabase
      .from('mining_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', {
        ascending: false,
      })
      .limit(1)
      .maybeSingle()

    if (sessionError) {
      throw new Error(sessionError.message)
    }

    console.log('MINING SESSION:', session)

    if (!session) {
      return NextResponse.json({
        success: false,
        session: null,
      })
    }

    // =====================================================
    // REQUIRED SESSION DATES
    // =====================================================

    if (!session.started_at) {
      throw new Error(
        'Mining session start time is missing.'
      )
    }

    if (!session.ends_at) {
      throw new Error(
        'Mining session end time is missing.'
      )
    }

    const startTime = new Date(
      session.started_at
    ).getTime()

    const endTime = new Date(
      session.ends_at
    ).getTime()

    if (
      !Number.isFinite(startTime) ||
      !Number.isFinite(endTime)
    ) {
      throw new Error(
        'Mining session contains an invalid date.'
      )
    }

    // =====================================================
    // DETERMINE MINING TYPE
    //
    // investment_amount > 0 = paid mining
    // investment_amount <= 0 = free mining
    // =====================================================

    const investmentAmount = Number(
      session.investment_amount || 0
    )

    const isPaidMining =
      investmentAmount > 0

    const isFreeMining =
      investmentAmount <= 0

    // =====================================================
    // COMPLETED SESSION
    //
    // IMPORTANT:
    //
    // A paid session may be completed while it still has
    // unclaimed reward in session.reward.
    //
    // Mine Now is responsible for claiming that reward.
    // =====================================================

    if (session.status === 'completed') {
      return NextResponse.json({
        success: true,
        session,
        claimed: 0,
        credited: 0,
        principal_returned: 0,
        reward: Number(
          session.reward || 0
        ),
        total_earned: Number(
          session.total_earned || 0
        ),
        completed: true,
        paused: false,
      })
    }

    // =====================================================
    // PAUSED SESSION
    // =====================================================

    if (session.status === 'paused') {
      const now = Date.now()

      // -----------------------------------------------------
      // PAID SESSION
      //
      // A paid session should only be paused while its
      // original plan is still valid.
      // -----------------------------------------------------

      if (isPaidMining) {
        if (now >= endTime) {
          const {
            data: completedRows,
            error: completionError,
          } = await supabase
            .from('mining_sessions')
            .update({
              active: false,
              status: 'completed',
              processing_at: null,
            })
            .eq('id', session.id)
            .eq('user_id', user.id)
            .eq('active', false)
            .eq('status', 'paused')
            .select()

          if (completionError) {
            throw new Error(
              completionError.message
            )
          }

          const completedSession =
            completedRows?.[0] || session

          return NextResponse.json({
            success: true,
            session: completedSession,
            claimed: 0,
            credited: 0,
            principal_returned: 0,
            reward: Number(
              completedSession.reward || 0
            ),
            total_earned: Number(
              completedSession.total_earned || 0
            ),
            completed: true,
            paused: false,
          })
        }

        return NextResponse.json({
          success: true,
          session,
          claimed: 0,
          credited: 0,
          principal_returned: 0,
          reward: Number(
            session.reward || 0
          ),
          total_earned: Number(
            session.total_earned || 0
          ),
          completed: false,
          paused: true,
        })
      }

      // -----------------------------------------------------
      // FREE SESSION
      // -----------------------------------------------------

      return NextResponse.json({
        success: true,
        session,
        claimed: 0,
        credited: 0,
        principal_returned: 0,
        reward: Number(
          session.reward || 0
        ),
        total_earned: Number(
          session.total_earned || 0
        ),
        completed: false,
        paused: true,
      })
    }

    // =====================================================
    // CURRENT TIME
    // =====================================================

    const now = Date.now()

    // =====================================================
    // DETERMINE LAST ACCRUAL TIME
    //
    // last_claim_at is being used as the point through
    // which mining profit has already been accumulated.
    //
    // If it is missing, the session start time is used.
    // =====================================================

    let lastClaimTime = startTime

    if (session.last_claim_at) {
      const parsedLastClaimTime =
        new Date(
          session.last_claim_at
        ).getTime()

      if (
        Number.isFinite(
          parsedLastClaimTime
        )
      ) {
        lastClaimTime =
          parsedLastClaimTime
      }
    }

    // Never accrue before the session started.
    if (lastClaimTime < startTime) {
      lastClaimTime = startTime
    }

    // Never accrue beyond the plan's end.
    if (lastClaimTime > endTime) {
      lastClaimTime = endTime
    }

    // =====================================================
    // PAID MINING
    //
    // IMPORTANT BUSINESS LOGIC:
    //
    // Paid mining accrues continuously.
    //
    // The user DOES NOT need to click Mine Now every
    // 24 hours.
    //
    // If the user waits:
    //
    // 1 day  -> 1 day of profit is accumulated
    // 3 days -> 3 days of profit is accumulated
    // 7 days -> 7 days of profit is accumulated
    //
    // Mine Now is the CLAIM action.
    //
    // This route does NOT credit balances.gold.
    // =====================================================

    if (isPaidMining) {
      // -----------------------------------------------------
      // ACCRUE ONLY THROUGH THE CURRENT TIME OR PLAN END
      // -----------------------------------------------------

      const accrualEndTime =
        Math.min(now, endTime)

      const elapsedMilliseconds =
        Math.max(
          0,
          accrualEndTime -
            lastClaimTime
        )

      const elapsedSeconds =
        Math.floor(
          elapsedMilliseconds / 1000
        )

      const ratePerSecond =
        Number(
          session.rate_per_second || 0
        )

      const accumulatedReward =
        ratePerSecond > 0 &&
        elapsedSeconds > 0
          ? ratePerSecond *
            elapsedSeconds
          : 0

      const existingReward =
        Number(
          session.reward || 0
        )

      const existingTotalEarned =
        Number(
          session.total_earned || 0
        )

      // -----------------------------------------------------
      // NO NEW PROFIT TO ACCUMULATE
      // -----------------------------------------------------

      if (accumulatedReward <= 0) {
        // ---------------------------------------------------
        // PLAN HAS EXPIRED
        // ---------------------------------------------------

        if (now >= endTime) {
          const {
            data: completedRows,
            error: completionError,
          } = await supabase
            .from('mining_sessions')
            .update({
              active: false,
              status: 'completed',
              processing_at: null,
            })
            .eq('id', session.id)
            .eq('user_id', user.id)
            .eq('active', true)
            .eq('status', 'active')
            .select()

          if (completionError) {
            throw new Error(
              completionError.message
            )
          }

          const completedSession =
            completedRows?.[0] || session

          return NextResponse.json({
            success: true,
            session: completedSession,
            claimed: 0,
            credited: 0,
            principal_returned: 0,
            reward: Number(
              completedSession.reward || 0
            ),
            total_earned: Number(
              completedSession.total_earned || 0
            ),
            completed: true,
            paused: false,
          })
        }

        // ---------------------------------------------------
        // PLAN STILL ACTIVE
        // ---------------------------------------------------

        return NextResponse.json({
          success: true,
          session,
          claimed: 0,
          credited: 0,
          principal_returned: 0,
          reward: existingReward,
          total_earned:
            existingTotalEarned,
          completed: false,
          paused: false,
        })
      }

      // =====================================================
      // ATOMIC PAID PROFIT ACCRUAL
      //
      // The update includes the exact last_claim_at value
      // that was read above.
      //
      // If another request has already processed this
      // session between the SELECT and this UPDATE, the
      // last_claim_at value will no longer match and this
      // update will affect zero rows.
      //
      // This prevents the same elapsed period from being
      // credited twice by concurrent requests.
      // =====================================================

      const previousLastClaimAt =
        session.last_claim_at

      let updateQuery =
        supabase
          .from('mining_sessions')
          .update({
            reward:
              existingReward +
              accumulatedReward,

            total_earned:
              existingTotalEarned +
              accumulatedReward,

            last_claim_at:
              new Date(
                accrualEndTime
              ).toISOString(),

            processing_at: null,
          })
          .eq(
            'id',
            session.id
          )
          .eq(
            'user_id',
            user.id
          )
          .eq(
            'active',
            true
          )
          .eq(
            'status',
            'active'
          )

      // -----------------------------------------------------
      // ATOMIC CHECK FOR last_claim_at
      //
      // When last_claim_at was NULL, explicitly require NULL.
      // Otherwise require the exact timestamp previously read.
      // -----------------------------------------------------

      if (previousLastClaimAt === null) {
        updateQuery =
          updateQuery.is(
            'last_claim_at',
            null
          )
      } else {
        updateQuery =
          updateQuery.eq(
            'last_claim_at',
            previousLastClaimAt
          )
      }

      const {
        data: updatedRows,
        error: updateError,
      } = await updateQuery.select()

      if (updateError) {
        throw new Error(
          updateError.message
        )
      }

      // -----------------------------------------------------
      // CONCURRENT REQUEST LOST THE ATOMIC CLAIM
      //
      // Another request already processed the elapsed
      // period. Return the latest session instead of
      // adding the same reward again.
      // -----------------------------------------------------

      if (
        !updatedRows ||
        updatedRows.length === 0
      ) {
        const {
          data: latestSession,
          error: latestSessionError,
        } = await supabase
          .from('mining_sessions')
          .select('*')
          .eq(
            'id',
            session.id
          )
          .eq(
            'user_id',
            user.id
          )
          .maybeSingle()

        if (latestSessionError) {
          throw new Error(
            latestSessionError.message
          )
        }

        if (!latestSession) {
          throw new Error(
            'Mining session could not be found after concurrent update.'
          )
        }

        return NextResponse.json({
          success: true,
          session: latestSession,
          claimed: 0,
          credited: 0,
          principal_returned: 0,
          reward: Number(
            latestSession.reward || 0
          ),
          total_earned: Number(
            latestSession.total_earned || 0
          ),
          completed:
            latestSession.status ===
            'completed',
          paused:
            latestSession.status ===
            'paused',
        })
      }

      const updatedSession =
        updatedRows[0]

      if (!updatedSession) {
        throw new Error(
          'Paid mining session update returned no session.'
        )
      }

      // =====================================================
      // PAID PLAN EXPIRED
      //
      // The final profit through ends_at has already been
      // accumulated above.
      //
      // The reward remains inside session.reward for Mine Now.
      // =====================================================

      if (
        accrualEndTime >= endTime
      ) {
        const {
          data: completedRows,
          error: completionError,
        } = await supabase
          .from('mining_sessions')
          .update({
            active: false,
            status: 'completed',
            processing_at: null,
          })
          .eq(
            'id',
            updatedSession.id
          )
          .eq(
            'user_id',
            user.id
          )
          .eq(
            'active',
            true
          )
          .eq(
            'status',
            'active'
          )
          .select()

        if (completionError) {
          throw new Error(
            completionError.message
          )
        }

        const completedSession =
          completedRows?.[0] ||
          updatedSession

        console.log(
          'PAID MINING PLAN COMPLETED:',
          {
            sessionId:
              completedSession.id,

            endsAt:
              completedSession.ends_at,

            reward:
              completedSession.reward,

            totalEarned:
              completedSession.total_earned,
          }
        )

        return NextResponse.json({
          success: true,
          session:
            completedSession,
          claimed: 0,
          credited: 0,
          principal_returned: 0,
          reward: Number(
            completedSession.reward || 0
          ),
          total_earned: Number(
            completedSession.total_earned || 0
          ),
          completed: true,
          paused: false,
        })
      }

      // =====================================================
      // PAID PLAN STILL ACTIVE
      // =====================================================

      return NextResponse.json({
        success: true,
        session:
          updatedSession,
        claimed: 0,
        credited: 0,
        principal_returned: 0,
        reward: Number(
          updatedSession.reward || 0
        ),
        total_earned: Number(
          updatedSession.total_earned || 0
        ),
        completed: false,
        paused: false,
      })
    }

    // =====================================================
    // FREE MINING
    //
    // Free mining is different from paid mining.
    //
    // It runs one 24-hour cycle and automatically credits
    // the earned GOLD at the end of that cycle.
    // =====================================================

    if (isFreeMining) {
      const freeCycleEndTime =
        Math.min(
          lastClaimTime +
            CLAIM_CYCLE_SECONDS *
              1000,
          endTime
        )

      const freeCycleMilliseconds =
        Math.max(
          0,
          freeCycleEndTime -
            lastClaimTime
        )

      const freeCycleSeconds =
        Math.floor(
          freeCycleMilliseconds /
            1000
        )

      const nowReachedCycleEnd =
        now >= freeCycleEndTime

      console.log(
        'FREE MINING CYCLE:',
        {
          sessionId:
            session.id,

          lastClaimTime,

          freeCycleEndTime,

          freeCycleSeconds,

          now,

          nowReachedCycleEnd,
        }
      )

      // =====================================================
      // FREE CYCLE NOT COMPLETE
      // =====================================================

      if (!nowReachedCycleEnd) {
        return NextResponse.json({
          success: true,
          session,
          claimed: 0,
          credited: 0,
          principal_returned: 0,
          reward: Number(
            session.reward || 0
          ),
          total_earned: Number(
            session.total_earned || 0
          ),
          completed: false,
          paused: false,
        })
      }

      // =====================================================
      // CALCULATE FREE REWARD
      // =====================================================

      const ratePerSecond =
        Number(
          session.rate_per_second || 0
        )

      const earned =
        ratePerSecond > 0
          ? ratePerSecond *
            freeCycleSeconds
          : 0

      console.log(
        'FREE MINING AUTOMATIC REWARD:',
        {
          sessionId:
            session.id,

          freeCycleSeconds,

          ratePerSecond,

          earned,
        }
      )

      // =====================================================
      // FINALIZE FREE CYCLE
      // =====================================================

      const previousTotalEarned =
        Number(
          session.total_earned || 0
        )

      const newTotalEarned =
        previousTotalEarned +
        earned

      // -----------------------------------------------------
      // Protect the session update using the original
      // last_claim_at value.
      // -----------------------------------------------------

      let freeUpdateQuery =
        supabase
          .from('mining_sessions')
          .update({
            active: false,

            status: 'paused',

            processing_at: null,

            last_claim_at:
              new Date(
                freeCycleEndTime
              ).toISOString(),

            reward:
              earned,

            total_earned:
              newTotalEarned,
          })
          .eq(
            'id',
            session.id
          )
          .eq(
            'user_id',
            user.id
          )
          .eq(
            'active',
            true
          )
          .eq(
            'status',
            'active'
          )

      if (
        session.last_claim_at ===
        null
      ) {
        freeUpdateQuery =
          freeUpdateQuery.is(
            'last_claim_at',
            null
          )
      } else {
        freeUpdateQuery =
          freeUpdateQuery.eq(
            'last_claim_at',
            session.last_claim_at
          )
      }

      const {
        data: updatedRows,
        error: updateError,
      } = await freeUpdateQuery.select()

      if (updateError) {
        throw new Error(
          updateError.message
        )
      }

      // -----------------------------------------------------
      // CONCURRENT FREE REQUEST
      //
      // Another request already finalized this cycle.
      //
      // NOTE:
      // The session protection prevents the same mining
      // session from being finalized twice.
      // -----------------------------------------------------

      if (
        !updatedRows ||
        updatedRows.length === 0
      ) {
        const {
          data: latestSession,
          error:
            latestSessionError,
        } = await supabase
          .from('mining_sessions')
          .select('*')
          .eq(
            'id',
            session.id
          )
          .eq(
            'user_id',
            user.id
          )
          .maybeSingle()

        if (latestSessionError) {
          throw new Error(
            latestSessionError.message
          )
        }

        if (!latestSession) {
          throw new Error(
            'Mining session could not be found after concurrent update.'
          )
        }

        return NextResponse.json({
          success: true,
          session:
            latestSession,
          claimed: 0,
          credited: 0,
          principal_returned: 0,
          reward: Number(
            latestSession.reward || 0
          ),
          total_earned: Number(
            latestSession.total_earned || 0
          ),
          completed:
            latestSession.status ===
            'completed',
          paused:
            latestSession.status ===
            'paused',
        })
      }

      const updatedSession =
        updatedRows[0]

      if (!updatedSession) {
        throw new Error(
          'Free mining session update returned no session.'
        )
      }

      // =====================================================
      // CREDIT GOLD
      // =====================================================

      if (earned > 0) {
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
          .maybeSingle()

        if (balanceError) {
          throw new Error(
            balanceError.message
          )
        }

        if (!balance) {
          const {
            error:
              balanceInsertError,
          } = await supabase
            .from('balances')
            .insert({
              user_id:
                user.id,

              gold:
                earned,

              cash:
                0,
            })

          if (
            balanceInsertError
          ) {
            throw new Error(
              balanceInsertError.message
            )
          }
        } else {
          const currentGold =
            Number(
              balance.gold || 0
            )

          const {
            error:
              balanceUpdateError,
          } = await supabase
            .from('balances')
            .update({
              gold:
                currentGold +
                earned,
            })
            .eq(
              'user_id',
              user.id
            )

          if (
            balanceUpdateError
          ) {
            throw new Error(
              balanceUpdateError.message
            )
          }
        }
      }

      // =====================================================
      // FREE MINING TRANSACTION
      // =====================================================

      if (earned > 0) {
        const {
          error:
            transactionError,
        } = await supabase
          .from('transactions')
          .insert({
            user_id:
              user.id,

            type:
              'mining',

            amount:
              earned,

            currency:
              'GOLD',

            status:
              'completed',

            description:
              'Free mining reward credited automatically',
          })

        if (transactionError) {
          console.error(
            'FREE MINING TRANSACTION ERROR:',
            transactionError
          )
        }
      }

      console.log(
        'FREE MINING CYCLE COMPLETED:',
        {
          sessionId:
            updatedSession.id,

          earned,

          totalEarned:
            newTotalEarned,

          status:
            updatedSession.status,
        }
      )

      return NextResponse.json({
        success: true,

        session:
          updatedSession,

        claimed:
          earned,

        credited:
          earned,

        principal_returned:
          0,

        reward:
          earned,

        total_earned:
          newTotalEarned,

        completed:
          false,

        paused:
          true,
      })
    }

    // =====================================================
    // UNKNOWN MINING TYPE
    // =====================================================

    return NextResponse.json(
      {
        success: false,

        error:
          'Unable to determine mining session type.',
      },
      {
        status: 400,
      }
    )
  } catch (err: unknown) {
    console.error(
      'MINING SESSION ERROR:',
      err
    )

    const message =
      err instanceof Error
        ? err.message
        : 'Mining error'

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      }
    )
  }
}