"use client";

interface LiveChatBadgeProps {
  count: number;
}

export default function LiveChatBadge({
  count,
}: LiveChatBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-semibold leading-none text-white"
      aria-label={`${count} unread chat message${
        count === 1 ? "" : "s"
      }`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}