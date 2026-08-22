import React from "react";

import ProfitPerformanceChart from "./profit-performance-chart";
import RoiPerformanceChart from "./roi-performance-chart";

interface BotPerformanceChartsProps {
  profitData: Array<{
    date: string;
    value: number;
  }>;

  roiData: Array<{
    date: string;
    percentage: number;
  }>;
}

const BotPerformanceCharts: React.FC<BotPerformanceChartsProps> = ({
  profitData,
  roiData,
}) => {
  return (
    <section className="space-y-6">
      <div>
        <h2
          className="
            text-xl
            font-bold
            bg-gradient-to-r
            from-yellow-300
            via-yellow-400
            to-amber-500
            bg-clip-text
            text-transparent
          "
        >
          Performance Overview
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Track automated bot profitability and ROI performance.
        </p>
      </div>


      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div
          className="
            rounded-2xl
            border
            border-white/10
            bg-[#0b1020]/80
            backdrop-blur-xl
            p-5
            shadow-xl
            transition-all
            duration-300
            hover:border-emerald-400/30
          "
        >

          <h3
            className="
              mb-4
              text-lg
              font-semibold
              text-emerald-400
            "
          >
            Profit Performance
          </h3>

          <ProfitPerformanceChart data={profitData} />

        </div>


        <div
          className="
            rounded-2xl
            border
            border-white/10
            bg-[#0b1020]/80
            backdrop-blur-xl
            p-5
            shadow-xl
            transition-all
            duration-300
            hover:border-yellow-400/30
          "
        >

          <h3
            className="
              mb-4
              text-lg
              font-semibold
              text-yellow-400
            "
          >
            ROI Performance
          </h3>

          <RoiPerformanceChart data={roiData} />

        </div>

      </div>

    </section>
  );
};

export default BotPerformanceCharts;