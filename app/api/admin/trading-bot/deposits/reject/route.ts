import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

import {
  createBotTransaction,
} from "@/lib/trading-bot/repository";

import {
  sendTradingBotEmail,
} from "@/lib/notifications/send-trading-bot-email";


export async function POST(
  request: NextRequest
) {

  const supabase =
    await   supabaseAdmin;


  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();



  if (!user) {

    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  }



  const {
    data: profile,
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .select("is_admin")
      .eq(
        "id",
        user.id
      )
      .single();



  if (
    profileError ||
    !profile ||
    profile.is_admin !== true
  ) {

    return NextResponse.json(
      {
        error: "Forbidden",
      },
      {
        status: 403,
      }
    );

  }



  const body =
    await request.json();



  if (
    !body.depositId
  ) {

    return NextResponse.json(
      {
        error:
          "Deposit ID required",
      },
      {
        status:400,
      }
    );

  }



  const {
    data: deposit,
    error: depositError,
  } =
    await supabase
      .from("bot_deposits")
      .select("*")
      .eq(
        "id",
        body.depositId
      )
      .single();



  if (
    depositError ||
    !deposit
  ) {

    return NextResponse.json(
      {
        error:
          "Deposit not found",
      },
      {
        status:404,
      }
    );

  }



  if (
    deposit.status !== "pending"
  ) {

    return NextResponse.json(
      {
        error:
          `Deposit already processed: ${deposit.status}`,
      },
      {
        status:400,
      }
    );

  }



  const now =
    new Date().toISOString();



  const {
    error: updateError,
  } =
    await supabase
      .from("bot_deposits")
      .update({

        status:
          "rejected",

        reviewed_at:
          now,

        reviewed_by:
          user.id,

        approved_by:
          null,

        approval_note:
          "Rejected by administrator",

      })
      .eq(
        "id",
        deposit.id
      );



  if (
    updateError
  ) {

    return NextResponse.json(
      {
        error:
          updateError.message,
      },
      {
        status:500,
      }
    );

  }



  await supabase
  .from("bot_logs")
  .insert({

    action:
      "BOT_DEPOSIT_REJECTED",

    deposit_id:
      deposit.id,

    user_id:
      deposit.user_id,

    log_type:
      "approval",

    message:
      "Trading bot deposit rejected by administrator.",

    performed_by:
      user.id,

    severity:
      "warning",

  });

  await supabase
  .from("user_notifications")
  .insert({

    user_id:
      deposit.user_id,

    subject:
      "Trading Bot Deposit Rejected",

    message:
      "Your trading bot deposit was rejected. Please review your payment information and submit a new deposit.",

    sent_by:
      user.id,

    is_read:
      false,

  });

  await supabase
  .from("transactions")
  .insert({

    user_id:
      deposit.user_id,

    type:
      "trading_bot_rejected",

    amount:
      deposit.investment_amount,

    asset_type:
      "cash",

    currency:
      "USD",

    status:
      "rejected",

    description:
      "Trading bot deposit rejected",

    reference_id:
      deposit.id,

  });

 await createBotTransaction({

  user_id:
    deposit.user_id,

  bot_id:
    deposit.bot_id,

  transaction_type:
    "ADMIN_ADJUSTMENT",

  amount:
    Number(deposit.investment_amount),

  balance_before:
    0,

  balance_after:
    0,

  status:
    "CANCELLED",

  reference_id:
    deposit.id,

  description:
    "Trading bot deposit rejected by administrator.",

  metadata: {

    action:
      "REJECTED",

    deposit_id:
      deposit.id,

    rejected_by:
      user.id,

  },

});



try {

  const {
    data: plan,
  } =
    await supabase
      .from("trading_bot_plans")
      .select("name")
      .eq(
        "id",
        deposit.plan_id
      )
      .single();



  await sendTradingBotEmail({

    userId:
      deposit.user_id,

    type:
      "rejected",

    botName:
      plan?.name ?? "Trading Bot",

    amount:
      deposit.investment_amount,

  });

} catch (error) {

  console.error(
    "Trading bot rejection email failed:",
    error
  );

}



return NextResponse.json(
  {
    success: true,
  },
  {
    status: 200,
  }
);

}