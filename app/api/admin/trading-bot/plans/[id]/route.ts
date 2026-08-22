import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  deleteAdminTradingBotPlan,
  getAdminTradingBotPlan,
  updateAdminTradingBotPlan,
} from "@/lib/trading-bot/admin-plan.service";


interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}


export async function GET(
  _request: NextRequest,
  context: RouteContext
) {

  const {
    id,
  } = await context.params;


  if (!id) {

    return NextResponse.json(
      {
        error:
          "Plan ID is required.",
      },
      {
        status: 400,
      }
    );

  }


  const result =
    await getAdminTradingBotPlan(
      id
    );


  if (result.error) {

    return NextResponse.json(
      {
        error:
          result.error.message,
      },
      {
        status: 404,
      }
    );

  }


  return NextResponse.json(
    {
      plan:
        result.data,
    },
    {
      status: 200,
    }
  );
}


export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {

  try {

    const {
      id,
    } = await context.params;


    if (!id) {

      return NextResponse.json(
        {
          error:
            "Plan ID is required.",
        },
        {
          status: 400,
        }
      );

    }


    const body =
      await request.json();


    const result =
      await updateAdminTradingBotPlan(
        id,
        body
      );


    if (result.error) {

      return NextResponse.json(
        {
          error:
            result.error.message,
        },
        {
          status: 400,
        }
      );

    }


    return NextResponse.json(
      {
        plan:
          result.data,
      },
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
            : "Unable to update trading bot plan.",
      },
      {
        status: 500,
      }
    );

  }
}


export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {

  try {

    const {
      id,
    } = await context.params;


    if (!id) {

      return NextResponse.json(
        {
          error:
            "Plan ID is required.",
        },
        {
          status: 400,
        }
      );

    }


    const result =
      await deleteAdminTradingBotPlan(
        id
      );


    if (result.error) {

      return NextResponse.json(
        {
          error:
            result.error.message,
        },
        {
          status: 400,
        }
      );

    }


    return NextResponse.json(
      {
        success: true,

        plan:
          result.data,
      },
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
            : "Unable to delete trading bot plan.",
      },
      {
        status: 500,
      }
    );

  }
}