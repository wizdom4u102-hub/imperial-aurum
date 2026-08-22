"use client";

import React, {
  useEffect,
  useState,
} from "react";

import BotMarketplaceHeader from "./bot-marketplace-header";
import BotGrid from "./bot-grid";
import EmptyMarketplace from "./empty-marketplace";
import BotDetailsModal from "./bot-details-modal";
import PlanSelection from "./plan-selection";
import DepositConfirmation from "../deposit/deposit-confirmation";

import type {
  TradingBotPlan,
} from "@/lib/trading-bot/marketplace.types";

import {
  tradingBotStyles,
} from "../theme";


const BotMarketplace: React.FC = () => {

  const [
    bots,
    setBots,
  ] = useState<TradingBotPlan[]>([]);


  const [
    selectedBot,
    setSelectedBot,
  ] = useState<TradingBotPlan | null>(null);


  const [
    investmentBot,
    setInvestmentBot,
  ] = useState<TradingBotPlan | null>(null);

  const [
  investmentAmount,
  setInvestmentAmount,
] = useState<number | null>(null);


  const [
    loading,
    setLoading,
  ] = useState(true);



  useEffect(() => {

    async function loadMarketplace() {

      try {

        const response =
          await fetch(
            "/api/trading-bot/marketplace"
          );


        if (!response.ok) {

          throw new Error(
            "Failed to load marketplace"
          );

        }


        const data =
          await response.json();


        setBots(
          data.bots ?? []
        );


      } catch(error) {

        console.error(
          "Marketplace loading failed:",
          error
        );


      } finally {

        setLoading(false);

      }

    }


    loadMarketplace();

  }, []);

  function handleStartInvestment(
  bot: TradingBotPlan
) {
  setSelectedBot(null);

  setInvestmentBot(bot);
}

  function handleInvestmentContinue(
  amount: number
) {
  setInvestmentAmount(amount);
}



  if (loading) {

    return (

      <div
        className="
          flex
          min-h-[40vh]
          w-full
          items-center
          justify-center
        "
      >

        <p
          className="
            text-[#A1A1AA]
            animate-pulse
          "
        >
          Loading trading strategies...
        </p>

      </div>

    );

  }



  return (

    <section
      className="
        w-full
      "
    >

      <div
        className={
          tradingBotStyles.container
        }
      >

        <BotMarketplaceHeader />



        {
          bots.length > 0
            ?

              <BotGrid

                bots={
                  bots
                }

                onViewDetails={
                  setSelectedBot
                }

              />

            :

              <EmptyMarketplace />

        }


      </div>




      {
        selectedBot && (

          <BotDetailsModal

            bot={
              selectedBot
            }

            open={
              true
            }

            onClose={() =>
              setSelectedBot(null)
            }

            onStartInvestment={
              handleStartInvestment
            }

          />

        )
      }




      {
  investmentBot &&
  investmentAmount === null && (
    <PlanSelection
      bot={investmentBot}
      onBack={() => setInvestmentBot(null)}
      onContinue={handleInvestmentContinue}
    />
  )
}

{
  investmentBot &&
  investmentAmount !== null && (
    <DepositConfirmation
      bot={investmentBot}
      amount={investmentAmount}
      onBack={() => setInvestmentAmount(null)}
      onSuccess={() => {
        setInvestmentAmount(null);
        setInvestmentBot(null);
      }}
    />
  )
}



    </section>

  );

};


export default BotMarketplace;