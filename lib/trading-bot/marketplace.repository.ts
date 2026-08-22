import { createClient } from "@/lib/supabase/server";

import type {
  TradingBotPlan,
} from "./marketplace.types";


export async function getMarketplaceBots(): Promise<
  TradingBotPlan[]
> {
  const supabase = await createClient();


  const {
    data,
    error,
  } = await supabase
    .from("trading_bot_plans")
    .select(
      `
      id,
      name,
      slug,
      description,
      minimum_investment,
      maximum_investment,
      expected_daily_roi,
      expected_monthly_roi,
      duration_days,
      features,
      supported_assets,
      badge,
      color,
      is_featured,
      is_popular,
      status
      `
    )
    .eq(
  "status",
  "active"
)
.order(
  "display_order",
  {
    ascending: true,
    nullsFirst: false,
  }
)
.order(
  "is_featured",
  {
    ascending: false,
  }
);


  if (error) {
    throw new Error(
      error.message
    );
  }


  return (
    data ?? []
  ) as TradingBotPlan[];
}