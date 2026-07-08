export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/sendEmail";
import { depositRejectedEmail } from "@/lib/email/templates";

export async function POST(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    console.log(
      "=========== REJECT DEPOSIT =========="
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

      const body = await req.json();

const reason = String(
  body?.reason || ""
).trim();

    if (!id) {
      return NextResponse.json(
        {
          error: "Deposit ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // ================= GET DEPOSIT =================

    const {
      data: deposit,
      error: depositError,
    } = await supabaseAdmin
      .from("deposits")
      .select("*")
      .eq("id", id)
      .single();

    if (
      depositError ||
      !deposit
    ) {
      return NextResponse.json(
        {
          error: "Deposit not found",
        },
        {
          status: 404,
        }
      );
    }

    // ================= ALREADY REJECTED =================

    if (
      deposit.status ===
      "rejected"
    ) {
      return NextResponse.json(
        {
          error:
            "Deposit already rejected",
        },
        {
          status: 400,
        }
      );
    }

    const userId =
      deposit.user_id;

    const amount =
      Number(
        deposit.amount || 0
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

    // ================= UPDATE DEPOSIT =================

    const {
      error:
        depositUpdateError,
    } =
      await supabaseAdmin
        .from("deposits")
        .update({
  status: "rejected",

  reject_reason:
    reason || null,

  updated_at:
    new Date().toISOString(),
})
        .eq("id", id);

    if (
      depositUpdateError
    ) {
      return NextResponse.json(
        {
          error:
            depositUpdateError.message,
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
          description:
  reason
    ? `Deposit rejected: ${reason}`
    : `Deposit request of $${amount} was rejected by admin.`,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "user_id",
          userId
        )
        .eq(
          "type",
          "deposit"
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
          subject: "Deposit Request Rejected",
          html: depositRejectedEmail(
            amount
          ),
        });

      }

    } catch (emailError) {

      console.error(
        "DEPOSIT REJECTED EMAIL ERROR:",
        emailError
      );

    }

    // ================= SUCCESS =================

    console.log(
      "✅ DEPOSIT REJECTED"
    );

    return NextResponse.json({
      success: true,
      message:
        "Deposit rejected successfully",
    });

  } catch (err: any) {

    console.error(
      "❌ DEPOSIT REJECTION ERROR:",
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