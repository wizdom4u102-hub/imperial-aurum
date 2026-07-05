export default function PlanComparison() {
  const rows = [
    {
      feature: "Daily Mining Rewards",
      free: "120 Gold",
      premium: "Up to 1000 Gold",
      shared: "Team Based",
    },

    {
      feature: "Cloud Mining Access",
      free: "✓",
      premium: "✓",
      shared: "✓",
    },

    {
      feature: "Personal Dashboard",
      free: "✓",
      premium: "✓",
      shared: "✓",
    },

    {
      feature: "Withdrawals",
      free: "Standard",
      premium: "Priority",
      shared: "Priority",
    },

    {
      feature: "Referral Program",
      free: "Basic",
      premium: "Enhanced",
      shared: "20 Levels",
    },

    {
      feature: "Team Bonuses",
      free: "✗",
      premium: "✓",
      shared: "✓✓",
    },

    {
      feature: "Leadership Rewards",
      free: "✗",
      premium: "✓",
      shared: "✓",
    },

    {
      feature: "Shared Mining Rewards",
      free: "✗",
      premium: "✓",
      shared: "✓",
    },
  ];


  return (

    <section className="py-28 bg-zinc-950">

      <div className="max-w-7xl mx-auto px-6">


        <div className="text-center mb-16">

          <span className="uppercase tracking-[5px] text-yellow-400 text-sm">
            Compare Plans
          </span>

          <h2 className="text-5xl font-bold mt-5">
            Choose Your Growth Path
          </h2>

        </div>



        <div className="overflow-x-auto">


          <table className="w-full border-collapse">


            <thead>

              <tr className="text-left">

                <th className="p-6 text-zinc-400">
                  Feature
                </th>


                <th className="p-6 text-yellow-400">
                  Free
                </th>


                <th className="p-6 text-yellow-400">
                  Premium
                </th>


                <th className="p-6 text-yellow-400">
                  Shared
                </th>

              </tr>

            </thead>



            <tbody>


              {rows.map((row,index)=>(

                <tr
                  key={index}
                  className="border-t border-zinc-800"
                >

                  <td className="p-6 font-semibold">
                    {row.feature}
                  </td>


                  <td className="p-6 text-zinc-300">
                    {row.free}
                  </td>


                  <td className="p-6 text-zinc-300">
                    {row.premium}
                  </td>


                  <td className="p-6 text-zinc-300">
                    {row.shared}
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