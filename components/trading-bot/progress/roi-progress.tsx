"use client";

import React from "react";

import RoiProgressBar from "./roi-progress-bar";
import RoiProgressSummary from "./roi-progress-summary";

interface RoiProgressProps {
  currentROI?: number;
  targetROI?: number;
  remainingROI?: number;
  progressPercentage?: number;
  performanceStatus?: string;
}

const RoiProgress: React.FC<RoiProgressProps> = ({
  currentROI = 0,
  targetROI = 0,
  remainingROI = 0,
  progressPercentage = 0,
  performanceStatus = "Unknown",
}) => {
  return (
    <section
      className="
        rounded-2xl
        border
        border-white/10
        bg-[#0b1020]/80
        backdrop-blur-xl
        p-6
        shadow-[0_0_30px_rgba(234,179,8,0.05)]
        transition-all
        duration-300
        hover:border-yellow-400/20
      "
    >
      <div className="mb-6">
        <h2
          className="
            text-2xl
            font-bold
            bg-gradient-to-r
            from-yellow-300
            via-yellow-400
            to-amber-500
            bg-clip-text
            text-transparent
          "
        >
          ROI Progress
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Track your return on investment against your configured target and
          monitor overall trading performance.
        </p>
      </div>

      <div className="space-y-6">
        <RoiProgressSummary
          currentROI={currentROI}
          targetROI={targetROI}
          remainingROI={remainingROI}
          performanceStatus={performanceStatus}
        />

        <div
          className="
            rounded-xl
            border
            border-white/10
            bg-black/20
            p-5
          "
        >
          <RoiProgressBar
            currentValue={currentROI}
            targetValue={targetROI}
            progressPercentage={progressPercentage}
            label="ROI Progress"
          />
        </div>
      </div>
    </section>
  );
};

export default RoiProgress;