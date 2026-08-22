"use client";

import {
  Activity,
  Globe,
  Monitor,
  User,
  UserPlus,
} from "lucide-react";

import type {
  VisitorEventRecord,
  VisitorSessionRecord,
} from "@/lib/visitor-tracking/types";

interface AdminVisitorPanelProps {
  session: VisitorSessionRecord | null;
  events: VisitorEventRecord[];
  isLoading: boolean;
  error: string | null;
}

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

function formatDate(
  value: string,
): string {
  return new Date(value).toLocaleString();
}

export default function AdminVisitorPanel({
  session,
  events,
  isLoading,
  error,
}: AdminVisitorPanelProps) {
  if (isLoading) {
    return (
      <aside className="w-full border-t p-4 lg:w-80 lg:border-l lg:border-t-0">
        <p className="text-sm text-gray-500">
          Loading visitor...
        </p>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-full border-t p-4 lg:w-80 lg:border-l lg:border-t-0">
        <p className="text-sm text-red-600">
          {error}
        </p>
      </aside>
    );
  }

  if (!session) {
    return (
      <aside className="w-full border-t p-4 lg:w-80 lg:border-l lg:border-t-0">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <User className="mb-3 h-8 w-8 text-gray-400" />

          <p className="text-sm font-medium">
            Visitor information
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Select a conversation to view visitor details.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full border-t lg:w-80 lg:border-l lg:border-t-0">
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <User className="h-5 w-5 text-gray-600" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">
              {session.user_id
                ? "Registered Visitor"
                : "Anonymous Visitor"}
            </h3>

            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  session.is_online
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              />

              <span className="text-xs text-gray-500">
                {session.is_online
                  ? "Online"
                  : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 overflow-y-auto p-4">
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />

            <h4 className="text-sm font-semibold">
              Current Activity
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <p className="text-gray-500">
                Current page
              </p>

              <p className="mt-0.5 break-all font-medium">
                {session.current_page ??
                  "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Landing page
              </p>

              <p className="mt-0.5 break-all font-medium">
                {session.landing_page ??
                  "Unknown"}
              </p>
            </div>

            {session.referrer_url ? (
              <div>
                <p className="text-gray-500">
                  Referrer
                </p>

                <p className="mt-0.5 break-all font-medium">
                  {session.referrer_url}
                </p>
              </div>
            ) : null}

            {session.referral_code ? (
              <div>
                <p className="text-gray-500">
                  Referral code
                </p>

                <p className="mt-0.5 font-medium">
                  {session.referral_code}
                </p>
              </div>
            ) : null}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Monitor className="h-4 w-4 text-gray-500" />

            <h4 className="text-sm font-semibold">
              Device
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <p className="text-gray-500">
                Device
              </p>

              <p className="mt-0.5 font-medium">
                {session.device_type ??
                  "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Browser
              </p>

              <p className="mt-0.5 font-medium">
                {session.browser ??
                  "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Operating system
              </p>

              <p className="mt-0.5 font-medium">
                {session.operating_system ??
                  "Unknown"}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-gray-500" />

            <h4 className="text-sm font-semibold">
              Account
            </h4>
          </div>

          <div className="text-xs">
            <p className="text-gray-500">
              User ID
            </p>

            <p className="mt-0.5 break-all font-medium">
              {session.user_id ??
                "Not registered"}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-500" />

            <h4 className="text-sm font-semibold">
              Visitor Journey
            </h4>
          </div>

          {events.length === 0 ? (
            <p className="text-xs text-gray-500">
              No tracked events yet.
            </p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border-l-2 border-gray-200 pl-3"
                >
                  <p className="text-xs font-medium">
                    {formatEventType(
                      event.event_type,
                    )}
                  </p>

                  {event.page_url ? (
                    <p className="mt-0.5 break-all text-[11px] text-gray-500">
                      {event.page_url}
                    </p>
                  ) : null}

                  <p className="mt-1 text-[10px] text-gray-400">
                    {formatDate(
                      event.created_at,
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}