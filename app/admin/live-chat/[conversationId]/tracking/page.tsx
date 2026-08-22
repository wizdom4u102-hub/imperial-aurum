"use client";

import {
  Activity,
  ArrowLeft,
  Globe,
  Monitor,
  User,
  UserPlus,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useAdminLiveChat } from "@/hooks/use-admin-live-chat";
import { useAdminVisitor } from "@/hooks/use-admin-visitor";

function formatEventType(
  eventType: string,
): string {
  return eventType
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-zinc-500">
        {label}
      </p>

      <p className="mt-1 break-all text-sm text-zinc-200">
        {value}
      </p>
    </div>
  );
}

export default function AdminLiveChatTrackingPage() {
  const router = useRouter();
  const params = useParams();

  const conversationId =
    typeof params.conversationId === "string"
      ? params.conversationId
      : null;

  const {
    conversations,
    isLoading: isLoadingConversations,
  } = useAdminLiveChat(conversationId);

  const conversation =
    conversations.find(
      (item) =>
        item.conversation.id ===
        conversationId,
    )?.conversation ?? null;

  const sessionId =
    conversation?.session_id ?? null;

  const {
    session,
    events,
    isLoading: isLoadingVisitor,
    error: visitorError,
  } = useAdminVisitor(sessionId);

  const isLoading =
    isLoadingConversations ||
    isLoadingVisitor;

  function handleBack(): void {
    if (conversationId) {
      router.push(
        `/admin/live-chat/${conversationId}`,
      );

      return;
    }

    router.push("/admin/live-chat");
  }

  return (
    <section className="w-full">
      {/* Header */}
      <header className="mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          aria-label="Back to conversation"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white">
            Visitor Tracking
          </h1>

          <p className="mt-1 text-sm text-zinc-400">
            {conversation?.subject ??
              "Visitor activity and journey"}
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">
            Loading visitor tracking...
          </p>
        </div>
      ) : visitorError ? (
        <div className="rounded-2xl border border-red-900/50 bg-zinc-900 p-6">
          <p className="text-sm text-red-400">
            {visitorError}
          </p>
        </div>
      ) : !session ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <User className="mx-auto mb-4 h-10 w-10 text-zinc-600" />

          <h2 className="text-base font-semibold text-white">
            Visitor session not found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
            Tracking information is not available
            for this conversation.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
                  <User className="h-5 w-5 text-zinc-300" />
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Visitor
                  </p>

                  <p className="text-sm font-medium text-white">
                    {session.user_id
                      ? "Registered"
                      : "Anonymous"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    session.is_online
                      ? "bg-emerald-400"
                      : "bg-zinc-600"
                  }`}
                />

                <div>
                  <p className="text-xs text-zinc-500">
                    Status
                  </p>

                  <p className="text-sm font-medium text-white">
                    {session.is_online
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 shrink-0 text-zinc-400" />

                <div className="min-w-0">
                  <p className="text-xs text-zinc-500">
                    Current Page
                  </p>

                  <p className="truncate text-sm font-medium text-white">
                    {session.current_page ??
                      "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-zinc-400" />

                <div>
                  <p className="text-xs text-zinc-500">
                    Events
                  </p>

                  <p className="text-sm font-medium text-white">
                    {events.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visitor information */}
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
              <div className="border-b border-zinc-800 p-5">
                <h2 className="font-semibold text-white">
                  Visitor Information
                </h2>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2">
                <InfoItem
                  label="Landing Page"
                  value={
                    session.landing_page ??
                    "Unknown"
                  }
                />

                <InfoItem
                  label="Referrer"
                  value={
                    session.referrer_url ??
                    "None"
                  }
                />

                <InfoItem
                  label="Referral Code"
                  value={
                    session.referral_code ??
                    "None"
                  }
                />

                <InfoItem
                  label="User ID"
                  value={
                    session.user_id ??
                    "Not registered"
                  }
                />
              </div>
            </section>

            {/* Device */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
              <div className="border-b border-zinc-800 p-5">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-zinc-400" />

                  <h2 className="font-semibold text-white">
                    Device
                  </h2>
                </div>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2">
                <InfoItem
                  label="Device"
                  value={
                    session.device_type ??
                    "Unknown"
                  }
                />

                <InfoItem
                  label="Browser"
                  value={
                    session.browser ??
                    "Unknown"
                  }
                />

                <InfoItem
                  label="Operating System"
                  value={
                    session.operating_system ??
                    "Unknown"
                  }
                />

                <InfoItem
                  label="User Agent"
                  value={
                    session.user_agent ??
                    "Unknown"
                  }
                />
              </div>
            </section>
          </div>

          {/* Journey */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="border-b border-zinc-800 p-5">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-zinc-400" />

                <div>
                  <h2 className="font-semibold text-white">
                    Visitor Journey
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    Complete tracked activity for this
                    visitor session
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {events.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No tracked events yet.
                </p>
              ) : (
                <div className="space-y-5">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="relative border-l border-zinc-700 pl-6"
                    >
                      <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-amber-400" />

                      <p className="text-sm font-medium text-white">
                        {formatEventType(
                          event.event_type,
                        )}
                      </p>

                      {event.page_url ? (
                        <p className="mt-1 break-all text-xs text-zinc-500">
                          {event.page_url}
                        </p>
                      ) : null}

                      {event.page_title ? (
                        <p className="mt-1 text-xs text-zinc-400">
                          {event.page_title}
                        </p>
                      ) : null}

                      <p className="mt-1 text-[11px] text-zinc-600">
                        {formatDate(
                          event.created_at,
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}