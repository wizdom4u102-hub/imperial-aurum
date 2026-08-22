"use client";

import { useTradingBotData } from "./use-trading-bot-data";

const useTradingBotDashboard = () => {

  const {
    data,
    loading,
    error,
    refresh,
  } = useTradingBotData();


  return {
    dashboard: data,

    loading,

    error,

    refreshDashboard: refresh,
  };

};


export default useTradingBotDashboard;