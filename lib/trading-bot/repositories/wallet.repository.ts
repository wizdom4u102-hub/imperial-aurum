import { createClient } from "@/lib/supabase/server";

import type {
  BalanceUpdate,
  BalanceRecord,
} from "../transfer-funds.types";

/* -------------------------------------------------------------------------- */
/*                              Get User Wallet                               */
/* -------------------------------------------------------------------------- */

export async function getUserWallet(
  userId: string
): Promise<BalanceRecord | null> {

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("balances")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;

}

/* -------------------------------------------------------------------------- */
/*                             Update Balance                                 */
/* -------------------------------------------------------------------------- */

export async function updateBalance(
  userId: string,
  values: BalanceUpdate
): Promise<void> {

  const supabase =
    await createClient();

  const {
    error,
  } = await supabase
    .from("balances")
    .update(values)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

}