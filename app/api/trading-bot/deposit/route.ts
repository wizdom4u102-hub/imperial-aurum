import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { validateDepositRequest } from "@/lib/trading-bot/validators";

import { prepareBotDeposit } from "@/lib/trading-bot/service";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const {
    planId,
    depositAmount,
    txid,
  } = await request.json();

  const validation = validateDepositRequest({
    planId,
    depositAmount,
    txid,
  });

  if (!validation.valid) {
    return NextResponse.json(
      {
        error: validation.errors,
      },
      {
        status: 400,
      }
    );
  }

  const result = await prepareBotDeposit({
    user_id: user.id,
    planId,
    depositAmount,
    txid,
  });

  if (result.error) {
    return NextResponse.json(
      {
        error: result.error.message,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(result.data, {
    status: 200,
  });
}