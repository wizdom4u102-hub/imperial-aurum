import React from "react";

interface ActivationStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const ActivationStepIndicator: React.FC<
  ActivationStepIndicatorProps
> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  return (
    <div className="flex items-center justify-between my-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex flex-col items-center ${
            index <= currentStep
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full border ${
              index === currentStep
                ? "border-blue-600"
                : "border-gray-400"
            }`}
          >
            {index + 1}
          </div>

          <span className="text-sm mt-1">
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ActivationStepIndicator;