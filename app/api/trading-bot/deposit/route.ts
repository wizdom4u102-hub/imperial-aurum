import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import {
  validateDepositRequest,
} from "@/lib/trading-bot/validators";

import {
  prepareBotDeposit,
} from "@/lib/trading-bot/service";

import { sendEmail } from "@/lib/email/sendEmail";

import {
  adminNewTradingBotDepositEmail,
  tradingBotDepositSubmittedEmail,
} from "@/lib/email/templates";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
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
    planId,
    depositAmount,
    txid,
  } = await request.json();

  const validation = validateDepositRequest({
    planId,
    depositAmount,
    txid,
  });

  if (!validation.valid) {
    return NextResponse.json(
      {
        error: validation.errors,
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
  } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.error(
      "TRADING BOT DEPOSIT PROFILE ERROR:",
      profileError
    );

    return NextResponse.json(
      {
        error: "User profile not found",
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
  } = await supabase
    .from("trading_bot_plans")
    .select("name")
    .eq("id", planId)
    .single();

  if (planError || !plan) {
    console.error(
      "TRADING BOT DEPOSIT PLAN ERROR:",
      planError
    );

    return NextResponse.json(
      {
        error: "Trading bot plan not found",
      },
      {
        status: 404,
      }
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                              PREPARE DEPOSIT                             */
  /* ------------------------------------------------------------------------ */

  const result = await prepareBotDeposit({
    user_id: user.id,
    planId,
    depositAmount,
    txid,
  });

  if (result.error) {
    console.error(
      "TRADING BOT DEPOSIT PREPARATION ERROR:",
      result.error
    );

    return NextResponse.json(
      {
        error: result.error.message,
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
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error(
        "TRADING BOT DEPOSIT ADMIN EMAIL FAILED: ADMIN_EMAIL is not configured."
      );
    } else if (!user.email) {
      console.error(
        "TRADING BOT DEPOSIT ADMIN EMAIL FAILED: User email is missing."
      );
    } else {
      const emailResult = await sendEmail({
        to: adminEmail,

        subject:
          "New Trading Bot Deposit Request",

        html:
          adminNewTradingBotDepositEmail({
            name:
              profile.username ||
              "User",

            email:
              user.email,

            planName:
              plan.name,

            amount:
              Number(depositAmount),

            txid,
          }),
      });

      if (!emailResult.success) {
        console.error(
          "TRADING BOT DEPOSIT ADMIN EMAIL FAILED:",
          emailResult.error
        );
      } else {
        console.log(
          "TRADING BOT DEPOSIT ADMIN EMAIL SENT:",
          {
            to: adminEmail,
            user: user.email,
            amount: Number(depositAmount),
            plan: plan.name,
          }
        );
      }
    }
  } catch (emailError) {
    console.error(
      "TRADING BOT DEPOSIT ADMIN EMAIL ERROR:",
      emailError
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                              USER EMAIL                                  */
  /* ------------------------------------------------------------------------ */

  try {
    if (!user.email) {
      console.error(
        "TRADING BOT DEPOSIT USER EMAIL FAILED: User email is missing."
      );
    } else {
      const emailResult = await sendEmail({
        to: user.email,

        subject:
          "Your Trading Bot Deposit Has Been Received",

        html:
          tradingBotDepositSubmittedEmail({
            name:
              profile.username ||
              "User",

            amount:
              Number(depositAmount),

            planName:
              plan.name,

            txid,
          }),
      });

      if (!emailResult.success) {
        console.error(
          "TRADING BOT DEPOSIT USER EMAIL FAILED:",
          emailResult.error
        );
      } else {
        console.log(
          "TRADING BOT DEPOSIT USER EMAIL SENT:",
          {
            to: user.email,
            amount: Number(depositAmount),
            plan: plan.name,
          }
        );
      }
    }
  } catch (emailError) {
    console.error(
      "TRADING BOT DEPOSIT USER EMAIL ERROR:",
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