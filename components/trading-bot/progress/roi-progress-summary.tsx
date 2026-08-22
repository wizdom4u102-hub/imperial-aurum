import React from "react";

interface RoiProgressSummaryProps {
  currentROI: number;
  targetROI: number;
  remainingROI: number;
  performanceStatus: string;
}

const RoiProgressSummary: React.FC<RoiProgressSummaryProps> = ({
  currentROI,
  targetROI,
  remainingROI,
  performanceStatus,
}) => {
  const statusColor =
    performanceStatus === "On Track"
      ? "text-emerald-400"
      : performanceStatus === "Above Target"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-[#111827]/70
        backdrop-blur-xl
        p-6
      "
    >
      <h3 className="text-lg font-semibold text-yellow-400">
        ROI Summary
      </h3>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-300">
            Current ROI
          </span>

          <span className="font-semibold text-white">
            {(currentROI ?? 0).toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">
            Target ROI
          </span>

          <span className="font-semibold text-white">
            {(targetROI ?? 0).toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">
            Remaining ROI
          </span>

          <span className="font-semibold text-white">
            {(remainingROI ?? 0).toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between border-t border-white/10 pt-4">
          <span className="text-gray-300">
            Status
          </span>

          <span className={`font-semibold ${statusColor}`}>
            {performanceStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoiProgressSummary;