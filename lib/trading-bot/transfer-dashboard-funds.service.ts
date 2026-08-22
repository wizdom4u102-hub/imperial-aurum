import {
  getActiveBotsByUserId,
  getUserWallet,
  updateTradingBot,
  updateBalance,
  createTransaction,
  createBotLog,
  createUserNotification,
  getUserProfile,
  createBotTransaction,
} from "./transfer-dashboard-funds.repository";

import {
  sendEmail,
} from "@/lib/email/sendEmail";

import {
  dashboardProfitTransferEmail,
} from "@/lib/email/templates";

import type {
  DashboardTransferResult,
} from "./transfer-dashboard-funds.types";

/* -------------------------------------------------------------------------- */
/*                    Transfer Dashboard Available Balance                    */
/* -------------------------------------------------------------------------- */

export async function transferDashboardFunds(
  userId: string,
  amount: number
): Promise<DashboardTransferResult> {

  if (
    amount <= 0 ||
    Number.isNaN(amount)
  ) {
    throw new Error(
      "Invalid transfer amount."
    );
  }

  const bots =
    await getActiveBotsByUserId(
      userId
    );

  if (
    bots.length === 0
  ) {
    throw new Error(
      "No active trading bots found."
    );
  }

  const totalAvailable =
    bots.reduce(
      (
        total,
        bot
      ) =>
        total +
        Number(
          bot.available_balance ?? 0
        ),
      0
    );

  if (
    totalAvailable <= 0
  ) {
    throw new Error(
      "No transferable balance available."
    );
  }

  if (
    amount > totalAvailable
  ) {
    throw new Error(
      "Transfer amount exceeds available balance."
    );
  }

  const balance =
    await getUserWallet(
      userId
    );

  if (!balance) {
    throw new Error(
      "User balance not found."
    );
  }

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

  let remaining =
    amount;

  /* ------------------------------------------------------------------------ */
  /*                 Deduct From Every Active Bot                             */
  /* ------------------------------------------------------------------------ */

  for (
    let index = 0;
    index < bots.length;
    index++
  ) {

    const bot =
      bots[index];

    const available =
      Number(
        bot.available_balance ?? 0
      );

    if (
      available <= 0
    ) {
      continue;
    }

    let deduction: number;

    if (
      index ===
      bots.length - 1
    ) {

      deduction =
        remaining;

    } else {

      deduction =
        Number(
          (
            amount *
            (
              available /
              totalAvailable
            )
          ).toFixed(2)
        );

    }

    remaining =
      Number(
        (
          remaining -
          deduction
        ).toFixed(2)
      );

    const newAvailable =
      Math.max(
        0,
        Number(
          (
            available -
            deduction
          ).toFixed(2)
        )
      );

    await updateTradingBot(
      bot.id,
      {
        available_balance:
          newAvailable,
      }
    );

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
        `$${deduction.toFixed(2)} transferred from ${bot.bot_name}.`,

      severity:
        "info",
    });
  }

  /* ------------------------------------------------------------------------ */
  /*                     Credit Dashboard Cash Balance                        */
  /* ------------------------------------------------------------------------ */

  await updateBalance(
    userId,
    {
      cash:
        Number(
          balance.cash ?? 0
        ) + amount,
    }
  );

  await createTransaction({
    user_id:
      userId,

    amount,

    type:
      "BOT_PROFIT_TRANSFER",

    status:
      "COMPLETED",

    currency:
      "USD",

    description:
      "Transferred from Trading Bot Dashboard",

    reference_id:
      crypto.randomUUID(),
  });

  await createBotTransaction({
    user_id:
      userId,

    bot_id:
      null,

    transaction_type:
      "DASHBOARD_TRANSFER",

    amount,

    balance_before:
      Number(
        totalAvailable
      ),

    balance_after:
      Number(
        (
          totalAvailable -
          amount
        ).toFixed(2)
      ),

    status:
      "COMPLETED",

    reference_id:
      crypto.randomUUID(),

    description:
      "Transferred funds from Trading Bot Dashboard.",

    metadata: {
      active_bots:
        bots.length,

      transfer_source:
        "dashboard",
    },
  });

  await createUserNotification({
    user_id:
      userId,

    subject:
      "Trading Bot Transfer",

    message:
      `$${amount.toFixed(2)} has been transferred from your Trading Bot available balance to your dashboard cash balance.`,

    is_read:
      false,
  });

  await sendEmail({
    to:
      profile.email,

    subject:
      "Trading Bot Funds Transferred",

    html:
      dashboardProfitTransferEmail({
        name:
          profile.name ??
          "Investor",

        amount,

        remainingBalance:
          Number(
            (
              totalAvailable -
              amount
            ).toFixed(2)
          ),
      }),
  });

  return {
    success:
      true,

    message:
      "Funds transferred successfully.",
  };
}