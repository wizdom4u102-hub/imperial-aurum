import React from "react";

interface AllocationSummaryProps {
  totalAllocated: number;
  activeBots: number;
  availablePercentage: number;
  totalPercentage: number;
}


const AllocationSummary: React.FC<AllocationSummaryProps> = ({
  totalAllocated,
  activeBots,
  availablePercentage,
  totalPercentage,
}) => {

  const stats = [
    {
      title: "Total Allocated",
      value: `$${(totalAllocated ?? 0).toFixed(2)}`,
    },
    {
      title: "Active Bots",
      value: activeBots ?? 0,
    },
    {
      title: "Available",
      value: `${(availablePercentage ?? 0).toFixed(2)}%`,
    },
    {
      title: "Allocation",
      value: `${(totalPercentage ?? 0).toFixed(2)}%`,
    },
  ];


  return (
    <div
      className="
        grid
        grid-cols-2
        lg:grid-cols-4
        gap-4
        rounded-xl
        border
        border-white/10
        bg-black/20
        p-4
      "
    >

      {stats.map((item) => (
        <div
          key={item.title}
          className="
            rounded-xl
            bg-white/[0.03]
            border
            border-white/5
            p-4
            text-center
          "
        >

          <p className="text-xs text-zinc-400">
            {item.title}
          </p>

          <p className="mt-2 text-xl font-bold text-white">
            {item.value}
          </p>

        </div>
      ))}

    </div>
  );
};


export default AllocationSummary;