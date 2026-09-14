import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { sendEmail } from "@/lib/email/sendEmail";

import {
  withdrawalSubmittedEmail,
  adminNewWithdrawalEmail,
} from "@/lib/email/templates";

export async function POST(
  req: Request
) {
  try {
    console.log(
      "=========== WITHDRAWAL REQUEST =========="
    );

    const supabase =
      await createClient();

    // ============================================================
    // AUTHENTICATION
    // ============================================================

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      console.error(
        "❌ WITHDRAWAL AUTH ERROR:",
        userError
      );

      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    console.log(
      "Withdrawal user:",
      user.id
    );

    console.log(
      "Withdrawal user email:",
      user.email
    );

    // ============================================================
    // GET USER PROFILE
    // ============================================================

    const {
      data: profile,
      error: profileError,
    } =
      await supabase
        .from("profiles")
        .select("username")
        .eq(
          "id",
          user.id
        )
        .single();

    if (
      profileError ||
      !profile
    ) {
      console.error(
        "❌ PROFILE FETCH ERROR:",
        profileError
      );

      return NextResponse.json(
        {
          error:
            "User profile not found",
        },
        {
          status: 404,
        }
      );
    }

    const username =
      profile.username ||
      "User";

    // ============================================================
    // REQUEST BODY
    // ============================================================

    const body =
      await req.json();

    const amount =
      Number(body.amount);

    const methodId =
      body.method_id;

    console.log(
      "Withdrawal amount:",
      amount
    );

    console.log(
      "Withdrawal method:",
      methodId
    );

    // ============================================================
    // VALIDATE AMOUNT
    // ============================================================

    if (
  !Number.isFinite(amount) ||
  amount < 10
) {
  console.error(
    "❌ INVALID WITHDRAWAL AMOUNT:",
    body.amount
  );

  return NextResponse.json(
    {
      error:
        "Minimum withdrawal amount is $5",
    },
    {
      status: 400,
    }
  );
}

    // ============================================================
    // VALIDATE WITHDRAWAL METHOD
    // ============================================================

    if (
      !methodId ||
      typeof methodId !== "string"
    ) {
      console.error(
        "❌ WITHDRAWAL METHOD NOT PROVIDED"
      );

      return NextResponse.json(
        {
          error:
            "Select withdrawal method",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // GET USER BALANCE
    // ============================================================

    const {
      data: balance,
      error: balanceError,
    } =
      await supabase
        .from("balances")
        .select(
          "cash"
        )
        .eq(
          "user_id",
          user.id
        )
        .single();

    if (
      balanceError ||
      !balance
    ) {
      console.error(
        "❌ BALANCE FETCH ERROR:",
        balanceError
      );

      return NextResponse.json(
        {
          error:
            "Balance not found",
        },
        {
          status: 404,
        }
      );
    }

    const currentBalance =
      Number(
        balance.cash || 0
      );

    console.log(
      "Current cash balance:",
      currentBalance
    );

    // ============================================================
    // CHECK SUFFICIENT BALANCE
    // ============================================================

    if (
      currentBalance <
      amount
    ) {
      console.error(
        "❌ INSUFFICIENT BALANCE",
        {
          currentBalance,
          withdrawalAmount:
            amount,
        }
      );

      return NextResponse.json(
        {
          error:
            "Insufficient balance",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // CALCULATE NEW BALANCE
    // ============================================================

    const newBalance =
      currentBalance -
      amount;

    const now =
      new Date().toISOString();

    console.log(
      "New cash balance:",
      newBalance
    );

    // ============================================================
    // DEDUCT BALANCE IMMEDIATELY
    // ============================================================

    const {
      error:
        balanceUpdateError,
    } =
      await supabase
        .from("balances")
        .update({
          cash:
            newBalance,

          updated_at:
            now,
        })
        .eq(
          "user_id",
          user.id
        );

    if (
      balanceUpdateError
    ) {
      console.error(
        "❌ WITHDRAWAL BALANCE DEDUCTION ERROR:",
        balanceUpdateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to deduct withdrawal amount from balance",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "✅ BALANCE DEDUCTED:",
      amount
    );

    // ============================================================
    // CREATE WITHDRAWAL
    // ============================================================

    const {
      data: withdrawal,
      error:
        withdrawalError,
    } =
      await supabase
        .from("withdrawals")
        .insert({
          user_id:
            user.id,

          amount:
            amount,

          method_id:
            methodId,

          status:
            "pending",

          created_at:
            now,
        })
        .select()
        .single();

    if (
      withdrawalError ||
      !withdrawal
    ) {
      console.error(
        "❌ WITHDRAWAL INSERT ERROR:",
        withdrawalError
      );

      // ==========================================================
      // ROLLBACK BALANCE IF WITHDRAWAL CREATION FAILS
      // ==========================================================

      const {
        error:
          rollbackError,
      } =
        await supabase
          .from("balances")
          .update({
            cash:
              currentBalance,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "user_id",
            user.id
          );

      if (
        rollbackError
      ) {
        console.error(
          "❌ CRITICAL BALANCE ROLLBACK ERROR:",
          rollbackError
        );
      } else {
        console.log(
          "✅ BALANCE ROLLED BACK:",
          amount
        );
      }

      return NextResponse.json(
        {
          error:
            withdrawalError?.message ||
            "Unable to create withdrawal request",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "✅ WITHDRAWAL CREATED:",
      withdrawal.id
    );

    // ============================================================
    // CREATE PENDING TRANSACTION
    //
    // reference_id = withdrawal.id
    // This lets approval/rejection update the exact transaction.
    // ============================================================

    const {
      data: transaction,
      error:
        transactionError,
    } =
      await supabase
        .from("transactions")
        .insert({
          user_id:
            user.id,

          type:
            "withdrawal",

          amount:
            amount,

          asset_type:
            "cash",

          currency:
            "USD",

          status:
            "pending",

          description:
            `Withdrawal request of $${amount.toFixed(
              2
            )} submitted`,

          reference_id:
            withdrawal.id,

          created_at:
            now,
        })
        .select()
        .single();

    if (
      transactionError ||
      !transaction
    ) {
      console.error(
        "❌ WITHDRAWAL TRANSACTION INSERT ERROR:",
        transactionError
      );

      // ==========================================================
      // REMOVE WITHDRAWAL IF TRANSACTION CREATION FAILS
      // ==========================================================

      const {
        error:
          withdrawalRollbackError,
      } =
        await supabase
          .from("withdrawals")
          .delete()
          .eq(
            "id",
            withdrawal.id
          );

      if (
        withdrawalRollbackError
      ) {
        console.error(
          "❌ WITHDRAWAL ROLLBACK ERROR:",
          withdrawalRollbackError
        );
      }

      // ==========================================================
      // RESTORE BALANCE
      // ==========================================================

      const {
        error:
          balanceRollbackError,
      } =
        await supabase
          .from("balances")
          .update({
            cash:
              currentBalance,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "user_id",
            user.id
          );

      if (
        balanceRollbackError
      ) {
        console.error(
          "❌ CRITICAL BALANCE ROLLBACK ERROR:",
          balanceRollbackError
        );
      } else {
        console.log(
          "✅ BALANCE RESTORED AFTER TRANSACTION FAILURE:",
          amount
        );
      }

      return NextResponse.json(
        {
          error:
            transactionError?.message ||
            "Unable to create withdrawal transaction",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "✅ PENDING WITHDRAWAL TRANSACTION CREATED:",
      transaction.id
    );

    // ============================================================
// SEND ADMIN EMAIL
// ============================================================

try {
  const adminEmail = process.env.ADMIN_EMAIL;

  console.log(
    "=== WITHDRAWAL ADMIN EMAIL ==="
  );

  console.log(
    "Admin email configured:",
    Boolean(adminEmail)
  );

  console.log(
    "Admin email recipient:",
    adminEmail
  );

  if (adminEmail) {
    const emailResult = await sendEmail({
      to: adminEmail,

      subject:
        "New Withdrawal Request",

      html: adminNewWithdrawalEmail({
        name: username,
        email: user.email ?? "N/A",
        amount,
      }),
    });

    if (!emailResult.success) {
      console.error(
        "❌ WITHDRAWAL ADMIN EMAIL FAILED:",
        emailResult.error
      );
    } else {
      console.log(
        "✅ WITHDRAWAL ADMIN EMAIL SENT:",
        adminEmail
      );
    }
  } else {
    console.error(
      "❌ WITHDRAWAL ADMIN EMAIL SKIPPED: ADMIN_EMAIL IS NOT CONFIGURED"
    );
  }
} catch (emailError) {
  console.error(
    "❌ WITHDRAWAL ADMIN EMAIL ERROR:",
    emailError
  );
}

    // ============================================================
    // SEND USER EMAIL
    // ============================================================

    try {
      console.log(
        "=== WITHDRAWAL USER EMAIL ==="
      );

      console.log(
        "User email recipient:",
        user.email
      );

      if (
        user.email
      ) {
        const emailResult =
          await sendEmail({
            to:
              user.email,

            subject:
              "Withdrawal Request Received",

            html:
              withdrawalSubmittedEmail(
                amount,
                username
              ),
          });

        if (
          !emailResult.success
        ) {
          console.error(
            "❌ WITHDRAWAL USER EMAIL FAILED:",
            emailResult.error
          );
        } else {
          console.log(
            "✅ WITHDRAWAL USER EMAIL SENT:",
            user.email
          );
        }
      } else {
        console.error(
          "❌ WITHDRAWAL USER EMAIL SKIPPED: USER EMAIL NOT FOUND"
        );
      }
    } catch (
      emailError
    ) {
      console.error(
        "❌ WITHDRAWAL USER EMAIL ERROR:",
        emailError
      );
    }

    // ============================================================
    // SUCCESS
    // ============================================================

    console.log(
      "✅ WITHDRAWAL REQUEST COMPLETED:",
      {
        withdrawalId:
          withdrawal.id,

        transactionId:
          transaction.id,

        amount,

        balanceBefore:
          currentBalance,

        balanceAfter:
          newBalance,
      }
    );

    return NextResponse.json(
      {
        success:
          true,

        message:
          "Withdrawal request submitted successfully",

        withdrawal,
      },
      {
        status: 200,
      }
    );

  } catch (
    error
  ) {
    console.error(
      "❌ WITHDRAW API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Server error",
      },
      {
        status: 500,
      }
    );
  }
}