import type {
  Database,
} from "@/lib/supabase/database.types";


type TradingBotPlanInsert =
  Database["public"]["Tables"]["trading_bot_plans"]["Insert"];

type TradingBotPlanUpdate =
  Database["public"]["Tables"]["trading_bot_plans"]["Update"];


export interface AdminPlanValidationResult {
  valid: boolean;
  errors: string[];
}


/* -------------------------------------------------------------------------- */
/*                         Validate Plan Values                               */
/* -------------------------------------------------------------------------- */

export function validateAdminTradingBotPlan(
  input:
    | TradingBotPlanInsert
    | TradingBotPlanUpdate
): AdminPlanValidationResult {

  const errors: string[] = [];


  if (
    input.name !==
      undefined &&
    !input.name.trim()
  ) {

    errors.push(
      "Plan name is required."
    );

  }


  if (
    input.slug !==
      undefined &&
    !input.slug.trim()
  ) {

    errors.push(
      "Plan slug is required."
    );

  }


  if (
    input.minimum_investment !==
      undefined &&
    (
      !Number.isFinite(
        input.minimum_investment
      ) ||
      input.minimum_investment < 0
    )
  ) {

    errors.push(
      "Minimum investment must be a valid non-negative number."
    );

  }


  if (
    input.maximum_investment !==
      undefined &&
    (
      !Number.isFinite(
        input.maximum_investment
      ) ||
      input.maximum_investment < 0
    )
  ) {

    errors.push(
      "Maximum investment must be a valid non-negative number."
    );

  }


  if (
    input.minimum_investment !==
      undefined &&
    input.maximum_investment !==
      undefined &&
    input.minimum_investment >
      input.maximum_investment
  ) {

    errors.push(
      "Minimum investment cannot exceed maximum investment."
    );

  }


  if (
    input.duration_days !==
      undefined &&
    (
      !Number.isInteger(
        input.duration_days
      ) ||
      input.duration_days <= 0
    )
  ) {

    errors.push(
      "Duration must be a positive whole number of days."
    );

  }


  if (
    input.expected_daily_roi !==
      undefined &&
    (
      !Number.isFinite(
        input.expected_daily_roi
      ) ||
      input.expected_daily_roi < 0
    )
  ) {

    errors.push(
      "Daily ROI must be a valid non-negative number."
    );

  }


  if (
    input.expected_monthly_roi !==
      undefined &&
    (
      !Number.isFinite(
        input.expected_monthly_roi
      ) ||
      input.expected_monthly_roi < 0
    )
  ) {

    errors.push(
      "Monthly ROI must be a valid non-negative number."
    );

  }


  if (
  input.display_order !== undefined &&
  input.display_order !== null &&
  (
    !Number.isInteger(
      input.display_order
    ) ||
    input.display_order < 0
  )
) {
  errors.push(
    "Display order must be a non-negative integer."
  );
}


  return {
    valid:
      errors.length === 0,

    errors,
  };
}