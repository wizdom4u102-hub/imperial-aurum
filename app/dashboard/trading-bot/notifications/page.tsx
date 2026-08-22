// app/dashboard/trading-bot/notifications/page.tsx

"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import DashboardLayout from "@/components/trading-bot/dashboard-layout";
import DashboardHeader from "@/components/trading-bot/dashboard-header";

import RecentNotificationsPanel from "@/components/trading-bot/notifications/recent-notifications-panel";

interface TradingBotNotification {
  id: string;

  type:
    | "success"
    | "warning"
    | "info"
    | "error"
    | "profit"
    | "trade"
    | "deposit";

  title: string;

  message: string;

  timestamp: string;

  is_read: boolean;
}

interface AdminMessage {
  id: string;

  subject: string | null;

  message: string | null;

  sent_by: string | null;

  created_at: string | null;

  user_id: string;
}

export default function NotificationsPage() {
  const [
    notifications,
    setNotifications,
  ] = useState<TradingBotNotification[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState("");

  const fetchNotifications =
    useCallback(
      async () => {
        try {
          setLoading(true);

          setError(null);

          const response =
            await fetch(
              "/api/trading-bot/notifications",
              {
                cache: "no-store",
              }
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result?.error ??
                "Failed to load notifications."
            );
          }

          const formatted =
  (Array.isArray(result?.notifications)
    ? result.notifications
    : []
  ).map(
    (
      item: AdminMessage
    ): TradingBotNotification => ({
                id:
                  item.id,

                type:
                  "info",

                title:
                  item.subject ??
                  "Notification",

                message:
                  item.message ??
                  "",

                timestamp:
                  item.created_at ??
                  new Date().toISOString(),

                is_read:
                  false,
              })
            );

          setNotifications(
            formatted
          );

          setLastUpdated(
            new Date().toLocaleString()
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load notifications."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(
    () => {
      fetchNotifications();
    },
    [
      fetchNotifications,
    ]
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader
          onRefresh={
            fetchNotifications
          }

          loading={
            loading
          }

          lastUpdated={
            lastUpdated
          }

          onActivateBot={() => {
            window.location.href =
              "/dashboard/trading-bot/marketplace";
          }}
        />

        {error && (
          <div
            className="
              rounded-2xl
              border
              border-red-500/30
              bg-red-500/10
              p-6
              text-center
              text-red-400
            "
          >
            {error}
          </div>
        )}

        <RecentNotificationsPanel
          notifications={
            notifications
          }

          loading={
            loading
          }
        />
      </div>
    </DashboardLayout>
  );
}