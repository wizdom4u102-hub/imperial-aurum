import { supabaseAdmin } from "@/lib/supabase/admin";

import type { Database } from "@/lib/supabase/database.types";

import type { RepositoryResult } from "./repository.types";

import {
  DATABASE_QUERY_FAILED,
} from "./repository.errors";


/* -------------------------------------------------------------------------- */
/*                              Database Types                                */
/* -------------------------------------------------------------------------- */

type TradingBotRecord =
  Database["public"]["Tables"]["user_trading_bots"]["Row"];

type BotTradeRecord =
  Database["public"]["Tables"]["bot_trades"]["Row"];

type BotStatisticsRecord =
  Database["public"]["Tables"]["bot_statistics"]["Row"];

type BotLogRecord =
  Database["public"]["Tables"]["bot_logs"]["Row"];

  export type AdminTradingBotRecord =
  TradingBotRecord & {
    profile: {
      name: string | null;
      email: string | null;
    } | null;
  };


/* -------------------------------------------------------------------------- */
/*                         Admin Trading Bots                                 */
/* -------------------------------------------------------------------------- */

export async function getAdminTradingBots(): Promise<
  RepositoryResult<AdminTradingBotRecord[]>
> {

  const {
    data: bots,
    error: botsError,
  } =
    await supabaseAdmin
      .from("user_trading_bots")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (botsError) {

    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          botsError.message,
      },
    };

  }

  if (!bots || bots.length === 0) {

    return {
      data: [],

      error: null,
    };

  }

  const userIds =
    Array.from(
      new Set(
        bots.map(
          (bot) =>
            bot.user_id
        )
      )
    );

  const {
    data: profiles,
    error: profilesError,
  } =
    await supabaseAdmin
      .from("profiles")
      .select(
        "id, name, email"
      )
      .in(
        "id",
        userIds
      );

  if (profilesError) {

    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          profilesError.message,
      },
    };

  }

  const profileMap =
    new Map(
      (profiles ?? []).map(
        (profile) => [
          profile.id,
          {
            name:
              profile.name,

            email:
              profile.email,
          },
        ]
      )
    );

  const result =
    bots.map(
      (bot) => ({
        ...bot,

        profile:
          profileMap.get(
            bot.user_id
          ) ?? null,
      })
    );

  return {
    data:
      result,

    error:
      null,
  };
}


/* -------------------------------------------------------------------------- */
/*                              Admin Bot Trades                              */
/* -------------------------------------------------------------------------- */

export async function getAdminBotTrades(): Promise<
  RepositoryResult<BotTradeRecord[]>
> {

  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from("bot_trades")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {

    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          error.message,
      },
    };

  }

  return {
    data:
      data ?? [],

    error:
      null,
  };
}


/* -------------------------------------------------------------------------- */
/*                           Admin Bot Statistics                             */
/* -------------------------------------------------------------------------- */

export async function getAdminBotStatistics(): Promise<
  RepositoryResult<BotStatisticsRecord[]>
> {

  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from("bot_statistics")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {

    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          error.message,
      },
    };

  }

  return {
    data:
      data ?? [],

    error:
      null,
  };
}


/* -------------------------------------------------------------------------- */
/*                              Admin Bot Logs                                */
/* -------------------------------------------------------------------------- */

export async function getAdminBotLogs(): Promise<
  RepositoryResult<BotLogRecord[]>
> {

  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from("bot_logs")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {

    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          error.message,
      },
    };

  }

  return {
    data:
      data ?? [],

    error:
      null,
  };
}