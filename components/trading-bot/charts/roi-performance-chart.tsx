import React from 'react';
import { Line } from 'react-chartjs-2';

interface RoiData {
  date: string;
  percentage: number;
}

interface RoiPerformanceChartProps {
  data: RoiData[];
}

const RoiPerformanceChart: React.FC<RoiPerformanceChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [{
      label: 'ROI Performance',
      data: data.map(item => item.percentage),
      borderColor: 'rgba(255, 206, 86, 1)',
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
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
            y: { title: { display: true, text: 'ROI (%)' }, beginAtZero: true },
          },
          plugins: {
            tooltip: { enabled: true },
          },
        }} />
      ) : (
        <div className="p-4 text-center text-gray-500">No ROI Data Available</div>
      )}
    </div>
  );
};

export default RoiPerformanceChart;