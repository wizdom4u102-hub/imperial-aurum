"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onActivateBot?: () => void;
  onViewTrades?: () => void;
  onViewHistory?: () => void;
  onContactSupport?: () => void;
  loading?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onActivateBot,
  onViewTrades,
  onViewHistory,
  onContactSupport,
  loading = false,
}) => {
  const router = useRouter();

  return (
    <div
      className={`grid ${
        loading ? "animate-pulse" : ""
      } grid-cols-1 md:grid-cols-2 gap-4 mt-6`}
    >
      <Button
        disabled={loading}
        onClick={() => {
          if (onActivateBot) {
            onActivateBot();
          } else {
            router.push("/dashboard/trading-bot/marketplace");
          }
        }}
        className="
          bg-gradient-to-r
          from-yellow-500
          to-amber-600
          text-black
          font-semibold
          hover:from-yellow-400
          hover:to-amber-500
        "
      >
        Activate New Bot
      </Button>

      <Button
        disabled={loading}
        onClick={() => {
          if (onViewTrades) {
            onViewTrades();
          } else {
            router.push("/dashboard/trading-bot/live-trades");
          }
        }}
        className="
          bg-gradient-to-r
          from-yellow-500
          to-amber-600
          text-black
          font-semibold
          hover:from-yellow-400
          hover:to-amber-500
        "
      >
        View All Trades
      </Button>

      <Button
        disabled={loading}
        onClick={() => {
          if (onViewHistory) {
            onViewHistory();
          } else {
            router.push("/dashboard/trading-bot/history");
          }
        }}
        className="
          bg-gradient-to-r
          from-yellow-500
          to-amber-600
          text-black
          font-semibold
          hover:from-yellow-400
          hover:to-amber-500
        "
      >
        View History
      </Button>

      <Button
        disabled={loading}
        onClick={() => {
          if (onContactSupport) {
            onContactSupport();
          } else {
            router.push("/dashboard/support");
          }
        }}
        className="
          bg-gradient-to-r
          from-yellow-500
          to-amber-600
          text-black
          font-semibold
          hover:from-yellow-400
          hover:to-amber-500
        "
      >
        Contact Support
      </Button>
    </div>
  );
};

export default QuickActions;