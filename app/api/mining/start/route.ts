export const dynamic =
  'force-dynamic'

export const revalidate = 0

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
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
          error:
            'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    // existing active session

    const {
      data: existing,
    } =
      await supabase
        .from(
          'mining_sessions'
        )
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

    if (existing) {

      return NextResponse.json({
        success: true,
        session: existing,
      })
    }

    const start =
      new Date()

    const end =
      new Date(
        start.getTime()
        +
        24 *
        60 *
        60 *
        1000
      )

    const {
      data: session,
      error,
    } =
      await supabase
        .from(
          'mining_sessions'
        )
        .insert({

          user_id:
            user.id,

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
            5 / 3600,

          reward:
            0,

          total_earned:
            0,

        })
        .select()
        .single()

    if (error) {

      return NextResponse.json(
        {
          error:
            error.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json({
      success: true,
      session,
    })

  } catch (err: any) {

    return NextResponse.json(
      {
        error:
          err.message,
      },
      {
        status: 500,
      }
    )
  }
}