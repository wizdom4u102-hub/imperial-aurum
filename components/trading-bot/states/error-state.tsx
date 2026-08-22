import React from "react";

interface ErrorStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
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
          className="px-4- py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
        >
          {actionLabel}
        </button>
      )}

      {secondaryActionLabel && onSecondaryAction && (
        <button
          onClick={onSecondaryAction}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mt-2 hover:bg-gray-300 transition"
        >
          {secondaryActionLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorState;