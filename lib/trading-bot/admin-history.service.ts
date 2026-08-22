import {
  getAdminTradingBotHistory as getAdminTradingBotHistoryRepository,
} from "./admin-history.repository";

import type {
  RepositoryResult,
} from "./repository.types";

import type {
  Database,
} from "@/lib/supabase/database.types";


type BotTransactionRecord =
  Database["public"]["Tables"]["bot_transactions"]["Row"];


type AdminTradingBotHistoryRecord =
  BotTransactionRecord & {
    profile: {
      id: string;
      name: string | null;
      username: string | null;
      email: string | null;
    } | null;

    bot: {
      id: string;
      bot_name: string | null;
    } | null;
  };


/* -------------------------------------------------------------------------- */
/*                    Admin Trading Bot History                              */
/* -------------------------------------------------------------------------- */

export async function getAdminTradingBotHistory(): Promise<
  RepositoryResult<AdminTradingBotHistoryRecord[]>
> {
  return getAdminTradingBotHistoryRepository();
}