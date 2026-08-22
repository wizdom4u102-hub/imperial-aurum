import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

interface ProfitData {
  date: string;
  value: number;
}

interface ProfitPerformanceChartProps {
  data: ProfitData[];
}

const ProfitPerformanceChart: React.FC<ProfitPerformanceChartProps> = ({
  data = [],
}) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [{
      label: 'Profit Over Time',
      data: data.map(item => item.value),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    }],
  };

  return (
    <div className="w-full border rounded-lg shadow-md">
      {data.length > 0 ? (
        <Line data={chartData} options={{
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'Date' } },
            y: { title: { display: true, text: 'Profit ($)' }, beginAtZero: true },
          },
          plugins: {
            tooltip: { enabled: true },
          },
        }} />
      ) : (
        <div className="p-4 text-center text-gray-500">No Profit Data Available</div>
      )}
    </div>
  );
};

export default ProfitPerformanceChart;