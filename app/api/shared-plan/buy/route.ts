import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: NextRequest) {
  try {
    console.log(
      '================ SHARED PLAN BUY ================'
    )

    const supabase = await createClient()

    // =====================================================
    // USER
    // =====================================================

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    console.log(
      'USER:',
      user.id
    )

    // =====================================================
    // REQUEST
    // =====================================================

    const body = await req.json()

    const amount = Number(
      body?.amount || 0
    )

    const methodId =
      typeof body?.method_id === 'string'
        ? body.method_id
        : ''

    console.log(
      'REQUEST:',
      {
        amount,
        methodId,
      }
    )

    // =====================================================
    // VALIDATION
    // =====================================================

    if (
      !amount ||
      amount < 1000
    ) {
      return NextResponse.json(
        {
          error:
            'Minimum investment is $1000',
        },
        {
          status: 400,
        }
      )
    }

    if (!methodId) {
      return NextResponse.json(
        {
          error:
            'Payment method is required',
        },
        {
          status: 400,
        }
      )
    }

    // =====================================================
    // VERIFY PAYMENT METHOD
    // =====================================================

    const {
      data: paymentMethod,
      error: paymentMethodError,
    } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', methodId)
      .maybeSingle()

    if (
      paymentMethodError
    ) {
      console.error(
        'PAYMENT METHOD ERROR:',
        paymentMethodError
      )

      return NextResponse.json(
        {
          error:
            paymentMethodError.message,
        },
        {
          status: 500,
        }
      )
    }

    if (!paymentMethod) {
      return NextResponse.json(
        {
          error:
            'Selected payment method was not found.',
        },
        {
          status: 400,
        }
      )
    }

    // =====================================================
    // PREVENT DUPLICATE PENDING PLAN
    // =====================================================

    const {
      data: existingPlan,
      error: existingPlanError,
    } = await supabase
      .from('shared_plans')
      .select('id')
      .eq(
        'user_id',
        user.id
      )
      .eq(
        'status',
        'pending'
      )
      .eq(
        'active',
        false
      )
      .maybeSingle()

    if (
      existingPlanError
    ) {
      console.error(
        'EXISTING PLAN CHECK ERROR:',
        existingPlanError
      )

      return NextResponse.json(
        {
          error:
            existingPlanError.message,
        },
        {
          status: 500,
        }
      )
    }

    if (existingPlan) {
      return NextResponse.json(
        {
          error:
            'You already have a Share Plan deposit waiting for approval.',
        },
        {
          status: 400,
        }
      )
    }

    // =====================================================
    // CREATE PENDING SHARE PLAN
    // =====================================================

    const now =
      new Date()

    const {
      data: plan,
      error: planError,
    } = await supabase
      .from('shared_plans')
      .insert({
        user_id:
          user.id,

        amount:
          amount,

        daily_roi:
          5,

        duration_days:
          30,

        days_completed:
          0,

        total_profit_generated:
          0,

        status:
          'pending',

        started_at:
          null,

        ends_at:
          null,

        last_profit_at:
          null,

        monthly_roi:
          150,

        minimum_amount:
          1000,

        total_invested:
          amount,

        active:
          false,

        title:
          'Imperial Gold Fund',

        description:
          'Buy company shares and earn monthly returns',

        created_at:
          now.toISOString(),

        updated_at:
          now.toISOString(),
      })
      .select()
      .single()

    if (
      planError ||
      !plan
    ) {
      console.error(
        'SHARED PLAN CREATE ERROR:',
        planError
      )

      return NextResponse.json(
        {
          error:
            planError?.message ||
            'Failed to create Share Plan.',
        },
        {
          status: 500,
        }
      )
    }

    console.log(
      'PENDING SHARE PLAN CREATED:',
      plan.id
    )

    // =====================================================
    // CREATE PENDING DEPOSIT
    // =====================================================

    const {
      data: deposit,
      error: depositError,
    } = await supabase
      .from('deposits')
      .insert({
        user_id:
          user.id,

        amount:
          amount,

        method_id:
          methodId,

        shared_plan_id:
          plan.id,

        status:
          'pending',

        created_at:
          now.toISOString(),

        updated_at:
          now.toISOString(),
      })
      .select()
      .single()

    if (
      depositError ||
      !deposit
    ) {
      console.error(
        'DEPOSIT CREATE ERROR:',
        depositError
      )

      // Roll back the pending plan.
      await supabase
        .from('shared_plans')
        .delete()
        .eq(
          'id',
          plan.id
        )

      return NextResponse.json(
        {
          error:
            depositError?.message ||
            'Failed to create deposit.',
        },
        {
          status: 500,
        }
      )
    }

    console.log(
      'PENDING DEPOSIT CREATED:',
      deposit.id
    )

    // =====================================================
    // CREATE PENDING TRANSACTION
    // =====================================================

    const {
      data: transaction,
      error: transactionError,
    } = await supabase
      .from('transactions')
      .insert({
        user_id:
          user.id,

        type:
          'shared_plan',

        amount:
          amount,

        status:
          'pending',

        description:
          `Share Plan investment of $${amount} submitted for approval`,

          reference_id:
           deposit.id,

        created_at:
          now.toISOString(),
      })
      .select()
      .single()

    if (
      transactionError
    ) {
      console.error(
        'TRANSACTION CREATE ERROR:',
        transactionError
      )

      // Roll back deposit.
      await supabase
        .from('deposits')
        .delete()
        .eq(
          'id',
          deposit.id
        )

      // Roll back plan.
      await supabase
        .from('shared_plans')
        .delete()
        .eq(
          'id',
          plan.id
        )

      return NextResponse.json(
        {
          error:
            transactionError.message,
        },
        {
          status: 500,
        }
      )
    }

    console.log(
      'PENDING SHARE PLAN TRANSACTION:',
      transaction.id
    )

    // =====================================================
    // SUCCESS
    //
    // IMPORTANT:
    // No balance.cash is changed here.
    //
    // The money stays outside the user's account balance
    // until the admin approves the deposit.
    // =====================================================

    return NextResponse.json({
      success:
        true,

      message:
        'Share Plan deposit submitted successfully and is waiting for admin approval.',

      deposit,

      investment:
        plan,
    })
  } catch (err: unknown) {
    console.error(
      'SHARED PLAN BUY ERROR:',
      err
    )

    const message =
      err instanceof Error
        ? err.message
        : 'Server error'

    return NextResponse.json(
      {
        error:
          message,
      },
      {
        status: 500,
      }
    )
  }
}