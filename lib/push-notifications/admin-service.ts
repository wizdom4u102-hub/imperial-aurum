import { createClient } from "@/lib/supabase/server";

import type {
  AdminPushSubscriptionData,
  AdminPushSubscriptionRecord,
  RemoveAdminPushSubscriptionInput,
  SaveAdminPushSubscriptionInput,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                         Save Subscription                                  */
/* -------------------------------------------------------------------------- */

export async function saveAdminPushSubscription(
  input: SaveAdminPushSubscriptionInput,
): Promise<AdminPushSubscriptionRecord> {
  const supabase = await createClient();

  const endpoint =
    input.subscription.endpoint.trim();

  const p256dh =
    input.subscription.keys.p256dh.trim();

  const auth =
    input.subscription.keys.auth.trim();

  if (!endpoint) {
    throw new Error(
      "Push subscription endpoint is required",
    );
  }

  if (!p256dh) {
    throw new Error(
      "Push subscription p256dh key is required",
    );
  }

  if (!auth) {
    throw new Error(
      "Push subscription auth key is required",
    );
  }

  const subscriptionData: AdminPushSubscriptionData =
    {
      endpoint,
      keys: {
        p256dh,
        auth,
      },
    };

  const { data, error } =
    await supabase
      .from("admin_push_subscriptions")
      .upsert(
        {
          endpoint:
            subscriptionData.endpoint,
          p256dh:
            subscriptionData.keys.p256dh,
          auth:
            subscriptionData.keys.auth,
          user_agent:
            input.userAgent ?? null,
          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict: "endpoint",
        },
      )
      .select("*")
      .single();

  if (error) {
    throw new Error(
      `Failed to save admin push subscription: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error(
      "Admin push subscription was not saved",
    );
  }

  return data;
}

/* -------------------------------------------------------------------------- */
/*                       Remove Subscription                                  */
/* -------------------------------------------------------------------------- */

export async function removeAdminPushSubscription(
  input: RemoveAdminPushSubscriptionInput,
): Promise<void> {
  const supabase = await createClient();

  const endpoint =
    input.endpoint.trim();

  if (!endpoint) {
    throw new Error(
      "Push subscription endpoint is required",
    );
  }

  const { error } =
    await supabase
      .from("admin_push_subscriptions")
      .delete()
      .eq("endpoint", endpoint);

  if (error) {
    throw new Error(
      `Failed to remove admin push subscription: ${error.message}`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                       Get Subscription                                     */
/* -------------------------------------------------------------------------- */

export async function getAdminPushSubscription(
  endpoint: string,
): Promise<AdminPushSubscriptionRecord | null> {
  const supabase = await createClient();

  const normalizedEndpoint =
    endpoint.trim();

  if (!normalizedEndpoint) {
    return null;
  }

  const { data, error } =
    await supabase
      .from("admin_push_subscriptions")
      .select("*")
      .eq(
        "endpoint",
        normalizedEndpoint,
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load admin push subscription: ${error.message}`,
    );
  }

  return data;
}

/* -------------------------------------------------------------------------- */
/*                       Subscription Count                                   */
/* -------------------------------------------------------------------------- */

export async function getAdminPushSubscriptionCount(): Promise<number> {
  const supabase = await createClient();

  const {
    count,
    error,
  } = await supabase
    .from("admin_push_subscriptions")
    .select("id", {
      count: "exact",
      head: true,
    });

  if (error) {
    throw new Error(
      `Failed to count admin push subscriptions: ${error.message}`,
    );
  }

  return count ?? 0;
}