export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

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

    const { data: session, error: sessionError } =
      await supabase
        .from('mining_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .maybeSingle()

        console.log('MINING SESSION:', session)
        console.log('SESSION FOUND:', {
  id: session?.id,
  active: session?.active,
  status: session?.status,
  started_at: session?.started_at,
  ends_at: session?.ends_at,
})

    if (sessionError) {
      throw new Error(sessionError.message)
    }

    if (!session) {
      return NextResponse.json({
        success: false,
        session: null,
      })
    }

    const rawEnd = String(session.ends_at)

    const normalizedEnd =
      rawEnd.endsWith('Z')
        ? rawEnd
        : rawEnd + 'Z'

    const endTime =
      new Date(normalizedEnd).getTime()

    const now = Date.now()
    console.log({
  now,
  endTime,
  remaining: endTime - now,
})

    // =====================
    // SESSION STILL ACTIVE
    // =====================

    if (now < endTime) {
      return NextResponse.json({
        success: true,
        session,
      })
    }

    // =====================
    // ALREADY COMPLETED
    // =====================

    if (
      session.status === 'completed' ||
      session.active === false
    ) {
      return NextResponse.json({
        success: true,
        completed: true,
        credited:
          Number(session.reward || 0),
      })
    }

    // =====================
    // LOCK SESSION
    // =====================
console.log(
  'STATUS BEFORE LOCK:',
  session.status
)

    const { data: lockRows, error: lockError } =
  await supabase
    .from('mining_sessions')
    .update({
      status: 'processing',
    })
    .eq('id', session.id)
    .eq('status', 'active')
    .select()

console.log('LOCK ROWS:', lockRows)
console.log('LOCK ERROR:', lockError)

const lockedSession =
  lockRows?.[0] || null

    if (lockError || !lockedSession) {
      const { data: latest } =
        await supabase
          .from('mining_sessions')
          .select('*')
          .eq('id', session.id)
          .maybeSingle()

      return NextResponse.json({
        success: true,
        completed:
          latest?.active === false,
        credited:
          Number(
            latest?.reward ||
            latest?.total_earned ||
            0
          ),
      })
    }

    // =====================
    // CALCULATE REWARD
    // =====================

    const started =
      new Date(
        lockedSession.started_at
      ).getTime()

    const seconds =
      Math.max(
        0,
        Math.floor(
          (endTime - started) / 1000
        )
      )

    const earned =
      Number(
        lockedSession.rate_per_second || 0
      ) * seconds

    // =====================
    // BALANCE
    // =====================

    const {
      data: balance,
      error: balanceError,
    } = await supabase
      .from('balances')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (balanceError) {
      throw new Error(
        balanceError.message
      )
    }

    if (!balance) {
      const { error } =
        await supabase
          .from('balances')
          .insert({
            user_id: user.id,
            gold: earned,
            cash: 0,
          })

      if (error) {
        throw new Error(error.message)
      }
    } else {
      const { error } =
        await supabase
          .from('balances')
          .update({
            gold:
              Number(
                balance.gold || 0
              ) + earned,
          })
          .eq(
            'user_id',
            user.id
          )

      if (error) {
        throw new Error(error.message)
      }
    }
    console.log('EARNED:', earned)
console.log('SESSION ID:', lockedSession.id)

    // =====================
    // COMPLETE SESSION
    // =====================

    const {
  data: completedRow,
  error: completeError,
} = await supabase
  .from('mining_sessions')
  .update({
    active: false,
    status: 'completed',
    reward: earned,
    total_earned: earned,
  })
  .eq(
    'id',
    lockedSession.id
  )
  .eq(
    'status',
    'processing'
  )
  .select()

console.log(
  'COMPLETE RESULT:',
  completedRow,
  completeError
)

if (completeError) {
  throw new Error(
    completeError.message
  )
}

    // =====================
    // TRANSACTION
    // =====================

    await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'mining',
        amount: earned,
        status: 'completed',
        description:
          'Mining reward credited',
      })

    return NextResponse.json({
      success: true,
      completed: true,
      credited: earned,
    })
  } catch (err: any) {
    console.error(
      'MINING SESSION ERROR',
      err
    )

    return NextResponse.json(
      {
        success: false,
        error:
          err.message ||
          'Mining error',
      },
      {
        status: 500,
      }
    )
  }
}