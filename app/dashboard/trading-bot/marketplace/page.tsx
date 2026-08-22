"use client";

import React from "react";

import DashboardLayout from "@/components/trading-bot/dashboard-layout";
import BotMarketplace from "@/components/trading-bot/marketplace/bot-marketplace";

export default function TradingBotMarketplacePage() {
  return (
    <DashboardLayout>
      <BotMarketplace />
    </DashboardLayout>
  );
}