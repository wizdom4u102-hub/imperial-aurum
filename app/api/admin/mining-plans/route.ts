import { NextResponse } from 'next/server'

import { requireAdminApi } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type MiningPlanPayload = {
  id?: string
  name?: string
  description?: string | null
  minimum_amount?: number
  maximum_amount?: number
  gold_per_dollar?: number
  free_daily_gold?: number
  is_free?: boolean
  is_active?: boolean
  duration_days?: number
}

function validatePlan(
  payload: MiningPlanPayload
): string | null {
  const name = payload.name?.trim()

  if (!name) {
    return 'Plan name is required.'
  }

  const minimumAmount = Number(
    payload.minimum_amount
  )

  const maximumAmount = Number(
    payload.maximum_amount
  )

  const goldPerDollar = Number(
    payload.gold_per_dollar
  )

  const freeDailyGold = Number(
    payload.free_daily_gold
  )

  if (
    !Number.isFinite(minimumAmount) ||
    minimumAmount < 0
  ) {
    return 'Minimum amount is invalid.'
  }

  if (
    !Number.isFinite(maximumAmount) ||
    maximumAmount < minimumAmount
  ) {
    return 'Maximum amount must be greater than or equal to the minimum amount.'
  }

  if (
    !Number.isFinite(goldPerDollar) ||
    goldPerDollar < 0
  ) {
    return 'Gold per dollar is invalid.'
  }

  if (
    !Number.isFinite(freeDailyGold) ||
    freeDailyGold < 0
  ) {
    return 'Free daily Gold is invalid.'
  }

  if (
    payload.is_free === true &&
    freeDailyGold <= 0
  ) {
    return 'Free mining plans must have a daily Gold amount greater than zero.'
  }

  if (
    payload.is_free === false &&
    goldPerDollar <= 0
  ) {
    return 'Paid mining plans must have a Gold-per-dollar rate greater than zero.'
  }

  const durationDays = Number(
  payload.duration_days
)

if (
  !Number.isInteger(durationDays) ||
  durationDays <= 0
) {
  return 'Duration must be a whole number greater than zero.'
}

  return null
}

// =====================================================
// GET — LOAD MINING PLANS
// =====================================================

export async function GET(
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

  const { searchParams } =
    new URL(request.url)

  const type =
    searchParams.get('type')

  let query = supabaseAdmin
    .from('mining_plans')
    .select('*')
    .order('minimum_amount', {
      ascending: true,
    })

  // =====================================================
  // PAID PLANS ONLY
  // =====================================================

  if (type === 'paid') {
    query = query.eq(
      'is_free',
      false
    )
  }

  // =====================================================
  // FREE PLANS ONLY
  // =====================================================

  if (type === 'free') {
    query = query.eq(
      'is_free',
      true
    )
  }

  const {
    data: plans,
    error,
  } = await query

  if (error) {
    console.error(
      'ADMIN MINING PLANS GET ERROR:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    )
  }

  return NextResponse.json({
    success: true,
    plans: plans ?? [],
  })
}

// =====================================================
// POST — CREATE MINING PLAN
// =====================================================

export async function POST(
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
      (await request.json()) as MiningPlanPayload

    const validationError =
      validatePlan(payload)

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

    const name =
      payload.name!.trim()

    // Prevent duplicate plan names.
    const {
      data: existingPlan,
      error: existingError,
    } = await supabaseAdmin
      .from('mining_plans')
      .select('id')
      .eq('name', name)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json(
        {
          success: false,
          error: existingError.message,
        },
        {
          status: 500,
        }
      )
    }

    if (existingPlan) {
      return NextResponse.json(
        {
          success: false,
          error:
            'A mining plan with this name already exists.',
        },
        {
          status: 409,
        }
      )
    }

    const {
      data: plan,
      error,
    } = await supabaseAdmin
      .from('mining_plans')
      .insert({
        name,
        description:
          payload.description?.trim() || null,
        minimum_amount:
          Number(payload.minimum_amount),
        maximum_amount:
          Number(payload.maximum_amount),
        gold_per_dollar:
          Number(payload.gold_per_dollar),
        free_daily_gold:
          Number(payload.free_daily_gold),
        is_free:
          payload.is_free === true,
        is_active:
          payload.is_active !== false,
                  duration_days:
          Number(payload.duration_days),
      })
      .select()
      .single()

    if (error) {
      console.error(
        'ADMIN MINING PLAN CREATE ERROR:',
        error
      )

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        plan,
      },
      {
        status: 201,
      }
    )
  } catch (error: unknown) {
    console.error(
      'ADMIN MINING PLAN CREATE ERROR:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create mining plan.',
      },
      {
        status: 500,
      }
    )
  }
}

// =====================================================
// PATCH — UPDATE MINING PLAN
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
      (await request.json()) as MiningPlanPayload

    if (!payload.id?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Mining plan ID is required.',
        },
        {
          status: 400,
        }
      )
    }

    const validationError =
      validatePlan(payload)

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
      payload.id.trim()

    const name =
      payload.name!.trim()

    // Make sure the plan being edited exists.
    const {
      data: existingPlan,
      error: existingError,
    } = await supabaseAdmin
      .from('mining_plans')
      .select('id')
      .eq('id', id)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json(
        {
          success: false,
          error: existingError.message,
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
          error: 'Mining plan not found.',
        },
        {
          status: 404,
        }
      )
    }

    // Prevent another plan from using the same name.
    const {
      data: duplicatePlan,
      error: duplicateError,
    } = await supabaseAdmin
      .from('mining_plans')
      .select('id')
      .eq('name', name)
      .neq('id', id)
      .maybeSingle()

    if (duplicateError) {
      return NextResponse.json(
        {
          success: false,
          error: duplicateError.message,
        },
        {
          status: 500,
        }
      )
    }

    if (duplicatePlan) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Another mining plan already uses this name.',
        },
        {
          status: 409,
        }
      )
    }

    const {
      data: plan,
      error,
    } = await supabaseAdmin
      .from('mining_plans')
      .update({
        name,
        description:
          payload.description?.trim() || null,
        minimum_amount:
          Number(payload.minimum_amount),
        maximum_amount:
          Number(payload.maximum_amount),
        gold_per_dollar:
          Number(payload.gold_per_dollar),
        free_daily_gold:
          Number(payload.free_daily_gold),
        is_free:
          payload.is_free === true,
        is_active:
          payload.is_active !== false,
                  duration_days:
          Number(payload.duration_days),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(
        'ADMIN MINING PLAN UPDATE ERROR:',
        error
      )

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json({
      success: true,
      plan,
    })
  } catch (error: unknown) {
    console.error(
      'ADMIN MINING PLAN UPDATE ERROR:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update mining plan.',
      },
      {
        status: 500,
      }
    )
  }
}