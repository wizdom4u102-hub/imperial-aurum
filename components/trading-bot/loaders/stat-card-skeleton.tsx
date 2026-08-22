import React from "react";

const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-200 animate-pulse rounded-lg border shadow-md p-4 mb-4">
      <div className="h-6 w-1/2 bg-gray-300 rounded mb-2" />

      <div className="h-10 w-3/4 bg-gray-300 rounded mb-2" />

      <div className="h-4 w-1/3 bg-gray-300 rounded" />
    </div>
  );
};

export default StatCardSkeleton;