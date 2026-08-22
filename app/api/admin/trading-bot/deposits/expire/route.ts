import {
  NextRequest,
  NextResponse,
} from "next/server";


import {
  createClient,
} from "@/lib/supabase/server";

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

 const authClient =
  await createClient();

const {
  data: {
    user,
  },
} =
await authClient.auth.getUser();

const supabase =
  supabaseAdmin;



  if (!user) {

    return NextResponse.json(
      {
        error:
          "Unauthorized",
      },
      {
        status:401,
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
        error:
          "Forbidden",
      },
      {
        status:403,
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
  deposit.status
    ?.trim()
    .toLowerCase() !==
  "pending"
)

 {

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
    error:updateError,
  } =
    await supabase
      .from("bot_deposits")
      .update({

        status:
          "expired",

        reviewed_at:
          now,

        reviewed_by:
          user.id,

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
      "BOT_DEPOSIT_EXPIRED",

    deposit_id:
      deposit.id,

    user_id:
      deposit.user_id,

    log_type:
      "approval",

    message:
      "Trading bot deposit expired by administrator.",

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
      "Trading Bot Deposit Expired",

    message:
      "Your trading bot deposit request has expired. Please submit a new deposit if you still wish to activate your trading bot.",

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
      "trading_bot_expired",

    amount:
      deposit.investment_amount,

    asset_type:
      "cash",

    currency:
      "USD",

    status:
      "expired",

    description:
      "Trading bot deposit expired",

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
    "Trading bot deposit expired by administrator.",

  metadata: {

    action:
      "EXPIRED",

    deposit_id:
      deposit.id,

    expired_by:
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
      "expired",

    botName:
      plan?.name ?? "Trading Bot",

    amount:
      deposit.investment_amount,

  });

} catch (error) {

  console.error(
    "Trading bot expiration email failed:",
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