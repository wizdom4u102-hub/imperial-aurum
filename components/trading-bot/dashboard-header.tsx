"use client";

import React from "react";

import { Button } from "@/components/ui/button";

import {
  Bot,
  RefreshCw,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react";

interface DashboardHeaderProps {
  onRefresh?: () => void;
  onActivateBot?: () => void;
  lastUpdated?: string;
  loading?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  onActivateBot,
  lastUpdated,
  loading = false,
}) => {
  return (
    <section
      className="
        rounded-2xl
        border border-white/10
        bg-[#0b1020]/80
        backdrop-blur-xl
        p-6
        shadow-[0_0_40px_rgba(234,179,8,0.05)]
      "
    >
      <div
        className="
          flex
          flex-col
          gap-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* Brand / Title */}
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-16
              w-16
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-yellow-400
              to-amber-600
              shadow-[0_0_25px_rgba(234,179,8,0.35)]
            "
          >
            <Bot
              size={30}
              className="text-black"
            />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Trading Terminal
              </h1>

              <span
                className="
                  rounded-full
                  border
                  border-yellow-400/20
                  bg-yellow-400/10
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-yellow-400
                "
              >
                AI Powered
              </span>
            </div>

            <p
              className="
                mt-2
                text-sm
                leading-relaxed
                text-gray-400
              "
            >
              Monitor automated trading bots, portfolio performance,
              live execution activity, and AI-driven strategies from
              your Imperial Aurum control center.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div
          className="
            flex
            flex-col
            items-start
            gap-4
            lg:items-end
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-emerald-400/20
              bg-emerald-400/10
              px-4
              py-2
            "
          >
            <Activity
              size={16}
              className="text-emerald-400"
            />

            <span className="text-sm font-medium text-emerald-400">
              Trading Engine Online
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={loading}
              className="
                border-white/10
                bg-white/5
                text-white
                hover:bg-white/10
              "
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "mr-2 animate-spin"
                    : "mr-2"
                }
              />

              Refresh
            </Button>

            <Button
              onClick={onActivateBot}
              className="
                bg-gradient-to-r
                from-yellow-500
                to-amber-600
                text-black
                font-semibold
                shadow-[0_0_20px_rgba(234,179,8,0.25)]
                hover:from-yellow-400
                hover:to-amber-500
              "
            >
              <TrendingUp
                size={16}
                className="mr-2"
              />

              Activate Bot
            </Button>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-gray-500
            "
          >
            <Clock size={14} />

            <span>
              Last Updated:
            </span>

            <span className="text-gray-300">
              {lastUpdated ?? "Just now"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHeader;