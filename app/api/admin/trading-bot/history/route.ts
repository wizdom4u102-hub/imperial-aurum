import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin";

import {
  getAdminTradingBotHistory,
} from "@/lib/trading-bot/admin-history.service";


export const dynamic = "force-dynamic";
export const revalidate = 0;


export async function GET() {

  try {

    const admin =
      await requireAdminApi();

    if (!admin.ok) {

      return NextResponse.json(
        {
          error:
            admin.error,
        },
        {
          status:
            admin.status,
        }
      );

    }


    const result =
      await getAdminTradingBotHistory();


    if (result.error) {

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


    return NextResponse.json(
      {
        success: true,

        history:
          result.data ?? [],
      },
      {
        status: 200,
      }
    );


  } catch (error) {

    console.error(
      "ADMIN TRADING BOT HISTORY API ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load trading bot history.",
      },
      {
        status: 500,
      }
    );

  }

}