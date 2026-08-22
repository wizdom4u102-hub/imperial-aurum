import {
  createClient,
} from "@/lib/supabase/server";

import type {
  CreateBotPurchaseInput,
  BotDepositRecord,
} from "./purchase.types";

export async function createBotDeposit(
  input: CreateBotPurchaseInput
): Promise<BotDepositRecord> {

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("bot_deposits")
    .insert({
      user_id:
        input.userId,

      bot_id:
        input.botId,

      plan_id:
        input.planId,

      investment_amount:
        input.amount,

      payment_method_id:
        input.paymentMethodId,

      reference:
        input.reference,

      deposit_type:
        "initial",

      status:
        "pending",
    })
    .select()
    .single();

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data;
}