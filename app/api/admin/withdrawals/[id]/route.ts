import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase =
      await createClient();

    const { id: withdrawalId } =
      await params;

    const {
      data: withdrawal,
    } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("id", withdrawalId)
      .single();

    if (!withdrawal) {
      return NextResponse.json(
        {
          error: "Not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!withdrawal.user_id) {
      return NextResponse.json(
        {
          error:
            "Withdrawal has no associated user.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      withdrawal.amount === null
    ) {
      return NextResponse.json(
        {
          error:
            "Withdrawal amount is missing.",
        },
        {
          status: 400,
        }
      );
    }

    // ✅ mark completed
    const {
      error: updateError,
    } = await supabase
      .from("withdrawals")
      .update({
        status: "completed",
      })
      .eq("id", withdrawalId);

    if (updateError) {
      throw updateError;
    }

    // ✅ deduct balance
    const {
      error: balanceError,
    } = await supabase.rpc(
      "increment_cash",
      {
        user_uuid:
          withdrawal.user_id,

        amount:
          -withdrawal.amount,
      }
    );

    if (balanceError) {
      throw balanceError;
    }

    // ✅ transaction
    const {
      error: transactionError,
    } = await supabase
      .from("transactions")
      .insert({
        user_id:
          withdrawal.user_id,

        type:
          "withdrawal",

        amount:
          withdrawal.amount,

        status:
          "completed",

        description:
          "Withdrawal approved",
      });

    if (transactionError) {
      throw transactionError;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Internal server error";

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