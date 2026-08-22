import {
  NextResponse,
} from "next/server";


import {
  getTradingBotStatistics,
} from "@/lib/trading-bot/statistics";


import {
  createClient,
} from "@/lib/supabase/server";



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



  try {

    const statistics =
      await getTradingBotStatistics(
        user.id
      );



    return NextResponse.json(
      statistics,
      {
        status: 200,
      }
    );


  } catch (error) {

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch statistics",
      },
      {
        status: 500,
      }
    );

  }

}