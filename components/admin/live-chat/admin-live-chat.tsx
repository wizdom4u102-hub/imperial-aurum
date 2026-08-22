"use client";

import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAdminLiveChat } from "@/hooks/use-admin-live-chat";

export default function AdminLiveChat() {
  const router = useRouter();

  const {
    conversations,
    isLoading,
    error,
  } = useAdminLiveChat();

  return (
    <section className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Live Chat
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Visitor conversations
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        {isLoading ? (
          <div className="p-6 text-sm text-zinc-400">
            Loading conversations...
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-400">
            {error}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800">
              <MessageCircle className="h-6 w-6 text-zinc-400" />
            </div>

            <h2 className="text-base font-semibold text-white">
              No visitor conversations
            </h2>

            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              New conversations will appear here when
              visitors start using the Live Chat widget.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {conversations.map((item) => {
              const conversation =
                item.conversation;

              const isClosed =
                conversation.status === "closed";

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => {
                    router.push(
                      `/admin/live-chat/${conversation.id}`,
                    );
                  }}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-zinc-800/70"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                    <MessageCircle className="h-5 w-5 text-zinc-300" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="truncate text-sm font-semibold text-white">
                        {conversation.subject ??
                          "Visitor"}
                      </h3>

                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          isClosed
                            ? "bg-zinc-800 text-zinc-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {isClosed
                          ? "Closed"
                          : "Open"}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-zinc-500">
                      {conversation.user_id
                        ? "Registered visitor"
                        : "Anonymous visitor"}
                    </p>

                    <p className="mt-1 text-[11px] text-zinc-600">
                      {conversation.last_message_at
                        ? new Date(
                            conversation.last_message_at,
                          ).toLocaleString()
                        : "No messages yet"}
                    </p>
                  </div>

                  {item.unreadMessageCount > 0 ? (
                    <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                      {item.unreadMessageCount >
                      99
                        ? "99+"
                        : item.unreadMessageCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}