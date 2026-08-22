"use client";

import {
  Bell,
  BellOff,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getPushPermissionState,
  isPushNotificationSupported,
  subscribeToAdminPush,
  unsubscribeFromAdminPush,
} from "@/lib/push-notifications/client";

import type {
  PushPermissionState,
} from "@/lib/push-notifications/types";

type PushSubscriptionApiResponse = {
  success: boolean;
  data?: unknown;
  error?: string;
};

export default function AdminPushNotifications() {
  const [isSupported, setIsSupported] =
    useState(false);

  const [permission, setPermission] =
    useState<PushPermissionState>(
      "default",
    );

  const [isSubscribed, setIsSubscribed] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refreshState =
    useCallback(async (): Promise<void> => {
      try {
        setError(null);

        const supported =
          isPushNotificationSupported();

        setIsSupported(supported);

        if (!supported) {
          setPermission("unsupported");
          setIsSubscribed(false);
          return;
        }

        const currentPermission =
          getPushPermissionState();

        setPermission(
          currentPermission,
        );

        const subscription =
          await navigator.serviceWorker
            .register("/sw.js")
            .then((registration) =>
              registration.pushManager.getSubscription(),
            );

        setIsSubscribed(
          subscription !== null,
        );
      } catch (refreshError) {
        setError(
          refreshError instanceof Error
            ? refreshError.message
            : "Failed to check notification status",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void refreshState();
  }, [refreshState]);

  const enableNotifications =
    useCallback(async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const subscription =
          await subscribeToAdminPush();

        const response =
          await fetch(
            "/api/admin/push-subscription",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                action: "subscribe",
                input: {
                  subscription,
                  userAgent:
                    navigator.userAgent,
                },
              }),
            },
          );

        const result =
          (await response.json()) as PushSubscriptionApiResponse;

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ??
              "Failed to save push subscription",
          );
        }

        setPermission("granted");
        setIsSubscribed(true);
      } catch (subscriptionError) {
        setError(
          subscriptionError instanceof Error
            ? subscriptionError.message
            : "Failed to enable notifications",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  const disableNotifications =
    useCallback(async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const endpoint =
          await unsubscribeFromAdminPush();

        if (endpoint) {
          const response =
            await fetch(
              "/api/admin/push-subscription",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  action: "unsubscribe",
                  input: {
                    endpoint,
                  },
                }),
              },
            );

          const result =
            (await response.json()) as PushSubscriptionApiResponse;

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              result.error ??
                "Failed to remove push subscription",
            );
          }
        }

        setIsSubscribed(false);
      } catch (unsubscribeError) {
        setError(
          unsubscribeError instanceof Error
            ? unsubscribeError.message
            : "Failed to disable notifications",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  if (!isSupported) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800">
            <BellOff className="h-5 w-5 text-zinc-500" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Browser Notifications
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              Push notifications are not supported
              by this browser.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
            <Bell className="h-5 w-5 text-amber-400" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Browser Notifications
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              Receive alerts for new visitors and
              new live chat messages.
            </p>

            <div className="mt-2 flex items-center gap-2">
              {isSubscribed ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />

                  <span className="text-xs text-emerald-400">
                    Notifications enabled
                  </span>
                </>
              ) : permission === "denied" ? (
                <>
                  <XCircle className="h-3.5 w-3.5 text-red-400" />

                  <span className="text-xs text-red-400">
                    Notifications blocked
                  </span>
                </>
              ) : (
                <span className="text-xs text-zinc-500">
                  Notifications are disabled
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isSubscribed) {
              void disableNotifications();
            } else {
              void enableNotifications();
            }
          }}
          disabled={isLoading}
          className="flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSubscribed ? (
            <>
              <BellOff className="h-4 w-4" />
              Disable
            </>
          ) : (
            <>
              <Bell className="h-4 w-4" />
              Enable Notifications
            </>
          )}
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      ) : null}

      {permission === "denied" ? (
        <p className="mt-4 text-xs text-zinc-500">
          Notifications are blocked by your browser.
          Allow notifications for this website in
          your browser settings, then try again.
        </p>
      ) : null}
    </div>
  );
}