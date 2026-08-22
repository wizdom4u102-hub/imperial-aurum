import React from "react";

interface ProfitChangeIndicatorProps {
  change: number;
  label?: string;
  icon?: React.ReactNode;
}

const ProfitChangeIndicator: React.FC<
  ProfitChangeIndicatorProps
> = ({
  change = 0,
  label = "Change",
  icon,
}) => {

  const safeChange = change ?? 0;

  let changeText = "No Change";
  let textColor = "text-zinc-400";
  let bgColor = "bg-white/5";


  if (safeChange > 0) {
    changeText = `+${safeChange.toFixed(2)}%`;
    textColor = "text-emerald-400";
    bgColor = "bg-emerald-500/10";
  }

  if (safeChange < 0) {
    changeText = `${safeChange.toFixed(2)}%`;
    textColor = "text-red-400";
    bgColor = "bg-red-500/10";
  }


  return (
    <div
      className={`
        flex
        items-center
        gap-2
        rounded-full
        px-3
        py-1
        text-sm
        ${textColor}
        ${bgColor}
      `}
    >

      {icon && (
        <span>
          {icon}
        </span>
      )}

      <span>
        {label}: {changeText}
      </span>

    </div>
  );
};


export default ProfitChangeIndicator;