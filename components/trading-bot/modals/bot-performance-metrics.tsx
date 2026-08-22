import React from 'react';

interface Metric {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
}

interface BotPerformanceMetricsProps {
  metrics: Metric[];
}

const BotPerformanceMetrics: React.FC<BotPerformanceMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg border shadow-md p-4">
          <div className="flex items-center mb-2">
            {metric.icon && <div className="mr-2">{metric.icon}</div>}
            <h3 className="font-bold text-lg">{metric.title}</h3>
          </div>
          <p className="text-2xl font-semibold">{metric.value}</p>
          {metric.description && <p className="text-sm text-gray-500">{metric.description}</p>}
        </div>
      ))}
    </div>
  );
};

export default BotPerformanceMetrics;