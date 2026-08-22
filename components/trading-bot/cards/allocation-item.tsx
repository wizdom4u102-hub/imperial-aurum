import React from "react";

interface AllocationItemProps {
  botName: string;
  percentage: number;
  amount: number;
  status: string;
  icon?: React.ReactNode;
}

const AllocationItem: React.FC<AllocationItemProps> = ({
  botName,
  percentage,
  amount,
  status,
  icon,
}) => {
  return (
    <div
      className="
        flex items-center justify-between
        rounded-xl
        border border-white/10
        bg-white/[0.03]
        p-4
        mb-3
        transition
        hover:border-yellow-500/30
        hover:bg-white/[0.05]
      "
    >
      <div className="flex items-center gap-3">

        {icon && (
          <div className="text-yellow-400">
            {icon}
          </div>
        )}

        <div>
          <h3 className="font-semibold text-white">
            {botName}
          </h3>

          <p className="text-xs text-zinc-400">
            Allocation
          </p>
        </div>

      </div>


      <div className="text-right">

        <p className="text-sm text-yellow-400">
          {(percentage ?? 0).toFixed(2)}%
        </p>

        <p className="font-bold text-white">
          ${(amount ?? 0).toFixed(2)}
        </p>

      </div>


      <span
        className={`
          ml-4
          rounded-full
          px-3
          py-1
          text-xs
          font-medium
          ${
            status === "Active"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }
        `}
      >
        {status}
      </span>


    </div>
  );
};


export default AllocationItem;