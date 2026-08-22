export default function PlanComparison() {
  const rows = [
    {
      feature: "Mining Access",
      free: "✓",
      premium: "✓",
    },
    {
      feature: "Daily Mining Rewards",
      free: "Free Daily Gold",
      premium: "Based on Investment",
    },
    {
      feature: "Investment Required",
      free: "Free",
      premium: "Paid Plans",
    },
    {
      feature: "Mining Power",
      free: "Standard",
      premium: "Increased",
    },
    {
      feature: "Personal Dashboard",
      free: "✓",
      premium: "✓",
    },
    {
      feature: "Mining Rewards",
      free: "Every 24 Hours",
      premium: "Every 24 Hours",
    },
    {
      feature: "Withdrawals",
      free: "Available",
      premium: "Available",
    },
    {
      feature: "Plan Upgrades",
      free: "✓",
      premium: "✓",
    },
  ];

  return (
    <section className="bg-zinc-950 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto w-full max-w-7xl">

        {/* HEADER */}
        <div className="mb-12 text-center sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-400 sm:text-sm sm:tracking-[0.35em]">
            Compare Plans
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Choose Your Mining Path
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">
            Compare the Free and Premium mining options and
            choose the plan that fits your goals.
          </p>
        </div>

        {/* COMPARISON */}
        <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-black shadow-2xl">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-5 text-left text-sm font-semibold text-zinc-400 sm:p-6">
                  Feature
                </th>

                <th className="p-5 text-left text-sm font-semibold text-yellow-400 sm:p-6">
                  Free Plan
                </th>

                <th className="p-5 text-left text-sm font-semibold text-yellow-400 sm:p-6">
                  Premium Plans
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.feature}
                  className="border-b border-zinc-800/80 transition-colors last:border-b-0 hover:bg-white/[0.02]"
                >
                  <td className="p-5 text-sm font-semibold text-white sm:p-6 sm:text-base">
                    {row.feature}
                  </td>

                  <td className="p-5 text-sm text-zinc-300 sm:p-6">
                    {row.free === "✓" ? (
                      <span className="font-semibold text-emerald-400">
                        ✓
                      </span>
                    ) : (
                      row.free
                    )}
                  </td>

                  <td className="p-5 text-sm text-zinc-300 sm:p-6">
                    {row.premium === "✓" ? (
                      <span className="font-semibold text-emerald-400">
                        ✓
                      </span>
                    ) : (
                      row.premium
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}