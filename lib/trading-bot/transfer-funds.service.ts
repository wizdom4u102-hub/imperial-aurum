import {
  getTradingBot,
  updateTradingBot,
  getUserWallet,
  updateBalance,
  createTransaction,
  createBotLog,
  createUserNotification,
  getUserProfile,
  createBotTransaction,
} from "./transfer-funds.repository";

import {
  validateTransferRequest,
} from "./transfer-funds.validators";

import type {
  TransferFundsRequest,
  TransferFundsResult,
} from "./transfer-funds.types";

import { sendEmail } from "@/lib/email/sendEmail";

import {
  botProfitTransferEmail,
} from "@/lib/email/templates";

/* -------------------------------------------------------------------------- */
/*                        Transfer Available Balance                          */
/* -------------------------------------------------------------------------- */

export async function transferBotProfit(
  userId: string,
  request: TransferFundsRequest
): Promise<TransferFundsResult> {

  const validation =
    validateTransferRequest(
      request
    );

  if (!validation.valid) {
    throw new Error(
      validation.message
    );
  }

  const bot =
    await getTradingBot(
      request.botId
    );

  if (!bot) {
    throw new Error(
      "Trading bot not found."
    );
  }

  if (
    bot.user_id !== userId
  ) {
    throw new Error(
      "Unauthorized."
    );
  }

  if (
    (bot.available_balance ?? 0) <
    request.amount
  ) {
    throw new Error(
      "Insufficient available balance."
    );
  }

  const balance =
    await getUserWallet(
      userId
    );

  const profile =
    await getUserProfile(
      userId
    );

  if (
    !profile ||
    !profile.email
  ) {
    throw new Error(
      "User profile not found."
    );
  }

  if (!balance) {
    throw new Error(
      "User balance record not found."
    );
  }

  await updateTradingBot(
    bot.id,
    {
      available_balance:
        (bot.available_balance ?? 0) -
        request.amount,

      current_value:
        (bot.current_value ?? 0) -
        request.amount,
    }
  );

  await updateBalance(
    userId,
    {
      cash:
        (balance.cash ?? 0) +
        request.amount,
    }
  );

  await createTransaction({
    user_id:
      userId,

    amount:
      request.amount,

    type:
      "BOT_PROFIT_TRANSFER",

    status:
      "COMPLETED",

    currency:
      "USD",

    description:
      `Transferred from ${bot.bot_name}`,

    reference_id:
      bot.id,
  });

  await createBotTransaction({
    user_id:
      userId,

    bot_id:
      bot.id,

    transaction_type:
      "TRANSFER",

    amount:
      request.amount,

    balance_before:
      Number(
        bot.available_balance ?? 0
      ),

    balance_after:
      Number(
        (bot.available_balance ?? 0) -
        request.amount
      ),

    status:
      "COMPLETED",

    reference_id:
      bot.id,

    description:
      `Transferred profit from ${bot.bot_name}.`,
  });

  await createBotLog({
    user_id:
      userId,

    bot_id:
      bot.id,

    action:
      "BOT_PROFIT_TRANSFER",

    log_type:
      "transfer",

    message:
      `Transferred $${request.amount} from ${bot.bot_name}.`,

    severity:
      "info",
  });

  await createUserNotification({
    user_id:
      userId,

    subject:
      "Profit Transfer",

    message:
      `$${request.amount} has been transferred from ${bot.bot_name} to your cash balance.`,

    is_read:
      false,
  });

  await sendEmail({
    to:
      profile.email,

    subject:
      "Bot Profit Transfer Successful",

    html:
      botProfitTransferEmail({
        botName:
          bot.bot_name,

        amount:
          request.amount,

        remainingBalance:
          (bot.available_balance ?? 0) -
          request.amount,
      }),
  });

  return {
    success:
      true,

    message:
      "Transfer completed successfully.",
  };
}