import {
  NextRequest,
  NextResponse,
} from "next/server";


import {
  createClient,
} from "@/lib/supabase/server";


import {
  approveTradingBotDeposit,
} from "@/lib/trading-bot/admin-approval.service";



export async function POST(
  request: NextRequest
) {

  try {


    const supabase =
      await createClient();




    // Get logged in admin

    const {
      data:{
        user,
      },
      error:authError,

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





    // Verify admin

    const {
      data:profile,
      error:profileError,

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

      return NextResponse.json(
        {
          error:
            "Forbidden",
        },
        {
          status:403,
        }
      );

    }





    const body =
      await request.json();



    const depositId =
      body.depositId;



    if (
      !depositId
    ) {

      return NextResponse.json(
        {
          error:
            "Deposit ID required",
        },
        {
          status:400,
        }
      );

    }





    const result =
      await approveTradingBotDeposit({

        depositId,

        adminId:
          user.id,

      });






    if (
      result.error
    ) {

      return NextResponse.json(
        {
          error:
            result.error,
        },
        {
          status:500,
        }
      );

    }





    /*
      Email notification hook

      Next step:
      Send approval email here

      Example:

      await sendBotApprovalEmail({
        userId:
          deposit.user_id,
        botId:
          result.data.userBotId
      });

    */





    return NextResponse.json(
      {
        success:true,

        data:
          result.data,

        message:
          "Trading bot deposit approved successfully",

      },
      {
        status:200,
      }
    );



  } catch(error:any) {


    console.error(
      "Approve bot deposit error:",
      error?.message,
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