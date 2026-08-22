import {
  createAdminTradingBotPlan as createAdminTradingBotPlanRepository,
  deleteAdminTradingBotPlan as deleteAdminTradingBotPlanRepository,
  getAdminTradingBotPlan as getAdminTradingBotPlanRepository,
  getAdminTradingBotPlans as getAdminTradingBotPlansRepository,
  updateAdminTradingBotPlan as updateAdminTradingBotPlanRepository,
} from "./admin-plan.repository";

import type {
  Database,
} from "@/lib/supabase/database.types";

import type {
  RepositoryResult,
} from "./repository.types";


type TradingBotPlanRecord =
  Database["public"]["Tables"]["trading_bot_plans"]["Row"];

type TradingBotPlanInsert =
  Database["public"]["Tables"]["trading_bot_plans"]["Insert"];

type TradingBotPlanUpdate =
  Database["public"]["Tables"]["trading_bot_plans"]["Update"];


/* -------------------------------------------------------------------------- */
/*                         Monthly ROI Calculation                            */
/* -------------------------------------------------------------------------- */

function calculateMonthlyRoi(
  dailyRoi: number
): number {
  return Number(
    (
      dailyRoi * 30
    ).toFixed(2)
  );
}


/* -------------------------------------------------------------------------- */
/*                         Get All Trading Bot Plans                          */
/* -------------------------------------------------------------------------- */

export async function getAdminTradingBotPlans(): Promise<
  RepositoryResult<TradingBotPlanRecord[]>
> {

  return getAdminTradingBotPlansRepository();

}


/* -------------------------------------------------------------------------- */
/*                         Get Single Trading Bot Plan                        */
/* -------------------------------------------------------------------------- */

export async function getAdminTradingBotPlan(
  planId: string
): Promise<
  RepositoryResult<TradingBotPlanRecord>
> {

  return getAdminTradingBotPlanRepository(
    planId
  );

}


/* -------------------------------------------------------------------------- */
/*                         Create Trading Bot Plan                            */
/* -------------------------------------------------------------------------- */

export async function createAdminTradingBotPlan(
  input: TradingBotPlanInsert
): Promise<
  RepositoryResult<TradingBotPlanRecord>
> {

  const dailyRoi =
    Number(
      input.expected_daily_roi ?? 0
    );

  const planInput: TradingBotPlanInsert = {
    ...input,

    expected_daily_roi:
      dailyRoi,

    expected_monthly_roi:
      calculateMonthlyRoi(
        dailyRoi
      ),
  };

  return createAdminTradingBotPlanRepository(
    planInput
  );

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

  const updateInput: TradingBotPlanUpdate = {
    ...input,
  };


  if (
    input.expected_daily_roi !==
    undefined
  ) {

    const dailyRoi =
      Number(
        input.expected_daily_roi ?? 0
      );

    updateInput.expected_daily_roi =
      dailyRoi;

    updateInput.expected_monthly_roi =
      calculateMonthlyRoi(
        dailyRoi
      );

  }


  updateInput.updated_at =
    new Date().toISOString();


  return updateAdminTradingBotPlanRepository(
    planId,
    updateInput
  );

}


/* -------------------------------------------------------------------------- */
/*                         Delete Trading Bot Plan                            */
/* -------------------------------------------------------------------------- */

export async function deleteAdminTradingBotPlan(
  planId: string
): Promise<
  RepositoryResult<TradingBotPlanRecord>
> {

  return deleteAdminTradingBotPlanRepository(
    planId
  );

}