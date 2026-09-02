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

    // ================= ADMIN =================

    const admin =
      await requireAdminApi();

    if (!admin.ok) {
      return NextResponse.json(
        {
          error: admin.error,
        },
        {
          status: admin.status,
        }
      );
    }

    // ================= PARAMS =================

    const { id } =
      await context.params;

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

    // ================= GET WITHDRAWAL =================

    const {
      data: withdrawal,
      error: withdrawalError,
    } = await supabaseAdmin
      .from("withdrawals")
      .select("*")
      .eq("id", id)
      .single();

    if (
      withdrawalError ||
      !withdrawal
    ) {
      return NextResponse.json(
        {
          error: "Withdrawal not found",
        },
        {
          status: 404,
        }
      );
    }

    // ================= ALREADY REJECTED =================

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

    const userId =
      withdrawal.user_id;

    const amount =
      Number(
        withdrawal.amount || 0
      );

    // ================= GET USER EMAIL =================

const {
  data: profile,
} =
  await supabaseAdmin.auth.admin.getUserById(
    userId
  );

const userEmail =
  profile.user?.email;

// ================= GET USERNAME =================

const {
  data: userProfile,
  error: userProfileError,
} = await supabaseAdmin
  .from("profiles")
  .select("username")
  .eq("id", userId)
  .single();

if (
  userProfileError ||
  !userProfile
) {
  console.error(
    "PROFILE FETCH ERROR:",
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
  userProfile.username || "User";

    // ================= UPDATE WITHDRAWAL =================

    const {
      error:
        withdrawalUpdateError,
    } =
      await supabaseAdmin
        .from("withdrawals")
        .update({
          status: "rejected",
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id);

    if (
      withdrawalUpdateError
    ) {
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

    // ================= UPDATE TRANSACTION =================

    const {
      error: txError,
    } =
      await supabaseAdmin
        .from("transactions")
        .update({
          status: "rejected",
          description: `Withdrawal request of $${amount} was rejected by admin.`,
          updated_at:
            new Date().toISOString(),
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
          "status",
          "pending"
        );

          // ================= SEND EMAIL =================

    try {

      if (userEmail) {

        await sendEmail({
          to: userEmail,
          subject: "Withdrawal Request Rejected",
          html: withdrawalRejectedEmail(
            amount,
           username
          ),
        });

      }

    } catch (emailError) {

      console.error(
        "WITHDRAWAL REJECTED EMAIL ERROR:",
        emailError
      );

    }

    // ================= SUCCESS =================

    console.log(
      "✅ WITHDRAWAL REJECTED"
    );

    return NextResponse.json({
      success: true,
      message:
        "Withdrawal rejected successfully",
    });

  } catch (err: any) {

    console.error(
      "❌ WITHDRAWAL REJECTION ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          err.message ||
          "Server error",
      },
      {
        status: 500,
      }
    );

  }
}