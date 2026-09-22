export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // =====================================================
    // FIND THE LATEST PAID MINING SESSION
    //
    // We deliberately filter for investment_amount > 0.
    //
    // This keeps paid mining separate from free mining.
    // =====================================================

    const {
      data: session,
      error: sessionError,
    } = await supabase
      .from('mining_sessions')
      .select('id')
      .eq('user_id', user.id)
      .gt('investment_amount', 0)
      .order('started_at', {
        ascending: false,
      })
      .limit(1)
      .maybeSingle()

    if (sessionError) {
      console.error(
        'PAID MINING SESSION LOOKUP ERROR:',
        sessionError
      )

      return NextResponse.json(
        {
          success: false,
          error: sessionError.message,
        },
        {
          status: 500,
        }
      )
    }

    if (!session) {
      return NextResponse.json({
        success: true,
        claimed: 0,
        credited: 0,
        completed: false,
        message:
          'No paid mining reward is available to claim.',
      })
    }

    // =====================================================
    // ATOMIC PAID MINING CLAIM
    //
    // The database function performs the complete claim:
    //
    // mining_sessions.reward
    //        ↓
    // balances.gold
    //        ↓
    // transaction history
    //
    // All of those operations occur inside one database
    // transaction.
    // =====================================================

    const {
      data: claimResult,
      error: claimError,
    } = await supabase.rpc(
      'claim_paid_mining_reward',
      {
        p_user_id: user.id,
        p_session_id: session.id,
      }
    )

    if (claimError) {
      console.error(
        'PAID MINING CLAIM ERROR:',
        claimError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            claimError.message ||
            'Unable to claim paid mining reward.',
        },
        {
          status: 500,
        }
      )
    }

    // =====================================================
    // RPC RETURNS A TABLE
    // =====================================================

    const result =
      Array.isArray(claimResult)
        ? claimResult[0]
        : null

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Paid mining claim returned no result.',
        },
        {
          status: 500,
        }
      )
    }

    const claimed =
      Number(
        result.claimed || 0
      )

    const totalEarned =
      Number(
        result.total_earned || 0
      )

    const completed =
      Boolean(
        result.completed
      )

    // =====================================================
    // SUCCESS
    // =====================================================

    console.log(
      'PAID MINING CLAIM SUCCESS:',
      {
        userId:
          user.id,

        sessionId:
          session.id,

        claimed,

        totalEarned,

        completed,
      }
    )

    return NextResponse.json({
      success: true,

      claimed,

      credited:
        claimed,

      reward:
        0,

      total_earned:
        totalEarned,

      completed,
    })
  } catch (err: unknown) {
    console.error(
      'PAID MINING CLAIM ROUTE ERROR:',
      err
    )

    const message =
      err instanceof Error
        ? err.message
        : 'Unable to claim paid mining reward.'

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