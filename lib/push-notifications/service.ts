import { supabaseAdmin } from "@/lib/supabase/admin";

import type {
  AdminPushNotificationPayload,
  AdminPushNotificationResult,
  AdminPushSubscriptionRecord,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                         Push Configuration                                 */
/* -------------------------------------------------------------------------- */

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY;

const VAPID_SUBJECT =
  process.env.VAPID_SUBJECT;

/* -------------------------------------------------------------------------- */
/*                         Web Push Loader                                    */
/* -------------------------------------------------------------------------- */

type WebPushModule = {
  sendNotification: (
    subscription: {
      endpoint: string;
      keys: {
        p256dh: string;
        auth: string;
      };
    },
    payload: string,
    options: {
      vapidDetails: {
        subject: string;
        publicKey: string;
        privateKey: string;
      };
    },
  ) => Promise<void>;
};

async function getWebPush(): Promise<WebPushModule> {
  const webPush =
    (await import("web-push")) as unknown as WebPushModule;

  return webPush;
}

/* -------------------------------------------------------------------------- */
/*                    Send Push Notification                                  */
/* -------------------------------------------------------------------------- */

export async function sendAdminPushNotification(
  payload: AdminPushNotificationPayload,
): Promise<AdminPushNotificationResult> {
  if (
    !VAPID_PUBLIC_KEY ||
    !VAPID_PRIVATE_KEY ||
    !VAPID_SUBJECT
  ) {
    throw new Error(
      "Web Push VAPID configuration is missing",
    );
  }

  const supabase = supabaseAdmin;;

  const {
    data: subscriptions,
    error,
  } = await supabase
    .from("admin_push_subscriptions")
    .select("*");

  if (error) {
    throw new Error(
      `Failed to load admin push subscriptions: ${error.message}`,
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return {
      sent: 0,
      failed: 0,
      removed: 0,
    };
  }

  const webPush = await getWebPush();

  const serializedPayload =
    JSON.stringify(payload);

  let sent = 0;
  let failed = 0;
  let removed = 0;

  for (const subscription of subscriptions) {
    try {
      await webPush.sendNotification(
        {
          endpoint:
            subscription.endpoint,
          keys: {
            p256dh:
              subscription.p256dh,
            auth:
              subscription.auth,
          },
        },
        serializedPayload,
        {
          vapidDetails: {
            subject: VAPID_SUBJECT,
            publicKey:
              VAPID_PUBLIC_KEY,
            privateKey:
              VAPID_PRIVATE_KEY,
          },
        },
      );

      sent += 1;

      await supabase
        .from("admin_push_subscriptions")
        .update({
          last_used_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          subscription.id,
        );
    } catch (error) {
      failed += 1;

      const statusCode =
        getPushErrorStatusCode(error);

      /*
       * HTTP 404 and 410 mean that the
       * browser subscription is no longer
       * valid. Remove it so we don't keep
       * attempting to send to a dead endpoint.
       */
      if (
        statusCode === 404 ||
        statusCode === 410
      ) {
        const { error: deleteError } =
          await supabase
            .from(
              "admin_push_subscriptions",
            )
            .delete()
            .eq(
              "id",
              subscription.id,
            );

        if (!deleteError) {
          removed += 1;
        }
      } else {
        console.error(
          "Failed to send admin push notification:",
          error,
        );
      }
    }
  }

  return {
    sent,
    failed,
    removed,
  };
}

/* -------------------------------------------------------------------------- */
/*                    Push Error Status                                       */
/* -------------------------------------------------------------------------- */

function getPushErrorStatusCode(
  error: unknown,
): number | null {
  if (
    typeof error !== "object" ||
    error === null ||
    !("statusCode" in error)
  ) {
    return null;
  }

  const statusCode =
    error.statusCode;

  return typeof statusCode === "number"
    ? statusCode
    : null;
}

/* -------------------------------------------------------------------------- */
/*                    Get Subscriptions                                      */
/* -------------------------------------------------------------------------- */

export async function getAdminPushSubscriptions(): Promise<
  AdminPushSubscriptionRecord[]
> {
  const supabase = supabaseAdmin;

  const {
    data,
    error,
  } = await supabase
    .from("admin_push_subscriptions")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Failed to load admin push subscriptions: ${error.message}`,
    );
  }

  return data;
}