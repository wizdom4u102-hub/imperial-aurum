import { supabaseAdmin } from "@/lib/supabase/admin";

import type { Database } from "@/lib/supabase/database.types";

import type {
  RepositoryResult,
} from "./repository.types";

import {
  DATABASE_QUERY_FAILED,
} from "./repository.errors";


type TradingBotPlanRecord =
  Database["public"]["Tables"]["trading_bot_plans"]["Row"];

type TradingBotPlanInsert =
  Database["public"]["Tables"]["trading_bot_plans"]["Insert"];

type TradingBotPlanUpdate =
  Database["public"]["Tables"]["trading_bot_plans"]["Update"];


/* -------------------------------------------------------------------------- */
/*                         Admin Trading Bot Plans                            */
/* -------------------------------------------------------------------------- */

export async function getAdminTradingBotPlans(): Promise<
  RepositoryResult<TradingBotPlanRecord[]>
> {

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("trading_bot_plans")
    .select("*")
    .order("display_order", {
      ascending: true,
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
/*                         Get Single Trading Bot Plan                        */
/* -------------------------------------------------------------------------- */

export async function getAdminTradingBotPlan(
  planId: string
): Promise<
  RepositoryResult<TradingBotPlanRecord>
> {

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("trading_bot_plans")
    .select("*")
    .eq("id", planId)
    .single();

  if (error || !data) {

    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          error?.message ??
          "Trading bot plan not found.",
      },
    };

  }

  return {
    data,

    error:
      null,
  };
}


/* -------------------------------------------------------------------------- */
/*                         Create Trading Bot Plan                            */
/* -------------------------------------------------------------------------- */

export async function createAdminTradingBotPlan(
  input: TradingBotPlanInsert
): Promise<
  RepositoryResult<TradingBotPlanRecord>
> {

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("trading_bot_plans")
    .insert(input)
    .select("*")
    .single();

  if (error || !data) {

    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          error?.message ??
          "Unable to create trading bot plan.",
      },
    };

  }

  return {
    data,

    error:
      null,
  };
}


/* -------------------------------------------------------------------------- */
/*                         Update Trading Bot Plan                            */
/* -------------------------------------------------------------------------- */

export async function updateAdminTradingBotPlan(
  planId: string,
  input: TradingBotPlanUpdate
): Promise<
  RepositoryResult<TradingBotPlanRecord>
> {

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("trading_bot_plans")
    .update(input)
    .eq("id", planId)
    .select("*")
    .single();

  if (error || !data) {

    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          error?.message ??
          "Unable to update trading bot plan.",
      },
    };

  }

  return {
    data,

    error:
      null,
  };
}


/* -------------------------------------------------------------------------- */
/*                         Delete Trading Bot Plan                            */
/* -------------------------------------------------------------------------- */

export async function deleteAdminTradingBotPlan(
  planId: string
): Promise<
  RepositoryResult<TradingBotPlanRecord>
> {

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("trading_bot_plans")
    .delete()
    .eq("id", planId)
    .select("*")
    .single();

  if (error || !data) {

    return {
      data: null,

      error: {
        code:
          DATABASE_QUERY_FAILED,

        message:
          error?.message ??
          "Unable to delete trading bot plan.",
      },
    };

  }

  return {
    data,

    error:
      null,
  };
}


/* -------------------------------------------------------------------------- */
/*                         Update Plan Status                                 */
/* -------------------------------------------------------------------------- */

export async function updateAdminTradingBotPlanStatus(
  planId: string,
  status: string
): Promise<
  RepositoryResult<TradingBotPlanRecord>
> {

  return updateAdminTradingBotPlan(
    planId,
    {
      status,
      updated_at:
        new Date().toISOString(),
    }
  );
}


/* -------------------------------------------------------------------------- */
/*                         Update Display Order                                */
/* -------------------------------------------------------------------------- */

export async function updateAdminTradingBotPlanOrder(
  planId: string,
  displayOrder: number
): Promise<
  RepositoryResult<TradingBotPlanRecord>
> {

  return updateAdminTradingBotPlan(
    planId,
    {
      display_order:
        displayOrder,

      updated_at:
        new Date().toISOString(),
    }
  );
}