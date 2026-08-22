import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

import type {
  Database,
} from "@/lib/supabase/database.types";

import {
  DATABASE_QUERY_FAILED,
} from "./repository.errors";

import type {
  AdminBotAdjustmentRepositoryResult,
  AdminTradingBotAdjustmentBot,
  AdminBotAdjustmentResult,
} from "./admin-bot-adjustment.types";


type TradingBotRecord =
  Database["public"]["Tables"]["user_trading_bots"]["Row"];


type BotStatisticsRecord =
  Database["public"]["Tables"]["bot_statistics"]["Row"];


/* -------------------------------------------------------------------------- */
/*                         Get Admin Bot List                                 */
/* -------------------------------------------------------------------------- */

export async function getAdminTradingBotAdjustmentBots(): Promise<
  AdminBotAdjustmentRepositoryResult<
    AdminTradingBotAdjustmentBot[]
  >
> {
  const {
    data: bots,
    error: botsError,
  } = await supabaseAdmin
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


  const botRecords =
    (bots ?? []) as TradingBotRecord[];


  if (botRecords.length === 0) {
    return {
      data: [],

      error: null,
    };
  }


  const userIds =
    Array.from(
      new Set(
        botRecords.map(
          (bot) =>
            bot.user_id
        )
      )
    );


  const botIds =
    botRecords.map(
      (bot) =>
        bot.id
    );


  const [
    profilesResponse,
    statisticsResponse,
  ] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select(
        `
          id,
          name,
          email
        `
      )
      .in(
        "id",
        userIds
      ),

    supabaseAdmin
      .from("bot_statistics")
      .select("*")
      .in(
        "bot_id",
        botIds
      ),
  ]);


  if (
    profilesResponse.error
  ) {
    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          profilesResponse.error.message,
      },
    };
  }


  if (
    statisticsResponse.error
  ) {
    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          statisticsResponse.error.message,
      },
    };
  }


  const profiles =
    profilesResponse.data ?? [];


  const statistics =
    (statisticsResponse.data ?? []) as BotStatisticsRecord[];


  const profileMap =
    new Map(
      profiles.map(
        (profile) => [
          profile.id,
          profile,
        ]
      )
    );


  const statisticsMap =
    new Map(
      statistics.map(
        (statistic) => [
          statistic.bot_id,
          statistic,
        ]
      )
    );


  const result =
    botRecords.map(
      (
        bot
      ): AdminTradingBotAdjustmentBot => {

        const profile =
          profileMap.get(
            bot.user_id
          );


        const statisticsRecord =
          statisticsMap.get(
            bot.id
          );


        return {
          id:
            bot.id,

          userId:
            bot.user_id,

          userName:
            profile?.name ??
            "Unknown User",

          userEmail:
            profile?.email ??
            null,

          botName:
            bot.bot_name,

          planId:
            bot.plan_id ??
            null,

          status:
            bot.status ??
            null,

          investmentCapital:
            Number(
              bot.investment_capital ??
              0
            ),

          availableBalance:
            Number(
              bot.available_balance ??
              0
            ),

          currentValue:
            Number(
              bot.current_value ??
              0
            ),

          accumulatedProfit:
            Number(
              bot.accumulated_profit ??
              0
            ),

          totalProfit:
            Number(
              statisticsRecord?.total_profit ??
              0
            ),

          roiPercentage:
            Number(
              statisticsRecord?.roi_percentage ??
              0
            ),

          totalTrades:
            Number(
              statisticsRecord?.total_trades ??
              0
            ),

          winningTrades:
            Number(
              statisticsRecord?.winning_trades ??
              0
            ),

          losingTrades:
            Number(
              statisticsRecord?.losing_trades ??
              0
            ),

          winRate:
            Number(
              statisticsRecord?.win_rate ??
              0
            ),

          todayProfit:
            Number(
              statisticsRecord?.today_profit ??
              0
            ),

          weeklyProfit:
            Number(
              statisticsRecord?.weekly_profit ??
              0
            ),

          monthlyProfit:
            Number(
              statisticsRecord?.monthly_profit ??
              0
            ),

          yearlyProfit:
            Number(
              statisticsRecord?.yearly_profit ??
              0
            ),

          runningDays:
            Number(
              statisticsRecord?.running_days ??
              0
            ),

          remainingDays:
            Number(
              statisticsRecord?.remaining_days ??
              0
            ),

          activatedAt:
            bot.activated_at ??
            null,

          expiresAt:
            bot.expires_at ??
            null,
        };
      }
    );


  return {
    data:
      result,

    error:
      null,
  };
}


/* -------------------------------------------------------------------------- */
/*                         Apply Bot Adjustment                               */
/* -------------------------------------------------------------------------- */

export async function applyAdminBotAdjustment(
  botId: string,
  userId: string,
  adjustmentType: "credit" | "debit",
  amount: number,
  reason: string,
  adminId: string
): Promise<
  AdminBotAdjustmentRepositoryResult<
    AdminBotAdjustmentResult
  >
> {
  const {
    data,
    error,
  } = await supabaseAdmin.rpc(
    "admin_adjust_trading_bot_balance",
    {
      p_bot_id:
        botId,

      p_user_id:
        userId,

      p_adjustment_type:
        adjustmentType,

      p_amount:
        amount,

      p_reason:
        reason,

      p_admin_id:
        adminId,
    }
  );


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


  if (!data) {
    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          "Trading bot adjustment returned no result.",
      },
    };
  }


  const result =
    data as {
      bot_id: string;
      user_id: string;
      adjustment_type:
        | "credit"
        | "debit";
      amount: number;
      balance_before: number;
      balance_after: number;
      current_value_before: number;
      current_value_after: number;
      adjusted_at: string;
    };


  return {
    data: {
      botId:
        result.bot_id,

      userId:
        result.user_id,

      adjustmentType:
        result.adjustment_type,

      amount:
        Number(
          result.amount
        ),

      balanceBefore:
        Number(
          result.balance_before
        ),

      balanceAfter:
        Number(
          result.balance_after
        ),

      currentValueBefore:
        Number(
          result.current_value_before
        ),

      currentValueAfter:
        Number(
          result.current_value_after
        ),

      adjustedAt:
        result.adjusted_at,
    },

    error:
      null,
  };
}