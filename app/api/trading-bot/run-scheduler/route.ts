import { NextRequest, NextResponse } from "next/server";

import {
  runTradingBotScheduler,
} from "@/lib/trading-bot/scheduler";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(
  request: NextRequest
) {
  try {
    // =====================================================
    // CRON AUTHENTICATION
    // =====================================================

    const authHeader =
      request.headers.get("authorization");

    if (
      authHeader !==
      `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // RUN TRADING BOT SCHEDULER
    // =====================================================

    await runTradingBotScheduler();

    // =====================================================
    // SUCCESS
    // =====================================================

    return NextResponse.json({
      success: true,
    });
  } catch (error: unknown) {
    console.error(
      "TRADING BOT SCHEDULER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Scheduler error",
      },
      {
        status: 500,
      }
    );
  }
}