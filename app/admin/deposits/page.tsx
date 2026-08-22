import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminPage } from "@/lib/admin";
import DepositActions from "./DepositActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ManageDepositsProps {
  searchParams: Promise<{
    filter?: string;
  }>;
}

export default async function ManageDeposits({
  searchParams,
}: ManageDepositsProps) {
  // =====================================================
  // ADMIN
  // =====================================================

  await requireAdminPage();

  const params = await searchParams;

  const filter = params?.filter || "all";

  // =====================================================
  // DEPOSITS
  // =====================================================

  let query = supabaseAdmin
    .from("deposits")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (filter === "pending") {
    query = query.eq("status", "pending");
  }

  if (filter === "approved") {
    query = query.eq("status", "completed");
  }

  if (filter === "rejected") {
    query = query.eq("status", "rejected");
  }

  const {
    data: deposits,
    error,
  } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // =====================================================
  // USER IDS
  // =====================================================

  const userIds = [
    ...new Set(
      (deposits ?? [])
        .map((deposit) => deposit.user_id)
        .filter(
          (userId): userId is string =>
            typeof userId === "string"
        )
    ),
  ];

  // =====================================================
  // MINING PLAN IDS
  // =====================================================

  const miningPlanIds = [
    ...new Set(
      (deposits ?? [])
        .map((deposit) => deposit.mining_plan_id)
        .filter(
          (planId): planId is string =>
            typeof planId === "string"
        )
    ),
  ];

  // =====================================================
  // SHARED PLAN IDS
  // =====================================================

  const sharedPlanIds = [
    ...new Set(
      (deposits ?? [])
        .map((deposit) => deposit.shared_plan_id)
        .filter(
          (planId): planId is string =>
            typeof planId === "string"
        )
    ),
  ];

  // =====================================================
  // PAYMENT METHOD IDS
  // =====================================================

  const paymentMethodIds = [
    ...new Set(
      (deposits ?? [])
        .map((deposit) => deposit.method_id)
        .filter(
          (methodId): methodId is string =>
            typeof methodId === "string"
        )
    ),
  ];

  // =====================================================
  // PROFILES
  // =====================================================

  const {
    data: profiles,
    error: profilesError,
  } =
    userIds.length > 0
      ? await supabaseAdmin
          .from("profiles")
          .select("id, username, email")
          .in("id", userIds)
      : {
          data: [],
          error: null,
        };

  if (profilesError) {
    throw new Error(
      profilesError.message
    );
  }

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [
      profile.id,
      profile,
    ])
  );

  // =====================================================
  // MINING PLANS
  // =====================================================

  const {
    data: miningPlans,
    error: miningPlansError,
  } =
    miningPlanIds.length > 0
      ? await supabaseAdmin
          .from("mining_plans")
          .select(
            "id, name, minimum_amount, maximum_amount"
          )
          .in("id", miningPlanIds)
      : {
          data: [],
          error: null,
        };

  if (miningPlansError) {
    throw new Error(
      miningPlansError.message
    );
  }

  const miningPlanMap = new Map(
    (miningPlans ?? []).map((plan) => [
      plan.id,
      plan,
    ])
  );

  // =====================================================
  // SHARED PLANS
  // =====================================================

  const {
    data: sharedPlans,
    error: sharedPlansError,
  } =
    sharedPlanIds.length > 0
      ? await supabaseAdmin
          .from("shared_plans")
          .select(
            "id, title, amount, status, active"
          )
          .in("id", sharedPlanIds)
      : {
          data: [],
          error: null,
        };

  if (sharedPlansError) {
    throw new Error(
      sharedPlansError.message
    );
  }

  const sharedPlanMap = new Map(
    (sharedPlans ?? []).map((plan) => [
      plan.id,
      plan,
    ])
  );

  // =====================================================
  // PAYMENT METHODS
  // =====================================================

  const {
    data: paymentMethods,
    error: paymentMethodsError,
  } =
    paymentMethodIds.length > 0
      ? await supabaseAdmin
          .from("payment_methods")
          .select(
            "id, name, type"
          )
          .in("id", paymentMethodIds)
      : {
          data: [],
          error: null,
        };

  if (paymentMethodsError) {
    throw new Error(
      paymentMethodsError.message
    );
  }

  const paymentMethodMap = new Map(
    (paymentMethods ?? []).map(
      (method) => [
        method.id,
        method,
      ]
    )
  );

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              Manage Deposits
            </h1>

            <p className="text-zinc-400 mt-2">
              Review and approve user deposits
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-3">

            <a
              href="/admin/deposits?filter=all"
              className={`px-4 py-2 rounded-xl text-sm ${
                filter === "all"
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              All
            </a>

            <a
              href="/admin/deposits?filter=pending"
              className={`px-4 py-2 rounded-xl text-sm ${
                filter === "pending"
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              Pending
            </a>

            <a
              href="/admin/deposits?filter=approved"
              className={`px-4 py-2 rounded-xl text-sm ${
                filter === "approved"
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              Approved
            </a>

            <a
              href="/admin/deposits?filter=rejected"
              className={`px-4 py-2 rounded-xl text-sm ${
                filter === "rejected"
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              Rejected
            </a>

          </div>
        </div>

        {/* DEPOSITS */}
        <div className="space-y-4">

          {deposits && deposits.length > 0 ? (
            deposits.map((deposit) => {
              const status =
                deposit.status ?? "pending";

              const profile =
                profileMap.get(
                  deposit.user_id ?? ""
                );

              const paymentMethod =
                paymentMethodMap.get(
                  deposit.method_id ?? ""
                );

              const miningPlan =
                miningPlanMap.get(
                  deposit.mining_plan_id ?? ""
                );

              const sharedPlan =
                sharedPlanMap.get(
                  deposit.shared_plan_id ?? ""
                );

              // =================================================
              // DETERMINE DEPOSIT PURPOSE
              // =================================================

              const isMiningPlan =
                Boolean(
                  deposit.mining_plan_id
                );

              const isSharedPlan =
                Boolean(
                  deposit.shared_plan_id
                );

              const purpose = isMiningPlan
                ? "Mining Plan"
                : isSharedPlan
                ? "Shared Plan"
                : "Normal Deposit";

              const purposeClass =
                isMiningPlan
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
                  : isSharedPlan
                  ? "bg-purple-500/20 text-purple-400 border-purple-500/20"
                  : "bg-blue-500/20 text-blue-400 border-blue-500/20";

              const statusColor =
                status === "completed"
                  ? "bg-green-500/20 text-green-400"
                  : status === "rejected"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-yellow-500/20 text-yellow-400";

              return (
                <div
                  key={deposit.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:p-6"
                >

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ================================================= */}
                    {/* DEPOSIT INFORMATION */}
                    {/* ================================================= */}

                    <div className="space-y-4">

                      {/* AMOUNT */}
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Amount
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-yellow-400">
                          $
                          {Number(
                            deposit.amount ?? 0
                          ).toLocaleString()}
                        </h2>
                      </div>

                      {/* USER */}
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          User
                        </p>

                        <div className="mt-1">
                          <p className="text-white font-medium">
                            {profile?.username ||
                              "No username"}
                          </p>

                          <p className="text-zinc-400 text-sm break-all">
                            {profile?.email ||
                              "No email"}
                          </p>
                        </div>
                      </div>

                      {/* ================================================= */}
                      {/* PURPOSE */}
                      {/* ================================================= */}

                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Deposit For
                        </p>

                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold ${purposeClass}`}
                          >
                            {purpose}
                          </span>
                        </div>

                        {/* MINING PLAN NAME */}
                        {isMiningPlan && (
                          <div className="mt-3 rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-4">
                            <p className="text-xs uppercase tracking-wider text-zinc-500">
                              Mining Plan
                            </p>

                            <p className="mt-1 text-lg font-semibold text-yellow-400">
                              {miningPlan?.name ||
                                "Mining Plan"}
                            </p>

                            {miningPlan && (
                              <p className="mt-1 text-sm text-zinc-400">
                                $
                                {Number(
                                  miningPlan.minimum_amount
                                ).toLocaleString()}
                                {" - "}
                                $
                                {Number(
                                  miningPlan.maximum_amount
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}

                        {/* SHARED PLAN NAME */}
                        {isSharedPlan && (
                          <div className="mt-3 rounded-xl border border-purple-500/10 bg-purple-500/5 p-4">
                            <p className="text-xs uppercase tracking-wider text-zinc-500">
                              Shared Plan
                            </p>

                            <p className="mt-1 text-lg font-semibold text-purple-400">
                              {sharedPlan?.title ||
                                "Shared Plan"}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* PAYMENT METHOD */}
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Payment Method
                        </p>

                        <p className="mt-1 text-zinc-300">
                          {paymentMethod?.name ||
                            "Unknown Method"}
                        </p>

                        {paymentMethod?.type && (
                          <p className="text-xs text-zinc-500">
                            {paymentMethod.type}
                          </p>
                        )}
                      </div>

                      {/* SUBMITTED */}
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500">
                          Submitted
                        </p>

                        <p className="mt-1 text-zinc-400 text-sm">
                          {deposit.created_at
                            ? new Date(
                                deposit.created_at
                              ).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                        >
                          {status}
                        </span>
                      </div>

                      {/* REJECTION REASON */}
                      {deposit.reject_reason && (
                        <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">
                          <p className="text-xs uppercase tracking-wider text-red-400">
                            Rejection Reason
                          </p>

                          <p className="mt-1 text-sm text-red-300">
                            {deposit.reject_reason}
                          </p>
                        </div>
                      )}

                    </div>

                    {/* ================================================= */}
                    {/* ACTIONS */}
                    {/* ================================================= */}

                    <div className="flex flex-col justify-between gap-4">

                      <div className="space-y-3">

                        {deposit.user_id && (
                          <a
                            href={`/admin/users/${deposit.user_id}`}
                            className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl transition"
                          >
                            View User
                          </a>
                        )}

                        {/* DEPOSIT ID FOR ADMIN AUDIT */}
                        <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                          <p className="text-xs uppercase tracking-wider text-zinc-500">
                            Deposit ID
                          </p>

                          <p className="mt-1 break-all text-xs text-zinc-400">
                            {deposit.id}
                          </p>
                        </div>

                      </div>

                      <DepositActions
                        id={deposit.id}
                        status={status}
                      />

                    </div>

                  </div>

                </div>
              );
            })
          ) : (
            <div className="bg-zinc-900 rounded-2xl p-10 text-center text-zinc-400">
              No deposits found.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}