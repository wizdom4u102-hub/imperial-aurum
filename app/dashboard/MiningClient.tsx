"use client";

import {
  useEffect,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import type {
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

type Session = {
  id: string;
  user_id: string;
  active: boolean;
  status: string;
  started_at: string;
  ends_at: string;
  last_claim_at: string | null;
  rate_per_second: number;
  reward: number;
  total_earned: number;
  boost?: number;
};

type Balance =
  Database["public"]["Tables"]["balances"]["Row"];

type StartMiningResponse = {
  success?: boolean;
  error?: string;
};

export default function MiningClient({
  session,
  initialBalance,
}: {
  session: Session | null;
  initialBalance: Balance | null;
}) {
  const [timeLeft, setTimeLeft] =
    useState(0);

  const [isSessionActive, setIsSessionActive] =
    useState(
      session?.active === true &&
        session?.status === "active"
    );

  const [balance, setBalance] =
    useState<Balance | null>(
      initialBalance
    );

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // SUPABASE CLIENT
  //
  // Create the browser client once for this component.
  // =====================================================

  const supabase = createClient();

  // =====================================================
  // ANTI-CHEAT DEVICE KEY
  // =====================================================

  const getDeviceKey = (): string => {
    if (
      typeof window === "undefined"
    ) {
      return "";
    }

    return (
      localStorage.getItem(
        "device_key"
      ) || ""
    );
  };

  // =====================================================
  // MINING COUNTDOWN
  //
  // IMPORTANT:
  //
  // NEVER calculate:
  //
  // last_claim_at + 24 hours
  //
  // for the countdown.
  //
  // The database already contains the authoritative
  // session end time in `ends_at`.
  //
  // Paid mining:
  //   ends_at = original paid-plan expiry
  //
  // Free mining:
  //   ends_at = 24 hours after that free cycle started
  //
  // Therefore both mining types can safely use:
  //
  //   ends_at - current time
  //
  // Refreshing the page does not restart the timer.
  // =====================================================

  useEffect(() => {
    if (
      !session?.started_at ||
      !session?.ends_at
    ) {
      setTimeLeft(0);
      setIsSessionActive(false);
      return;
    }

    if (
      session.status !== "active" ||
      session.active !== true
    ) {
      setTimeLeft(0);
      setIsSessionActive(false);
      return;
    }

    const endTime = new Date(
      session.ends_at
    ).getTime();

    if (!Number.isFinite(endTime)) {
      console.error(
        "MINING TIMER: Invalid session end time.",
        session.ends_at
      );

      setTimeLeft(0);
      setIsSessionActive(false);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();

      const remainingSeconds =
        Math.max(
          0,
          Math.floor(
            (endTime - now) /
              1000
          )
        );

      setTimeLeft(
        remainingSeconds
      );

      setIsSessionActive(
        remainingSeconds > 0
      );
    };

    updateTimer();

    const interval =
      window.setInterval(
        updateTimer,
        1000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [session]);

  // =====================================================
  // REALTIME BALANCE SYNC
  // =====================================================

  useEffect(() => {
    if (!balance?.user_id) {
      return;
    }

    const channel = supabase
      .channel(
        `balance-${balance.user_id}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "balances",
          filter:
            `user_id=eq.${balance.user_id}`,
        },
        (
          payload: RealtimePostgresChangesPayload<Balance>
        ) => {
          if (payload.new) {
            setBalance(
              payload.new as Balance
            );
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(
        channel
      );
    };
  }, [balance?.user_id, supabase]);

  // =====================================================
  // START / MINE NOW
  //
  // IMPORTANT:
  //
  // For paid mining, the backend preserves the original
  // plan end time and elapsed profit.
  //
  // This button does NOT create a new paid 24-hour cycle.
  // =====================================================

  const startMining = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const device =
        getDeviceKey();

      const response =
        await fetch(
          "/api/mining/start",
          {
            method: "POST",

            headers: {
              "x-device": device,
            },

            credentials:
              "include",
          }
        );

      const data =
        (await response.json()) as StartMiningResponse;

      if (!response.ok) {
        alert(
          data.error ||
            "Failed to start mining."
        );

        return;
      }

      // Reload only after the server successfully
      // starts/continues the mining session.
      //
      // The server response contains the authoritative
      // session and its ends_at.
      window.location.reload();
    } catch (error: unknown) {
      console.error(
        "Start mining error:",
        error
      );

      alert(
        "Unable to start mining. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // BOOST
  // =====================================================

  const boostMultiplier =
    session?.boost === 5
      ? 5
      : session?.boost === 2
        ? 2
        : 1;

  // =====================================================
  // TIMER DISPLAY
  // =====================================================

  const hours =
    Math.floor(
      timeLeft / 3600
    );

  const minutes =
    Math.floor(
      (timeLeft % 3600) / 60
    );

  const seconds =
    timeLeft % 60;

  return (
    <div className="space-y-6">

      {/* =================================================
          BALANCE
          ================================================= */}

      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h2 className="text-lg font-semibold">
          Balance
        </h2>

        <p className="text-2xl text-yellow-400 font-bold">
          {Number(
            balance?.gold || 0
          ).toFixed(4)}{" "}
          Gold
        </p>

        <p className="text-zinc-400 mt-2">
          Cash: $
          {Number(
            balance?.cash || 0
          ).toFixed(2)}
        </p>
      </div>

      {/* =================================================
          MINING
          ================================================= */}

      <div className="bg-zinc-900 p-6 rounded-2xl">

        {!session ||
        !isSessionActive ? (
          <>
            <p className="text-zinc-400 mb-4">
              Mining cycle completed. Click Mine Now to start again.
            </p>

            <button
              onClick={
                startMining
              }
              className="bg-green-500 text-black px-6 py-3 rounded-xl font-bold"
              disabled={loading}
            >
              {loading
                ? "Starting..."
                : "Mine Now"}
            </button>
          </>
        ) : (
          <>
            <h2 className="font-semibold">
              Mining Active
            </h2>

            {/* =================================================
                TIMER
                ================================================= */}

            <p className="text-yellow-400 text-xl font-bold mt-2">
              {timeLeft > 0
                ? `${hours}h ${minutes}m ${seconds}s`
                : "Cycle Completed"}
            </p>

            {/* =================================================
                BOOST
                ================================================= */}

            <p className="text-sm text-zinc-400 mt-2">
              Boost: x
              {boostMultiplier}
            </p>
          </>
        )}
      </div>
    </div>
  );
}