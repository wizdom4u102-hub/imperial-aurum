export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // =====================================================
    // USER
    // =====================================================

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    // =====================================================
    // EXISTING ACTIVE SESSION
    // =====================================================

    const {
      data: existing,
      error: existingError,
    } = await supabase
      .from('mining_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('active', true)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json(
        {
          error: existingError.message,
        },
        {
          status: 500,
        }
      )
    }

    if (existing) {
      return NextResponse.json({
        success: true,
        session: existing,
      })
    }

    // =====================================================
    // GET FREE MINING PLAN
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
          error: freePlanError.message,
        },
        {
          status: 500,
        }
      )
    }

    if (!freePlan) {
      return NextResponse.json(
        {
          error:
            'Free mining plan is currently unavailable.',
        },
        {
          status: 400,
        }
      )
    }

        const durationDays =
      Number(freePlan.duration_days)

    if (
      !Number.isInteger(durationDays) ||
      durationDays <= 0
    ) {
      return NextResponse.json(
        {
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

    const dailyGold =
      Number(
        freePlan.free_daily_gold || 0
      )

    if (dailyGold <= 0) {
      return NextResponse.json(
        {
          error:
            'Free mining plan has an invalid mining rate.',
        },
        {
          status: 400,
        }
      )
    }

   const ratePerSecond =
     dailyGold /
        (24 * 60 * 60)

    // =====================================================
    // CREATE FREE MINING SESSION
    // =====================================================

    const start =
      new Date()

    const end =
      new Date(
        start.getTime() +
           24 * 60 * 60 * 1000
      )

    const {
      data: session,
      error,
    } = await supabase
      .from('mining_sessions')
      .insert({
        user_id: user.id,

        mining_plan_id:
          freePlan.id,

        investment_amount:
          0,

        active: true,

        status: 'active',

        started_at:
          start.toISOString(),

        ends_at:
          end.toISOString(),

        last_claim_at:
          start.toISOString(),

        rate_per_second:
          ratePerSecond,

        reward: 0,

        total_earned: 0,
      })
      .select()
      .single()

    if (error) {
      console.error(
        'MINING SESSION CREATE ERROR:',
        error
      )

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      )
    }

    console.log(
      'FREE MINING SESSION CREATED:',
      {
        userId: user.id,
        planId: freePlan.id,
        dailyGold,
        durationDays,
        ratePerSecond,
        sessionId: session.id,
      }
    )

    return NextResponse.json({
      success: true,
      session,
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
        error: message,
      },
      {
        status: 500,
      }
    )
  }
}