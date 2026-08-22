import React from "react";

import SuccessState from "./success-state";

interface BotActivationSuccessProps {
  botName: string;
  onAction: () => void;
}

const BotActivationSuccess: React.FC<
  BotActivationSuccessProps
> = ({
  botName,
  onAction,
}) => {
  return (
    <SuccessState
      title="Trading Bot Activated Successfully"
      description={`Your trading bot ${botName} has been activated successfully!`}
      actionLabel="View Bot Dashboard"
      onAction={onAction}
    />
  );
};

export default BotActivationSuccess;