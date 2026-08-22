"use client";

import React from "react";

function getStatusLabel(status: string) {
  switch (status) {
    case "pending_activation":
      return "Awaiting Activation";

    case "active":
      return "Active";

    case "running":
      return "Running";

    case "paused":
      return "Paused";

    case "stopped":
      return "Stopped";

    default:
      return status;
  }
}


interface TradingBotCardProps {
  id: string;
  name: string;
  status: string;
  strategy: string;
  tradingAsset?: string;
  investmentCapital?: number;
  currentValue?: number;
  accumulatedProfit?: number;
  availableBalance?: number;
  onSelect?: (id:string)=>void;
  onAddFunds?: () => void;
  onTransferFunds?: () => void;
}


const BotCard: React.FC<
  TradingBotCardProps
> = ({
  id,
  name,
  status,
  strategy,
  tradingAsset,
  investmentCapital = 0,
  currentValue = 0,
  accumulatedProfit = 0,
  availableBalance = 0,
  onSelect,
   onAddFunds,
   onTransferFunds,
}) => {


  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-gradient-to-br
        from-white/[0.05]
        to-transparent
        p-5
        shadow-xl
        transition
        hover:border-yellow-500/30
      "
    >


      <div className="
        flex
        items-center
        justify-between
        mb-5
      ">

        <h3 className="
          text-lg
          font-bold
          text-white
        ">
          {name}
        </h3>


        <span
          className="
            rounded-full
            bg-emerald-500/10
            px-3
            py-1
            text-xs
            text-emerald-400
          "
        >
          {getStatusLabel(status)}
        </span>


      </div>



      <div className="space-y-3 text-sm">


        {tradingAsset && (
          <Row
            label="Asset"
            value={tradingAsset}
          />
        )}


        <Row
          label="Strategy"
          value={strategy}
        />


        
        <Row
          label="Capital"
          value={`$${investmentCapital.toLocaleString()}`}
        />


        <Row
          label="Current"
          value={`$${currentValue.toLocaleString()}`}
        />


        <Row
          label="Profit"
          value={`$${accumulatedProfit.toLocaleString()}`}
          highlight
        />

        <Row
          label="Available Balance"
           value={`$${availableBalance.toLocaleString()}`}
        />


      </div>



      <div className="mt-5 grid grid-cols-1 gap-3">

  {onSelect && (
    <button
      type="button"
      onClick={() => {
        if (onSelect) {
          onSelect(id);
        } else {
          window.location.href =
            `/dashboard/trading-bot/view/${id}`;
        }
      }}
      className="
        rounded-xl
        border
        border-yellow-500/30
        bg-yellow-500/10
        py-3
        text-sm
        font-medium
        text-yellow-400
        transition
        hover:bg-yellow-500/20
      "
    >
      View Bot
    </button>
  )}

  <div className="grid grid-cols-2 gap-3">

    {onAddFunds && (
      <button
        type="button"
        onClick={onAddFunds}
        className="
          rounded-xl
          border
          border-emerald-500/30
          bg-emerald-500/10
          py-3
          text-sm
          font-medium
          text-emerald-400
          transition
          hover:bg-emerald-500/20
        "
      >
        Add Funds
      </button>
    )}

    {onTransferFunds && (
  <button
    type="button"
    onClick={onTransferFunds}
    disabled={accumulatedProfit <= 0}
    className={`
      rounded-xl
      py-3
      text-sm
      font-medium
      transition
      ${
        accumulatedProfit > 0
          ? `
            border
            border-blue-500/30
            bg-blue-500/10
            text-blue-400
            hover:bg-blue-500/20
          `
          : `
            cursor-not-allowed
            border
            border-zinc-700
            bg-zinc-800
            text-zinc-500
          `
      }
    `}
  >
    {accumulatedProfit > 0
      ? "Transfer"
      : "No Profit"}
  </button>
)}

  </div>

</div>



    </div>
  );
};



function Row({
  label,
  value,
  highlight,
}:{
  label:string;
  value:string;
  highlight?:boolean;
}){

  return (
    <div className="
      flex
      justify-between
      border-b
      border-white/5
      pb-2
    ">

      <span className="text-zinc-400">
        {label}
      </span>

      <span
        className={
          highlight
          ? "text-emerald-400 font-semibold"
          : "text-white"
        }
      >
        {value}
      </span>

    </div>
  );
}


export default BotCard;