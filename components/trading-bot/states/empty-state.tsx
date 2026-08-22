import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-lg shadow-md">
      {icon && (
        <div className="mb-4">
          {icon}
        </div>
      )}

      <h2 className="text-lg font-bold mb-2">
        {title}
      </h2>

      <p className="text-gray-600 mb-4">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;