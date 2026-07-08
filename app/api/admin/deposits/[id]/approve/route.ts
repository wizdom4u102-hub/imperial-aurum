export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { requireAdminApi  } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { processReferral } from "@/lib/referral/processReferral";
import { sendEmail } from "@/lib/email/sendEmail";
import { depositApprovedEmail } from "@/lib/email/templates";

export async function POST(
  req: Request,
  context: {
    params: Promise<{ id: string }>
  }
) {
  try {

    console.log(
      '=========== APPROVE DEPOSIT =========='
    )

    // ================= ADMIN =================
    const admin =
      await requireAdminApi()

    if (!admin.ok) {

      console.error(
        '❌ ADMIN FAILED:',
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

    // ================= PARAMS =================
    const { id } =
      await context.params

    console.log(
      'DEPOSIT ID:',
      id
    )

    // ================= GET DEPOSIT =================
    const {
      data: deposit,
      error: depositError
    } =
      await supabaseAdmin
        .from('deposits')
        .select('*')
        .eq('id', id)
        .single()

    if (
      depositError ||
      !deposit
    ) {

      console.error(
        '❌ DEPOSIT ERROR:',
        depositError
      )

      return NextResponse.json(
        {
          error:
            'Deposit not found'
        },
        {
          status: 404
        }
      )
    }

    console.log(
      'DEPOSIT:',
      deposit
    )

    // ================= ALREADY COMPLETED =================
    if (
      deposit.status ===
      'completed'
    ) {

      return NextResponse.json(
        {
          error:
            'Deposit already approved'
        },
        {
          status: 400
        }
      )
    }

    const amount =
      Number(
        deposit.amount || 0
      )

    const userId =
      deposit.user_id

      // ================= USER EMAIL =================

const {
  data: profile,
} = await supabaseAdmin.auth.admin.getUserById(userId);

const userEmail =
  profile.user?.email;

    // =====================================================
    // IMPORTANT FIX
    // UPDATE DEPOSIT STATUS FIRST
    // =====================================================

    const {
  data: updatedDeposit,
  error: depositUpdateError
} =
  await supabaseAdmin
    .from('deposits')
    .update({

      status:
        'completed',

      updated_at:
        new Date().toISOString()

    })
    .eq(
      'id',
      id
    )
    .select()
    .single()

console.log(
  'UPDATED DEPOSIT:',
  updatedDeposit
)

if (
  depositUpdateError
) {

  console.error(
    '❌ DEPOSIT UPDATE ERROR:',
    depositUpdateError
  )

  return NextResponse.json(
    {
      error:
        depositUpdateError.message
    },
    {
      status: 500
    }
  )

}

// ==========================
// PROCESS REFERRALS
// ==========================

await processReferral({
  userId,
  depositId: id,
  amount,
});

    // ================= GET BALANCE =================
    const {
      data: balance
    } =
      await supabaseAdmin
        .from('balances')
        .select('*')
        .eq(
          'user_id',
          userId
        )
        .single()

    // ================= UPDATE BALANCE =================
    if (balance) {

      const newCash =
        Number(
          balance.cash || 0
        ) + amount

      const {
        error: balanceError
      } =
        await supabaseAdmin
          .from('balances')
          .update({

            cash:
              newCash,

            updated_at:
              new Date().toISOString()

          })
          .eq(
            'user_id',
            userId
          )

      if (
        balanceError
      ) {

        console.error(
          '❌ BALANCE UPDATE ERROR:',
          balanceError
        )

        return NextResponse.json(
          {
            error:
              balanceError.message
          },
          {
            status: 500
          }
        )
      }

    } else {

      const {
        error: createBalanceError
      } =
        await supabaseAdmin
          .from('balances')
          .insert({

            user_id:
              userId,

            cash:
              amount,

            gold: 0,

            shares: 0,

            updated_at:
              new Date().toISOString()

          })

      if (
        createBalanceError
      ) {

        console.error(
          '❌ CREATE BALANCE ERROR:',
          createBalanceError
        )

        return NextResponse.json(
          {
            error:
              createBalanceError.message
          },
          {
            status: 500
          }
        )
      }
    }

    // =====================================================
// UPDATE EXISTING PENDING TRANSACTION
// =====================================================

const {
  data: updatedTx,
  error: txUpdateError
} =
  await supabaseAdmin
    .from('transactions')
    .update({

      status:
        'completed',

      description:
        `USDT crypto deposit of $${amount} confirmed via blockchain`,

      updated_at:
        new Date().toISOString()

    })
    .eq(
      'user_id',
      userId
    )
    .eq(
      'type',
      'deposit'
    )
    .eq(
      'status',
      'pending'
    )
    .eq(
      'amount',
      amount
    )
    .select()

if (
  txUpdateError
) {

  console.error(
    '❌ TX UPDATE ERROR:',
    txUpdateError
  )

}

// =====================================================
// FALLBACK IF NO PENDING TX EXISTS
// =====================================================

if (
  !updatedTx ||
  updatedTx.length === 0
) {

  console.log(
    'No pending transaction found. Creating completed transaction.'
  )

  const {
    error: insertTxError
  } =
    await supabaseAdmin
      .from('transactions')
      .insert({

        user_id:
          userId,

        type:
          'deposit',

        amount:
          amount,

        status:
          'completed',

        description:
          `USDT crypto deposit of $${amount} confirmed via blockchain`,

        created_at:
          new Date().toISOString()

      })

  if (
    insertTxError
  ) {

    console.error(
      '❌ INSERT TX ERROR:',
      insertTxError
    )

  }

}

// =====================================================
// SEND APPROVAL EMAIL
// =====================================================

try {

  if (userEmail) {

    await sendEmail({

      to: userEmail,

      subject: "Deposit Approved",

      html: depositApprovedEmail(
        amount
      ),

    });

  }

} catch (emailError) {

  console.error(
    "DEPOSIT APPROVED EMAIL ERROR:",
    emailError
  );

}

// =====================================================
// SUCCESS RESPONSE
// =====================================================

console.log(
  "✅ DEPOSIT APPROVED SUCCESSFULLY"
);

return NextResponse.json({
  success: true,
});

} catch (err: any) {

console.error(
  '❌ APPROVE ERROR:',
  err
)

return NextResponse.json(
  {
    error:
      err.message ||
      'Server error'
  },
  {
    status: 500
  }
)

}
}