"use client";

import React, {
  FormEvent,
  useMemo,
  useState,
} from "react";

import Link from "next/link";


interface PlanForm {
  name: string;
  slug: string;
  description: string;
  minimum_investment: string;
  maximum_investment: string;
  duration_days: string;
  expected_daily_roi: string;
  features: string;
  supported_assets: string;
  badge: string;
  color: string;
  icon: string;
  status: string;
  is_featured: boolean;
  is_popular: boolean;
  display_order: string;
}


const initialForm: PlanForm = {
  name: "",
  slug: "",
  description: "",
  minimum_investment: "",
  maximum_investment: "",
  duration_days: "",
  expected_daily_roi: "",
  features: "",
  supported_assets: "",
  badge: "",
  color: "",
  icon: "",
  status: "active",
  is_featured: false,
  is_popular: false,
  display_order: "0",
};


export default function NewTradingBotPlanPage() {

  const [
    form,
    setForm,
  ] = useState<PlanForm>(
    initialForm
  );


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  const [
    success,
    setSuccess,
  ] = useState(false);


  const monthlyRoi =
    useMemo(() => {

      const dailyRoi =
        Number(
          form.expected_daily_roi
        );

      if (
        !Number.isFinite(
          dailyRoi
        )
      ) {
        return 0;
      }

      return Number(
        (
          dailyRoi * 30
        ).toFixed(2)
      );

    }, [
      form.expected_daily_roi,
    ]);


  function updateField<
    K extends keyof PlanForm
  >(
    field: K,
    value: PlanForm[K]
  ) {

    setForm(
      (
        current
      ) => ({
        ...current,
        [field]:
          value,
      })
    );

  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(false);


    try {

      const features =
        form.features
          .split("\n")
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean);


      const supportedAssets =
        form.supported_assets
          .split(",")
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean);


      const response =
        await fetch(
          "/api/admin/trading-bot/plans",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name:
                  form.name.trim(),

                slug:
                  form.slug.trim(),

                description:
                  form.description.trim(),

                minimum_investment:
                  Number(
                    form.minimum_investment
                  ),

                maximum_investment:
                  Number(
                    form.maximum_investment
                  ),

                duration_days:
                  Number(
                    form.duration_days
                  ),

                expected_daily_roi:
                  Number(
                    form.expected_daily_roi
                  ),

                features,

                supported_assets:
                  supportedAssets,

                badge:
                  form.badge.trim() ||
                  null,

                color:
                  form.color.trim() ||
                  null,

                icon:
                  form.icon.trim() ||
                  null,

                status:
                  form.status,

                is_featured:
                  form.is_featured,

                is_popular:
                  form.is_popular,

                display_order:
                  Number(
                    form.display_order
                  ),
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
            "Unable to create trading bot plan."
        );

      }


      setSuccess(true);

      setForm(
        initialForm
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create trading bot plan."
      );

    } finally {

      setLoading(false);

    }

  }


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
          max-w-4xl
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
              Create Trading Bot Plan
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-zinc-400
              "
            >
              Add a new plan to the trading bot marketplace.
            </p>

          </div>


          <Link
            href="/admin/trading-bot/plans"
            className="
              text-sm
              text-zinc-400
              transition
              hover:text-white
            "
          >
            Back to Plans
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


        {success && (

          <div
            className="
              mb-6
              rounded-xl
              border
              border-green-500/30
              bg-green-500/10
              p-4
              text-sm
              text-green-400
            "
          >
            Trading bot plan created successfully.
          </div>

        )}


        <form
          onSubmit={
            handleSubmit
          }
          className="
            space-y-6
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            p-5
            sm:p-7
          "
        >

          <section>

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Basic Information
            </h2>


            <div
              className="
                mt-5
                grid
                gap-5
                sm:grid-cols-2
              "
            >

              <Field
                label="Plan Name"
                value={form.name}
                onChange={(value) =>
                  updateField(
                    "name",
                    value
                  )
                }
                required
              />


              <Field
                label="Slug"
                value={form.slug}
                onChange={(value) =>
                  updateField(
                    "slug",
                    value
                  )
                }
                required
              />


              <div
                className="
                  sm:col-span-2
                "
              >

                <label className="text-sm text-zinc-400">
                  Description
                </label>

                <textarea
                  value={
                    form.description
                  }
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  rows={4}
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/20
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    focus:border-[#D4AF37]
                  "
                />

              </div>

            </div>

          </section>


          <section>

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Investment Settings
            </h2>


            <div
              className="
                mt-5
                grid
                gap-5
                sm:grid-cols-2
              "
            >

              <Field
                label="Minimum Investment"
                type="number"
                value={
                  form.minimum_investment
                }
                onChange={(value) =>
                  updateField(
                    "minimum_investment",
                    value
                  )
                }
                required
              />


              <Field
                label="Maximum Investment"
                type="number"
                value={
                  form.maximum_investment
                }
                onChange={(value) =>
                  updateField(
                    "maximum_investment",
                    value
                  )
                }
                required
              />


              <Field
                label="Duration (Days)"
                type="number"
                value={
                  form.duration_days
                }
                onChange={(value) =>
                  updateField(
                    "duration_days",
                    value
                  )
                }
                required
              />


              <Field
                label="Daily ROI (%)"
                type="number"
                step="0.01"
                value={
                  form.expected_daily_roi
                }
                onChange={(value) =>
                  updateField(
                    "expected_daily_roi",
                    value
                  )
                }
                required
              />

            </div>


            <div
              className="
                mt-5
                rounded-xl
                border
                border-[#D4AF37]/20
                bg-[#D4AF37]/5
                p-4
              "
            >

              <p
                className="
                  text-xs
                  text-zinc-400
                "
              >
                Monthly ROI
              </p>

              <p
                className="
                  mt-1
                  text-xl
                  font-semibold
                  text-[#F5D76E]
                "
              >
                {monthlyRoi}%
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-zinc-500
                "
              >
                Automatically calculated from Daily ROI × 30.
              </p>

            </div>

          </section>


          <section>

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Features & Assets
            </h2>


            <div
              className="
                mt-5
                grid
                gap-5
                sm:grid-cols-2
              "
            >

              <div>

                <label className="text-sm text-zinc-400">
                  Features
                </label>

                <textarea
                  value={
                    form.features
                  }
                  onChange={(event) =>
                    updateField(
                      "features",
                      event.target.value
                    )
                  }
                  rows={6}
                  placeholder={
                    "One feature per line"
                  }
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/20
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    focus:border-[#D4AF37]
                  "
                />

              </div>


              <div>

                <label className="text-sm text-zinc-400">
                  Supported Assets
                </label>

                <textarea
                  value={
                    form.supported_assets
                  }
                  onChange={(event) =>
                    updateField(
                      "supported_assets",
                      event.target.value
                    )
                  }
                  rows={6}
                  placeholder={
                    "BTC, ETH, USDT"
                  }
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/20
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    focus:border-[#D4AF37]
                  "
                />

              </div>

            </div>

          </section>


          <section>

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Appearance & Status
            </h2>


            <div
              className="
                mt-5
                grid
                gap-5
                sm:grid-cols-2
              "
            >

              <Field
                label="Badge"
                value={
                  form.badge
                }
                onChange={(value) =>
                  updateField(
                    "badge",
                    value
                  )
                }
              />


              <Field
                label="Color"
                value={
                  form.color
                }
                onChange={(value) =>
                  updateField(
                    "color",
                    value
                  )
                }
              />


              <Field
                label="Icon"
                value={
                  form.icon
                }
                onChange={(value) =>
                  updateField(
                    "icon",
                    value
                  )
                }
              />


              <Field
                label="Display Order"
                type="number"
                value={
                  form.display_order
                }
                onChange={(value) =>
                  updateField(
                    "display_order",
                    value
                  )
                }
              />

            </div>


            <div
              className="
                mt-5
                grid
                gap-5
                sm:grid-cols-2
              "
            >

              <div>

                <label className="text-sm text-zinc-400">
                  Status
                </label>

                <select
                  value={
                    form.status
                  }
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value
                    )
                  }
                  className="
                    mt-2
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-[#111827]
                    px-4
                    text-sm
                    text-white
                    outline-none
                    focus:border-[#D4AF37]
                  "
                >

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                </select>

              </div>


              <div
                className="
                  flex
                  flex-col
                  justify-end
                  gap-3
                "
              >

                <label
                  className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    text-zinc-300
                  "
                >

                  <input
                    type="checkbox"
                    checked={
                      form.is_featured
                    }
                    onChange={(event) =>
                      updateField(
                        "is_featured",
                        event.target.checked
                      )
                    }
                    className="
                      h-4
                      w-4
                      accent-[#D4AF37]
                    "
                  />

                  Featured Plan

                </label>


                <label
                  className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    text-zinc-300
                  "
                >

                  <input
                    type="checkbox"
                    checked={
                      form.is_popular
                    }
                    onChange={(event) =>
                      updateField(
                        "is_popular",
                        event.target.checked
                      )
                    }
                    className="
                      h-4
                      w-4
                      accent-[#D4AF37]
                    "
                  />

                  Popular Plan

                </label>

              </div>

            </div>

          </section>


          <div
            className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-white/10
              pt-6
              sm:flex-row
              sm:justify-end
            "
          >

            <Link
              href="/admin/trading-bot/plans"
              className="
                inline-flex
                h-12
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                px-6
                text-sm
                font-medium
                text-white
                transition
                hover:bg-white/[0.06]
              "
            >
              Cancel
            </Link>


            <button
              type="submit"
              disabled={
                loading
              }
              className="
                inline-flex
                h-12
                items-center
                justify-center
                rounded-xl
                bg-[#D4AF37]
                px-6
                text-sm
                font-semibold
                text-[#050816]
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {
                loading
                  ? "Creating..."
                  : "Create Plan"
              }
            </button>

          </div>

        </form>

      </div>

    </div>

  );
}


function Field({
  label,
  value,
  onChange,
  type = "text",
  step,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
  step?: string;
  required?: boolean;
}) {

  return (

    <div>

      <label
        className="
          text-sm
          text-zinc-400
        "
      >
        {label}
      </label>


      <input
        type={type}
        step={step}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          mt-2
          h-12
          w-full
          rounded-xl
          border
          border-white/10
          bg-black/20
          px-4
          text-sm
          text-white
          outline-none
          focus:border-[#D4AF37]
        "
      />

    </div>

  );
}