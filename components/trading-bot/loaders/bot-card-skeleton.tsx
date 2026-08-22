import React from "react";

const BotCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-200 animate-pulse rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-gray-300 mr-2" />

        <div className="flex-grow">
          <div className="h-6 w-3/4 bg-gray-300 rounded mb-2" />

          <div className="h-4 w-1/2 bg-gray-300 rounded" />
        </div>
      </div>

      <div className="h-4 w-1/3 bg-gray-300 rounded mb-2" />

      <div className="h-10 w-full bg-gray-300 rounded mb-2" />

      <div className="flex justify-between mt-2">
        <div className="h-8 w-20 bg-gray-300 rounded" />

        <div className="h-8 w-20 bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default BotCardSkeleton;