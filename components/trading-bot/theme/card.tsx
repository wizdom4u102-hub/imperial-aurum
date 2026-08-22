import React from "react";

import { tradingBotStyles } from "../theme";


interface TradingBotCardProps {
  children: React.ReactNode;

  className?: string;
}


const TradingBotCard: React.FC<
  TradingBotCardProps
> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`${tradingBotStyles.glassCard} ${className}`}
    >
      {children}
    </div>
  );
};


export default TradingBotCard;