import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/sendEmail'
import { withdrawalApprovedEmail } from '@/lib/email/templates'

export async function POST(
  req: Request,
  context: {
    params: Promise<{ id: string }>
  }
) {
  try {
    console.log(
      '=========== APPROVE WITHDRAWAL =========='
    )

    // ================= ADMIN AUTH =================
    const admin =
      await requireAdminApi()

    if (!admin.ok) {
      console.error(
        '❌ ADMIN AUTH FAILED:',
        admin.error
      )

      return NextResponse.json(
        {
          error: admin.error
        },
        {
          status: admin.status
        }
      )
    }

    const { id } =
      await context.params

    console.log(
      'WITHDRAWAL ID:',
      id
    )

    // ================= GET WITHDRAWAL =================
    const {
      data: withdrawal,
      error: withdrawalError
    } =
      await supabaseAdmin
        .from('withdrawals')
        .select('*')
        .eq('id', id)
        .single()

    if (
      withdrawalError ||
      !withdrawal
    ) {
      console.error(
        '❌ WITHDRAWAL FETCH ERROR:',
        withdrawalError
      )

      return NextResponse.json(
        {
          error: 'Withdrawal not found'
        },
        {
          status: 404
        }
      )
    }

    console.log(
      'WITHDRAWAL:',
      withdrawal
    )

    // ================= ALREADY APPROVED =================
    if (
      withdrawal.status === 'approved'
    ) {
      return NextResponse.json(
        {
          error: 'Withdrawal already approved'
        },
        {
          status: 400
        }
      )
    }

    const userId =
      withdrawal.user_id

    const withdrawAmount =
      Number(
        withdrawal.amount || 0
      )

    // ================= GET USER EMAIL =================
const {
  data: profile,
} =
  await supabaseAdmin.auth.admin.getUserById(
    userId
  )

const userEmail =
  profile.user?.email

// ================= GET USERNAME =================
const {
  data: userProfile,
  error: userProfileError,
} =
  await supabaseAdmin
    .from('profiles')
    .select('username')
    .eq(
      'id',
      userId
    )
    .single()

if (
  userProfileError ||
  !userProfile
) {
  console.error(
    '❌ PROFILE FETCH ERROR:',
    userProfileError
  )

  return NextResponse.json(
    {
      error:
        'User profile not found'
    },
    {
      status: 404
    }
  )
}

const username =
  userProfile.username ||
  'User'

    // ================= GET USER BALANCE =================
    const {
      data: balance,
      error: balanceFetchError
    } =
      await supabaseAdmin
        .from('balances')
        .select('*')
        .eq(
          'user_id',
          userId
        )
        .single()

    if (
      balanceFetchError ||
      !balance
    ) {
      console.error(
        '❌ BALANCE FETCH ERROR:',
        balanceFetchError
      )

      return NextResponse.json(
        {
          error: 'Balance not found'
        },
        {
          status: 404
        }
      )
    }

    const currentCash =
      Number(
        balance.cash || 0
      )

    // ================= CHECK FUNDS =================
    if (
      currentCash <
      withdrawAmount
    ) {
      return NextResponse.json(
        {
          error:
            'Insufficient user balance'
        },
        {
          status: 400
        }
      )
    }

    // ================= DEDUCT USER BALANCE =================
    const {
      error: balanceUpdateError
    } =
      await supabaseAdmin
        .from('balances')
        .update({
          cash:
            currentCash -
            withdrawAmount,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          'user_id',
          userId
        )

    if (
      balanceUpdateError
    ) {
      console.error(
        '❌ BALANCE UPDATE ERROR:',
        balanceUpdateError
      )

      return NextResponse.json(
        {
          error:
            balanceUpdateError.message
        },
        {
          status: 500
        }
      )
    }

    // ================= UPDATE WITHDRAWAL STATUS =================
    const {
      error: withdrawalUpdateError
    } =
      await supabaseAdmin
        .from('withdrawals')
        .update({
          status:
            'approved',
        })
        .eq(
          'id',
          id
        )

    if (
      withdrawalUpdateError
    ) {
      console.error(
        '❌ WITHDRAWAL UPDATE ERROR:',
        withdrawalUpdateError
      )

      return NextResponse.json(
        {
          error:
            withdrawalUpdateError.message
        },
        {
          status: 500
        }
      )
    }

    // =====================================================
    // FIND EXISTING PENDING WITHDRAWAL TRANSACTION
    // =====================================================

    const {
      data: pendingTransactions,
      error: pendingTransactionsError
    } =
      await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq(
          'user_id',
          userId
        )
        .eq(
          'type',
          'withdrawal'
        )
        .eq(
          'status',
          'pending'
        )
        .order(
          'created_at',
          {
            ascending: false
          }
        )

    if (
      pendingTransactionsError
    ) {
      console.error(
        '❌ PENDING TRANSACTION FETCH ERROR:',
        pendingTransactionsError
      )
    }

    // =====================================================
    // MATCH THE EXISTING TRANSACTION
    // =====================================================

    const pendingTransaction =
      pendingTransactions?.find(
        (transaction) =>
          Number(
            transaction.amount
          ) === withdrawAmount
      )

    console.log(
      'PENDING WITHDRAWAL TRANSACTION:',
      pendingTransaction
    )

    // =====================================================
    // UPDATE THE EXISTING TRANSACTION
    // =====================================================

    if (
      pendingTransaction
    ) {
      const {
        error: txUpdateError
      } =
        await supabaseAdmin
          .from('transactions')
          .update({
            status:
              'completed',

            description:
              `Withdrawal of $${withdrawAmount} approved by admin`,
          })
          .eq(
            'id',
            pendingTransaction.id
          )

      if (
        txUpdateError
      ) {
        console.error(
          '❌ TX UPDATE ERROR:',
          txUpdateError
        )
      } else {
        console.log(
          '✅ EXISTING WITHDRAWAL TRANSACTION UPDATED:',
          pendingTransaction.id
        )
      }
    } else {
      console.error(
        '❌ NO MATCHING PENDING WITHDRAWAL TRANSACTION FOUND',
        {
          userId,
          withdrawAmount,
        }
      )
    }

    // =====================================================
    // SEND APPROVAL EMAIL
    // =====================================================
    try {
      if (userEmail) {
        const emailResult =
          await sendEmail({
            to: userEmail,
            subject:
              'Withdrawal Approved',
            html:
              withdrawalApprovedEmail(
                withdrawAmount,
               username
              ),
          })

        if (
          !emailResult.success
        ) {
          console.error(
            'WITHDRAWAL APPROVAL EMAIL FAILED:',
            emailResult.error
          )
        } else {
          console.log(
            'WITHDRAWAL APPROVAL EMAIL SENT:',
            userEmail
          )
        }
      } else {
        console.error(
          'WITHDRAWAL APPROVAL EMAIL SKIPPED: USER EMAIL NOT FOUND',
          {
            userId,
          }
        )
      }
    } catch (
      emailError
    ) {
      console.error(
        'WITHDRAWAL APPROVED EMAIL ERROR:',
        emailError
      )
    }

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    console.log(
      '✅ WITHDRAWAL APPROVED SUCCESSFULLY'
    )

    return NextResponse.json({
      success: true,
    })
  } catch (
    err: unknown
  ) {
    console.error(
      '❌ APPROVE WITHDRAWAL ERROR:',
      err
    )

    const message =
      err instanceof Error
        ? err.message
        : 'Server error'

    return NextResponse.json(
      {
        error: message
      },
      {
        status: 500
      }
    )
  }
}