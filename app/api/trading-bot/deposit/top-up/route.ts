import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import {
  validateTopUpDepositRequest,
} from "@/lib/trading-bot/validators";

import {
  prepareBotTopUpDeposit,
} from "@/lib/trading-bot/service";

import { sendEmail } from "@/lib/email/sendEmail";

import {
  adminNewTradingBotTopUpEmail,
  tradingBotTopUpSubmittedEmail,
} from "@/lib/email/templates";

export async function POST(
  request: Request
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } =
    await supabase.auth.getUser();

  if (
    authError ||
    !user
  ) {
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
    botId,
    depositAmount,
    txid,
    proofImage,
    notes,
  } =
    await request.json();

  const validation =
    validateTopUpDepositRequest({
      botId,
      depositAmount,
      txid,
    });

  if (!validation.valid) {
    return NextResponse.json(
      {
        error:
          validation.errors,
      },
      {
        status: 400,
      }
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                              USER PROFILE                                */
  /* ------------------------------------------------------------------------ */

  const {
    data: profile,
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .select("username")
      .eq(
        "id",
        user.id
      )
      .single();

  if (
    profileError ||
    !profile
  ) {
    console.error(
      "TRADING BOT TOP-UP PROFILE ERROR:",
      profileError
    );

    return NextResponse.json(
      {
        error:
          "User profile not found",
      },
      {
        status: 404,
      }
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                              TRADING BOT                                 */
  /* ------------------------------------------------------------------------ */

  const {
    data: bot,
    error: botError,
  } =
    await supabase
      .from("user_trading_bots")
      .select(
        "bot_name, plan_id"
      )
      .eq(
        "id",
        botId
      )
      .eq(
        "user_id",
        user.id
      )
      .single();

  if (
    botError ||
    !bot
  ) {
    console.error(
      "TRADING BOT TOP-UP BOT ERROR:",
      botError
    );

    return NextResponse.json(
      {
        error:
          "Trading bot not found",
      },
      {
        status: 404,
      }
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                              TRADING BOT PLAN                             */
  /* ------------------------------------------------------------------------ */

  const {
    data: plan,
    error: planError,
  } =
    await supabase
      .from("trading_bot_plans")
      .select("name")
      .eq(
        "id",
        bot.plan_id
      )
      .single();

  if (
    planError ||
    !plan
  ) {
    console.error(
      "TRADING BOT TOP-UP PLAN ERROR:",
      planError
    );

    return NextResponse.json(
      {
        error:
          "Trading bot plan not found",
      },
      {
        status: 404,
      }
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                              PREPARE TOP-UP                              */
  /* ------------------------------------------------------------------------ */

  const result =
    await prepareBotTopUpDeposit({
      user_id:
        user.id,

      botId,

      depositAmount,

      txid,

      proofImage,

      notes,
    });

  if (result.error) {
    console.error(
      "TRADING BOT TOP-UP PREPARATION ERROR:",
      result.error
    );

    return NextResponse.json(
      {
        error:
          result.error.message,
      },
      {
        status: 500,
      }
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                              ADMIN EMAIL                                 */
  /* ------------------------------------------------------------------------ */

  try {
    const adminEmail =
      process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error(
        "TRADING BOT TOP-UP ADMIN EMAIL FAILED: ADMIN_EMAIL is not configured."
      );
    } else if (!user.email) {
      console.error(
        "TRADING BOT TOP-UP ADMIN EMAIL FAILED: User email is missing."
      );
    } else {
      const emailResult =
        await sendEmail({
          to:
            adminEmail,

          subject:
            "New Trading Bot Top-Up Request",

          html:
            adminNewTradingBotTopUpEmail({
              name:
                profile.username ||
                "User",

              email:
                user.email,

              botName:
                bot.bot_name,

              planName:
                plan.name,

              amount:
                Number(
                  depositAmount
                ),

              txid,
            }),
        });

      if (
        !emailResult.success
      ) {
        console.error(
          "TRADING BOT TOP-UP ADMIN EMAIL FAILED:",
          emailResult.error
        );
      } else {
        console.log(
          "TRADING BOT TOP-UP ADMIN EMAIL SENT:",
          {
            to:
              adminEmail,

            user:
              user.email,

            bot:
              bot.bot_name,

            plan:
              plan.name,

            amount:
              Number(
                depositAmount
              ),
          }
        );
      }
    }
  } catch (
    emailError
  ) {
    console.error(
      "TRADING BOT TOP-UP ADMIN EMAIL ERROR:",
      emailError
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                              USER EMAIL                                  */
  /* ------------------------------------------------------------------------ */

  try {
    if (!user.email) {
      console.error(
        "TRADING BOT TOP-UP USER EMAIL FAILED: User email is missing."
      );
    } else {
      const emailResult =
        await sendEmail({
          to:
            user.email,

          subject:
            "Your Trading Bot Top-Up Has Been Received",

          html:
            tradingBotTopUpSubmittedEmail({
              name:
                profile.username ||
                "User",

              amount:
                Number(
                  depositAmount
                ),

              botName:
                bot.bot_name,

              planName:
                plan.name,

              txid,
            }),
        });

      if (
        !emailResult.success
      ) {
        console.error(
          "TRADING BOT TOP-UP USER EMAIL FAILED:",
          emailResult.error
        );
      } else {
        console.log(
          "TRADING BOT TOP-UP USER EMAIL SENT:",
          {
            to:
              user.email,

            bot:
              bot.bot_name,

            plan:
              plan.name,

            amount:
              Number(
                depositAmount
              ),
          }
        );
      }
    }
  } catch (
    emailError
  ) {
    console.error(
      "TRADING BOT TOP-UP USER EMAIL ERROR:",
      emailError
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                                RESPONSE                                  */
  /* ------------------------------------------------------------------------ */

  return NextResponse.json(
    result.data,
    {
      status: 200,
    }
  );
}