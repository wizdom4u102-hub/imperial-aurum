"use client";

import React from "react";

import NotificationIcon from "./notification-icon";

interface NotificationItemProps {

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

  read: boolean;

  icon?: React.ReactNode;

  onRead(id: string): void;

}

const NotificationItem: React.FC<
  NotificationItemProps
> = ({
  id,
  type,
  title,
  message,
  timestamp,
  read,
  icon,
  onRead,
}) => {

  async function handleClick() {

    if (!read) {

      await fetch(
        `/api/trading-bot/notifications/${id}`,
        {
          method: "PATCH",
        }
      );

      onRead(id);

    }

  }

  return (

    <div

      onClick={handleClick}

      className={`

      cursor-pointer

      flex

      items-start

      rounded-xl

      border

      border-zinc-700

      bg-zinc-950

      p-4

      transition

      hover:border-yellow-400

      hover:bg-zinc-900

      ${read ? "opacity-70" : ""}

      `}
    >

      <NotificationIcon

        type={type}

        customIcon={icon}

      />

      <div className="ml-4 flex-1">

        <div className="flex items-center justify-between">

          <h3 className="font-semibold text-white">

            {title}

          </h3>

          {!read && (

            <span className="rounded-full bg-blue-600 px-2 py-1 text-xs text-white">

              New

            </span>

          )}

        </div>

        <p className="mt-2 text-sm text-zinc-300">

          {message}

        </p>

        <p className="mt-2 text-xs text-zinc-500">

          {new Date(timestamp).toLocaleString()}

        </p>

      </div>

    </div>

  );

};

export default NotificationItem;