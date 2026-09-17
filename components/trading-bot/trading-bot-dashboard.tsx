"use client";

import React from "react";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import TopUpBotDepositModal from "./modals/top-up-bot-deposit-modal";

import DashboardLayout from "./dashboard-layout";

import DashboardHeader from "./dashboard-header";
import DashboardStatistics from "./dashboard-statistics";
import ActiveBotsSection from "./active-bots-section";
import QuickActions from "./quick-actions";
import { useRouter } from "next/navigation";

import ProfitSummaryCard from "./cards/profit-summary-card";
import PortfolioAllocationCard from "./cards/portfolio-allocation-card";

import RoiProgress from "./progress/roi-progress";

import BotPerformanceCharts from "./charts/bot-performance-charts";

import LiveTradesTable from "./tables/live-trades-table";
import TradingHistory from "./tables/trading-history";

import ActivityTimeline from "./timeline/activity-timeline";

import RecentNotificationsPanel from "./notifications/recent-notifications-panel";

import MobileBottomActionBar from "./mobile/mobile-bottom-action-bar";

import DashboardErrorState from "./states/dashboard-error-state";

import useTradingBotDashboard from "@/hooks/use-trading-bot-dashboard";

import TransferFundsModal from "@/components/trading-bot/modals/transfer-funds-modal";

import DashboardTransferModal from "@/components/trading-bot/modals/dashboard-transfer-modal";

import type {
  TradingBotRecord,
} from "@/lib/trading-bot/types";

type TradeDirection = "BUY" | "SELL";

interface DashboardTradeRow {
  id: string;
  asset: string;
  direction: TradeDirection;
  status: string;
  result: string;
  timestamp: string;
}

interface DashboardHistoryRow {
  id: string;
  transactionType: string;
  botName?: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}

