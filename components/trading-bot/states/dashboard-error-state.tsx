import React from "react";

import ErrorState from "./error-state";

interface DashboardErrorStateProps {
  onRetry: () => void;
}

const DashboardErrorState: React.FC<
  DashboardErrorStateProps
> = ({
  onRetry,
}) => {
  return (
    <ErrorState
      title="Unable to Load Trading Dashboard"
      description="Dashboard information could not be displayed."
      actionLabel="Try Again"
      onAction={onRetry}
    />
  );
};

export default DashboardErrorState;