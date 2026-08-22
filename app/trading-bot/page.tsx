import TradingBotHero from "@/components/trading-bot/TradingBotHero";
import TradingBotOverview from "@/components/trading-bot/TradingBotOverview";
import TradingBotFeatures from "@/components/trading-bot/TradingBotFeatures";
import TradingBotPlans from "@/components/trading-bot/TradingBotPlans";
import TradingBotBenefits from "@/components/trading-bot/TradingBotBenefits";
import TradingBotComparison from "@/components/trading-bot/TradingBotComparison";
import TradingBotFAQ from "@/components/trading-bot/TradingBotFAQ";
import TradingBotCTA from "@/components/trading-bot/TradingBotCTA";
import Footer from "@/components/Footer";

export default function TradingBotPage() {
  return (
    <main className="overflow-x-hidden bg-black text-white">

      {/* Hero */}
      <TradingBotHero />

      {/* What Is Our AI Trading Bot */}
      <TradingBotOverview />

      {/* Bot Features */}
      <TradingBotFeatures />

      {/* Trading Bot Marketplace / Plans */}
      <TradingBotPlans />

      {/* Benefits */}
      <TradingBotBenefits />

      {/* Compare Bot Plans */}
      <TradingBotComparison />

      {/* FAQ */}
      <TradingBotFAQ />

      {/* Call To Action */}
      <TradingBotCTA />

      {/* Footer */}
      <Footer />

    </main>
  );
}