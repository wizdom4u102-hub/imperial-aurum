import {
  NextRequest,
  NextResponse,
} from "next/server";


import {
  createClient,
} from "@/lib/supabase/server";


console.log("=== ADMIN DEPOSITS API HIT ===");

export async function GET(
  request: NextRequest
) {

  try {


    const supabase =
      await createClient();



    // Check logged in user

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
          status:401,
        }
      );

    }




    // Admin check

    const {
      data: profile,
      error: profileError,

    } =
      await supabase
        .from("profiles")
        .select(
          "is_admin"
        )
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

  console.log("ADMIN CHECK FAILED");
  console.log("USER:", user);
  console.log("PROFILE:", profile);
  console.log("PROFILE ERROR:", profileError);

  return NextResponse.json(
    {
      error: "Forbidden",
    },
    {
      status: 403,
    }
  );

}





    const searchParams =
      request.nextUrl.searchParams;



    const search =
      searchParams.get(
        "search"
      ) ?? "";



    const status =
      searchParams.get(
        "status"
      ) ?? "all";




    let query = supabase
  .from("bot_deposits")
  .select(
    `
    *,
    deposit_type,
    bot_id,
    plan:trading_bot_plans(
      id,
      name,
      trading_asset,
      duration_days
    ),
    profile:profiles(
      id,
      name,
      email
    ),
    bot:user_trading_bots!bot_deposits_bot_id_fkey(
      id,
      bot_name
    )
    `,
    {
      count: "exact",
    }
  )
  .order("created_at", {
    ascending: false,
  });



    if (
      status !== "all"
    ) {

      query =
        query.eq(
          "status",
          status
        );

    }





    if (
      search
    ) {


      query =
        query.or(
          `
          reference.ilike.%${search}%,
          payment_wallet.ilike.%${search}%
          `
        );


    }





    const {
      data,
      error,
      count,

    } =
      await query;




    if (error) {

      throw error;

    }

    console.log(
  "BOT DEPOSITS:",
  data?.map((item: any) => ({
    id: item.id,
    status: item.status,
    deposit_type: item.deposit_type,
    bot_id: item.bot_id,
  }))
);




    return NextResponse.json(
      {
        deposits:
          data ?? [],

        total:
          count ?? 0,

      },
      {
        status:200,
      }
    );



  } catch(error:any) {


    console.error(
      "Admin deposits error:",
      error
    );



    return NextResponse.json(
      {
        error:
          error.message ??
          "Internal server error",
      },
      {
        status:500,
      }
    );

  }

} 