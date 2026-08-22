import React from "react";

interface ActivationSummaryCardProps {
  botName: string;
  strategy: string;
  expectedROI: number;
  activationAmount: number;
}

const ActivationSummaryCard: React.FC<
  ActivationSummaryCardProps
> = ({
  botName,
  strategy,
  expectedROI,
  activationAmount,
}) => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-[rgba(255,255,255,0.04)]
        p-6
        backdrop-blur-xl
      "
    >
      <h2 className="mb-4 text-xl font-bold text-white">
        {botName}
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[#A1A1AA]">
            Strategy
          </span>

          <span className="text-white">
            {strategy}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#A1A1AA]">
            Expected ROI
          </span>

          <span className="text-[#D4AF37] font-semibold">
            {expectedROI}%
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#A1A1AA]">
            Investment
          </span>

          <span className="text-white">
            ${activationAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivationSummaryCard;