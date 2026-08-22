import type { Database } from "@/lib/supabase/database.types";

/* -------------------------------------------------------------------------- */
/*                    Database Record Types                                   */
/* -------------------------------------------------------------------------- */

export type AdminPushSubscriptionRecord =
  Database["public"]["Tables"]["admin_push_subscriptions"]["Row"];

export type AdminPushSubscriptionInsert =
  Database["public"]["Tables"]["admin_push_subscriptions"]["Insert"];

export type AdminPushSubscriptionUpdate =
  Database["public"]["Tables"]["admin_push_subscriptions"]["Update"];

/* -------------------------------------------------------------------------- */
/*                    Browser Push Subscription                               */
/* -------------------------------------------------------------------------- */

export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface AdminPushSubscriptionData {
  endpoint: string;
  keys: PushSubscriptionKeys;
}

/* -------------------------------------------------------------------------- */
/*                    Save Subscription                                      */
/* -------------------------------------------------------------------------- */

export interface SaveAdminPushSubscriptionInput {
  subscription: AdminPushSubscriptionData;
  userAgent?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                    Remove Subscription                                    */
/* -------------------------------------------------------------------------- */

export interface RemoveAdminPushSubscriptionInput {
  endpoint: string;
}

/* -------------------------------------------------------------------------- */
/*                    Push Notification                                      */
/* -------------------------------------------------------------------------- */

export interface AdminPushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
  data?: Record<string, string>;
}

/* -------------------------------------------------------------------------- */
/*                    Push Notification Result                               */
/* -------------------------------------------------------------------------- */

export interface AdminPushNotificationResult {
  sent: number;
  failed: number;
  removed: number;
}

/* -------------------------------------------------------------------------- */
/*                    Push Permission                                        */
/* -------------------------------------------------------------------------- */

export type PushPermissionState =
  | "default"
  | "granted"
  | "denied"
  | "unsupported";

/* -------------------------------------------------------------------------- */
/*                    Push Client State                                      */
/* -------------------------------------------------------------------------- */

export interface AdminPushNotificationState {
  isSupported: boolean;
  permission: PushPermissionState;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
}