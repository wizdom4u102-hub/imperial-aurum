"use client";

import type {
  AdminPushSubscriptionData,
  PushPermissionState,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                         Service Worker Path                                */
/* -------------------------------------------------------------------------- */

const SERVICE_WORKER_PATH =
  "/sw.js";

/* -------------------------------------------------------------------------- */
/*                         Browser Support                                    */
/* -------------------------------------------------------------------------- */

export function isPushNotificationSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/* -------------------------------------------------------------------------- */
/*                         Permission State                                   */
/* -------------------------------------------------------------------------- */

export function getPushPermissionState(): PushPermissionState {
  if (
    typeof window === "undefined" ||
    !("Notification" in window)
  ) {
    return "unsupported";
  }

  return Notification.permission;
}

/* -------------------------------------------------------------------------- */
/*                         VAPID Key Conversion                               */
/* -------------------------------------------------------------------------- */

function urlBase64ToArrayBuffer(
  value: string,
): ArrayBuffer {
  const padding =
    "=".repeat(
      (4 - (value.length % 4)) % 4,
    );

  const base64 =
    `${value}${padding}`
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const rawData =
    window.atob(base64);

  const output =
    new Uint8Array(
      rawData.length,
    );

  for (
    let index = 0;
    index < rawData.length;
    index += 1
  ) {
    output[index] =
      rawData.charCodeAt(index);
  }

  return output.buffer;
}

/* -------------------------------------------------------------------------- */
/*                         Service Worker                                    */
/* -------------------------------------------------------------------------- */

export async function registerPushServiceWorker(): Promise<
  ServiceWorkerRegistration
> {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator)
  ) {
    throw new Error(
      "Service workers are not supported",
    );
  }

  return navigator.serviceWorker.register(
    SERVICE_WORKER_PATH,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Request Permission                                 */
/* -------------------------------------------------------------------------- */

export async function requestPushPermission(): Promise<
  PushPermissionState
> {
  if (
    typeof window === "undefined" ||
    !("Notification" in window)
  ) {
    return "unsupported";
  }

  const permission =
    await Notification.requestPermission();

  return permission;
}

/* -------------------------------------------------------------------------- */
/*                         Get Subscription                                  */
/* -------------------------------------------------------------------------- */

export async function getExistingPushSubscription(): Promise<
  PushSubscription | null
> {
  const registration =
    await registerPushServiceWorker();

  return registration.pushManager.getSubscription();
}

/* -------------------------------------------------------------------------- */
/*                         Create Subscription                                */
/* -------------------------------------------------------------------------- */

export async function subscribeToAdminPush(): Promise<
  AdminPushSubscriptionData
> {
  if (
    !isPushNotificationSupported()
  ) {
    throw new Error(
      "Push notifications are not supported by this browser",
    );
  }

  const publicKey =
    process.env
      .NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error(
      "NEXT_PUBLIC_VAPID_PUBLIC_KEY is not configured",
    );
  }

  const permission =
    await requestPushPermission();

  if (permission !== "granted") {
    if (permission === "denied") {
      throw new Error(
        "Browser notifications are blocked. Please allow notifications in your browser settings.",
      );
    }

    throw new Error(
      "Notification permission was not granted",
    );
  }

  const registration =
    await registerPushServiceWorker();

  const existingSubscription =
    await registration.pushManager.getSubscription();

  const subscription =
    existingSubscription ??
    (await registration.pushManager.subscribe(
      {
        userVisibleOnly: true,
        applicationServerKey:
          urlBase64ToArrayBuffer(
            publicKey,
          ),
      },
    ));

  const json =
    subscription.toJSON();

  const endpoint =
    subscription.endpoint;

  const p256dh =
    json.keys?.p256dh;

  const auth =
    json.keys?.auth;

  if (!endpoint) {
    throw new Error(
      "Push subscription endpoint is missing",
    );
  }

  if (!p256dh) {
    throw new Error(
      "Push subscription p256dh key is missing",
    );
  }

  if (!auth) {
    throw new Error(
      "Push subscription auth key is missing",
    );
  }

  return {
    endpoint,
    keys: {
      p256dh,
      auth,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                         Unsubscribe                                       */
/* -------------------------------------------------------------------------- */

export async function unsubscribeFromAdminPush(): Promise<
  string | null
> {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator)
  ) {
    return null;
  }

  const registration =
    await registerPushServiceWorker();

  const subscription =
    await registration.pushManager.getSubscription();

  if (!subscription) {
    return null;
  }

  const endpoint =
    subscription.endpoint;

  await subscription.unsubscribe();

  return endpoint;
}