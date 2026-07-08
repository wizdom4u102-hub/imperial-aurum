import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { withdrawalSubmittedEmail } from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // ================= AUTH =================

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ================= BODY =================

    const body = await req.json();

    const {
      amount,
      method_id,
    } = body;

    if (
      !amount ||
      Number(amount) <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid amount",
        },
        {
          status: 400,
        }
      );
    }

    if (!method_id) {
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

    // ================= CHECK BALANCE =================

    const {
      data: balance,
    } = await supabase
      .from("balances")
      .select("cash")
      .eq("user_id", user.id)
      .single();

    const currentBalance =
      Number(balance?.cash || 0);

    if (
      currentBalance <
      Number(amount)
    ) {
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

    // ================= CREATE WITHDRAWAL =================

    const {
      data: withdrawal,
      error,
    } = await supabase
      .from("withdrawals")
      .insert({
        user_id: user.id,
        amount: Number(amount),
        method_id,
        status: "pending",
        created_at:
          new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error(
        "WITHDRAW ERROR:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    // ================= TRANSACTION HISTORY =================

    const {
      error: txError,
    } = await supabase
      .from("transactions")
      .insert({

        user_id: user.id,

        withdrawal_id:
          withdrawal.id,

        type:
          "withdrawal",

        amount:
          Number(amount),

        status:
          "pending",

        description:
          `Withdrawal request of $${Number(amount).toFixed(2)} submitted`,

        created_at:
          new Date().toISOString(),

      });

    if (txError) {
      console.error(
        "TRANSACTION ERROR:",
        txError
      );
    }

    // ================= SEND EMAIL =================

    try {

      if (user.email) {

        await sendEmail({

          to: user.email,

          subject:
            "Withdrawal Request Received",

          html:
            withdrawalSubmittedEmail(
              Number(amount)
            ),

        });

      }

    } catch (emailError) {

      console.error(
        "WITHDRAWAL EMAIL ERROR:",
        emailError
      );

    }

    // ================= SUCCESS =================

    return NextResponse.json({

      success: true,

      message:
        "Withdrawal request submitted",

      withdrawal,

    });

  } catch (err: any) {

    console.error(
      "WITHDRAW API ERROR:",
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