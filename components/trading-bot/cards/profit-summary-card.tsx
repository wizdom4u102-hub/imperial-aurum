import React from "react";

interface ProfitSummaryCardProps {
  title: string;
  value: number | string;
  description: string;
  icon?: React.ReactNode;
  trend?: "positive" | "negative" | "neutral";
}

const ProfitSummaryCard: React.FC<ProfitSummaryCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
}) => {
  const formattedValue =
    value !== undefined && value !== null ? value : "0";

  const trendConfig = {
    positive: {
      label: "▲ Positive Trend",
      className: "text-emerald-400",
    },
    negative: {
      label: "▼ Negative Trend",
      className: "text-red-400",
    },
    neutral: {
      label: "• No Change",
      className: "text-gray-400",
    },
  };

  return (
    <div
      className="
        rounded-2xl
        border border-white/10
        bg-[#0b1020]/80
        backdrop-blur-xl
        p-5
        transition-all
        duration-300
        hover:border-yellow-400/30
        hover:shadow-[0_0_25px_rgba(234,179,8,0.08)]
      "
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-yellow-400/20
              bg-yellow-400/10
              text-yellow-400
            "
          >
            {icon}
          </div>
        )}

        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
      </div>

      <p
        className="
          my-4
          text-3xl
          font-bold
          tracking-tight
          text-yellow-400
        "
      >
        {formattedValue}
      </p>

      <p className="text-sm text-gray-400">
        {description}
      </p>

      {trend && (
        <p
          className={`
            mt-3
            text-sm
            font-medium
            ${trendConfig[trend].className}
          `}
        >
          {trendConfig[trend].label}
        </p>
      )}
    </div>
  );
};

export default ProfitSummaryCard;