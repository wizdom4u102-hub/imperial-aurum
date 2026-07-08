import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminPage } from "@/lib/admin";
import DepositActions from "./DepositActions";

export default async function ManageDeposits({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: string;
  }>;
}) {
  // Protect page
  await requireAdminPage();

  const params = await searchParams;

  const filter = params?.filter || "all";

  let query = supabaseAdmin
    .from("deposits")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter === "pending") {
    query = query.eq("status", "pending");
  }

  // "Approved" button still filters completed deposits
  if (filter === "approved") {
    query = query.eq("status", "completed");
  }

  // Future use
  if (filter === "rejected") {
    query = query.eq("status", "rejected");
  }

  const { data: deposits, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-10">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              Manage Deposits
            </h1>

            <p className="text-zinc-400 mt-2">
              Review and approve user deposits
            </p>
          </div>

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

          </div>
        </div>

        <div className="space-y-4">

                    {deposits && deposits.length > 0 ? (
            deposits.map((deposit: any) => {

              const statusColor =
                deposit.status === "completed"
                  ? "bg-green-500/20 text-green-400"
                  : deposit.status === "rejected"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-yellow-500/20 text-yellow-400";

              return (

                <div
                  key={deposit.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:p-6"
                >

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="space-y-3">

                      <h2 className="text-2xl font-bold text-yellow-400">
                        ${deposit.amount}
                      </h2>

                      <p className="text-zinc-300">
                        <span className="font-semibold">
                          User:
                        </span>{" "}
                        {deposit.user_id}
                      </p>

                      <p className="text-zinc-400">
                        <span className="font-semibold">
                          Method:
                        </span>{" "}
                        {deposit.method_id || "N/A"}
                      </p>

                      <p className="text-zinc-400">
                        <span className="font-semibold">
                          Submitted:
                        </span>{" "}
                        {new Date(
                          deposit.created_at
                        ).toLocaleString()}
                      </p>

                      <div>

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                        >
                          {deposit.status}
                        </span>

                      </div>

                      {deposit.reject_reason && (
                        <p className="text-red-400 text-sm">
                          <strong>Reason:</strong>{" "}
                          {deposit.reject_reason}
                        </p>
                      )}

                    </div>

                    <div className="flex flex-col justify-between gap-4">

                      <a
                        href={`/admin/users/${deposit.user_id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl"
                      >
                        View User
                      </a>

                      <DepositActions
                        id={deposit.id}
                        status={deposit.status}
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