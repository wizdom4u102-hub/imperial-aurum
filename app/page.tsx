import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Statistics from "@/components/Statistics";
import AboutPreview from "@/components/AboutPreview";
import HowItWorks from "@/components/HowItWorks";
import PlansPreview from "@/components/PlansPreview";
import ReferralPreview from "@/components/ReferralPreview";
import SharedPlanPreview from "@/components/SharedPlanPreview";
import Testimonials from "@/components/Testimonials";
import FaqPreview from "@/components/FaqPreview";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import LiveTicker from "@/components/LiveTicker";
import PaymentSecurity from "@/components/PaymentSecurity";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      <Navbar />

      <Hero />

      <LiveTicker />

      <Statistics />

      <AboutPreview />

      <HowItWorks />

      <PlansPreview />

      <ReferralPreview />

      <SharedPlanPreview />

      <Testimonials />

      <CTA />

      <FaqPreview />

      <PaymentSecurity />


      <Footer />

    </main>
  );
}