const TradingBotDashboard: React.FC = () => {
  const router = useRouter();

  const [
    selectedBot,
    setSelectedBot,
  ] = useState<TradingBotRecord | null>(null);

  const [
    topUpModalOpen,
    setTopUpModalOpen,
  ] = useState(false);

  const [
    transferBot,
    setTransferBot,
  ] = useState<TradingBotRecord | null>(null);

  const [
    transferModalOpen,
    setTransferModalOpen,
  ] = useState(false);

  const [
    dashboardTransferOpen,
    setDashboardTransferOpen,
  ] = useState(false);

  /*
   * Collapsible dashboard sections
   *
   * All four sections are collapsed by default
   * to keep the Overview dashboard compact.
   */
  const [
    liveTradesOpen,
    setLiveTradesOpen,
  ] = useState(false);

  const [
    financialLedgerOpen,
    setFinancialLedgerOpen,
  ] = useState(false);

  const [
    activityTimelineOpen,
    setActivityTimelineOpen,
  ] = useState(false);

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

  const {
    dashboard,
    loading,
    error,
    refreshDashboard,
  } = useTradingBotDashboard();

  const handleOpenBotDetails = (
    botId: string
  ) => {
    router.push(
      `/dashboard/trading-bot/${botId}`
    );
  };

  const handleTopUpBot = (
    bot: TradingBotRecord
  ) => {
    setSelectedBot(bot);
    setTopUpModalOpen(true);
  };

  const handleTransferFunds = (
    bot: TradingBotRecord
  ) => {
    setTransferBot(bot);
    setTransferModalOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div
          className="
            min-h-[60vh]
            flex
            items-center
            justify-center
          "
        >
          <div
            className="
              text-[#A1A1AA]
              animate-pulse
            "
          >
            Loading trading terminal...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardErrorState
          onRetry={
            refreshDashboard
          }
        />
      </DashboardLayout>
    );
  }

  if (!dashboard) {
    return null;
  }

  console.log(
    "DASHBOARD STATISTICS:",
    dashboard.statistics
  );

  console.log(
    "DASHBOARD PERFORMANCE:",
    dashboard.performance
  );

  console.log(
    "DASHBOARD PERFORMANCE SUMMARY:",
    dashboard.performanceSummary
  );

  console.log(
    "DASHBOARD RECENT TRADES:",
    dashboard.recentTrades
  );

  console.log(
    "Activities:",
    dashboard.activities
  );

  console.log(
    "First Activity:",
    dashboard.activities[0]
  );

  const liveTrades: DashboardTradeRow[] =
    dashboard.recentTrades.map(
      (trade) => ({
        id:
          trade.id,

        asset:
          trade.asset,

        direction:
          trade.trade_type === "SELL"
            ? "SELL"
            : "BUY",

        status:
          trade.status ?? "PENDING",

        result:
          trade.net_profit !== null &&
          trade.net_profit !== undefined
            ? String(trade.net_profit)
            : "0",

        timestamp:
          trade.closed_at ??
          trade.opened_at ??
          new Date().toISOString(),
      })
    );

  console.log(
    "Dashboard History:",
    dashboard.history
  );

  console.log(
    "History Length:",
    dashboard.history.length
  );

  if (dashboard.history.length > 0) {
    console.log(
      "First History:",
      dashboard.history[0]
    );
  }

  const tradingHistory: DashboardHistoryRow[] =
    dashboard.history.map(
      (transaction) => ({
        id:
          transaction.id,

        transactionType:
          transaction.transaction_type,

        botName:
          transaction.bot?.bot_name ??
          "Multiple Bots",

        amount:
          Number(
            transaction.amount
          ),

        status:
          transaction.status,

        description:
          transaction.description ??
          "",

        createdAt:
          transaction.created_at ??
          "",
      })
    );

  const activityTimeline =
    dashboard.activities.map(
      (activity) => ({
        id:
          activity.id,

        title:
          activity.action,

        description:
          activity.message,

        timestamp:
          activity.created_at
            ? new Date(
                activity.created_at
              ).toLocaleString()
            : "",
      })
    );

  console.log(
    "Mapped Activity Timeline:",
    activityTimeline
  );

  console.log(
    "Mapped Length:",
    activityTimeline.length
  );

  const notifications =
    dashboard.notifications.map(
      (notification) => ({
        id:
          notification.id,

        type:
          "info" as const,

        title:
          notification.subject ??
          "Notification",

        message:
          notification.message ??
          "",

        timestamp:
          notification.created_at ??
          "",

        is_read:
          notification.is_read,
      })
    );

  return (
    <DashboardLayout>
      <div
        className="
          space-y-8
        "
      >
        <DashboardHeader
          loading={loading}
          onRefresh={
            refreshDashboard
          }
          onActivateBot={() =>
            router.push(
              "/dashboard/trading-bot/marketplace"
            )
          }
        />

        <section
          className="
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            backdrop-blur-xl
            p-5
            shadow-xl
          "
        >
          <DashboardStatistics
            statistics={
              dashboard.statistics
            }

            totalAvailableBalance={
              dashboard.totalAvailableBalance
            }

            activeBotsCount={
              dashboard.activeBotsCount
            }

            onTransferFunds={() => {
              setDashboardTransferOpen(true);
            }}
          />
        </section>

        <section
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
          "
        >
          {
            dashboard.performanceSummary.map(
              (card, index) => (
                <ProfitSummaryCard
                  key={
                    `${card.bot_name}-${index}`
                  }

                  title={
                    card.bot_name
                  }

                  value={
                    card.performance_value
                  }

                  description={
                    `${card.trade_count} trades • ${card.win_rate}% win rate`
                  }

                  trend={
                    card.performance_value > 0
                      ? "positive"
                      : card.performance_value < 0
                        ? "negative"
                        : "neutral"
                  }
                />
              )
            )
          }
        </section>

        <section
          className="
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            p-5
          "
        >
          <PortfolioAllocationCard
            totalAllocated={0}

            activeBots={
              dashboard.activeBots.length
            }

            availablePercentage={0}

            totalPercentage={100}

            allocations={[]}
          />
        </section>

        <section>
          <ActiveBotsSection
            activeBots={
              dashboard.activeBots
            }

            onBotSelect={
              handleOpenBotDetails
            }

            onAddFunds={
              handleTopUpBot
            }

            onTransferFunds={
              handleTransferFunds
            }
          />
        </section>

        <section
          className="
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            p-5
          "
        >
          <RoiProgress
            currentROI={
              dashboard.statistics.totalROI
            }

            targetROI={100}

            remainingROI={
              Math.max(
                100 -
                  dashboard.statistics.totalROI,
                0
              )
            }

            progressPercentage={
              Math.min(
                dashboard.statistics.totalROI,
                100
              )
            }

            performanceStatus={
              dashboard.statistics.totalROI >= 0
                ? "On Track"
                : "Needs Attention"
            }
          />
        </section>

        <section>
          <BotPerformanceCharts
            profitData={
              dashboard.performance.profit_data ?? []
            }

            roiData={
              dashboard.performance.roi_data ?? []
            }
          />
        </section>

        {/* =====================================================
            LIVE TRADES + FINANCIAL LEDGER
            ===================================================== */}

        <section
          className="
            grid
            lg:grid-cols-2
            gap-6
          "
        >
          {/* Live Trades */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
            "
          >
            <button
              type="button"
              onClick={() =>
                setLiveTradesOpen(
                  (previous) => !previous
                )
              }
              aria-expanded={
                liveTradesOpen
              }
              className="
                flex
                w-full
                items-center
                justify-between
                gap-4
                p-5
                text-left
                transition
                hover:bg-white/[0.03]
              "
            >
              <div>
                <h2
                  className="
                    text-base
                    font-semibold
                    text-white
                    sm:text-lg
                  "
                >
                  Live Trades
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    text-zinc-500
                  "
                >
                  Current trading activity
                </p>
              </div>

              {liveTradesOpen ? (
                <ChevronUp
                  className="
                    h-5
                    w-5
                    shrink-0
                    text-cyan-400
                  "
                />
              ) : (
                <ChevronDown
                  className="
                    h-5
                    w-5
                    shrink-0
                    text-cyan-400
                  "
                />
              )}
            </button>

            {liveTradesOpen && (
              <div
                className="
                  border-t
                  border-white/10
                  p-5
                "
              >
                <LiveTradesTable
                  trades={
                    liveTrades
                  }

                  loading={false}

                  error={null}
                />
              </div>
            )}
          </div>

          {/* Trading Bot Financial Ledger */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
            "
          >
            <button
              type="button"
              onClick={() =>
                setFinancialLedgerOpen(
                  (previous) => !previous
                )
              }
              aria-expanded={
                financialLedgerOpen
              }
              className="
                flex
                w-full
                items-center
                justify-between
                gap-4
                p-5
                text-left
                transition
                hover:bg-white/[0.03]
              "
            >
              <div>
                <h2
                  className="
                    text-base
                    font-semibold
                    text-white
                    sm:text-lg
                  "
                >
                  Trading Bot Financial Ledger
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    text-zinc-500
                  "
                >
                  Complete trading bot financial activity
                </p>
              </div>

              {financialLedgerOpen ? (
                <ChevronUp
                  className="
                    h-5
                    w-5
                    shrink-0
                    text-cyan-400
                  "
                />
              ) : (
                <ChevronDown
                  className="
                    h-5
                    w-5
                    shrink-0
                    text-cyan-400
                  "
                />
              )}
            </button>

            {financialLedgerOpen && (
              <div
                className="
                  border-t
                  border-white/10
                  p-5
                "
              >
                <TradingHistory
                  history={
                    tradingHistory
                  }

                  loading={false}

                  error={null}
                />
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            ACTIVITY TIMELINE + NOTIFICATIONS
            ===================================================== */}

        <section
          className="
            grid
            lg:grid-cols-2
            gap-6
          "
        >
          {/* Activity Timeline */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
            "
          >
            <button
              type="button"
              onClick={() =>
                setActivityTimelineOpen(
                  (previous) => !previous
                )
              }
              aria-expanded={
                activityTimelineOpen
              }
              className="
                flex
                w-full
                items-center
                justify-between
                gap-4
                p-5
                text-left
                transition
                hover:bg-white/[0.03]
              "
            >
              <div>
                <h2
                  className="
                    text-base
                    font-semibold
                    text-white
                    sm:text-lg
                  "
                >
                  Activity Timeline
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    text-zinc-500
                  "
                >
                  Recent trading bot activity
                </p>
              </div>

              {activityTimelineOpen ? (
                <ChevronUp
                  className="
                    h-5
                    w-5
                    shrink-0
                    text-cyan-400
                  "
                />
              ) : (
                <ChevronDown
                  className="
                    h-5
                    w-5
                    shrink-0
                    text-cyan-400
                  "
                />
              )}
            </button>

            {activityTimelineOpen && (
              <div
                className="
                  border-t
                  border-white/10
                  p-5
                "
              >
                <ActivityTimeline
                  activities={
                    activityTimeline
                  }

                  loading={false}
                />
              </div>
            )}
          </div>

          {/* Notifications */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
            "
          >
            <button
              type="button"
              onClick={() =>
                setNotificationsOpen(
                  (previous) => !previous
                )
              }
              aria-expanded={
                notificationsOpen
              }
              className="
                flex
                w-full
                items-center
                justify-between
                gap-4
                p-5
                text-left
                transition
                hover:bg-white/[0.03]
              "
            >
              <div>
                <h2
                  className="
                    text-base
                    font-semibold
                    text-white
                    sm:text-lg
                  "
                >
                  Notifications
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    text-zinc-500
                  "
                >
                  Recent trading bot notifications
                </p>
              </div>

              {notificationsOpen ? (
                <ChevronUp
                  className="
                    h-5
                    w-5
                    shrink-0
                    text-cyan-400
                  "
                />
              ) : (
                <ChevronDown
                  className="
                    h-5
                    w-5
                    shrink-0
                    text-cyan-400
                  "
                />
              )}
            </button>

            {notificationsOpen && (
              <div
                className="
                  border-t
                  border-white/10
                  p-5
                "
              >
                <RecentNotificationsPanel
                  notifications={
                    notifications
                  }

                  loading={false}
                />
              </div>
            )}
          </div>
        </section>

        <QuickActions
          onActivateBot={() =>
            router.push(
              "/dashboard/trading-bot/marketplace"
            )
          }

          onViewTrades={() =>
            router.push(
              "/dashboard/trading-bot/live-trades"
            )
          }

          onViewHistory={() =>
            router.push(
              "/dashboard/trading-bot/history"
            )
          }

          onContactSupport={() =>
            router.push(
              "/dashboard/support"
            )
          }

          loading={false}
        />
      </div>

      <div className="lg:hidden">
        <MobileBottomActionBar
          actions={[]}
        />
      </div>

      <TopUpBotDepositModal
        open={
          topUpModalOpen
        }

        bot={
          selectedBot
        }

        onClose={() => {
          setTopUpModalOpen(false);
          setSelectedBot(null);
        }}

        onSuccess={() => {
          refreshDashboard();
        }}
      />

      <TransferFundsModal
        open={
          transferModalOpen
        }

        bot={
          transferBot
        }

        onClose={() => {
          setTransferModalOpen(false);
          setTransferBot(null);
        }}

        onSuccess={() => {
          refreshDashboard();
        }}
      />

      <DashboardTransferModal
        open={
          dashboardTransferOpen
        }

        availableBalance={
          dashboard.totalAvailableBalance
        }

        onClose={() => {
          setDashboardTransferOpen(false);
        }}

        onSuccess={() => {
          setDashboardTransferOpen(false);
          refreshDashboard();
        }}
      />
    </DashboardLayout>
  );
};

export default TradingBotDashboard;