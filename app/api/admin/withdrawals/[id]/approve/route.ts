import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/sendEmail";

import {
  withdrawalApprovedEmail,
} from "@/lib/email/templates";

export async function POST(
  _req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    console.log(
      "=========== APPROVE WITHDRAWAL =========="
    );

    // ============================================================
    // ADMIN AUTHENTICATION
    // ============================================================

    const admin = await requireAdminApi();

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
    // GET WITHDRAWAL ID
    // ============================================================

    const { id } = await context.params;

    console.log(
      "WITHDRAWAL ID:",
      id
    );

    if (!id) {
      return NextResponse.json(
        {
          error: "Withdrawal ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // GET WITHDRAWAL
    // ============================================================

    const {
      data: withdrawal,
      error: withdrawalError,
    } = await supabaseAdmin
      .from("withdrawals")
      .select("*")
      .eq("id", id)
      .single();

    if (withdrawalError || !withdrawal) {
      console.error(
        "❌ WITHDRAWAL FETCH ERROR:",
        withdrawalError
      );

      return NextResponse.json(
        {
          error: "Withdrawal not found",
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "WITHDRAWAL:",
      withdrawal
    );

    // ============================================================
    // ONLY PENDING WITHDRAWALS CAN BE APPROVED
    // ============================================================

    if (withdrawal.status !== "pending") {
      console.error(
        "❌ WITHDRAWAL IS NOT PENDING:",
        withdrawal.status
      );

      return NextResponse.json(
        {
          error:
            `Withdrawal is already ${withdrawal.status}`,
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // BASIC WITHDRAWAL DATA
    // ============================================================

    const userId = withdrawal.user_id;

    const withdrawAmount = Number(
      withdrawal.amount || 0
    );

    if (
      !Number.isFinite(withdrawAmount) ||
      withdrawAmount <= 0
    ) {
      console.error(
        "❌ INVALID WITHDRAWAL AMOUNT:",
        withdrawal.amount
      );

      return NextResponse.json(
        {
          error: "Invalid withdrawal amount",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "USER ID:",
      userId
    );

    console.log(
      "WITHDRAWAL AMOUNT:",
      withdrawAmount
    );

    // ============================================================
    // GET USER EMAIL
    // ============================================================

    const {
      data: authUserData,
      error: authUserError,
    } =
      await supabaseAdmin.auth.admin.getUserById(
        userId
      );

    if (authUserError) {
      console.error(
        "❌ USER AUTH FETCH ERROR:",
        authUserError
      );
    }

    const userEmail =
      authUserData.user?.email;

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
        .eq("id", userId)
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
          error: "User profile not found",
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
    // FIND THE EXACT PENDING TRANSACTION
    //
    // The withdrawal submission route creates:
    //
    // reference_id: withdrawal.id
    //
    // Therefore approval MUST use that exact reference.
    // We must NOT match transactions by amount.
    // ============================================================

    const {
      data: pendingTransaction,
      error: transactionFetchError,
    } =
      await supabaseAdmin
        .from("transactions")
        .select("*")
        .eq("reference_id", id)
        .eq("user_id", userId)
        .eq("type", "withdrawal")
        .eq("status", "pending")
        .maybeSingle();

    if (transactionFetchError) {
      console.error(
        "❌ PENDING TRANSACTION FETCH ERROR:",
        transactionFetchError
      );

      return NextResponse.json(
        {
          error:
            "Unable to find pending withdrawal transaction",
        },
        {
          status: 500,
        }
      );
    }

    if (!pendingTransaction) {
      console.error(
        "❌ NO MATCHING PENDING WITHDRAWAL TRANSACTION FOUND:",
        {
          withdrawalId: id,
          userId,
        }
      );

      return NextResponse.json(
        {
          error:
            "Pending withdrawal transaction not found",
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "✅ EXACT PENDING TRANSACTION FOUND:",
      pendingTransaction.id
    );

    // ============================================================
    // VERIFY TRANSACTION AMOUNT
    //
    // This prevents accidentally completing a transaction that
    // does not correspond to the withdrawal amount.
    // ============================================================

    const transactionAmount =
      Number(
        pendingTransaction.amount || 0
      );

    if (
      transactionAmount !==
      withdrawAmount
    ) {
      console.error(
        "❌ WITHDRAWAL / TRANSACTION AMOUNT MISMATCH:",
        {
          withdrawalAmount:
            withdrawAmount,
          transactionAmount,
        }
      );

      return NextResponse.json(
        {
          error:
            "Withdrawal and transaction amounts do not match",
        },
        {
          status: 409,
        }
      );
    }

    // ============================================================
    // IMPORTANT:
    //
    // DO NOT TOUCH THE USER BALANCE HERE.
    //
    // The withdrawal amount was already deducted when the user
    // submitted the withdrawal request.
    //
    // Approval only changes the withdrawal and transaction state.
    // ============================================================

    console.log(
      "✅ APPROVAL WILL NOT DEDUCT USER BALANCE AGAIN"
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
          status: "approved",
        })
        .eq("id", id)
        .eq("status", "pending");

    if (withdrawalUpdateError) {
      console.error(
        "❌ WITHDRAWAL APPROVAL UPDATE ERROR:",
        withdrawalUpdateError
      );

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
      "✅ WITHDRAWAL MARKED APPROVED:",
      id
    );

    // ============================================================
    // UPDATE EXISTING PENDING TRANSACTION
    //
    // DO NOT INSERT A NEW TRANSACTION.
    // ============================================================

    const {
      error: transactionUpdateError,
    } =
      await supabaseAdmin
        .from("transactions")
        .update({
          status: "completed",

          description:
            `Withdrawal of $${withdrawAmount.toFixed(
              2
            )} approved by admin`,
        })
        .eq(
          "id",
          pendingTransaction.id
        )
        .eq(
          "status",
          "pending"
        );

    // ============================================================
    // TRANSACTION UPDATE FAILED
    //
    // Attempt to restore the withdrawal to pending so the system
    // does not leave an approved withdrawal with a pending
    // transaction.
    // ============================================================

    if (transactionUpdateError) {
      console.error(
        "❌ WITHDRAWAL TRANSACTION UPDATE ERROR:",
        transactionUpdateError
      );

      const {
        error: withdrawalRollbackError,
      } =
        await supabaseAdmin
          .from("withdrawals")
          .update({
            status: "pending",
          })
          .eq("id", id)
          .eq("status", "approved");

      if (withdrawalRollbackError) {
        console.error(
          "❌ CRITICAL WITHDRAWAL STATUS ROLLBACK ERROR:",
          withdrawalRollbackError
        );
      } else {
        console.log(
          "✅ WITHDRAWAL STATUS RESTORED TO PENDING"
        );
      }

      return NextResponse.json(
        {
          error:
            transactionUpdateError.message ||
            "Unable to complete withdrawal transaction",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "✅ EXISTING WITHDRAWAL TRANSACTION MARKED COMPLETED:",
      pendingTransaction.id
    );

    // ============================================================
    // SEND USER APPROVAL EMAIL
    // ============================================================

    try {
      if (userEmail) {
        console.log(
          "=== WITHDRAWAL APPROVAL EMAIL ==="
        );

        console.log(
          "User email recipient:",
          userEmail
        );

        const emailResult =
          await sendEmail({
            to: userEmail,

            subject:
              "Withdrawal Approved",

            html:
              withdrawalApprovedEmail(
                withdrawAmount,
                username
              ),
          });

        if (!emailResult.success) {
          console.error(
            "❌ WITHDRAWAL APPROVAL EMAIL FAILED:",
            emailResult.error
          );
        } else {
          console.log(
            "✅ WITHDRAWAL APPROVAL EMAIL SENT:",
            userEmail
          );
        }
      } else {
        console.error(
          "❌ WITHDRAWAL APPROVAL EMAIL SKIPPED: USER EMAIL NOT FOUND",
          {
            userId,
          }
        );
      }
    } catch (emailError) {
      console.error(
        "❌ WITHDRAWAL APPROVAL EMAIL ERROR:",
        emailError
      );
    }

    // ============================================================
    // SUCCESS
    // ============================================================

    console.log(
      "✅ WITHDRAWAL APPROVED SUCCESSFULLY:",
      {
        withdrawalId: id,
        transactionId:
          pendingTransaction.id,
        userId,
        amount: withdrawAmount,
      }
    );

    return NextResponse.json(
      {
        success: true,

        message:
          "Withdrawal approved successfully",

        withdrawalId: id,

        transactionId:
          pendingTransaction.id,
      },
      {
        status: 200,
      }
    );
  } catch (err: unknown) {
    console.error(
      "❌ APPROVE WITHDRAWAL ERROR:",
      err
    );

    const message =
      err instanceof Error
        ? err.message
        : "Server error";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}