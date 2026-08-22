import { createClient } from "@/lib/supabase/server";

export {
  createBotTransaction,
  updateTradingBot,
  createBotLog,
} from "./repository";

export {
  getUserWallet,
  updateBalance,
} from "./repositories/wallet.repository";

export {
  createTransaction,
} from "./repositories/transaction.repository";

export {
  createUserNotification,
} from "./repositories/notification.repository";

export {
  getUserProfile,
} from "./repositories/profile.repository";;

import type {
  TradingBotRecord,
} from "./transfer-dashboard-funds.types";

/* -------------------------------------------------------------------------- */
/*                          Active Trading Bots                               */
/* -------------------------------------------------------------------------- */

export async function getActiveBotsByUserId(
  userId: string
): Promise<TradingBotRecord[]> {

  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("user_trading_bots")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .gt("available_balance", 0)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];

}