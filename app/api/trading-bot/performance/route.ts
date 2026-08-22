import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  getBotPerformanceSummary,
} from "@/lib/trading-bot/service";


export async function GET() {

  const supabase =
    await createClient();



  const {
    data: {
      user,
    },
    error: authError,
  } =
    await supabase.auth.getUser();



  if (authError || !user) {

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



  const performance =
    await getBotPerformanceSummary(
      user.id
    );



  if (performance.error) {

    return NextResponse.json(
      {
        error:
          performance.error.message,
      },
      {
        status: 500,
      }
    );

  }



  return NextResponse.json(
    performance.data,
    {
      status: 200,
    }
  );

}