import PlansHero from "@/components/plans/PlansHero";
import Statistics from "@/components/Statistics";
import FreePlan from "@/components/plans/FreePlan";
import PremiumPlan from "@/components/plans/PremiumPlan";
import SharedPlan from "@/components/plans/SharedPlan";
import PlanComparison from "@/components/plans/PlanComparison";
import PlanFAQ from "@/components/plans/PlanFAQ";
import PlansCTA from "@/components/plans/PlansCTA";
import Footer from "@/components/Footer";


export default function PlansPage() {
  return (
    <main className="bg-black text-white overflow-x-hidden">

        

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