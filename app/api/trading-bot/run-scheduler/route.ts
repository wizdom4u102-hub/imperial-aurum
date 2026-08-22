import { NextResponse } from "next/server";

import {
  runTradingBotScheduler,
} from "@/lib/trading-bot/scheduler";

export async function POST() {
  try {
    await runTradingBotScheduler();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}