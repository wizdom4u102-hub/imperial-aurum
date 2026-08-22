import { NextResponse } from "next/server";

import {
  removeAdminPushSubscription,
  saveAdminPushSubscription,
} from "@/lib/push-notifications/admin-service";

import type {
  RemoveAdminPushSubscriptionInput,
  SaveAdminPushSubscriptionInput,
} from "@/lib/push-notifications/types";

/* -------------------------------------------------------------------------- */
/*                              Request Types                                 */
/* -------------------------------------------------------------------------- */

type AdminPushSubscriptionRequest =
  | {
      action: "subscribe";
      input: SaveAdminPushSubscriptionInput;
    }
  | {
      action: "unsubscribe";
      input: RemoveAdminPushSubscriptionInput;
    };

/* -------------------------------------------------------------------------- */
/*                              Response Type                                 */
/* -------------------------------------------------------------------------- */

type AdminPushSubscriptionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/* -------------------------------------------------------------------------- */
/*                              POST                                          */
/* -------------------------------------------------------------------------- */

export async function POST(
  request: Request,
): Promise<
  NextResponse<
    AdminPushSubscriptionResponse<unknown>
  >
> {
  try {
    const body =
      (await request.json()) as AdminPushSubscriptionRequest;

    switch (body.action) {
      case "subscribe": {
        const subscription =
          await saveAdminPushSubscription(
            body.input,
          );

        return NextResponse.json({
          success: true,
          data: subscription,
        });
      }

      case "unsubscribe": {
        await removeAdminPushSubscription(
          body.input,
        );

        return NextResponse.json({
          success: true,
          data: true,
        });
      }

      default: {
        return NextResponse.json(
          {
            success: false,
            error:
              "Unsupported push subscription action",
          },
          {
            status: 400,
          },
        );
      }
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Push subscription request failed";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}