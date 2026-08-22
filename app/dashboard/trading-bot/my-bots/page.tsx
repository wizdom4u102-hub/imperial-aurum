"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import DashboardLayout from "@/components/trading-bot/dashboard-layout";
import DashboardHeader from "@/components/trading-bot/dashboard-header";
import ActiveBotsSection from "@/components/trading-bot/active-bots-section";

import TopUpBotDepositModal from "@/components/trading-bot/modals/top-up-bot-deposit-modal";
import TransferFundsModal from "@/components/trading-bot/modals/transfer-funds-modal";

import type {
  TradingBotRecord,
} from "@/lib/trading-bot/types";

import type {
  ApiResponse,
} from "@/lib/trading-bot/api.types";


export default function MyBotsPage() {

  const router =
    useRouter();


  const [
    bots,
    setBots,
  ] = useState<TradingBotRecord[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState<string | null>(null);


  const [
    lastUpdated,
    setLastUpdated,
  ] = useState("");


  const [
    selectedBot,
    setSelectedBot,
  ] = useState<TradingBotRecord | null>(
    null
  );


  const [
    topUpModalOpen,
    setTopUpModalOpen,
  ] = useState(false);


  const [
    transferBot,
    setTransferBot,
  ] = useState<TradingBotRecord | null>(
    null
  );


  const [
    transferModalOpen,
    setTransferModalOpen,
  ] = useState(false);


  const fetchBots =
    useCallback(
      async () => {

        try {

          setLoading(true);

          setError(null);


          const response =
            await fetch(
              "/api/trading-bot/my-bots",
              {
                method: "GET",
                cache: "no-store",
              }
            );


          const result:
            ApiResponse<TradingBotRecord[]> =
              await response.json();


          if (
            !response.ok ||
            result.error
          ) {

            throw new Error(
              result.error?.message ??
                "Failed to load trading bots."
            );

          }


          setBots(
            result.data ?? []
          );


          setLastUpdated(
            new Date().toLocaleString()
          );


        } catch (err) {

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load trading bots."
          );

        } finally {

          setLoading(false);

        }

      },
      []
    );


  useEffect(
    () => {

      fetchBots();

    },
    [
      fetchBots,
    ]
  );


  const handleOpenBotDetails =
    (
      botId: string
    ) => {

      router.push(
        `/dashboard/trading-bot/my-bots/${botId}`
      );

    };


  const handleTopUpBot =
    (
      bot: TradingBotRecord
    ) => {

      setSelectedBot(
        bot
      );

      setTopUpModalOpen(
        true
      );

    };


  const handleTransferFunds =
    (
      bot: TradingBotRecord
    ) => {

      setTransferBot(
        bot
      );

      setTransferModalOpen(
        true
      );

    };


  return (

    <DashboardLayout>

      <div className="space-y-6">

        <DashboardHeader

          onRefresh={
            fetchBots
          }

          loading={
            loading
          }

          lastUpdated={
            lastUpdated
          }

          onActivateBot={() => {

            window.location.href =
              "/dashboard/trading-bot/marketplace";

          }}

        />


        {error && (

          <div
            className="
              rounded-2xl
              border
              border-red-500/30
              bg-red-500/10
              p-6
              text-center
              text-red-400
            "
          >

            {error}

          </div>

        )}


        <ActiveBotsSection

          activeBots={
            bots
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


      </div>


      <TopUpBotDepositModal

        open={
          topUpModalOpen
        }

        bot={
          selectedBot
        }

        onClose={() => {

          setTopUpModalOpen(
            false
          );

          setSelectedBot(
            null
          );

        }}

        onSuccess={() => {

          setTopUpModalOpen(
            false
          );

          setSelectedBot(
            null
          );

          fetchBots();

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

          setTransferModalOpen(
            false
          );

          setTransferBot(
            null
          );

        }}

        onSuccess={() => {

          setTransferModalOpen(
            false
          );

          setTransferBot(
            null
          );

          fetchBots();

        }}

      />

    </DashboardLayout>

  );
}