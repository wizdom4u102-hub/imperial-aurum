export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PROCESSING_LOCK_TIMEOUT =
  30 * 1000

const CLAIM_CYCLE_SECONDS =
  24 * 60 * 60

export async function GET() {
  try {
    const supabase =
      await createClient()

    const {
      data: { user },
    } =
      await supabase.auth.getUser()

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
    // GET ACTIVE MINING SESSION
    // =====================================================

    const {
      data: session,
      error: sessionError,
    } =
      await supabase
        .from('mining_sessions')
        .select('*')
        .eq(
          'user_id',
          user.id
        )
        .eq(
          'active',
          true
        )
        .maybeSingle()

    console.log(
      'MINING SESSION:',
      session
    )

    console.log(
      'SESSION FOUND:',
      {
        id:
          session?.id,
        active:
          session?.active,
        status:
          session?.status,
        started_at:
          session?.started_at,
        ends_at:
          session?.ends_at,
        last_claim_at:
          session?.last_claim_at,
        total_earned:
          session?.total_earned,
        investment_amount:
          session?.investment_amount,
        processing_at:
          session?.processing_at,
      }
    )

    if (sessionError) {
      throw new Error(
        sessionError.message
      )
    }

    if (!session) {
      return NextResponse.json({
        success: false,
        session: null,
      })
    }

    if (!session.ends_at) {
      throw new Error(
        'Mining session end time is missing.'
      )
    }

    if (!session.started_at) {
      throw new Error(
        'Mining session start time is missing.'
      )
    }

    // =====================================================
    // SESSION TIME
    // =====================================================

    const endTime =
      new Date(
        session.ends_at
      ).getTime()

    const now =
      Date.now()

    console.log({
      now,
      endTime,
      remaining:
        endTime - now,
    })

    // =====================================================
    // DETERMINE 24-HOUR CLAIM WINDOW
    // =====================================================

    const lastClaimTime =
      session.last_claim_at
        ? new Date(
            session.last_claim_at
          ).getTime()
        : new Date(
            session.started_at
          ).getTime()

    const nextClaimTime =
      lastClaimTime +
      CLAIM_CYCLE_SECONDS * 1000

    const claimIsReady =
      now >= nextClaimTime

    console.log(
      'MINING CLAIM WINDOW:',
      {
        sessionId:
          session.id,

        lastClaimTime,

        nextClaimTime,

        now,

        claimIsReady,

        remainingUntilClaim:
          Math.max(
            0,
            nextClaimTime - now
          ),

        remainingHours:
          Math.max(
            0,
            nextClaimTime - now
          ) /
          1000 /
          60 /
          60,
      }
    )

    // =====================================================
    // 24-HOUR CYCLE NOT COMPLETE
    // =====================================================

    if (!claimIsReady) {
      return NextResponse.json({
        success: true,

        session,

        claimed: 0,

        credited: 0,

        principal_returned: 0,

        total_earned:
          Number(
            session.total_earned ||
              0
          ),

        completed: false,
      })
    }

    // =====================================================
    // FULL 24-HOUR CYCLE IS READY
    // =====================================================

    const claimEndTime =
      Math.min(
        nextClaimTime,
        endTime
      )

    const claimSeconds =
      Math.max(
        0,
        Math.floor(
          (
            claimEndTime -
            lastClaimTime
          ) / 1000
        )
      )

    const ratePerSecond =
      Number(
        session.rate_per_second ||
          0
      )

    const earned =
      ratePerSecond *
      claimSeconds

    console.log(
      'MINING 24-HOUR CLAIM:',
      {
        sessionId:
          session.id,

        lastClaimTime,

        nextClaimTime,

        claimEndTime,

        claimSeconds,

        ratePerSecond,

        earned,
      }
    )

    // =====================================================
    // NOTHING TO CLAIM
    // =====================================================

    if (
      claimSeconds <= 0
    ) {
      return NextResponse.json({
        success: true,

        session,

        claimed: 0,

        credited: 0,

        principal_returned: 0,

        total_earned:
          Number(
            session.total_earned ||
              0
          ),

        completed: false,
      })
    }

    // =====================================================
    // LOCK SESSION
    // =====================================================

    console.log(
      'STATUS BEFORE LOCK:',
      session.status
    )

    const nowForLock =
      Date.now()

    const processingAt =
      session.processing_at
        ? new Date(
            session.processing_at
          ).getTime()
        : 0

    const processingLockAge =
      processingAt > 0
        ? nowForLock -
          processingAt
        : Number.POSITIVE_INFINITY

    let lockedSession:
      | typeof session
      | null = null

    let lockError:
      | Error
      | null = null

    // =====================================================
    // ACTIVE SESSION — ACQUIRE LOCK
    // =====================================================

    if (
      session.status ===
      'active'
    ) {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            'mining_sessions'
          )
          .update({
            status:
              'processing',

            processing_at:
              new Date(
                nowForLock
              ).toISOString(),
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
          .select()
          .maybeSingle()

      lockedSession =
        data

      lockError =
        error
    }

    // =====================================================
    // STALE PROCESSING SESSION — RECOVER LOCK
    // =====================================================

    else if (
      session.status ===
        'processing' &&
      processingLockAge >=
        PROCESSING_LOCK_TIMEOUT
    ) {
      console.log(
        'STALE MINING LOCK DETECTED:',
        {
          sessionId:
            session.id,

          processingAt:
            session.processing_at,

          processingLockAge,
        }
      )

      const newProcessingAt =
        new Date(
          nowForLock
        ).toISOString()

      if (
        session.processing_at
      ) {
        const {
          data,
          error,
        } =
          await supabase
            .from(
              'mining_sessions'
            )
            .update({
              processing_at:
                newProcessingAt,
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
              'processing'
            )
            .eq(
              'processing_at',
              session.processing_at
            )
            .select()
            .maybeSingle()

        lockedSession =
          data

        lockError =
          error
      } else {
        const {
          data,
          error,
        } =
          await supabase
            .from(
              'mining_sessions'
            )
            .update({
              processing_at:
                newProcessingAt,
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
              'processing'
            )
            .is(
              'processing_at',
              null
            )
            .select()
            .maybeSingle()

        lockedSession =
          data

        lockError =
          error
      }
    }

    // =====================================================
    // CURRENTLY PROCESSING
    // =====================================================

    else if (
      session.status ===
        'processing' &&
      processingLockAge <
        PROCESSING_LOCK_TIMEOUT
    ) {
      console.log(
        'MINING SESSION IS CURRENTLY PROCESSING:',
        {
          sessionId:
            session.id,

          processingAt:
            session.processing_at,

          processingLockAge,
        }
      )

      return NextResponse.json({
        success: true,

        session,

        claimed: 0,

        credited: 0,

        principal_returned: 0,

        total_earned:
          Number(
            session.total_earned ||
              0
          ),

        completed: false,
      })
    }

    console.log(
      'LOCKED SESSION:',
      lockedSession
    )

    console.log(
      'LOCK ERROR:',
      lockError
    )

    // =====================================================
    // LOCK FAILED
    // =====================================================

    if (
      lockError
    ) {
      throw new Error(
        lockError.message
      )
    }

    if (
      !lockedSession
    ) {
      const {
        data: latest,
        error:
          latestError,
      } =
        await supabase
          .from(
            'mining_sessions'
          )
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

      if (latestError) {
        throw new Error(
          latestError.message
        )
      }

      if (!latest) {
        return NextResponse.json({
          success: false,
          session: null,
          claimed: 0,
          credited: 0,
          principal_returned: 0,
          completed: false,
        })
      }

      return NextResponse.json({
        success: true,

        session:
          latest,

        claimed: 0,

        credited: 0,

        principal_returned: 0,

        total_earned:
          Number(
            latest.total_earned ||
              0
          ),

        completed:
          latest.active ===
          false,
      })
    }

    // =====================================================
    // RECALCULATE FROM LOCKED SESSION
    // =====================================================

    if (
      !lockedSession.started_at
    ) {
      throw new Error(
        'Mining session start time is missing.'
      )
    }

    if (
      !lockedSession.ends_at
    ) {
      throw new Error(
        'Mining session end time is missing.'
      )
    }

    const lockedLastClaimTime =
      lockedSession.last_claim_at
        ? new Date(
            lockedSession.last_claim_at
          ).getTime()
        : new Date(
            lockedSession.started_at
          ).getTime()

    const lockedEndTime =
      new Date(
        lockedSession.ends_at
      ).getTime()

    const lockedNow =
      Date.now()

    const lockedNextClaimTime =
      lockedLastClaimTime +
      CLAIM_CYCLE_SECONDS * 1000

    // =====================================================
    // ONLY COMPLETE 24-HOUR CYCLES CAN BE CLAIMED
    // =====================================================

    if (
      lockedNow <
      lockedNextClaimTime
    ) {
      await supabase
        .from(
          'mining_sessions'
        )
        .update({
          status:
            'active',

          processing_at:
            null,
        })
        .eq(
          'id',
          lockedSession.id
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
          'processing'
        )

      return NextResponse.json({
        success: true,

        session:
          lockedSession,

        claimed: 0,

        credited: 0,

        principal_returned: 0,

        total_earned:
          Number(
            lockedSession.total_earned ||
              0
          ),

        completed: false,
      })
    }

    const lockedClaimEndTime =
      Math.min(
        lockedNextClaimTime,
        lockedEndTime
      )

    const lockedClaimSeconds =
      Math.max(
        0,
        Math.floor(
          (
            lockedClaimEndTime -
            lockedLastClaimTime
          ) / 1000
        )
      )

    const lockedRatePerSecond =
      Number(
        lockedSession.rate_per_second ||
          0
      )

    const lockedEarned =
      lockedRatePerSecond *
      lockedClaimSeconds

    console.log(
      'LOCKED MINING CLAIM:',
      {
        sessionId:
          lockedSession.id,

        lastClaimTime:
          lockedLastClaimTime,

        nextClaimTime:
          lockedNextClaimTime,

        claimEndTime:
          lockedClaimEndTime,

        claimSeconds:
          lockedClaimSeconds,

        ratePerSecond:
          lockedRatePerSecond,

        earned:
          lockedEarned,
      }
    )

    // =====================================================
    // DETERMINE COMPLETION
    // =====================================================

    const isCompleted =
      lockedClaimEndTime >=
      lockedEndTime

    // =====================================================
    // BALANCE
    // =====================================================

    if (lockedEarned > 0) {
      const {
        data: balance,
        error:
          balanceError,
      } =
        await supabase
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
        } =
          await supabase
            .from('balances')
            .insert({
              user_id:
                user.id,

              gold:
                lockedEarned,

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

        const newGold =
          currentGold +
          lockedEarned

        const {
          error:
            balanceUpdateError,
        } =
          await supabase
            .from('balances')
            .update({
              gold:
                newGold,
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

    console.log(
      'EARNED:',
      lockedEarned
    )

    console.log(
      'SESSION ID:',
      lockedSession.id
    )

    // =====================================================
    // UPDATE SESSION
    // =====================================================

    const previousTotalEarned =
      Number(
        lockedSession
          .total_earned ||
          0
      )

    const newTotalEarned =
      previousTotalEarned +
      lockedEarned

    const {
      data: updatedRows,
      error:
        updateError,
    } =
      await supabase
        .from(
          'mining_sessions'
        )
        .update({
          active:
            !isCompleted,

          status:
            isCompleted
              ? 'completed'
              : 'active',

          processing_at:
            null,

          last_claim_at:
            new Date(
              lockedClaimEndTime
            ).toISOString(),

          reward:
            lockedEarned,

          total_earned:
            newTotalEarned,

          investment_amount:
            Number(
              lockedSession
                .investment_amount ||
                0
            ),
        })
        .eq(
          'id',
          lockedSession.id
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
          'processing'
        )
        .select()

    console.log(
      'SESSION UPDATE RESULT:',
      updatedRows,
      updateError
    )

    if (updateError) {
      throw new Error(
        updateError.message
      )
    }

    const updatedSession =
      updatedRows?.[0] ||
      null

    if (!updatedSession) {
      throw new Error(
        'Mining session could not be finalized.'
      )
    }

    // =====================================================
    // MINING REWARD TRANSACTION
    // =====================================================

   if (
  lockedEarned > 0
) {
  const {
    error:
      transactionError,
  } =
    await supabase
      .from(
        'transactions'
      )
      .insert({
        user_id:
          user.id,

        type:
          'mining',

        amount:
          lockedEarned,

        currency:
          'GOLD',

        status:
          'completed',

        description:
          'Mining reward claimed',
      })

  if (
    transactionError
  ) {
    console.error(
      'MINING TRANSACTION ERROR:',
      transactionError
    )
  }
}

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      session:
        updatedSession,

      claimed:
        lockedEarned,

      credited:
        lockedEarned,

      principal_returned:
        0,

      total_earned:
        newTotalEarned,

      completed:
        isCompleted,
    })
  } catch (err: unknown) {
    console.error(
      'MINING SESSION ERROR',
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