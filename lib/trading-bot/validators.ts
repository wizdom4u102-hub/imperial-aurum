interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateActivationRequest = (data: {
  botId: string;
  amount: number;
}): ValidationResult => {
  const errors: string[] = [];

  if (!data.botId) {
    errors.push("Bot ID is required.");
  }

  if (data.amount <= 0) {
    errors.push("Amount must be greater than zero.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateDepositRequest = (data: {
  planId: string;
  depositAmount: number;
  txid: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!data.planId) {
    errors.push("Plan ID is required.");
  }

  if (
    Number.isNaN(data.depositAmount) ||
    data.depositAmount <= 0
  ) {
    errors.push("Deposit amount must be greater than zero.");
  }

  if (!data.txid || !data.txid.trim()) {
    errors.push("Transaction hash is required.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/* -------------------------------------------------------------------------- */
/*                     Validate Top Up Deposit Request                        */
/* -------------------------------------------------------------------------- */

export function validateTopUpDepositRequest(
  input: {
    botId: string;
    depositAmount: number;
    txid: string;
  }
) {

  const errors: string[] = [];

  if (!input.botId?.trim()) {
    errors.push(
      "Trading bot is required."
    );
  }

  if (
    Number(input.depositAmount) <= 0
  ) {
    errors.push(
      "Deposit amount must be greater than zero."
    );
  }

  if (!input.txid?.trim()) {
    errors.push(
      "Transaction hash is required."
    );
  }

  return {
    valid:
      errors.length === 0,
    errors,
  };

}

export const validateTradingBotId = (
  id: string
): ValidationResult => {
  const errors: string[] = [];

  if (!id) {
    errors.push("Trading Bot ID is required.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateAmount = (
  amount: number
): ValidationResult => {
  const errors: string[] = [];

  if (
    Number.isNaN(amount) ||
    amount <= 0
  ) {
    errors.push("Amount must be greater than zero.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validatePositiveNumber = (
  value: number
): ValidationResult => {
  const errors: string[] = [];

  if (
    Number.isNaN(value) ||
    value <= 0
  ) {
    errors.push("Value must be a positive number.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export type { ValidationResult };