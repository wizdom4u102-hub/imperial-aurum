"use client";

import { MessageCircle } from "lucide-react";

interface LiveChatButtonProps {
  onClick: () => void;
  hasUnreadMessages?: boolean;
}

export default function LiveChatButton({
  onClick,
  hasUnreadMessages = false,
}: LiveChatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:scale-105"
      aria-label="Open live chat"
    >
      <MessageCircle className="h-6 w-6" />

      {hasUnreadMessages ? (
        <span
          className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-red-500"
          aria-label="Unread chat messages"
        />
      ) : null}
    </button>
  );
}