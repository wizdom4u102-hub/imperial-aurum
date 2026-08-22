import {
  applyAdminBotAdjustment,
  getAdminTradingBotAdjustmentBots,
} from "./admin-bot-adjustment.repository";

import type {
  AdminBotAdjustmentInput,
  AdminBotAdjustmentResult,
  AdminTradingBotAdjustmentBot,
  AdminBotAdjustmentRepositoryResult,
} from "./admin-bot-adjustment.types";


/* -------------------------------------------------------------------------- */
/*                         Service Result Types                               */
/* -------------------------------------------------------------------------- */

export interface AdminBotAdjustmentServiceResult<T> {
  data: T | null;

  error: {
    code: string;
    message: string;
  } | null;
}


/* -------------------------------------------------------------------------- */
/*                         Get Admin Bot List                                 */
/* -------------------------------------------------------------------------- */

export async function getAdminTradingBotAdjustmentBotsService(): Promise<
  AdminBotAdjustmentServiceResult<
    AdminTradingBotAdjustmentBot[]
  >
> {
  const result =
    await getAdminTradingBotAdjustmentBots();

  return result;
}


/* -------------------------------------------------------------------------- */
/*                         Validate Adjustment                                */
/* -------------------------------------------------------------------------- */

function validateAdjustmentInput(
  input: AdminBotAdjustmentInput
): string | null {

  if (!input.botId.trim()) {
    return "Trading bot is required.";
  }


  if (
    !Number.isFinite(
      input.amount
    )
  ) {
    return "Adjustment amount must be a valid number.";
  }


  if (
    input.amount <= 0
  ) {
    return "Adjustment amount must be greater than zero.";
  }


  if (
    !input.reason.trim()
  ) {
    return "Adjustment reason is required.";
  }


  return null;
}


/* -------------------------------------------------------------------------- */
/*                         Credit Trading Bot                                */
/* -------------------------------------------------------------------------- */

export async function creditTradingBot(
  input: AdminBotAdjustmentInput,
  userId: string,
  adminId: string
): Promise<
  AdminBotAdjustmentServiceResult<
    AdminBotAdjustmentResult
  >
> {

  const validationError =
    validateAdjustmentInput(
      input
    );


  if (validationError) {
    return {
      data: null,

      error: {
        code:
          "VALIDATION_ERROR",

        message:
          validationError,
      },
    };
  }


  const result =
    await applyAdminBotAdjustment(
      input.botId,
      userId,
      "credit",
      input.amount,
      input.reason.trim(),
      adminId
    );


  return result;
}


/* -------------------------------------------------------------------------- */
/*                         Debit Trading Bot                                 */
/* -------------------------------------------------------------------------- */

export async function debitTradingBot(
  input: AdminBotAdjustmentInput,
  userId: string,
  adminId: string
): Promise<
  AdminBotAdjustmentServiceResult<
    AdminBotAdjustmentResult
  >
> {

  const validationError =
    validateAdjustmentInput(
      input
    );


  if (validationError) {
    return {
      data: null,

      error: {
        code:
          "VALIDATION_ERROR",

        message:
          validationError,
      },
    };
  }


  const result =
    await applyAdminBotAdjustment(
      input.botId,
      userId,
      "debit",
      input.amount,
      input.reason.trim(),
      adminId
    );


  return result;
}