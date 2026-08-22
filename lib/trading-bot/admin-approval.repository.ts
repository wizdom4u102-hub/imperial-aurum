import {
  supabaseAdmin,
} from "@/lib/supabase/admin";


import type {
  ApproveBotDepositInput,
} from "./admin-approval.types";

import {
  approveTopUpDeposit,
} from "./top-up-approval";

import {
  createBotTransaction,
} from "./repository";



export async function approveBotDeposit(
  input: ApproveBotDepositInput
) {

  const supabase =
      supabaseAdmin;



  const {
  data: deposit,
  error: depositError,
} =
  await supabase
    .from("bot_deposits")
    .select("*")
    .eq(
      "id",
      input.depositId
    )
    .single();


if (depositError || !deposit) {

  throw new Error(
    depositError?.message ??
    "Deposit not found"
  );

}


if (deposit.status !== "pending") {

  throw new Error(
    `Deposit already processed. Current status: ${deposit.status}`
  );

}



  const {
    data: botPlan,
    error: planError,
  } =
    await supabase
      .from("trading_bot_plans")
      .select("*")
      .eq(
        "id",
        deposit.plan_id
      )
      .single();



  if (planError || !botPlan) {

    throw new Error(
      planError?.message ??
      "Trading bot plan not found"
    );

  }




  const now =
    new Date().toISOString();



  const expiresAt = new Date();

expiresAt.setDate(
  expiresAt.getDate() +
    botPlan.duration_days
);

if (
  deposit.deposit_type ===
  "top_up"
) {

  return await approveTopUpDeposit({
    deposit,
    adminId: input.adminId,
  });

}

const {
  data: existingBot,
  error: existingBotError,
} =
await supabase
  .from("user_trading_bots")
  .select("*")
  .eq(
    "deposit_id",
    deposit.id
  )
  .maybeSingle();

  if (existingBotError) {
  throw new Error(existingBotError.message);
}


let userBot;


if (existingBot) {

  const {
    data: updatedBot,
    error: updateBotError,
  } =
    await supabase
      .from("user_trading_bots")
      .update({

        status: "active",

        activated_at: now,

        expires_at:
          expiresAt.toISOString(),

        updated_at: now,

      })
      .eq(
        "id",
        existingBot.id
      )
      .select()
      .single();

  if (
    updateBotError ||
    !updatedBot
  ) {
    throw new Error(
      updateBotError?.message ??
      "Unable to activate trading bot"
    );
  }

  userBot = updatedBot;

} else {


  const {
    data: newBot,
    error: botError,
  } =
  await supabase
    .from("user_trading_bots")
    .insert({

      user_id:
        deposit.user_id,

      deposit_id:
        deposit.id,

      plan_id:
        deposit.plan_id,

      bot_name:
        botPlan.name,

      status:
        "active",

      investment_capital:
        deposit.investment_amount,

      trading_asset:
        botPlan.trading_asset,

      duration_days:
        botPlan.duration_days,

      activated_at:
        now,

      expires_at:
        expiresAt.toISOString(),

      created_at:
        now,

      updated_at:
        now,

    })
    .select()
    .single();



  if (botError || !newBot) {

    throw new Error(
      botError?.message ??
      "Unable to create trading bot"
    );

  }


  userBot = newBot;
  

  const { error: botCreatedLogError } =
  await supabase
    .from("bot_logs")
    .insert({
      action: "BOT_CREATED",
      bot_id: userBot.id,
      deposit_id: deposit.id,
      log_type: "lifecycle",
      message: `Trading bot "${botPlan.name}" was created.`,
      metadata: {
        plan_id: botPlan.id,
        plan_name: botPlan.name,
      },
      performed_by: input.adminId,
      severity: "info",
      user_id: deposit.user_id,
    });

if (botCreatedLogError) {
  throw new Error(
    botCreatedLogError.message
  );
}

}





  const {
    error:
      updateDepositError,
  } =
    await supabase
      .from("bot_deposits")
      .update({

        bot_id:
          userBot.id,

        status:
          "approved",

        approved_at:
          now,

        approved_by:
          input.adminId,

        reviewed_at:
          now,

        reviewed_by:
          input.adminId,

      })
      .eq(
        "id",
        deposit.id
      );



  if (updateDepositError) {

    throw new Error(
      updateDepositError.message
    );

  }


const {
  data: existingStatistics,
} = await supabase
  .from("bot_statistics")
  .select("id")
  .eq("bot_id", userBot.id)
  .maybeSingle();

let statisticsError = null;

if (!existingStatistics) {
  const result = await supabase
    .from("bot_statistics")
    .insert({

      bot_id: userBot.id,

      user_id: deposit.user_id,

      investment_capital:
        deposit.investment_amount,

      current_value:
        deposit.investment_amount,

      current_portfolio_value:
        deposit.investment_amount,

      accumulated_profit: 0,

      total_profit: 0,

      roi_percentage: 0,

      completed_trades: 0,

      winning_trades: 0,

      losing_trades: 0,

      open_trades: 0,

      total_trades: 0,

      server_status: "running",

      running_days: 0,

      remaining_days:
        botPlan.duration_days,

    });

  statisticsError = result.error;
} else {
  const result = await supabase
    .from("bot_statistics")
    .update({

      server_status: "running",

      current_value:
        deposit.investment_amount,

      current_portfolio_value:
        deposit.investment_amount,

      investment_capital:
        deposit.investment_amount,

      remaining_days:
        botPlan.duration_days,

      last_updated_at: now,

    })
    .eq("bot_id", userBot.id);

  statisticsError = result.error;
}

if (statisticsError) {
  throw new Error(statisticsError.message);
}



  const { error: activationLogError } =

  await supabase

    .from("bot_logs")

    .insert({

      action: "BOT_ACTIVATED",

      bot_id: userBot.id,

      deposit_id: deposit.id,

      log_type: "lifecycle",

      message: `Trading bot "${botPlan.name}" is now active and has started trading.`,

      metadata: {

        activated_at: now,

      },

      performed_by: input.adminId,

      severity: "info",

      user_id: deposit.user_id,

    });



if (activationLogError) {

  throw new Error(

    activationLogError.message

  );

}

 const { error: logError } = await supabase
  .from("bot_logs")
  .insert({
    action: "BOT_APPROVED",
    bot_id: userBot.id,
    deposit_id: deposit.id,
    log_type: "approval",
    message: `Trading bot "${botPlan.name}" approved by administrator.`,
    metadata: {
      plan_id: botPlan.id,
      plan_name: botPlan.name,
      trading_asset: botPlan.trading_asset,
      investment_amount: deposit.investment_amount,
    },
    performed_by: input.adminId,
    severity: "info",
    user_id: deposit.user_id,
  });

if (logError) {
  throw new Error(logError.message);
}

const {
  data: existingTransaction,
  error: transactionCheckError,
} =
  await supabase
    .from("transactions")
    .select("id")
    .eq("reference_id", deposit.id)
    .maybeSingle();


if (transactionCheckError) {

  throw new Error(
    transactionCheckError.message
  );

}



if (!existingTransaction) {

  console.log("Deposit ID:", deposit.id);
console.log("Reference ID:", deposit.id);
console.log("Transaction Type:", "trading_bot_activation");

const { data, error: transactionError } =
  await supabase
    .from("transactions")
    .insert({

      user_id: deposit.user_id,
      type: "trading_bot_activation",
      amount: deposit.investment_amount,
      asset_type: "cash",
      currency: "USD",
      status: "approved",
      description: `Trading Bot "${botPlan.name}" activated`,
      reference_id: deposit.id,

    })
    .select();

console.log("Inserted transaction:", data);

if (transactionError) {
  console.error("TRANSACTION INSERT ERROR:", transactionError);

  throw new Error(
    JSON.stringify(transactionError)
  );
}

}

console.log("=== CREATING BOT TRANSACTION ===");

const ledger = await createBotTransaction({

  user_id:
    deposit.user_id,

  bot_id:
    userBot.id,

  transaction_type:
    "ACTIVATION",

  amount:
    Number(
      deposit.investment_amount
    ),

  balance_before:
    0,

  balance_after:
    Number(
      deposit.investment_amount
    ),

  status:
    "COMPLETED",

  reference_id:
    deposit.id,

  description:
    `Initial investment into "${botPlan.name}".`,

  metadata: {

    deposit_id:
      deposit.id,

    plan_id:
      botPlan.id,

    plan_name:
      botPlan.name,

    approved_by:
      input.adminId,

  },

});

console.log(
  "BOT TRANSACTION CREATED:",
  ledger
);

const {
  error: notificationError,
} =
  await supabase
    .from("user_notifications")
    .insert({

      user_id:
        deposit.user_id,

      subject:
        "Trading Bot Activated",

      message:
        `Your trading bot "${botPlan.name}" has been activated successfully and has started trading.`,

      sent_by:
        input.adminId,

    });

    console.log("ADMIN MESSAGE INSERT:", notificationError);

if (notificationError) {

  throw new Error(
    notificationError.message
  );

}

// TODO: send approval email notification

return {
  depositId: deposit.id,
  userBotId: userBot.id,
};

}