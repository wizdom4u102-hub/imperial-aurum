import { supabaseAdmin } from "@/lib/supabase/admin";

import type { Database } from "@/lib/supabase/database.types";

import type { RepositoryResult } from "./repository.types";

import {
  DATABASE_QUERY_FAILED,
} from "./repository.errors";


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

  const {
    data: transactions,
    error: transactionError,
  } = await supabaseAdmin
    .from("bot_transactions")
    .select("*")
    .order("created_at", {
      ascending: false,
    });


  if (transactionError) {

    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          transactionError.message,
      },
    };

  }


  if (!transactions || transactions.length === 0) {

    return {
      data: [],

      error: null,
    };

  }


  const userIds = Array.from(
    new Set(
      transactions
        .map(
          (
            transaction
          ) =>
            transaction.user_id
        )
        .filter(
          (
            userId
          ): userId is string =>
            userId !== null
        )
    )
  );


  const botIds = Array.from(
    new Set(
      transactions
        .map(
          (
            transaction
          ) =>
            transaction.bot_id
        )
        .filter(
          (
            botId
          ): botId is string =>
            botId !== null
        )
    )
  );


  /* ------------------------------------------------------------------------ */
  /*                              Profiles                                    */
  /* ------------------------------------------------------------------------ */

  const {
    data: profiles,
    error: profileError,
  } = userIds.length > 0
    ? await supabaseAdmin
        .from("profiles")
        .select(
          "id,name,username,email"
        )
        .in(
          "id",
          userIds
        )
    : {
        data: [],
        error: null,
      };


  if (profileError) {

    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          profileError.message,
      },
    };

  }


  /* ------------------------------------------------------------------------ */
  /*                           Trading Bots                                   */
  /* ------------------------------------------------------------------------ */

  const {
    data: bots,
    error: botError,
  } = botIds.length > 0
    ? await supabaseAdmin
        .from("user_trading_bots")
        .select(
          "id,bot_name"
        )
        .in(
          "id",
          botIds
        )
    : {
        data: [],
        error: null,
      };


  if (botError) {

    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          botError.message,
      },
    };

  }


  /* ------------------------------------------------------------------------ */
  /*                              Lookup Maps                                 */
  /* ------------------------------------------------------------------------ */

  const profileMap =
    new Map<
      string,
      {
        id: string;
        name: string | null;
        username: string | null;
        email: string | null;
      }
    >();


  for (
    const profile
    of profiles ?? []
  ) {

    profileMap.set(
      profile.id,
      profile
    );

  }


  const botMap =
    new Map<
      string,
      {
        id: string;
        bot_name: string | null;
      }
    >();


  for (
    const bot
    of bots ?? []
  ) {

    botMap.set(
      bot.id,
      bot
    );

  }


  /* ------------------------------------------------------------------------ */
  /*                         Build Admin History                              */
  /* ------------------------------------------------------------------------ */

  const history =
    transactions.map(
      (
        transaction
      ): AdminTradingBotHistoryRecord => ({

        ...transaction,

        profile:
          transaction.user_id
            ? profileMap.get(
                transaction.user_id
              ) ?? null
            : null,

        bot:
          transaction.bot_id
            ? botMap.get(
                transaction.bot_id
              ) ?? null
            : null,

      })
    );


  return {
    data:
      history,

    error:
      null,
  };

}