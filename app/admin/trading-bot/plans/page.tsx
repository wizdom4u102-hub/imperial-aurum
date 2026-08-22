"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import type {
  Database,
} from "@/lib/supabase/database.types";


type TradingBotPlan =
  Database["public"]["Tables"]["trading_bot_plans"]["Row"];


export default function AdminTradingBotPlansPage() {

  const [
    plans,
    setPlans,
  ] = useState<TradingBotPlan[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  const [
    actionLoading,
    setActionLoading,
  ] = useState<string | null>(
    null
  );


  const fetchPlans =
    useCallback(
      async () => {

        try {

          setLoading(true);

          setError(null);


          const response =
            await fetch(
              "/api/admin/trading-bot/plans",
              {
                method: "GET",
                cache: "no-store",
              }
            );


          const result =
            await response.json();


          if (
            !response.ok
          ) {

            throw new Error(
              result?.error ??
                "Failed to load trading bot plans."
            );

          }


          setPlans(
            Array.isArray(
              result?.plans
            )
              ? result.plans
              : []
          );

        } catch (err) {

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load trading bot plans."
          );

        } finally {

          setLoading(false);

        }

      },
      []
    );


  useEffect(
    () => {

      fetchPlans();

    },
    [
      fetchPlans,
    ]
  );


  const handleToggleStatus =
    async (
      plan: TradingBotPlan
    ) => {

      const nextStatus =
        plan.status === "active"
          ? "inactive"
          : "active";


      try {

        setActionLoading(
          plan.id
        );


        const response =
          await fetch(
            `/api/admin/trading-bot/plans/${plan.id}/settings`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  status:
                    nextStatus,
                }),
            }
          );


        const result =
          await response.json();


        if (
          !response.ok
        ) {

          throw new Error(
            result?.error ??
              "Unable to update plan status."
          );

        }


        await fetchPlans();

      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : "Unable to update plan status."
        );

      } finally {

        setActionLoading(
          null
        );

      }

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
          max-w-7xl
        "
      >

        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <h1
              className="
                text-2xl
                font-bold
                sm:text-3xl
              "
            >
              Trading Bot Plans
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-zinc-400
              "
            >
              Manage trading bot investment plans,
              ROI, duration, availability, and display order.
            </p>

          </div>


          <Link
            href="/admin/trading-bot/plans/new"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-[#D4AF37]
              px-5
              py-3
              text-sm
              font-semibold
              text-[#050816]
              transition
              hover:opacity-90
            "
          >
            Add New Plan
          </Link>

        </div>


        {error && (

          <div
            className="
              mb-6
              rounded-xl
              border
              border-red-500/30
              bg-red-500/10
              p-4
              text-sm
              text-red-400
            "
          >
            {error}
          </div>

        )}


        {loading ? (

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.04]
              p-8
              text-center
              text-zinc-400
            "
          >
            Loading trading bot plans...
          </div>

        ) : plans.length === 0 ? (

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-white/10
              bg-white/[0.04]
              p-10
              text-center
            "
          >

            <h2
              className="
                text-xl
                font-semibold
                text-white
              "
            >
              No Trading Bot Plans
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-zinc-400
              "
            >
              Create your first trading bot plan.
            </p>

          </div>

        ) : (

          <div
            className="
              grid
              gap-5
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >

            {plans.map(
              (plan) => (

                <div
                  key={plan.id}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    p-5
                    backdrop-blur-xl
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >

                    <div>

                      <h2
                        className="
                          text-lg
                          font-semibold
                          text-white
                        "
                      >
                        {plan.name}
                      </h2>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-zinc-500
                        "
                      >
                        {plan.slug}
                      </p>

                    </div>


                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${
                          plan.status === "active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-zinc-500/10 text-zinc-400"
                        }
                      `}
                    >
                      {plan.status}
                    </span>

                  </div>


                  <div
                    className="
                      mt-5
                      grid
                      grid-cols-2
                      gap-4
                    "
                  >

                    <div>

                      <p className="text-xs text-zinc-500">
                        Investment
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        ${plan.minimum_investment.toLocaleString()}
                        {" - "}
                        ${plan.maximum_investment.toLocaleString()}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-zinc-500">
                        Duration
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {plan.duration_days} days
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-zinc-500">
                        Daily ROI
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#F5D76E]">
                        {plan.expected_daily_roi ?? 0}%
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-zinc-500">
                        Monthly ROI
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#F5D76E]">
                        {plan.expected_monthly_roi ?? 0}%
                      </p>

                    </div>

                  </div>


                  <div
                    className="
                      mt-5
                      flex
                      flex-wrap
                      gap-2
                    "
                  >

                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-400">
                      Order: {plan.display_order}
                    </span>

                    {plan.is_featured && (
                      <span className="rounded-full bg-[#D4AF37]/10 px-2.5 py-1 text-xs text-[#F5D76E]">
                        Featured
                      </span>
                    )}

                    {plan.is_popular && (
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs text-blue-400">
                        Popular
                      </span>
                    )}

                  </div>


                  <div
                    className="
                      mt-6
                      grid
                      grid-cols-2
                      gap-3
                    "
                  >

                    <Link
                      href={`/admin/trading-bot/plans/${plan.id}/edit`}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-white/[0.08]
                      "
                    >
                      Edit
                    </Link>


                    <button
                      type="button"
                      disabled={
                        actionLoading === plan.id
                      }
                      onClick={() =>
                        handleToggleStatus(
                          plan
                        )
                      }
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-zinc-300
                        transition
                        hover:bg-white/[0.08]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {
                        actionLoading === plan.id
                          ? "Updating..."
                          : plan.status === "active"
                            ? "Deactivate"
                            : "Activate"
                      }
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );
}