"use client";

import React, {
  useEffect,
  useState,
} from "react";
import NotificationItem from "./notification-item";

interface Notification {
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

  icon?: React.ReactNode;
}

interface RecentNotificationsPanelProps {
  notifications: Notification[];

  loading: boolean;
}

const RecentNotificationsPanel: React.FC<
  RecentNotificationsPanelProps
> = ({
  notifications: initialNotifications,
  loading,
}) => {

  const [
    notifications,
    setNotifications,
  ] = useState(initialNotifications);

  useEffect(
  () => {
    setNotifications(
      initialNotifications
    );
  },
  [
    initialNotifications,
  ]
);

  if (loading) {
    return (
      <div className="animate-pulse rounded-xl bg-zinc-900 p-6">
        Loading...
      </div>
    );
  }

  const unreadCount =
    notifications.filter(
      (item) => !item.is_read
    ).length;

  async function markAllAsRead() {

    await fetch(
      "/api/trading-bot/notifications/read-all",
      {
        method: "PATCH",
      }
    );

    setNotifications(
      notifications.map((item) => ({
        ...item,
        is_read: true,
      }))
    );
  }

  function markAsRead(
    id: string
  ) {

    setNotifications(
      notifications.map((item) =>
        item.id === id
          ? {
              ...item,
              is_read: true,
            }
          : item
      )
    );
  }

  return (

    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-xl font-bold text-white">
          Notifications ({notifications.length})
        </h2>

        <div className="flex items-center gap-3">

          {unreadCount > 0 && (

            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">

              {unreadCount}

            </span>

          )}

          {unreadCount > 0 && (

            <button
              onClick={markAllAsRead}
              className="text-sm text-yellow-400 hover:text-yellow-300"
            >
              Mark all as read
            </button>

          )}

        </div>

      </div>

      {notifications.length === 0 ? (

        <div className="py-8 text-center">

          <h3 className="font-semibold text-white">
            No Notifications
          </h3>

          <p className="mt-2 text-zinc-400">
            Your notifications will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-3">

          {notifications.map((notification) => (

            <NotificationItem
              key={notification.id}
              id={notification.id}
              type={notification.type}
              title={notification.title}
              message={notification.message}
              timestamp={notification.timestamp}
              read={notification.is_read}
              icon={notification.icon}
              onRead={markAsRead}
            />

          ))}

        </div>

      )}

    </div>

  );

};

export default RecentNotificationsPanel;