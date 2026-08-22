import React from "react";

interface RoiProgressBarProps {
  currentValue: number;
  targetValue: number;
  progressPercentage: number;
  label: string;
}

const RoiProgressBar: React.FC<RoiProgressBarProps> = ({
  currentValue,
  targetValue,
  progressPercentage,
  label,
}) => {
  const progress = Math.min(
    Math.max(progressPercentage ?? 0, 0),
    100
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-yellow-400">
          {label}
        </span>

        <span className="font-semibold text-white">
          {progress.toFixed(1)}%
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-yellow-400
            via-amber-500
            to-emerald-400
            transition-all
            duration-700
          "
          style={{
            width: `${progress}%`,
          }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${progress}%`}
        />
      </div>

      <div className="flex justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-gray-400">
            Current
          </span>

          <span className="font-semibold text-white">
            {(currentValue ?? 0).toFixed(2)}%
          </span>
        </div>

        <div className="text-right">
          <span className="text-gray-400">
            Target
          </span>

          <div className="font-semibold text-white">
            {(targetValue ?? 0).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoiProgressBar;