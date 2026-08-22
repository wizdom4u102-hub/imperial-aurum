"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Wallet,
  TrendingUp,
  Activity,
  Users,
  X,
  ArrowDownToLine,
  ArrowUpFromLine,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  useAdminBotAdjustment,
} from "@/hooks/admin/use-admin-bot-adjustment";

import type {
  AdminTradingBotAdjustmentBot,
} from "@/lib/trading-bot/admin-bot-adjustment.types";


/* -------------------------------------------------------------------------- */
/*                              Helpers                                       */
/* -------------------------------------------------------------------------- */

function formatMoney(
  value: number
): string {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(value);
}


function formatDate(
  value: string | null
): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
    }
  ).format(
    new Date(value)
  );
}


function getStatusClasses(
  status: string | null
): string {
  const normalized =
    status?.toLowerCase();

  if (
    normalized === "active" ||
    normalized === "running"
  ) {
    return "bg-green-500/10 text-green-400";
  }

  if (
    normalized === "pending_activation"
  ) {
    return "bg-yellow-500/10 text-yellow-400";
  }

  if (
    normalized === "expired" ||
    normalized === "inactive" ||
    normalized === "cancelled"
  ) {
    return "bg-red-500/10 text-red-400";
  }

  return "bg-zinc-500/10 text-zinc-400";
}


/* -------------------------------------------------------------------------- */
/*                              Adjustment Modal                              */
/* -------------------------------------------------------------------------- */

interface AdjustmentModalProps {
  bot:
    AdminTradingBotAdjustmentBot;

  adjustmentType:
    | "credit"
    | "debit";

  submitting:
    boolean;

  onClose:
    () => void;

  onSubmit:
    (
      amount: number,
      reason: string
    ) => Promise<void>;
}


function AdjustmentModal({
  bot,
  adjustmentType,
  submitting,
  onClose,
  onSubmit,
}: AdjustmentModalProps) {

  const [
    amount,
    setAmount,
  ] = useState("");


  const [
    reason,
    setReason,
  ] = useState("");


  const [
    validationError,
    setValidationError,
  ] = useState<string | null>(
    null
  );


  const isCredit =
    adjustmentType === "credit";


  const numericAmount =
    Number(amount);


  const handleSubmit =
    async (
      event: React.FormEvent<HTMLFormElement>
    ) => {

      event.preventDefault();


      setValidationError(null);


      if (
        !Number.isFinite(
          numericAmount
        ) ||
        numericAmount <= 0
      ) {
        setValidationError(
          "Enter an amount greater than zero."
        );

        return;
      }


      if (
        !reason.trim()
      ) {
        setValidationError(
          "Please provide a reason for this adjustment."
        );

        return;
      }


      if (
        !isCredit &&
        numericAmount >
          bot.availableBalance
      ) {
        setValidationError(
          "The debit amount cannot exceed the bot available balance."
        );

        return;
      }


      await onSubmit(
        numericAmount,
        reason.trim()
      );
    };


  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-black/70
        p-0
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div
        className="
          max-h-[92vh]
          w-full
          overflow-y-auto
          rounded-t-3xl
          border
          border-white/10
          bg-[#050816]
          shadow-2xl
          sm:max-w-lg
          sm:rounded-3xl
        "
      >

        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/10
            p-5
            sm:p-6
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              {isCredit ? (
                <ArrowUpFromLine
                  className="
                    h-5
                    w-5
                    text-green-400
                  "
                />
              ) : (
                <ArrowDownToLine
                  className="
                    h-5
                    w-5
                    text-red-400
                  "
                />
              )}

              <h2
                className="
                  text-lg
                  font-semibold
                  text-white
                "
              >
                {isCredit
                  ? "Credit Trading Bot"
                  : "Debit Trading Bot"}
              </h2>

            </div>

            <p
              className="
                mt-1
                text-sm
                text-zinc-400
              "
            >
              Administrative balance adjustment
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="
              rounded-xl
              p-2
              text-zinc-400
              transition
              hover:bg-white/5
              hover:text-white
              disabled:opacity-50
            "
          >
            <X className="h-5 w-5" />
          </button>

        </div>


        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6"
        >

          {/* User */}

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.04]
              p-4
            "
          >

            <div
              className="
                flex
                items-start
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#D4AF37]/10
                  text-sm
                  font-bold
                  text-[#F5D76E]
                "
              >
                {(
                  bot.userName ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>


              <div
                className="
                  min-w-0
                "
              >

                <p
                  className="
                    truncate
                    font-semibold
                    text-white
                  "
                >
                  {bot.userName}
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-sm
                    text-zinc-400
                  "
                >
                  {bot.userEmail ??
                    "No email available"}
                </p>

              </div>

            </div>


            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-3
              "
            >

              <div>
                <p className="text-xs text-zinc-500">
                  Bot
                </p>

                <p className="mt-1 text-sm font-medium text-white">
                  {bot.botName}
                </p>
              </div>


              <div>
                <p className="text-xs text-zinc-500">
                  Available Balance
                </p>

                <p className="mt-1 text-sm font-semibold text-[#F5D76E]">
                  {formatMoney(
                    bot.availableBalance
                  )}
                </p>
              </div>

            </div>

          </div>


          {/* Amount */}

          <div className="mt-5">

            <label
              htmlFor="adjustment-amount"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-zinc-300
              "
            >
              Amount
            </label>

            <div
              className="
                relative
              "
            >

              <span
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-zinc-500
                "
              >
                $
              </span>

              <input
                id="adjustment-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(
                  event
                ) =>
                  setAmount(
                    event.target.value
                  )
                }
                disabled={submitting}
                placeholder="0.00"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  py-3
                  pl-9
                  pr-4
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-600
                  focus:border-[#D4AF37]/50
                  focus:ring-1
                  focus:ring-[#D4AF37]/30
                "
              />

            </div>

          </div>


          {/* Reason */}

          <div className="mt-5">

            <label
              htmlFor="adjustment-reason"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-zinc-300
              "
            >
              Reason
            </label>

            <textarea
              id="adjustment-reason"
              value={reason}
              onChange={(
                event
              ) =>
                setReason(
                  event.target.value
                )
              }
              disabled={submitting}
              rows={4}
              placeholder="Enter the reason for this adjustment..."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-white/10
                bg-white/[0.04]
                px-4
                py-3
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-zinc-600
                focus:border-[#D4AF37]/50
                focus:ring-1
                focus:ring-[#D4AF37]/30
              "
            />

          </div>


          {/* Validation */}

          {validationError && (

            <div
              className="
                mt-4
                flex
                items-start
                gap-2
                rounded-xl
                border
                border-red-500/20
                bg-red-500/10
                p-3
                text-sm
                text-red-400
              "
            >
              <AlertCircle
                className="
                  mt-0.5
                  h-4
                  w-4
                  shrink-0
                "
              />

              <span>
                {validationError}
              </span>

            </div>

          )}


          {/* Warning */}

          <div
            className={`
              mt-5
              rounded-xl
              border
              p-4
              ${
                isCredit
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-red-500/20 bg-red-500/5"
              }
            `}
          >

            <p
              className="
                text-xs
                leading-5
                text-zinc-400
              "
            >
              {isCredit
                ? "This will increase the selected trading bot's available balance. The adjustment will be recorded in the bot transaction ledger, activity log, and user notifications."
                : "This will decrease the selected trading bot's available balance. The debit cannot exceed the current available balance and will be recorded in the transaction ledger, activity log, and user notifications."}
            </p>

          </div>


          {/* Actions */}

          <div
            className="
              mt-6
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-2
            "
          >

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="
                order-2
                rounded-xl
                border
                border-white/10
                bg-white/[0.04]
                px-4
                py-3
                text-sm
                font-medium
                text-zinc-300
                transition
                hover:bg-white/[0.08]
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:order-1
              "
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={submitting}
              className={`
                order-1
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                px-4
                py-3
                text-sm
                font-semibold
                transition
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:order-2
                ${
                  isCredit
                    ? "bg-green-500 text-[#050816] hover:bg-green-400"
                    : "bg-red-500 text-white hover:bg-red-400"
                }
              `}
            >

              {submitting ? (
                <>
                  <Loader2
                    className="
                      h-4
                      w-4
                      animate-spin
                    "
                  />

                  Processing...
                </>
              ) : (
                <>
                  {isCredit ? (
                    <ArrowUpFromLine className="h-4 w-4" />
                  ) : (
                    <ArrowDownToLine className="h-4 w-4" />
                  )}

                  {isCredit
                    ? "Credit Bot"
                    : "Debit Bot"}
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


/* -------------------------------------------------------------------------- */
/*                         Admin Adjustment Page                              */
/* -------------------------------------------------------------------------- */

export default function AdminTradingBotAdjustmentPage() {

  const {
    bots,
    loading,
    submitting,
    error,
    lastAdjustment,
    refresh,
    adjustBot,
  } =
    useAdminBotAdjustment();


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    selectedBot,
    setSelectedBot,
  ] =
    useState<
      AdminTradingBotAdjustmentBot | null
    >(null);


  const [
    adjustmentType,
    setAdjustmentType,
  ] =
    useState<
      "credit" | "debit"
    >("credit");


  const [
    showDetails,
    setShowDetails,
  ] =
    useState<Record<string, boolean>>(
      {}
    );


  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState<string | null>(
      null
    );


  /* ------------------------------------------------------------------------ */
  /*                              Filtering                                   */
  /* ------------------------------------------------------------------------ */

  const filteredBots =
    useMemo(
      () => {

        const query =
          search
            .trim()
            .toLowerCase();


        if (!query) {
          return bots;
        }


        return bots.filter(
          (bot) => {

            const values = [
              bot.userName,
              bot.userEmail ?? "",
              bot.botName,
              bot.status ?? "",
            ];


            return values.some(
              (value) =>
                value
                  .toLowerCase()
                  .includes(query)
            );
          }
        );

      },
      [
        bots,
        search,
      ]
    );


  /* ------------------------------------------------------------------------ */
  /*                              Open Modal                                  */
  /* ------------------------------------------------------------------------ */

  const openAdjustment =
    useCallback(
      (
        bot:
          AdminTradingBotAdjustmentBot,
        type:
          | "credit"
          | "debit"
      ) => {

        setSelectedBot(
          bot
        );

        setAdjustmentType(
          type
        );

        setSuccessMessage(
          null
        );
      },
      []
    );


  /* ------------------------------------------------------------------------ */
  /*                            Submit Adjustment                             */
  /* ------------------------------------------------------------------------ */

  const handleAdjustment =
    useCallback(
      async (
        amount: number,
        reason: string
      ) => {

        if (
          !selectedBot
        ) {
          return;
        }


        const success =
          await adjustBot({
            botId:
              selectedBot.id,

            userId:
              selectedBot.userId,

            amount,

            reason,

            adjustmentType,
          });


        if (!success) {
          return;
        }


        setSuccessMessage(
          `${
            adjustmentType === "credit"
              ? "Credit"
              : "Debit"
          } completed successfully for ${
            selectedBot.botName
          }.`
        );


        setSelectedBot(
          null
        );

      },
      [
        selectedBot,
        adjustBot,
        adjustmentType,
      ]
    );


  /* ------------------------------------------------------------------------ */
  /*                              Toggle Details                              */
  /* ------------------------------------------------------------------------ */

  const toggleDetails =
    (
      botId: string
    ) => {

      setShowDetails(
        (current) => ({
          ...current,

          [botId]:
            !current[botId],
        })
      );
    };


  return (
    <div
      className="
        min-h-screen
        bg-[#050816]
        p-4
        text-white
        sm:p-6
        lg:p-8
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-[1600px]
        "
      >

        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#D4AF37]/10
                  text-[#F5D76E]
                "
              >
                <Wallet className="h-5 w-5" />
              </div>

              <div>

                <h1
                  className="
                    text-2xl
                    font-bold
                    sm:text-3xl
                  "
                >
                  Bot Balance Management
                </h1>

                <p
                  className="
                    mt-1
                    text-sm
                    text-zinc-400
                  "
                >
                  Credit or debit user trading bot balances.
                </p>

              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={() => {
              void refresh();
            }}
            disabled={loading}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-white/10
              bg-white/[0.04]
              px-4
              py-3
              text-sm
              font-medium
              text-zinc-300
              transition
              hover:bg-white/[0.08]
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading && (
              <Loader2
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />
            )}

            Refresh
          </button>

        </div>


        {/* ---------------------------------------------------------------- */}
        {/* Summary                                                          */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            mb-6
            grid
            grid-cols-2
            gap-3
            lg:grid-cols-4
          "
        >

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.04]
              p-4
              backdrop-blur-xl
              sm:p-5
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <p className="text-xs text-zinc-500">
                Total Bots
              </p>

              <Users
                className="
                  h-4
                  w-4
                  text-[#F5D76E]
                "
              />

            </div>

            <p
              className="
                mt-2
                text-xl
                font-bold
                sm:text-2xl
              "
            >
              {bots.length}
            </p>

          </div>


          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.04]
              p-4
              backdrop-blur-xl
              sm:p-5
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <p className="text-xs text-zinc-500">
                Active Bots
              </p>

              <Activity
                className="
                  h-4
                  w-4
                  text-green-400
                "
              />

            </div>

            <p
              className="
                mt-2
                text-xl
                font-bold
                text-green-400
                sm:text-2xl
              "
            >
              {
                bots.filter(
                  (bot) =>
                    bot.status?.toLowerCase() ===
                      "active" ||
                    bot.status?.toLowerCase() ===
                      "running"
                ).length
              }
            </p>

          </div>


          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.04]
              p-4
              backdrop-blur-xl
              sm:p-5
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <p className="text-xs text-zinc-500">
                Total Current Value
              </p>

              <Wallet
                className="
                  h-4
                  w-4
                  text-[#F5D76E]
                "
              />

            </div>

            <p
              className="
                mt-2
                truncate
                text-xl
                font-bold
                sm:text-2xl
              "
            >
              {formatMoney(
                bots.reduce(
                  (
                    total,
                    bot
                  ) =>
                    total +
                    bot.currentValue,
                  0
                )
              )}
            </p>

          </div>


          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.04]
              p-4
              backdrop-blur-xl
              sm:p-5
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <p className="text-xs text-zinc-500">
                Total Profit
              </p>

              <TrendingUp
                className="
                  h-4
                  w-4
                  text-[#F5D76E]
                "
              />

            </div>

            <p
              className="
                mt-2
                truncate
                text-xl
                font-bold
                text-[#F5D76E]
                sm:text-2xl
              "
            >
              {formatMoney(
                bots.reduce(
                  (
                    total,
                    bot
                  ) =>
                    total +
                    bot.totalProfit,
                  0
                )
              )}
            </p>

          </div>

        </div>


        {/* ---------------------------------------------------------------- */}
        {/* Success                                                           */}
        {/* ---------------------------------------------------------------- */}

        {successMessage && (

          <div
            className="
              mb-5
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-green-500/20
              bg-green-500/10
              p-4
              text-sm
              text-green-400
            "
          >

            <CheckCircle2
              className="
                mt-0.5
                h-5
                w-5
                shrink-0
              "
            />

            <span>
              {successMessage}
            </span>

            <button
              type="button"
              onClick={() =>
                setSuccessMessage(
                  null
                )
              }
              className="
                ml-auto
                shrink-0
                text-green-400/70
                hover:text-green-400
              "
            >
              <X className="h-4 w-4" />
            </button>

          </div>

        )}


        {/* ---------------------------------------------------------------- */}
        {/* Error                                                             */}
        {/* ---------------------------------------------------------------- */}

        {error && (

          <div
            className="
              mb-5
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/10
              p-4
              text-sm
              text-red-400
            "
          >

            <AlertCircle
              className="
                mt-0.5
                h-5
                w-5
                shrink-0
              "
            />

            <span>
              {error.message}
            </span>

          </div>

        )}


        {/* ---------------------------------------------------------------- */}
        {/* Search                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            mb-6
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            p-4
            backdrop-blur-xl
          "
        >

          <div
            className="
              relative
            "
          >

            <Search
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                h-5
                w-5
                -translate-y-1/2
                text-zinc-500
              "
            />

            <input
              type="search"
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search by user name, email, bot name, or status..."
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-black/10
                py-3
                pl-12
                pr-4
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-zinc-600
                focus:border-[#D4AF37]/50
                focus:ring-1
                focus:ring-[#D4AF37]/30
              "
            />

          </div>

        </div>


        {/* ---------------------------------------------------------------- */}
        {/* Loading                                                           */}
        {/* ---------------------------------------------------------------- */}

        {loading ? (

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.04]
              p-12
              text-center
              text-zinc-400
            "
          >

            <Loader2
              className="
                mx-auto
                h-7
                w-7
                animate-spin
                text-[#D4AF37]
              "
            />

            <p className="mt-3 text-sm">
              Loading trading bots...
            </p>

          </div>

        ) : filteredBots.length === 0 ? (

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-white/10
              bg-white/[0.04]
              p-12
              text-center
            "
          >

            <Wallet
              className="
                mx-auto
                h-8
                w-8
                text-zinc-600
              "
            />

            <h2
              className="
                mt-4
                text-lg
                font-semibold
              "
            >
              No trading bots found
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-zinc-500
              "
            >
              Try another search.
            </p>

          </div>

        ) : (

          <>
            {/* ------------------------------------------------------------ */}
            {/* Desktop                                                        */}
            {/* ------------------------------------------------------------ */}

            <div
              className="
                hidden
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                backdrop-blur-xl
                xl:block
              "
            >

              <div
                className="
                  overflow-x-auto
                "
              >

                <table
                  className="
                    w-full
                    min-w-[1250px]
                    text-left
                  "
                >

                  <thead
                    className="
                      border-b
                      border-white/10
                      bg-white/[0.03]
                    "
                  >

                    <tr>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        User
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Bot
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Balance
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Current Value
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Profit
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        ROI
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Trades
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody
                    className="
                      divide-y
                      divide-white/5
                    "
                  >

                    {filteredBots.map(
                      (
                        bot
                      ) => (

                        <tr
                          key={bot.id}
                          className="
                            transition
                            hover:bg-white/[0.025]
                          "
                        >

                          <td className="px-5 py-5">

                            <div>

                              <p className="font-medium text-white">
                                {bot.userName}
                              </p>

                              <p className="mt-1 text-xs text-zinc-500">
                                {bot.userEmail ??
                                  "No email"}
                              </p>

                            </div>

                          </td>


                          <td className="px-5 py-5">

                            <div>

                              <p className="font-medium text-white">
                                {bot.botName}
                              </p>

                              <span
                                className={`
                                  mt-1
                                  inline-flex
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-[11px]
                                  font-semibold
                                  ${getStatusClasses(
                                    bot.status
                                  )}
                                `}
                              >
                                {bot.status ??
                                  "Unknown"}
                              </span>

                            </div>

                          </td>


                          <td className="px-5 py-5">

                            <p className="font-semibold text-[#F5D76E]">
                              {formatMoney(
                                bot.availableBalance
                              )}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              Investment{" "}
                              {formatMoney(
                                bot.investmentCapital
                              )}
                            </p>

                          </td>


                          <td className="px-5 py-5">

                            <p className="font-medium text-white">
                              {formatMoney(
                                bot.currentValue
                              )}
                            </p>

                          </td>


                          <td className="px-5 py-5">

                            <p
                              className={`
                                font-semibold
                                ${
                                  bot.totalProfit >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                                }
                              `}
                            >
                              {formatMoney(
                                bot.totalProfit
                              )}
                            </p>

                          </td>


                          <td className="px-5 py-5">

                            <p className="font-semibold text-[#F5D76E]">
                              {bot.roiPercentage.toFixed(
                                2
                              )}
                              %
                            </p>

                          </td>


                          <td className="px-5 py-5">

                            <p className="font-medium text-white">
                              {bot.totalTrades}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {bot.winRate.toFixed(
                                2
                              )}
                              % win
                            </p>

                          </td>


                          <td className="px-5 py-5">

                            <div
                              className="
                                flex
                                gap-2
                              "
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  openAdjustment(
                                    bot,
                                    "credit"
                                  )
                                }
                                className="
                                  rounded-xl
                                  bg-green-500
                                  px-3
                                  py-2
                                  text-xs
                                  font-semibold
                                  text-[#050816]
                                  transition
                                  hover:bg-green-400
                                "
                              >
                                Credit
                              </button>


                              <button
                                type="button"
                                onClick={() =>
                                  openAdjustment(
                                    bot,
                                    "debit"
                                  )
                                }
                                className="
                                  rounded-xl
                                  bg-red-500
                                  px-3
                                  py-2
                                  text-xs
                                  font-semibold
                                  text-white
                                  transition
                                  hover:bg-red-400
                                "
                              >
                                Debit
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>


            {/* ------------------------------------------------------------ */}
            {/* Mobile / Tablet Cards                                         */}
            {/* ------------------------------------------------------------ */}

            <div
              className="
                grid
                gap-4
                xl:hidden
              "
            >

              {filteredBots.map(
                (
                  bot
                ) => {

                  const detailsOpen =
                    Boolean(
                      showDetails[
                        bot.id
                      ]
                    );


                  return (
                    <div
                      key={bot.id}
                      className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        backdrop-blur-xl
                      "
                    >

                      <div
                        className="
                          p-4
                          sm:p-5
                        "
                      >

                        {/* User / Bot */}

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                        >

                          <div
                            className="
                              flex
                              min-w-0
                              items-center
                              gap-3
                            "
                          >

                            <div
                              className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#D4AF37]/10
                                font-bold
                                text-[#F5D76E]
                              "
                            >
                              {(
                                bot.userName ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>


                            <div
                              className="
                                min-w-0
                              "
                            >

                              <p
                                className="
                                  truncate
                                  font-semibold
                                  text-white
                                "
                              >
                                {bot.userName}
                              </p>

                              <p
                                className="
                                  truncate
                                  text-xs
                                  text-zinc-500
                                "
                              >
                                {bot.userEmail ??
                                  "No email"}
                              </p>

                            </div>

                          </div>


                          <span
                            className={`
                              shrink-0
                              rounded-full
                              px-2.5
                              py-1
                              text-[11px]
                              font-semibold
                              ${getStatusClasses(
                                bot.status
                              )}
                            `}
                          >
                            {bot.status ??
                              "Unknown"}
                          </span>

                        </div>


                        {/* Bot */}

                        <div
                          className="
                            mt-4
                            rounded-xl
                            border
                            border-white/5
                            bg-black/10
                            p-3
                          "
                        >

                          <p className="text-xs text-zinc-500">
                            Trading Bot
                          </p>

                          <p className="mt-1 font-semibold text-white">
                            {bot.botName}
                          </p>

                        </div>


                        {/* Main Stats */}

                        <div
                          className="
                            mt-4
                            grid
                            grid-cols-2
                            gap-3
                            sm:grid-cols-4
                          "
                        >

                          <div
                            className="
                              rounded-xl
                              bg-white/[0.03]
                              p-3
                            "
                          >

                            <p className="text-[11px] text-zinc-500">
                              Balance
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#F5D76E]">
                              {formatMoney(
                                bot.availableBalance
                              )}
                            </p>

                          </div>


                          <div
                            className="
                              rounded-xl
                              bg-white/[0.03]
                              p-3
                            "
                          >

                            <p className="text-[11px] text-zinc-500">
                              Current Value
                            </p>

                            <p className="mt-1 text-sm font-semibold text-white">
                              {formatMoney(
                                bot.currentValue
                              )}
                            </p>

                          </div>


                          <div
                            className="
                              rounded-xl
                              bg-white/[0.03]
                              p-3
                            "
                          >

                            <p className="text-[11px] text-zinc-500">
                              Profit
                            </p>

                            <p
                              className={`
                                mt-1
                                text-sm
                                font-semibold
                                ${
                                  bot.totalProfit >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                                }
                              `}
                            >
                              {formatMoney(
                                bot.totalProfit
                              )}
                            </p>

                          </div>


                          <div
                            className="
                              rounded-xl
                              bg-white/[0.03]
                              p-3
                            "
                          >

                            <p className="text-[11px] text-zinc-500">
                              ROI
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#F5D76E]">
                              {bot.roiPercentage.toFixed(
                                2
                              )}
                              %
                            </p>

                          </div>

                        </div>


                        {/* Actions */}

                        <div
                          className="
                            mt-4
                            grid
                            grid-cols-2
                            gap-3
                          "
                        >

                          <button
                            type="button"
                            onClick={() =>
                              openAdjustment(
                                bot,
                                "credit"
                              )
                            }
                            className="
                              inline-flex
                              min-h-11
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              bg-green-500
                              px-4
                              py-3
                              text-sm
                              font-semibold
                              text-[#050816]
                              transition
                              hover:bg-green-400
                            "
                          >
                            <ArrowUpFromLine className="h-4 w-4" />
                            Credit
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              openAdjustment(
                                bot,
                                "debit"
                              )
                            }
                            className="
                              inline-flex
                              min-h-11
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              bg-red-500
                              px-4
                              py-3
                              text-sm
                              font-semibold
                              text-white
                              transition
                              hover:bg-red-400
                            "
                          >
                            <ArrowDownToLine className="h-4 w-4" />
                            Debit
                          </button>

                        </div>


                        {/* Details Toggle */}

                        <button
                          type="button"
                          onClick={() =>
                            toggleDetails(
                              bot.id
                            )
                          }
                          className="
                            mt-3
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            px-4
                            py-2.5
                            text-xs
                            font-medium
                            text-zinc-400
                            transition
                            hover:bg-white/[0.06]
                            hover:text-white
                          "
                        >

                          {detailsOpen ? (
                            <>
                              Hide Statistics
                              <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              View Full Statistics
                              <ChevronDown className="h-4 w-4" />
                            </>
                          )}

                        </button>


                        {/* Details */}

                        {detailsOpen && (

                          <div
                            className="
                              mt-4
                              border-t
                              border-white/10
                              pt-4
                            "
                          >

                            <div
                              className="
                                grid
                                grid-cols-2
                                gap-3
                              "
                            >

                              <div>
                                <p className="text-xs text-zinc-500">
                                  Investment
                                </p>
                                <p className="mt-1 text-sm font-medium">
                                  {formatMoney(
                                    bot.investmentCapital
                                  )}
                                </p>
                              </div>


                              <div>
                                <p className="text-xs text-zinc-500">
                                  Accumulated Profit
                                </p>
                                <p className="mt-1 text-sm font-medium text-green-400">
                                  {formatMoney(
                                    bot.accumulatedProfit
                                  )}
                                </p>
                              </div>


                              <div>
                                <p className="text-xs text-zinc-500">
                                  Today
                                </p>
                                <p className="mt-1 text-sm font-medium">
                                  {formatMoney(
                                    bot.todayProfit
                                  )}
                                </p>
                              </div>


                              <div>
                                <p className="text-xs text-zinc-500">
                                  Weekly
                                </p>
                                <p className="mt-1 text-sm font-medium">
                                  {formatMoney(
                                    bot.weeklyProfit
                                  )}
                                </p>
                              </div>


                              <div>
                                <p className="text-xs text-zinc-500">
                                  Monthly
                                </p>
                                <p className="mt-1 text-sm font-medium">
                                  {formatMoney(
                                    bot.monthlyProfit
                                  )}
                                </p>
                              </div>


                              <div>
                                <p className="text-xs text-zinc-500">
                                  Yearly
                                </p>
                                <p className="mt-1 text-sm font-medium">
                                  {formatMoney(
                                    bot.yearlyProfit
                                  )}
                                </p>
                              </div>


                              <div>
                                <p className="text-xs text-zinc-500">
                                  Total Trades
                                </p>
                                <p className="mt-1 text-sm font-medium">
                                  {bot.totalTrades}
                                </p>
                              </div>


                              <div>
                                <p className="text-xs text-zinc-500">
                                  Win Rate
                                </p>
                                <p className="mt-1 text-sm font-medium">
                                  {bot.winRate.toFixed(
                                    2
                                  )}
                                  %
                                </p>
                              </div>


                              <div>
                                <p className="text-xs text-zinc-500">
                                  Winning Trades
                                </p>
                                <p className="mt-1 text-sm font-medium text-green-400">
                                  {bot.winningTrades}
                                </p>
                              </div>


                              <div>
                                <p className="text-xs text-zinc-500">
                                  Losing Trades
                                </p>
                                <p className="mt-1 text-sm font-medium text-red-400">
                                  {bot.losingTrades}
                                </p>
                              </div>


                              <div>
                                <p className="text-xs text-zinc-500">
                                  Running Days
                                </p>
                                <p className="mt-1 text-sm font-medium">
                                  {bot.runningDays}
                                </p>
                              </div>


                              <div>
                                <p className="text-xs text-zinc-500">
                                  Remaining Days
                                </p>
                                <p className="mt-1 text-sm font-medium">
                                  {bot.remainingDays}
                                </p>
                              </div>

                            </div>


                            <div
                              className="
                                mt-4
                                grid
                                grid-cols-1
                                gap-3
                                rounded-xl
                                bg-white/[0.03]
                                p-3
                                sm:grid-cols-2
                              "
                            >

                              <div>
                                <p className="text-xs text-zinc-500">
                                  Activated
                                </p>

                                <p className="mt-1 text-xs text-zinc-300">
                                  {formatDate(
                                    bot.activatedAt
                                  )}
                                </p>
                              </div>


                              <div>
                                <p className="text-xs text-zinc-500">
                                  Expires
                                </p>

                                <p className="mt-1 text-xs text-zinc-300">
                                  {formatDate(
                                    bot.expiresAt
                                  )}
                                </p>
                              </div>

                            </div>

                          </div>

                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </>

        )}

      </div>


      {/* ------------------------------------------------------------------ */}
      {/* Adjustment Modal                                                   */}
      {/* ------------------------------------------------------------------ */}

      {selectedBot && (

        <AdjustmentModal
          bot={
            selectedBot
          }

          adjustmentType={
            adjustmentType
          }

          submitting={
            submitting
          }

          onClose={() =>
            setSelectedBot(
              null
            )
          }

          onSubmit={
            handleAdjustment
          }
        />

      )}

    </div>
  );
}