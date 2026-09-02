import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/sendEmail'
import { depositSubmittedEmail } from '@/lib/email/templates'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // =====================================================
    // AUTH
    // =====================================================

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
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
    // BODY
    // =====================================================

    const body = await req.json()

    const amount = Number(
      body?.amount || 0
    )

    const methodId =
      typeof body?.method_id === 'string'
        ? body.method_id
        : ''

    const miningPlanId =
      typeof body?.mining_plan_id === 'string'
        ? body.mining_plan_id
        : ''

    // =====================================================
    // VALIDATION
    // =====================================================

    if (
      !amount ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          error: 'Invalid amount',
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
            'Payment method required',
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
      .eq(
        'id',
        methodId
      )
      .eq(
        'is_active',
        true
      )
      .maybeSingle()

    if (paymentMethodError) {
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
            'Selected payment method is not available.',
        },
        {
          status: 400,
        }
      )
    }

    // =====================================================
    // MINING PLAN VALIDATION
    //
    // If mining_plan_id is provided, this is a Mining Plan
    // deposit.
    //
    // If it is empty, this remains a normal deposit.
    // =====================================================

    let miningPlan:
      | {
          id: string
          name: string
          minimum_amount: number
          maximum_amount: number
          gold_per_dollar: number
          is_active: boolean
          is_free: boolean
        }
      | null = null

    if (miningPlanId) {
      const {
        data: plan,
        error: miningPlanError,
      } = await supabase
        .from('mining_plans')
        .select(
          `
            id,
            name,
            minimum_amount,
            maximum_amount,
            gold_per_dollar,
            duration_days,
            is_active,
            is_free
          `
        )
        .eq(
          'id',
          miningPlanId
        )
        .maybeSingle()

      if (miningPlanError) {
        console.error(
          'MINING PLAN ERROR:',
          miningPlanError
        )

        return NextResponse.json(
          {
            error:
              miningPlanError.message,
          },
          {
            status: 500,
          }
        )
      }

      if (!plan) {
        return NextResponse.json(
          {
            error:
              'Selected Mining Plan was not found.',
          },
          {
            status: 400,
          }
        )
      }

      if (!plan.is_active) {
        return NextResponse.json(
          {
            error:
              'Selected Mining Plan is currently unavailable.',
          },
          {
            status: 400,
          }
        )
      }

      if (plan.is_free) {
        return NextResponse.json(
          {
            error:
              'The Free Mining Plan does not require a deposit.',
          },
          {
            status: 400,
          }
        )
      }

      const minimumAmount =
        Number(
          plan.minimum_amount
        )

      const maximumAmount =
        Number(
          plan.maximum_amount
        )

      if (
        amount <
          minimumAmount ||
        amount >
          maximumAmount
      ) {
        return NextResponse.json(
          {
            error:
              `${plan.name} accepts investments from $${minimumAmount} to $${maximumAmount}.`,
          },
          {
            status: 400,
          }
        )
      }

      miningPlan = {
        id:
          plan.id,

        name:
          plan.name,

        minimum_amount:
          minimumAmount,

        maximum_amount:
          maximumAmount,

        gold_per_dollar:
          Number(
            plan.gold_per_dollar
          ),

        is_active:
          plan.is_active,

        is_free:
          plan.is_free,
      }

      console.log(
        'MINING PLAN DEPOSIT:',
        {
          planId:
            miningPlan.id,

          planName:
            miningPlan.name,

          amount,

          goldPerDollar:
            miningPlan.gold_per_dollar,

          dailyGold:
            amount *
            miningPlan.gold_per_dollar,
        }
      )
    }

    // =====================================================
    // CREATE DEPOSIT
    // =====================================================

    const now =
      new Date().toISOString()

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

        mining_plan_id:
          miningPlanId || null,

        status:
          'pending',

        created_at:
          now,

        updated_at:
          now,
      })
      .select()
      .single()

    if (depositError) {
      console.error(
        'DEPOSIT INSERT ERROR:',
        depositError
      )

      return NextResponse.json(
        {
          error:
            depositError.message,
        },
        {
          status: 500,
        }
      )
    }

    // =====================================================
    // TRANSACTION HISTORY
    //
    // reference_id directly points to the deposit.
    // This prevents approval from accidentally updating
    // another transaction with the same amount.
    // =====================================================

    const transactionDescription =
      miningPlan
        ? `${miningPlan.name} Mining Plan investment of $${amount} submitted for approval`
        : `Deposit request of $${amount} submitted`

    const {
      data: transaction,
      error: txError,
    } = await supabase
      .from('transactions')
      .insert({
        user_id:
          user.id,

        type:
          'deposit',

        amount:
          amount,

        status:
          'pending',

        reference_id:
          deposit.id,

        asset_type:
          miningPlan
            ? 'mining'
            : 'cash',

        currency:
          'USD',

        description:
          transactionDescription,

        created_at:
          now,
      })
      .select()
      .single()

    if (txError) {
      console.error(
        'TRANSACTION INSERT ERROR:',
        txError
      )

      // ===================================================
      // ROLLBACK DEPOSIT
      // ===================================================

      await supabase
        .from('deposits')
        .delete()
        .eq(
          'id',
          deposit.id
        )

      return NextResponse.json(
        {
          error:
            'Failed to create transaction history for this deposit.',
        },
        {
          status: 500,
        }
      )
    }

    // =====================================================
    // EMAIL NOTIFICATION
    // =====================================================

    try {
      await sendEmail({
        to:
          user.email!,

        subject:
          miningPlan
            ? 'Mining Plan Deposit Received'
            : 'Deposit Request Received',

        html:
          depositSubmittedEmail(
            amount,
            paymentMethod.name
          ),
      })
    } catch (emailError) {
      console.error(
        'DEPOSIT EMAIL ERROR:',
        emailError
      )

      // Email failure does NOT cancel the deposit.
      // The deposit and transaction already exist.
    }

    // =====================================================
    // AUDIT LOG
    // =====================================================

    console.log(
      '================================================='
    )

    console.log(
      '✅ DEPOSIT CREATED'
    )

    console.log(
      'USER:',
      user.id
    )

    console.log(
      'DEPOSIT ID:',
      deposit.id
    )

    console.log(
      'TRANSACTION ID:',
      transaction.id
    )

    console.log(
      'AMOUNT:',
      amount
    )

    console.log(
      'PAYMENT METHOD:',
      paymentMethod.name
    )

    console.log(
      'DEPOSIT TYPE:',
      miningPlan
        ? 'MINING PLAN'
        : 'NORMAL DEPOSIT'
    )

    if (miningPlan) {
      console.log(
        'MINING PLAN:',
        miningPlan.name
      )

      console.log(
        'MINING PLAN ID:',
        miningPlan.id
      )

      console.log(
        'EXPECTED DAILY GOLD:',
        amount *
          miningPlan.gold_per_dollar
      )
    }

    console.log(
      '================================================='
    )

    // =====================================================
    // SUCCESS
    // =====================================================

    return NextResponse.json({
      success:
        true,

      deposit,

      transaction,

      miningPlan:
        miningPlan
          ? {
              id:
                miningPlan.id,

              name:
                miningPlan.name,

              dailyGold:
                amount *
                miningPlan.gold_per_dollar,
            }
          : null,
    })
  } catch (err: unknown) {
    console.error(
      'DEPOSIT API ERROR:',
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