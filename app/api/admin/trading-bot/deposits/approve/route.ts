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
  approveTradingBotDeposit,
} from "@/lib/trading-bot/admin-approval.service";

import {
  sendEmail,
} from "@/lib/email/sendEmail";

import {
  tradingBotDepositApprovedEmail,
} from "@/lib/email/templates";

export async function POST(
  request: NextRequest
) {
  try {
    const supabase =
      await createClient();

    // ============================================================
    // GET LOGGED-IN ADMIN
    // ============================================================

    const {
      data: {
        user,
      },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !user
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // ============================================================
    // VERIFY ADMIN
    // ============================================================

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
          status: 403,
        }
      );
    }

    // ============================================================
    // GET REQUEST BODY
    // ============================================================

    const body =
      await request.json();

    const depositId =
      body.depositId;

    if (
      !depositId ||
      typeof depositId !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Deposit ID required",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // APPROVE TRADING BOT DEPOSIT
    // ============================================================

    const result =
      await approveTradingBotDeposit({
        depositId,
        adminId: user.id,
      });

    // ============================================================
    // CHECK APPROVAL RESULT
    // ============================================================

    if (
      result.error ||
      !result.data
    ) {
      console.error(
        "TRADING BOT APPROVAL FAILED:",
        result.error
      );

      return NextResponse.json(
        {
          error:
            result.error ??
            "Trading bot approval failed",
        },
        {
          status: 500,
        }
      );
    }

    // ============================================================
    // GET APPROVED DEPOSIT
    // ============================================================

    const {
      data: deposit,
      error: depositError,
    } =
      await supabaseAdmin
        .from("bot_deposits")
        .select(
          "user_id, investment_amount, plan_id, bot_id, deposit_type"
        )
        .eq(
          "id",
          depositId
        )
        .single();

    if (
      depositError ||
      !deposit
    ) {
      console.error(
        "TRADING BOT APPROVAL EMAIL DEPOSIT ERROR:",
        depositError
      );

      return NextResponse.json(
        {
          success: true,
          data: result,
          message:
            "Trading bot deposit approved successfully, but the approval email could not be prepared.",
        },
        {
          status: 200,
        }
      );
    }

    // ============================================================
    // GET USER PROFILE
    // ============================================================

    const {
      data: userProfile,
      error: userProfileError,
    } =
      await supabaseAdmin
        .from("profiles")
        .select("username")
        .eq(
          "id",
          deposit.user_id
        )
        .single();

    if (
      userProfileError ||
      !userProfile
    ) {
      console.error(
        "TRADING BOT APPROVAL EMAIL PROFILE ERROR:",
        userProfileError
      );

      return NextResponse.json(
        {
          success: true,
          data: result,
          message:
            "Trading bot deposit approved successfully, but the user profile could not be loaded for email notification.",
        },
        {
          status: 200,
        }
      );
    }

    // ============================================================
    // GET USER EMAIL
    // ============================================================

    const {
      data: {
        user: approvedUser,
      },
      error: approvedUserError,
    } =
      await supabaseAdmin.auth.admin.getUserById(
        deposit.user_id
      );

    if (
      approvedUserError ||
      !approvedUser ||
      !approvedUser.email
    ) {
      console.error(
        "TRADING BOT APPROVAL EMAIL USER ERROR:",
        approvedUserError
      );

      return NextResponse.json(
        {
          success: true,
          data: result,
          message:
            "Trading bot deposit approved successfully, but the user's email could not be loaded.",
        },
        {
          status: 200,
        }
      );
    }

    // ============================================================
    // GET BOT
    // ============================================================

    const {
      data: bot,
      error: botError,
    } =
      await supabaseAdmin
        .from("user_trading_bots")
        .select("bot_name")
        .eq(
          "id",
          result.data.userBotId
        )
        .single();

    if (
      botError ||
      !bot
    ) {
      console.error(
        "TRADING BOT APPROVAL EMAIL BOT ERROR:",
        botError
      );

      return NextResponse.json(
        {
          success: true,
          data: result,
          message:
            "Trading bot deposit approved successfully, but the bot details could not be loaded for email notification.",
        },
        {
          status: 200,
        }
      );
    }

    // ============================================================
    // GET PLAN
    // ============================================================

    const {
      data: plan,
      error: planError,
    } =
      await supabaseAdmin
        .from("trading_bot_plans")
        .select("name")
        .eq(
          "id",
          deposit.plan_id
        )
        .single();

    if (
      planError ||
      !plan
    ) {
      console.error(
        "TRADING BOT APPROVAL EMAIL PLAN ERROR:",
        planError
      );

      return NextResponse.json(
        {
          success: true,
          data: result,
          message:
            "Trading bot deposit approved successfully, but the plan details could not be loaded for email notification.",
        },
        {
          status: 200,
        }
      );
    }

    // ============================================================
    // DETERMINE EMAIL TYPE
    // ============================================================

    const emailType =
      deposit.deposit_type === "top_up"
        ? "top_up"
        : "deposit";

    const emailSubject =
      emailType === "top_up"
        ? "Trading Bot Top-Up Approved"
        : "Trading Bot Deposit Approved";

    // ============================================================
    // SEND USER APPROVAL EMAIL
    // ============================================================

    try {
      console.log(
        "=== TRADING BOT APPROVAL EMAIL ==="
      );

      console.log(
        "Approval email recipient:",
        approvedUser.email
      );

      console.log(
        "Approval email bot:",
        bot.bot_name
      );

      console.log(
        "Approval email plan:",
        plan.name
      );

      console.log(
        "Approval email amount:",
        deposit.investment_amount
      );

      console.log(
        "Approval email type:",
        emailType
      );

      const emailResult =
        await sendEmail({
          to:
            approvedUser.email,

          subject:
            emailSubject,

          html:
            tradingBotDepositApprovedEmail({
              name:
                userProfile.username ||
                "User",

              botName:
                bot.bot_name,

              planName:
                plan.name,

              amount:
                Number(
                  deposit.investment_amount
                ),

              type:
                emailType,
            }),
        });

      if (
        !emailResult.success
      ) {
        console.error(
          "TRADING BOT APPROVAL USER EMAIL FAILED:",
          emailResult.error
        );
      } else {
        console.log(
          "TRADING BOT APPROVAL USER EMAIL SENT SUCCESSFULLY:",
          approvedUser.email
        );
      }

    } catch (
      emailError
    ) {
      console.error(
        "TRADING BOT APPROVAL USER EMAIL ERROR:",
        emailError
      );
    }

    // ============================================================
    // SUCCESS
    // ============================================================

    return NextResponse.json(
      {
        success: true,

        data:
          result,

        message:
          emailType === "top_up"
            ? "Trading bot top-up approved successfully"
            : "Trading bot deposit approved successfully",
      },
      {
        status: 200,
      }
    );

  } catch (
    error
  ) {
    console.error(
      "Approve bot deposit error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}