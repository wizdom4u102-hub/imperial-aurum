"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { useLiveChat } from "@/hooks/use-live-chat";

import LiveChatBadge from "./live-chat-badge";
import LiveChatButton from "./live-chat-button";
import LiveChatWindow from "./live-chat-window";

interface LiveChatProps {
  sessionId: string | null;
  userId?: string | null;
}

interface SendMessageOptions {
  image?: File | null;
}

export default function LiveChat({
  sessionId,
  userId = null,
}: LiveChatProps) {
  const pathname = usePathname();

  /*
   * This is the visitor-facing chat widget.
   *
   * The admin area already has its own chat interface,
   * so this visitor widget must not be mounted there.
   */
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <VisitorLiveChat
      sessionId={sessionId}
      userId={userId}
    />
  );
}

function VisitorLiveChat({
  sessionId,
  userId,
}: LiveChatProps) {
  const {
    messages,
    isOpen,
    isLoading,
    isSending,
    error,
    unreadCount,
    openChat,
    closeChat,
    sendMessage,
  } = useLiveChat(sessionId, userId);

  const [showWelcome, setShowWelcome] =
    useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowWelcome(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowWelcome(true);
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen]);

  function handleOpenChat(): void {
    setShowWelcome(false);
    void openChat();
  }

  function handleCloseWelcome(): void {
    setShowWelcome(false);
  }

  if (isOpen) {
    return (
      <LiveChatWindow
        messages={messages}
        isLoading={isLoading}
        isSending={isSending}
        error={error}
        onClose={closeChat}
        onSendMessage={(
          message: string,
          options?: SendMessageOptions,
        ) => sendMessage(message, options)}
      />
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Welcome message */}
      {showWelcome ? (
        <div className="relative w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-amber-400/20 bg-zinc-950 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          {/* Premium gold accent */}
          <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />

          {/* Subtle gold glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative p-5">
            {/* Header */}
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Bigger waving hand */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center">
                  <span
                    className="text-5xl leading-none"
                    role="img"
                    aria-label="Waving hand"
                  >
                    👋
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-white">
                    Welcome To
                  </h2>

                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-amber-400">
                    Imperial Aurum Mining
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={handleCloseWelcome}
                className="rounded-full p-1.5 text-zinc-500 transition-all hover:bg-white/10 hover:text-white"
                aria-label="Close welcome message"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Message */}
            <div className="space-y-2.5">
              <p className="text-[15px] font-medium leading-6 text-zinc-100">
                How can we help you today?
              </p>

              <p className="text-sm leading-6 text-zinc-400">
                Have questions about our platform, mining plans, or getting
                started? Our support team is ready to assist you.
              </p>
            </div>

            {/* Chat CTA */}
            <button
              type="button"
              onClick={handleOpenChat}
              className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 px-4 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/10 transition-all hover:-translate-y-0.5 hover:from-amber-300 hover:to-yellow-200 hover:shadow-amber-400/20"
            >
              <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
              Chat with us
              <span className="text-base">→</span>
            </button>
          </div>

          {/* Bubble pointer */}
          <div className="absolute -bottom-2 right-7 h-4 w-4 rotate-45 border-b border-r border-amber-400/20 bg-zinc-950" />
        </div>
      ) : null}

      {/* Chat button */}
      <div
        className="
          relative
          [&_button]:!bg-blue-600
          [&_button]:!text-white
          [&_button]:hover:!bg-blue-700
        "
      >
        <LiveChatButton
          onClick={handleOpenChat}
          hasUnreadMessages={unreadCount > 0}
        />

        <LiveChatBadge count={unreadCount} />
      </div>
    </div>
  );
}