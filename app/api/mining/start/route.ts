export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SECONDS_PER_DAY = 24 * 60 * 60

export async function POST() {
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

    const now = new Date()
    const nowTime = now.getTime()

    // =====================================================
    // FIND ACTIVE SESSION
    // =====================================================

    const {
      data: activeSession,
      error: activeSessionError,
    } = await supabase
      .from('mining_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('active', true)
      .maybeSingle()

    if (activeSessionError) {
      console.error(
        'ACTIVE MINING SESSION ERROR:',
        activeSessionError
      )

      return NextResponse.json(
        {
          success: false,
          error: activeSessionError.message,
        },
        {
          status: 500,
        }
      )
    }

    // =====================================================
    // ALREADY ACTIVE
    //
    // Do not create another session.
    // Do not reset started_at.
    // Do not reset last_claim_at.
    // Do not reset reward.
    // =====================================================

    if (activeSession) {
      return NextResponse.json({
        success: true,
        session: activeSession,
        type:
          Number(
            activeSession.investment_amount || 0
          ) > 0
            ? 'paid_mining'
            : 'free_mining',
      })
    }

    // =====================================================
    // FIND MOST RECENT SESSION
    // =====================================================

    const {
      data: previousSession,
      error: previousSessionError,
    } = await supabase
      .from('mining_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', {
        ascending: false,
      })
      .limit(1)
      .maybeSingle()

    if (previousSessionError) {
      console.error(
        'PREVIOUS MINING SESSION ERROR:',
        previousSessionError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            previousSessionError.message,
        },
        {
          status: 500,
        }
      )
    }

    // =====================================================
    // CONTINUE EXISTING PAID PLAN
    //
    // IMPORTANT:
    //
    // Paid mining is NOT a sequence of independent
    // 24-hour plans.
    //
    // The purchased plan has one original ends_at.
    //
    // Mine Now is a CLAIM action. If the user returns
    // after several days, the elapsed profit must not be
    // lost.
    //
    // Therefore:
    //
    // - original ends_at is preserved
    // - original investment_amount is preserved
    // - original rate_per_second is preserved
    // - existing total_earned is preserved
    // - existing reward is preserved
    //
    // The session route is responsible for calculating
    // elapsed paid profit from last_claim_at.
    // =====================================================

    if (
      previousSession &&
      Number(
        previousSession.investment_amount || 0
      ) > 0 &&
      previousSession.mining_plan_id &&
      previousSession.ends_at
    ) {
      const planEndTime = new Date(
        previousSession.ends_at
      ).getTime()

      if (
        Number.isFinite(planEndTime) &&
        nowTime < planEndTime
      ) {
        // -------------------------------------------------
        // PRESERVE THE LAST ACCRUAL POINT
        //
        // Do NOT set last_claim_at to now.
        //
        // If the user has not clicked Mine Now for 3 days,
        // the next session GET must be able to calculate
        // those 3 days of elapsed profit.
        // -------------------------------------------------

        const preservedLastClaimAt =
          previousSession.last_claim_at

        const {
          data: restartedRows,
          error: restartError,
        } = await supabase
          .from('mining_sessions')
          .update({
            active: true,

            status: 'active',

            started_at:
              previousSession.started_at,

            ends_at:
              previousSession.ends_at,

            last_claim_at:
              preservedLastClaimAt,

            processing_at:
              null,

            reward:
              Number(
                previousSession.reward || 0
              ),

            total_earned:
              Number(
                previousSession.total_earned || 0
              ),

            rate_per_second:
              Number(
                previousSession.rate_per_second || 0
              ),

            investment_amount:
              Number(
                previousSession.investment_amount || 0
              ),
          })
          .eq(
            'id',
            previousSession.id
          )
          .eq(
            'user_id',
            user.id
          )
          .eq(
            'active',
            false
          )
          .select()

        if (restartError) {
          console.error(
            'PAID MINING SESSION RESTART ERROR:',
            restartError
          )

          return NextResponse.json(
            {
              success: false,
              error:
                restartError.message,
            },
            {
              status: 500,
            }
          )
        }

        const restartedSession =
          restartedRows?.[0]

        if (!restartedSession) {
          // Another request may have changed the session
          // between the SELECT and UPDATE.
          //
          // Read the current state before deciding that
          // the operation actually failed.
          const {
            data: currentSession,
            error:
              currentSessionError,
          } = await supabase
            .from('mining_sessions')
            .select('*')
            .eq(
              'id',
              previousSession.id
            )
            .eq(
              'user_id',
              user.id
            )
            .maybeSingle()

          if (currentSessionError) {
            console.error(
              'CURRENT MINING SESSION ERROR:',
              currentSessionError
            )

            return NextResponse.json(
              {
                success: false,
                error:
                  currentSessionError.message,
              },
              {
                status: 500,
              }
            )
          }

          if (
            currentSession?.active === true
          ) {
            return NextResponse.json({
              success: true,
              session:
                currentSession,
              type:
                'paid_mining',
            })
          }

          return NextResponse.json(
            {
              success: false,
              error:
                'Paid mining session could not be started.',
            },
            {
              status: 409,
            }
          )
        }

        console.log(
          'PAID MINING SESSION STARTED:',
          {
            userId:
              user.id,

            sessionId:
              restartedSession.id,

            investmentAmount:
              restartedSession.investment_amount,

            ratePerSecond:
              restartedSession.rate_per_second,

            startedAt:
              restartedSession.started_at,

            lastClaimAt:
              restartedSession.last_claim_at,

            originalEndsAt:
              restartedSession.ends_at,

            existingReward:
              restartedSession.reward,

            totalEarned:
              restartedSession.total_earned,
          }
        )

        return NextResponse.json({
          success: true,

          session:
            restartedSession,

          type:
            'paid_mining',
        })
      }
    }

    // =====================================================
    // GET ACTIVE FREE MINING PLAN
    //
    // A new free session is created only when there is no
    // remaining paid mining period.
    // =====================================================

    const {
      data: freePlan,
      error: freePlanError,
    } = await supabase
      .from('mining_plans')
      .select('*')
      .eq('is_free', true)
      .eq('is_active', true)
      .maybeSingle()

    if (freePlanError) {
      console.error(
        'FREE MINING PLAN ERROR:',
        freePlanError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            freePlanError.message,
        },
        {
          status: 500,
        }
      )
    }

    if (!freePlan) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Free mining plan is currently unavailable.',
        },
        {
          status: 400,
        }
      )
    }

    // =====================================================
    // FREE PLAN DURATION
    //
    // The plan may have a multi-day availability period,
    // but each free Mine Now cycle is 24 hours.
    // =====================================================

    const durationDays = Number(
      freePlan.duration_days
    )

    if (
      !Number.isInteger(durationDays) ||
      durationDays <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Free mining plan has an invalid duration.',
        },
        {
          status: 400,
        }
      )
    }

    // =====================================================
    // FREE PLAN DAILY GOLD
    // =====================================================

    const dailyGold = Number(
      freePlan.free_daily_gold || 0
    )

    if (
      !Number.isFinite(dailyGold) ||
      dailyGold <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Free mining plan has an invalid mining rate.',
        },
        {
          status: 400,
        }
      )
    }

    // =====================================================
    // FREE PLAN RATE
    // =====================================================

    const ratePerSecond =
      dailyGold /
      SECONDS_PER_DAY

    if (
      !Number.isFinite(ratePerSecond) ||
      ratePerSecond <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Free mining plan produced an invalid mining rate.',
        },
        {
          status: 400,
        }
      )
    }

    // =====================================================
    // CREATE NEW FREE MINING CYCLE
    // =====================================================

    const start = now

    const end = new Date(
      start.getTime() +
        SECONDS_PER_DAY * 1000
    )

    const {
      data: session,
      error: createError,
    } = await supabase
      .from('mining_sessions')
      .insert({
        user_id:
          user.id,

        mining_plan_id:
          freePlan.id,

        investment_amount:
          0,

        active:
          true,

        status:
          'active',

        started_at:
          start.toISOString(),

        ends_at:
          end.toISOString(),

        last_claim_at:
          start.toISOString(),

        rate_per_second:
          ratePerSecond,

        reward:
          0,

        total_earned:
          0,

        processing_at:
          null,
      })
      .select()
      .single()

    if (createError) {
      console.error(
        'FREE MINING SESSION CREATE ERROR:',
        createError
      )

      // -------------------------------------------------
      // If two requests attempted to start mining at the
      // same time, re-read the active session before
      // returning an error.
      // -------------------------------------------------

      const {
        data: concurrentSession,
        error:
          concurrentSessionError,
      } = await supabase
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

      if (
        !concurrentSessionError &&
        concurrentSession
      ) {
        return NextResponse.json({
          success: true,
          session:
            concurrentSession,
          type:
            Number(
              concurrentSession.investment_amount ||
                0
            ) > 0
              ? 'paid_mining'
              : 'free_mining',
        })
      }

      return NextResponse.json(
        {
          success: false,
          error:
            createError.message,
        },
        {
          status: 500,
        }
      )
    }

    console.log(
      'FREE MINING SESSION CREATED:',
      {
        userId:
          user.id,

        planId:
          freePlan.id,

        dailyGold,

        durationDays,

        ratePerSecond,

        sessionId:
          session.id,

        startedAt:
          session.started_at,

        endsAt:
          session.ends_at,
      }
    )

    return NextResponse.json({
      success: true,

      session,

      type:
        'free_mining',
    })
  } catch (err: unknown) {
    console.error(
      'MINING START ERROR:',
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