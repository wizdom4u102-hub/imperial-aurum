import {
  NextResponse,
} from "next/server";


import {
  createClient,
} from "@/lib/supabase/server";


export async function GET() {

  const supabase =
    await createClient();

    const {
  data: sessionData,
} = await supabase.auth.getSession();

console.log(
  "API SESSION:",
  sessionData.session?.user?.id
);


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



  const {
    data,
    error,
  } =
    await supabase
      .from("bot_trades")
      .select("*")
      .eq(
        "user_id",
        user.id
      )
      .in(
        "status",
        [
          "ACTIVE",
          "RUNNING",
          "OPEN",
        ]
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );



  if (error) {

    return NextResponse.json(
      {
        error:
          error.message,
      },
      {
        status: 500,
      }
    );

  }

console.log("LIVE TRADES USER:", user.id);
console.log("LIVE TRADES COUNT:", data?.length);
console.log("LIVE TRADES:", data);

  return NextResponse.json(
  {
    data: {
      trades: data ?? [],
    },
    error: null,
  },
  {
    status: 200,
  }
);

}