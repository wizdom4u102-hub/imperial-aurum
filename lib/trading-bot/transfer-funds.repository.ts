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
  createUserNotification,
} from "./repositories/notification.repository";

export {
  createTransaction,
} from "./repositories/transaction.repository";

export {
  getUserProfile,
} from "./repositories/profile.repository";

import type {
  TradingBotRecord,
} from "./transfer-funds.types";

/* -------------------------------------------------------------------------- */
/*                              Trading Bot                                   */
/* -------------------------------------------------------------------------- */

export async function getTradingBot(
  botId: string
): Promise<TradingBotRecord | null> {

  const supabase = await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("user_trading_bots")
    .select("*")
    .eq("id", botId)
    .single();

  if (error) {
    throw error;
  }

  return data;

}