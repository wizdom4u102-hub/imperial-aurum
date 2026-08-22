import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createAdminTradingBotPlan,
  getAdminTradingBotPlans,
} from "@/lib/trading-bot/admin-plan.service";


export async function GET() {

  const result =
    await getAdminTradingBotPlans();

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
      plans:
        result.data ?? [],
    },
    {
      status: 200,
    }
  );
}


export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json();

    const result =
      await createAdminTradingBotPlan(
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
        status: 201,
      }
    );

  } catch (error) {

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create trading bot plan.",
      },
      {
        status: 500,
      }
    );

  }
}