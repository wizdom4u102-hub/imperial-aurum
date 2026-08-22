import React from 'react';

const TradingBotLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold">Trading Bot</h1>
      {children}
    </div>
  );
};

export default TradingBotLayout;