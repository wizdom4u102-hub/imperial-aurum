import { NextResponse } from 'next/server'

import { requireAdminApi } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type SharePlanPayload = {
  id?: string
  title?: string
  description?: string | null
  amount?: number
  minimum_amount?: number
  daily_roi?: number
  monthly_roi?: number
  duration_days?: number
  days_completed?: number
  total_invested?: number
  total_profit_generated?: number
  started_at?: string | null
  ends_at?: string | null
  active?: boolean
  status?: string
}

// =====================================================
// VALIDATION
// =====================================================

function validatePayload(
  payload: SharePlanPayload
): string | null {
  if (!payload.id?.trim()) {
    return 'Share plan ID is required.'
  }

  if (!payload.title?.trim()) {
    return 'Share plan title is required.'
  }

  const amount = Number(payload.amount)

  const minimumAmount = Number(
    payload.minimum_amount
  )

  const dailyRoi = Number(
    payload.daily_roi
  )

  const monthlyRoi = Number(
    payload.monthly_roi
  )

  const durationDays = Number(
    payload.duration_days
  )

  const daysCompleted = Number(
    payload.days_completed
  )

  const totalInvested = Number(
    payload.total_invested
  )

  const totalProfitGenerated =
    Number(
      payload.total_profit_generated
    )

  if (!Number.isFinite(amount) || amount < 0) {
    return 'Investment amount is invalid.'
  }

  if (
    !Number.isFinite(minimumAmount) ||
    minimumAmount < 0
  ) {
    return 'Minimum amount is invalid.'
  }

  if (
    !Number.isFinite(dailyRoi) ||
    dailyRoi < 0
  ) {
    return 'Daily ROI is invalid.'
  }

  if (
    !Number.isFinite(monthlyRoi) ||
    monthlyRoi < 0
  ) {
    return 'Monthly ROI is invalid.'
  }

  if (
    !Number.isFinite(durationDays) ||
    durationDays < 0
  ) {
    return 'Duration is invalid.'
  }

  if (
    !Number.isFinite(daysCompleted) ||
    daysCompleted < 0
  ) {
    return 'Completed days are invalid.'
  }

  if (
    durationDays > 0 &&
    daysCompleted > durationDays
  ) {
    return 'Completed days cannot exceed the plan duration.'
  }

  if (
    !Number.isFinite(totalInvested) ||
    totalInvested < 0
  ) {
    return 'Total invested amount is invalid.'
  }

  if (
    !Number.isFinite(totalProfitGenerated) ||
    totalProfitGenerated < 0
  ) {
    return 'Total profit generated is invalid.'
  }

  if (
    payload.status &&
    ![
      'active',
      'completed',
      'pending',
      'cancelled',
    ].includes(payload.status)
  ) {
    return 'Invalid share plan status.'
  }

  return null
}

// =====================================================
// GET
// =====================================================

export async function GET() {
  const admin = await requireAdminApi()

  if (!admin.ok) {
    return NextResponse.json(
      {
        success: false,
        error: admin.error,
      },
      {
        status: admin.status,
      }
    )
  }

  const {
    data: plans,
    error: plansError,
  } =
    await supabaseAdmin
      .from('shared_plans')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

  if (plansError) {
    console.error(
      'ADMIN SHARE PLANS GET ERROR:',
      plansError
    )

    return NextResponse.json(
      {
        success: false,
        error: plansError.message,
      },
      {
        status: 500,
      }
    )
  }

  const userIds = [
    ...new Set(
      (plans ?? [])
        .map(
          (plan) =>
            plan.user_id
        )
        .filter(
          (
            userId
          ): userId is string =>
            typeof userId === 'string' &&
            userId.length > 0
        )
    ),
  ]

  const {
    data: profiles,
    error: profilesError,
  } =
    userIds.length > 0
      ? await supabaseAdmin
          .from('profiles')
          .select(
            'id, name, username, email'
          )
          .in(
            'id',
            userIds
          )
      : {
          data: [],
          error: null,
        }

  if (profilesError) {
    console.error(
      'ADMIN SHARE PLAN PROFILES ERROR:',
      profilesError
    )

    return NextResponse.json(
      {
        success: false,
        error:
          profilesError.message,
      },
      {
        status: 500,
      }
    )
  }

  return NextResponse.json({
    success: true,
    plans: plans ?? [],
    profiles: profiles ?? [],
  })
}

// =====================================================
// PATCH
// =====================================================

export async function PATCH(
  request: Request
) {
  const admin = await requireAdminApi()

  if (!admin.ok) {
    return NextResponse.json(
      {
        success: false,
        error: admin.error,
      },
      {
        status: admin.status,
      }
    )
  }

  try {
    const payload =
      (await request.json()) as SharePlanPayload

    const validationError =
      validatePayload(payload)

    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: validationError,
        },
        {
          status: 400,
        }
      )
    }

    const id =
      payload.id!.trim()

    // =================================================
    // VERIFY EXISTING SHARE PLAN
    // =================================================

    const {
      data: existingPlan,
      error: existingError,
    } =
      await supabaseAdmin
        .from('shared_plans')
        .select(
          'id, user_id'
        )
        .eq('id', id)
        .maybeSingle()

    if (existingError) {
      console.error(
        'ADMIN SHARE PLAN LOOKUP ERROR:',
        existingError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            existingError.message,
        },
        {
          status: 500,
        }
      )
    }

    if (!existingPlan) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Share plan not found.',
        },
        {
          status: 404,
        }
      )
    }

    // =================================================
    // UPDATE EXISTING RECORD
    // =================================================

    const {
      data: updatedPlan,
      error: updateError,
    } =
      await supabaseAdmin
        .from('shared_plans')
        .update({
          title:
            payload.title!.trim(),

          description:
            payload.description?.trim() ||
            null,

          amount:
            Number(
              payload.amount
            ),

          minimum_amount:
            Number(
              payload.minimum_amount
            ),

          daily_roi:
            Number(
              payload.daily_roi
            ),

          monthly_roi:
            Number(
              payload.monthly_roi
            ),

          duration_days:
            Number(
              payload.duration_days
            ),

          days_completed:
            Number(
              payload.days_completed
            ),

          total_invested:
            Number(
              payload.total_invested
            ),

          total_profit_generated:
            Number(
              payload.total_profit_generated
            ),

          started_at:
            payload.started_at ??
            null,

          ends_at:
            payload.ends_at ??
            null,

          active:
            payload.active ??
            false,

          status:
            payload.status ??
            'active',
        })
        .eq('id', id)
        .select()
        .single()

    if (updateError) {
      console.error(
        'ADMIN SHARE PLAN UPDATE ERROR:',
        updateError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            updateError.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json({
      success: true,
      plan: updatedPlan,
    })
  } catch (error: unknown) {
    console.error(
      'ADMIN SHARE PLAN PATCH ERROR:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update share plan.',
      },
      {
        status: 500,
      }
    )
  }
}