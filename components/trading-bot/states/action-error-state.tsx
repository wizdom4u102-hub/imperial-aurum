import React from "react";

import ErrorState from "./error-state";

interface ActionErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ActionErrorState: React.FC<ActionErrorStateProps> = ({
  message,
  onRetry,
}) => {
  return (
    <ErrorState
      title="Action Failed"
      description={message}
      actionLabel="Retry"
      onAction={onRetry}
    />
  );
};

export default ActionErrorState;