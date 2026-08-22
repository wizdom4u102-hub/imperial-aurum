import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import {
  getTradingBotDashboard,
} from "@/lib/trading-bot/service";


export async function GET() {
  try {
    const supabase = await createClient();


    const {
      data: {
        user,
      },
      error: authError,
    } = await supabase.auth.getUser();



    if (authError || !user) {
      return NextResponse.json(
        {
          data: null,

          error: {
            code: "UNAUTHORIZED",

            message:
              "User authentication required.",
          },
        },
        {
          status: 401,
        }
      );
    }



    const dashboard =
      await getTradingBotDashboard(
        user.id
      );

      console.log(
  "Notifications:",
  dashboard.notifications
);



    return NextResponse.json(
      {
        data: dashboard,

        error: null,
      },
      {
        status: 200,
      }
    );


  } catch (error) {
    console.error(
      "Trading bot dashboard error:",
      error
    );
    


    return NextResponse.json(
      {
        data: null,

        error: {
          code: "SERVER_ERROR",

          message:
            error instanceof Error
              ? error.message
              : "Failed to load trading bot dashboard.",
        },
      },
      {
        status: 500,
      }
    );
  }
}