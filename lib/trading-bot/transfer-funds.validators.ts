import type {
  TransferFundsRequest,
  TransferValidationResult,
  TransferBalance,
} from "./transfer-funds.types";

/* -------------------------------------------------------------------------- */
/*                         Validate Request                                   */
/* -------------------------------------------------------------------------- */

export function validateTransferRequest(
  request: TransferFundsRequest
): TransferValidationResult {

  if (!request.botId) {
    return {
      valid: false,
      message: "Trading bot is required.",
    };
  }

  if (
    Number.isNaN(request.amount) ||
    request.amount <= 0
  ) {
    return {
      valid: false,
      message: "Transfer amount must be greater than zero.",
    };
  }

  return {
    valid: true,
  };

}

/* -------------------------------------------------------------------------- */
/*                    Validate Available Profit                               */
/* -------------------------------------------------------------------------- */

export function validateTransferBalance(
  balance: TransferBalance,
  amount: number
): TransferValidationResult {

  if (
    amount > balance.transferableProfit
  ) {
    return {
      valid: false,
      message:
        "Insufficient transferable profit.",
    };
  }

  return {
    valid: true,
  };

}

/* -------------------------------------------------------------------------- */
/*                   Validate Current Bot Status                              */
/* -------------------------------------------------------------------------- */

export function validateBotStatus(
  status: string | null
): TransferValidationResult {

  if (!status) {
    return {
      valid: false,
      message: "Invalid trading bot.",
    };
  }

  if (
    status.toUpperCase() !== "ACTIVE"
  ) {
    return {
      valid: false,
      message:
        "Only active trading bots can transfer funds.",
    };
  }

  return {
    valid: true,
  };

}