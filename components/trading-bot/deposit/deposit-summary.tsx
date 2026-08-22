// components/trading-bot/deposit/deposit-summary.tsx

import type {
  TradingBotPlan,
} from "@/lib/trading-bot/marketplace.types";

interface DepositSummaryProps {
  bot: TradingBotPlan;
  amount: number;
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/10">
      <span className="text-[#A1A1AA]">
        {label}
      </span>

      <span className="font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

export default function DepositSummary({
  bot,
  amount,
}: DepositSummaryProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-6">

      <h2 className="text-2xl font-bold text-white">
        Deposit Summary
      </h2>

      <div className="mt-6 space-y-1">

        <Row
          label="Trading Bot"
          value={bot.name}
        />

        <Row
          label="Investment"
          value={`$${amount.toLocaleString()}`}
        />

        <Row
          label="Daily ROI"
          value={`${bot.expected_daily_roi}%`}
        />

        <Row
          label="Monthly ROI"
          value={`${bot.expected_monthly_roi}%`}
        />

        <Row
          label="Duration"
          value={`${bot.duration_days} Days`}
        />

        <Row
          label="Minimum Investment"
          value={`$${bot.minimum_investment}`}
        />

        <Row
          label="Maximum Investment"
          value={`$${bot.maximum_investment}`}
        />

      </div>
    </div>
  );
}