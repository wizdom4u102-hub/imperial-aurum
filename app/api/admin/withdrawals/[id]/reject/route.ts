export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/sendEmail";
import { withdrawalRejectedEmail } from "@/lib/email/templates";

export async function POST(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    console.log(
      "=========== REJECT WITHDRAWAL =========="
    );

    // ============================================================
    // ADMIN AUTHENTICATION
    // ============================================================

    const admin =
      await requireAdminApi();

    if (!admin.ok) {
      console.error(
        "❌ ADMIN AUTH FAILED:",
        admin.error
      );

      return NextResponse.json(
        {
          error: admin.error,
        },
        {
          status: admin.status,
        }
      );
    }

    // ============================================================
    // PARAMS
    // ============================================================

    const { id } =
      await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Withdrawal ID is required",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "Withdrawal ID:",
      id
    );

    // ============================================================
    // GET WITHDRAWAL
    // ============================================================

    const {
      data: withdrawal,
      error: withdrawalError,
    } =
      await supabaseAdmin
        .from("withdrawals")
        .select("*")
        .eq("id", id)
        .single();

    if (
      withdrawalError ||
      !withdrawal
    ) {
      console.error(
        "❌ WITHDRAWAL FETCH ERROR:",
        withdrawalError
      );

      return NextResponse.json(
        {
          error:
            "Withdrawal not found",
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "Withdrawal:",
      withdrawal
    );

    // ============================================================
    // PREVENT DUPLICATE / INVALID REJECTION
    // ============================================================

    if (
      withdrawal.status ===
      "rejected"
    ) {
      return NextResponse.json(
        {
          error:
            "Withdrawal already rejected",
        },
        {
          status: 400,
        }
      );
    }

    if (
      withdrawal.status ===
      "approved"
    ) {
      return NextResponse.json(
        {
          error:
            "Approved withdrawal cannot be rejected",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // WITHDRAWAL DATA
    // ============================================================

    const userId =
      withdrawal.user_id;

    const amount =
      Number(
        withdrawal.amount || 0
      );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      console.error(
        "❌ INVALID WITHDRAWAL AMOUNT:",
        withdrawal.amount
      );

      return NextResponse.json(
        {
          error:
            "Invalid withdrawal amount",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "User ID:",
      userId
    );

    console.log(
      "Withdrawal amount:",
      amount
    );

    // ============================================================
    // GET USER EMAIL
    // ============================================================

    const {
      data: authUser,
      error: authUserError,
    } =
      await supabaseAdmin.auth.admin.getUserById(
        userId
      );

    if (
      authUserError
    ) {
      console.error(
        "❌ USER AUTH FETCH ERROR:",
        authUserError
      );
    }

    const userEmail =
      authUser.user?.email;

    // ============================================================
    // GET USERNAME
    // ============================================================

    const {
      data: userProfile,
      error: userProfileError,
    } =
      await supabaseAdmin
        .from("profiles")
        .select("username")
        .eq(
          "id",
          userId
        )
        .single();

    if (
      userProfileError ||
      !userProfile
    ) {
      console.error(
        "❌ PROFILE FETCH ERROR:",
        userProfileError
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
      userProfile.username ||
      "User";

    // ============================================================
    // GET USER BALANCE
    // ============================================================

    const {
      data: balance,
      error: balanceError,
    } =
      await supabaseAdmin
        .from("balances")
        .select("cash")
        .eq(
          "user_id",
          userId
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
            "User balance not found",
        },
        {
          status: 404,
        }
      );
    }

    const currentCash =
      Number(
        balance.cash || 0
      );

    const restoredCash =
      currentCash + amount;

    const now =
      new Date().toISOString();

    console.log(
      "Current cash balance:",
      currentCash
    );

    console.log(
      "Amount being returned:",
      amount
    );

    console.log(
      "Restored cash balance:",
      restoredCash
    );

    // ============================================================
    // RETURN WITHDRAWAL AMOUNT TO USER BALANCE
    //
    // The amount was already deducted when the withdrawal
    // request was submitted.
    //
    // Therefore rejection MUST restore the exact amount.
    // ============================================================

    const {
      error: balanceUpdateError,
    } =
      await supabaseAdmin
        .from("balances")
        .update({
          cash:
            restoredCash,

          updated_at:
            now,
        })
        .eq(
          "user_id",
          userId
        );

    if (
      balanceUpdateError
    ) {
      console.error(
        "❌ BALANCE REFUND ERROR:",
        balanceUpdateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to return withdrawal amount to user balance",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "✅ WITHDRAWAL AMOUNT RETURNED:",
      amount
    );

    // ============================================================
    // UPDATE WITHDRAWAL STATUS
    // ============================================================

    const {
      error: withdrawalUpdateError,
    } =
      await supabaseAdmin
        .from("withdrawals")
        .update({
          status:
            "rejected",

          updated_at:
            now,
        })
        .eq(
          "id",
          id
        );

    if (
      withdrawalUpdateError
    ) {
      console.error(
        "❌ WITHDRAWAL STATUS UPDATE ERROR:",
        withdrawalUpdateError
      );

      // ==========================================================
      // ROLLBACK BALANCE REFUND
      //
      // If the withdrawal could not be marked rejected,
      // remove the refund so the account returns to its
      // previous balance.
      // ==========================================================

      const {
        error: rollbackError,
      } =
        await supabaseAdmin
          .from("balances")
          .update({
            cash:
              currentCash,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "user_id",
            userId
          );

      if (
        rollbackError
      ) {
        console.error(
          "❌ CRITICAL BALANCE REFUND ROLLBACK ERROR:",
          rollbackError
        );
      } else {
        console.log(
          "✅ BALANCE REFUND ROLLED BACK"
        );
      }

      return NextResponse.json(
        {
          error:
            withdrawalUpdateError.message,
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "✅ WITHDRAWAL MARKED REJECTED:",
      id
    );

    // ============================================================
    // UPDATE EXACT PENDING WITHDRAWAL TRANSACTION
    //
    // reference_id was set to withdrawal.id when the withdrawal
    // transaction was created.
    //
    // NEVER update all pending withdrawal transactions for the
    // user. Update only this withdrawal's transaction.
    // ============================================================

    const {
      data: transaction,
      error: transactionError,
    } =
      await supabaseAdmin
        .from("transactions")
        .update({
          status:
            "rejected",

          description:
            `Withdrawal request of $${amount.toFixed(
              2
            )} was rejected by admin. The amount was returned to the user's cash balance.`,

          updated_at:
            now,
        })
        .eq(
          "user_id",
          userId
        )
        .eq(
          "type",
          "withdrawal"
        )
        .eq(
          "reference_id",
          id
        )
        .eq(
          "status",
          "pending"
        )
        .select()
        .single();

    if (
      transactionError ||
      !transaction
    ) {
      console.error(
        "❌ WITHDRAWAL TRANSACTION UPDATE ERROR:",
        transactionError
      );

      // ==========================================================
      // IMPORTANT:
      //
      // The withdrawal has already been rejected and the balance
      // restored. We do NOT deduct the user's money again.
      //
      // The transaction issue is logged so it can be repaired
      // without creating another balance movement.
      // ==========================================================

      return NextResponse.json(
        {
          success: true,

          warning:
            "Withdrawal rejected and amount returned, but the transaction record could not be updated.",

          withdrawalId:
            id,
        },
        {
          status: 200,
        }
      );
    }

    console.log(
      "✅ WITHDRAWAL TRANSACTION UPDATED:",
      transaction.id
    );

    // ============================================================
// SEND REJECTION EMAIL
// ============================================================

try {
  if (userEmail) {
    const emailResult =
      await sendEmail({
        to: userEmail,

        subject:
          "Withdrawal Request Rejected",

        html:
          withdrawalRejectedEmail(
            amount,
            username
          ),
      });

    if (
      !emailResult.success
    ) {
      console.error(
        "❌ WITHDRAWAL REJECTION EMAIL FAILED:",
        emailResult.error
      );
    } else {
      console.log(
        "✅ WITHDRAWAL REJECTION EMAIL SENT:",
        userEmail
      );
    }
  } else {
    console.error(
      "❌ WITHDRAWAL REJECTION EMAIL SKIPPED: USER EMAIL NOT FOUND",
      {
        userId,
      }
    );
  }
} catch (
  emailError
) {
  console.error(
    "❌ WITHDRAWAL REJECTION EMAIL ERROR:",
    emailError
  );
}

    // ============================================================
    // SUCCESS
    // ============================================================

    console.log(
      "✅ WITHDRAWAL REJECTION COMPLETED:",
      {
        withdrawalId:
          id,

        transactionId:
          transaction.id,

        amount,

        balanceBeforeRefund:
          currentCash,

        balanceAfterRefund:
          restoredCash,
      }
    );

    return NextResponse.json(
      {
        success:
          true,

        message:
          "Withdrawal rejected successfully and the amount has been returned to the user's balance.",

        withdrawalId:
          id,

        transactionId:
          transaction.id,
      },
      {
        status: 200,
      }
    );
  } catch (
    err: unknown
  ) {
    console.error(
      "❌ WITHDRAWAL REJECTION ERROR:",
      err
    );

    const message =
      err instanceof Error
        ? err.message
        : "Server error";

    return NextResponse.json(
      {
        error:
          message,
      },
      {
        status: 500,
      }
    );
  }
}