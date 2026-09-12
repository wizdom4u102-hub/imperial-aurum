import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface GoldTransaction {
  id: string;
  type: string;
  amount: number | null;
  description: string | null;
  status: string | null;
  created_at: string | null;
  asset_type: string | null;
  reference_id: string | null;
  currency: string | null;
}

export default async function MiningHistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /*
   * Fetch all transactions belonging to the user.
   *
   * We filter Gold-related records after fetching so this page
   * can include:
   * - Mining rewards
   * - Gold transactions
   * - Gold deposits
   * - Gold referral rewards
   * - Other transactions marked as Gold
   */
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Gold history fetch error:", error);
  }

  const data: GoldTransaction[] = (transactions ?? [])
    .filter((item) => {
      const currency = item.currency?.toUpperCase() ?? "";
      const assetType = item.asset_type?.toLowerCase() ?? "";

      return (
        item.type === "mining" ||
        currency === "GOLD" ||
        assetType === "gold"
      );
    })
    .map((item) => ({
      id: item.id,
      type: item.type,
      amount: item.amount,
      description: item.description,
      status: item.status,
      created_at: item.created_at,
      asset_type: item.asset_type,
      reference_id: item.reference_id,
      currency: item.currency,
    }));

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            Mining History
          </h1>

          <Link
            href="/history"
            className="text-yellow-400 transition hover:text-yellow-300"
          >
            ← Back
          </Link>
        </div>

        {!data || data.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-500">
            No Gold activity yet.
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {data.map((item) => {
                const isMining =
                  item.type === "mining";

                const isDeposit =
                  item.type === "deposit";

                const isReferralBonus =
                  item.type === "referral_bonus";

                const typeLabel = isMining
                  ? "Mining Reward"
                  : isDeposit
                    ? "Gold Deposit"
                    : isReferralBonus
                      ? "Gold Referral Reward"
                      : item.type.replace(/_/g, " ");

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <span className="text-sm text-zinc-500">
                        {typeLabel}
                      </span>

                      <span className="text-lg font-bold text-yellow-400">
                        +{Number(item.amount ?? 0).toFixed(2)}G
                      </span>
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-zinc-500">
                        Status
                      </span>

                      <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs capitalize text-yellow-400">
                        {item.status || "Completed"}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="mb-1 text-sm text-zinc-500">
                        Description
                      </p>

                      <p className="text-zinc-300">
                        {item.description ||
                          "Gold transaction credited"}
                      </p>
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-zinc-500">
                        Asset
                      </span>

                      <span className="font-medium text-yellow-400">
                        GOLD
                      </span>
                    </div>

                    {item.reference_id && (
                      <div className="mb-3">
                        <p className="mb-1 text-sm text-zinc-500">
                          Reference
                        </p>

                        <p className="break-all text-xs text-zinc-400">
                          {item.reference_id}
                        </p>
                      </div>
                    )}

                    <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-500">
                      {item.created_at
                        ? new Date(
                            item.created_at
                          ).toLocaleString()
                        : "-"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900 md:block">
              <table className="min-w-[900px] w-full">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="p-5 text-left font-semibold">
                      Date
                    </th>

                    <th className="p-5 text-left font-semibold">
                      Type
                    </th>

                    <th className="p-5 text-left font-semibold">
                      Gold
                    </th>

                    <th className="p-5 text-left font-semibold">
                      Status
                    </th>

                    <th className="p-5 text-left font-semibold">
                      Description
                    </th>

                    <th className="p-5 text-left font-semibold">
                      Reference
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item) => {
                    const isMining =
                      item.type === "mining";

                    const isDeposit =
                      item.type === "deposit";

                    const isReferralBonus =
                      item.type === "referral_bonus";

                    const typeLabel = isMining
                      ? "Mining Reward"
                      : isDeposit
                        ? "Gold Deposit"
                        : isReferralBonus
                          ? "Gold Referral Reward"
                          : item.type.replace(/_/g, " ");

                    return (
                      <tr
                        key={item.id}
                        className="border-t border-zinc-800 transition hover:bg-zinc-800/40"
                      >
                        <td className="p-5 text-zinc-400">
                          {item.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleString()
                            : "-"}
                        </td>

                        <td className="p-5 font-medium capitalize text-yellow-400">
                          {typeLabel}
                        </td>

                        <td className="p-5 font-bold text-yellow-400">
                          +{Number(
                            item.amount ?? 0
                          ).toFixed(2)}G
                        </td>

                        <td className="p-5">
                          <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-1 text-xs capitalize text-yellow-400">
                            {item.status || "Completed"}
                          </span>
                        </td>

                        <td className="p-5 text-zinc-400">
                          {item.description ||
                            "Gold transaction credited"}
                        </td>

                        <td className="p-5 text-xs text-zinc-500">
                          {item.reference_id || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}