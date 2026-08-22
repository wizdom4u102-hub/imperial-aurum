import React from "react";

interface TradeStatusBadgeProps {
  status:
    | "Running"
    | "Open"
    | "Won"
    | "Lost"
    | "Completed"
    | "Cancelled"
    | "Pending";
}

const TradeStatusBadge: React.FC<TradeStatusBadgeProps> = ({
  status,
}) => {
  const statusStyles: Record<
    TradeStatusBadgeProps["status"],
    string
  > = {
    Running:
      "border-blue-400/30 bg-blue-500/10 text-blue-300",

    Open:
      "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",

    Won:
      "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",

    Lost:
      "border-red-400/30 bg-red-500/10 text-red-300",

    Completed:
      "border-gray-400/30 bg-gray-500/10 text-gray-300",

    Cancelled:
      "border-orange-400/30 bg-orange-500/10 text-orange-300",

    Pending:
      "border-purple-400/30 bg-purple-500/10 text-purple-300",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-semibold
        tracking-wide
        backdrop-blur-sm
        transition-all
        duration-200
        ${statusStyles[status]}
      `}
    >
      <span
        className="
          mr-2
          h-2
          w-2
          rounded-full
          bg-current
          opacity-80
        "
      />

      {status}
    </span>
  );
};

export default TradeStatusBadge;