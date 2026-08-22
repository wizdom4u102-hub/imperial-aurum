import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  updateAdminTradingBotPlan,
} from "@/lib/trading-bot/admin-plan.service";


interface RouteContext {
  params: Promise<{
    id: string;
  }>;
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


    const update: {
      status?: string;
      display_order?: number;
      is_featured?: boolean;
      is_popular?: boolean;
    } = {};


    if (
      body.status !==
      undefined
    ) {

      update.status =
        String(
          body.status
        );

    }


    if (
      body.display_order !==
      undefined
    ) {

      const displayOrder =
        Number(
          body.display_order
        );


      if (
        !Number.isInteger(
          displayOrder
        ) ||
        displayOrder < 0
      ) {

        return NextResponse.json(
          {
            error:
              "Display order must be a non-negative integer.",
          },
          {
            status: 400,
          }
        );

      }


      update.display_order =
        displayOrder;

    }


    if (
      body.is_featured !==
      undefined
    ) {

      update.is_featured =
        Boolean(
          body.is_featured
        );

    }


    if (
      body.is_popular !==
      undefined
    ) {

      update.is_popular =
        Boolean(
          body.is_popular
        );

    }


    if (
      Object.keys(
        update
      ).length === 0
    ) {

      return NextResponse.json(
        {
          error:
            "No valid plan settings were provided.",
        },
        {
          status: 400,
        }
      );

    }


    const result =
      await updateAdminTradingBotPlan(
        id,
        update
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
            : "Unable to update trading bot plan settings.",
      },
      {
        status: 500,
      }
    );

  }
}