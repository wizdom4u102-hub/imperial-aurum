import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MiningHistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", "mining")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
  }

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
            No mining rewards yet.
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {data.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-zinc-500">
                      Gold Earned
                    </span>

                    <span className="text-lg font-bold text-yellow-400">
                      +{Number(item.amount || 0).toFixed(2)}G
                    </span>
                  </div>

                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-zinc-500">
                      Status
                    </span>

                    <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                      {item.status || "Completed"}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="mb-1 text-sm text-zinc-500">
                      Description
                    </p>

                    <p className="text-zinc-300">
                      {item.description || "Mining reward credited"}
                    </p>
                  </div>

                  <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-500">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900 md:block">
              <table className="min-w-full">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="p-5 text-left font-semibold">Date</th>
                    <th className="p-5 text-left font-semibold">
                      Gold Earned
                    </th>
                    <th className="p-5 text-left font-semibold">Status</th>
                    <th className="p-5 text-left font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item: any) => (
                    <tr
                      key={item.id}
                      className="border-t border-zinc-800 transition hover:bg-zinc-800/40"
                    >
                      <td className="p-5 text-zinc-400">
                        {new Date(item.created_at).toLocaleString()}
                      </td>

                      <td className="p-5 font-bold text-yellow-400">
                        +{Number(item.amount || 0).toFixed(2)}G
                      </td>

                      <td className="p-5">
                        <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-1 text-xs text-yellow-400">
                          {item.status || "Completed"}
                        </span>
                      </td>

                      <td className="p-5 text-zinc-400">
                        {item.description || "Mining reward credited"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}