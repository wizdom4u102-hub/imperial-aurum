import React from "react";

import AllocationSummary from "./allocation-summary";
import AllocationItem from "./allocation-item";


interface AllocationItemData {
  botName: string;
  percentage: number;
  amount: number;
  status: string;
  icon?: React.ReactNode;
}


interface PortfolioAllocationCardProps {
  totalAllocated: number;
  activeBots: number;
  availablePercentage: number;
  totalPercentage: number;
  allocations: AllocationItemData[];
}


const PortfolioAllocationCard: React.FC<
  PortfolioAllocationCardProps
> = ({
  totalAllocated,
  activeBots,
  availablePercentage,
  totalPercentage,
  allocations = [],
}) => {


  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-gradient-to-br
        from-white/[0.05]
        to-transparent
        p-6
        shadow-xl
      "
    >

      <h2 className="
        mb-6
        text-xl
        font-bold
        text-white
      ">
        Portfolio Allocation
      </h2>


      <AllocationSummary
        totalAllocated={totalAllocated ?? 0}
        activeBots={activeBots ?? 0}
        availablePercentage={availablePercentage ?? 0}
        totalPercentage={totalPercentage ?? 0}
      />


      <div className="mt-6">

        {allocations.length > 0 ? (

          allocations.map((item,index)=>(
            <AllocationItem
              key={index}
              {...item}
            />
          ))

        ) : (

          <div
            className="
              rounded-xl
              border
              border-white/10
              bg-white/[0.02]
              p-8
              text-center
              text-sm
              text-zinc-500
            "
          >
            No portfolio allocations available.
          </div>

        )}

      </div>


    </div>
  );
};


export default PortfolioAllocationCard;