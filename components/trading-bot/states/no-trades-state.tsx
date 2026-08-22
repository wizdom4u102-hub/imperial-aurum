import React from "react";

import EmptyState from "./empty-state";

interface NoTradesStateProps {
  onViewBots: () => void;
}

const NoTradesState: React.FC<
  NoTradesStateProps
> = ({
  onViewBots,
}) => {
  return (
    <EmptyState
      title="No Trading Activity Yet"
      description="Trades will appear after a bot starts operating."
      actionLabel="View Available Bots"
      onAction={onViewBots}
    />
  );
};

export default NoTradesState;