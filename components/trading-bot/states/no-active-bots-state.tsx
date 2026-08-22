import React from "react";

import EmptyState from "./empty-state";

interface NoActiveBotsStateProps {
  onActivateBot: () => void;
}

const NoActiveBotsState: React.FC<
  NoActiveBotsStateProps
> = ({
  onActivateBot,
}) => {
  return (
    <EmptyState
      title="No Active Trading Bots"
      description="You haven't activated any trading bot yet."
      actionLabel="Activate Bot"
      onAction={onActivateBot}
    />
  );
};

export default NoActiveBotsState;