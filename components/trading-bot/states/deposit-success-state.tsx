import React from "react";

interface DepositSuccessStateProps {
  message: string;
  onClose: () => void;
}

const DepositSuccessState: React.FC<
  DepositSuccessStateProps
> = ({
  message,
  onClose,
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-lg font-bold">
        Deposit Successful
      </h2>

      <p className="text-gray-600 mb-4">
        {message}
      </p>

      <button
        onClick={onClose}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
      >
        Close
      </button>
    </div>
  );
};

export default DepositSuccessState;