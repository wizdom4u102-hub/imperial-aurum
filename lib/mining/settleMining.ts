import { createClient } from '@/lib/supabase/server'

export async function settleMining(
  userId: string
): Promise<void> {
  const supabase = await createClient()

  // =====================================================
  // FIND ACTIVE MINING SESSION
  // =====================================================

  const {
    data: session,
    error,
  } = await supabase
    .from('mining_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .maybeSingle()

  if (error) {
    console.error(
      'SETTLE MINING SESSION ERROR:',
      error
    )

    return
  }

  if (!session) {
    return
  }

  // =====================================================
  // REQUIRED END TIME
  //
  // Check for null before passing the value to Date().
  // This prevents:
  //
  // Argument of type 'string | null' is not assignable
  // to parameter of type 'string | number | Date'
  // =====================================================

  if (!session.ends_at) {
    console.error(
      'SETTLE MINING: session end time is missing.',
      {
        sessionId:
          session.id,
        userId,
      }
    )

    return
  }

  const endTime = new Date(
    session.ends_at
  ).getTime()

  if (!Number.isFinite(endTime)) {
    console.error(
      'SETTLE MINING: session end time is invalid.',
      {
        sessionId:
          session.id,
        endsAt:
          session.ends_at,
      }
    )

    return
  }

  const now = Date.now()

  // =====================================================
  // SESSION HAS NOT EXPIRED
  // =====================================================

  if (now < endTime) {
    return
  }

  // =====================================================
  // DETERMINE MINING TYPE
  // =====================================================

  const investmentAmount = Number(
    session.investment_amount || 0
  )

  const isPaidMining =
    investmentAmount > 0

  // =====================================================
  // FREE MINING
  //
  // Free mining is settled by the mining session route.
  //
  // Do not mark a free session completed here because
  // free mining uses the paused 24-hour cycle logic.
  // =====================================================

  if (!isPaidMining) {
    return
  }

  // =====================================================
  // PAID MINING FINAL ACCRUAL
  //
  // IMPORTANT:
  //
  // A paid user may never have clicked Mine Now during
  // the entire plan duration.
  //
  // Therefore, before completing the session, calculate
  // every remaining second from last_claim_at through
  // ends_at.
  //
  // Example:
  //
  // last_claim_at = Day 1
  // ends_at       = Day 7
  //
  // The user receives profit for Days 1-7 in reward.
  //
  // Mine Now later claims the accumulated reward.
  // =====================================================

  const startTime = session.started_at
    ? new Date(
        session.started_at
      ).getTime()
    : endTime

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

  // Never accrue before the mining session started.
  if (
    Number.isFinite(startTime) &&
    lastClaimTime < startTime
  ) {
    lastClaimTime = startTime
  }

  // Never accrue beyond the plan end.
  if (lastClaimTime > endTime) {
    lastClaimTime = endTime
  }

  const elapsedMilliseconds =
    Math.max(
      0,
      endTime -
        lastClaimTime
    )

  const elapsedSeconds =
    Math.floor(
      elapsedMilliseconds /
        1000
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

  const finalReward =
    existingReward +
    accumulatedReward

  const finalTotalEarned =
    existingTotalEarned +
    accumulatedReward

  console.log(
    'SETTLE PAID MINING:',
    {
      sessionId:
        session.id,

      userId,

      endsAt:
        session.ends_at,

      lastClaimAt:
        session.last_claim_at,

      elapsedSeconds,

      ratePerSecond,

      accumulatedReward,

      existingReward,

      finalReward,

      existingTotalEarned,

      finalTotalEarned,
    }
  )

  // =====================================================
  // ATOMIC FINAL SETTLEMENT
  //
  // The update only succeeds if the session is still
  // active AND its last_claim_at is exactly the value
  // that was read above.
  //
  // If another request has already processed the session,
  // this update affects zero rows.
  //
  // This prevents duplicate final accrual.
  // =====================================================

  let settlementQuery =
    supabase
      .from('mining_sessions')
      .update({
        active:
          false,

        status:
          'completed',

        reward:
          finalReward,

        total_earned:
          finalTotalEarned,

        last_claim_at:
          new Date(
            endTime
          ).toISOString(),

        processing_at:
          null,
      })
      .eq(
        'id',
        session.id
      )
      .eq(
        'user_id',
        userId
      )
      .eq(
        'active',
        true
      )
      .eq(
        'status',
        'active'
      )

  // =====================================================
  // ATOMIC NULL / VALUE CHECK
  // =====================================================

  if (
    session.last_claim_at ===
    null
  ) {
    settlementQuery =
      settlementQuery.is(
        'last_claim_at',
        null
      )
  } else {
    settlementQuery =
      settlementQuery.eq(
        'last_claim_at',
        session.last_claim_at
      )
  }

  const {
    data: settledRows,
    error:
      settlementError,
  } = await settlementQuery.select()

  if (settlementError) {
    console.error(
      'PAID MINING SETTLEMENT UPDATE ERROR:',
      settlementError
    )

    return
  }

  // =====================================================
  // NO ROW UPDATED
  //
  // Another request already changed the session.
  //
  // Do not attempt another reward calculation because
  // that could duplicate the final profit.
  // =====================================================

  if (
    !settledRows ||
    settledRows.length === 0
  ) {
    console.log(
      'PAID MINING SETTLEMENT SKIPPED: SESSION WAS ALREADY PROCESSED.',
      {
        sessionId:
          session.id,

        userId,
      }
    )

    return
  }

  const settledSession =
    settledRows[0]

  if (!settledSession) {
    console.error(
      'PAID MINING SETTLEMENT: no settled session returned.',
      {
        sessionId:
          session.id,

        userId,
      }
    )

    return
  }

  // =====================================================
  // IMPORTANT
  //
  // We intentionally DO NOT update balances.gold here.
  //
  // Paid mining profit remains in mining_sessions.reward
  // until the user clicks Mine Now and claims it.
  //
  // Therefore:
  //
  //   mining_sessions.reward
  //          ↓
  //       Mine Now
  //          ↓
  //   balances.gold
  //
  // The user's elapsed paid profit is preserved even when
  // Mine Now was not clicked during the plan.
  // =====================================================

  console.log(
    'PAID MINING SESSION SETTLED:',
    {
      sessionId:
        settledSession.id,

      userId,

      status:
        settledSession.status,

      active:
        settledSession.active,

      reward:
        settledSession.reward,

      totalEarned:
        settledSession.total_earned,

      endsAt:
        settledSession.ends_at,
    }
  )
}