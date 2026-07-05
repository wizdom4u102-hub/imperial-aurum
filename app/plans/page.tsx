import PlansHero from "@/components/plans/PlansHero";
import Statistics from "@/components/Statistics";
import FreePlan from "@/components/plans/FreePlan";
import PremiumPlan from "@/components/plans/PremiumPlan";
import SharedPlan from "@/components/plans/SharedPlan";
import PlanComparison from "@/components/plans/PlanComparison";
import PlanFAQ from "@/components/plans/PlanFAQ";
import PlansCTA from "@/components/plans/PlansCTA";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function PlansPage() {
  return (
    <main className="bg-black text-white overflow-x-hidden">

        <Link href="/" className="flex items-center gap-4">
        
          <Image
            src="/images/logo.png"
            alt="Imperial Aurum"
            width={65}
            height={65}
            className="object-contain"
          />
        
          <div className="leading-none">
        
            <h1 className="text-3xl font-bold text-yellow-400 tracking-wide">
              Imperial Aurum
            </h1>
        
            <p className="text-sm uppercase tracking-[8px] text-yellow-300">
              Mining
            </p>
        
          </div>
        
        </Link>

      {/* Hero */}
      <PlansHero />

      {/* Company Statistics */}
      <Statistics />

      {/* Free Plan */}
      <FreePlan />

      {/* Premium Plan */}
      <PremiumPlan />

      {/* Shared Plan */}
      <SharedPlan />

      {/* Comparison Table */}
      <PlanComparison />

      {/* FAQ */}
      <PlanFAQ />

      {/* Call To Action */}
      <PlansCTA />

      {/* Footer */}
      <Footer />

    </main>
  );
}