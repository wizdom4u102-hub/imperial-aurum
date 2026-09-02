import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutPreview from "@/components/AboutPreview";
import HowItWorks from "@/components/HowItWorks";
import PlansPreview from "@/components/PlansPreview";
import ReferralPreview from "@/components/ReferralPreview";
import SharedPlanPreview from "@/components/SharedPlanPreview";
import Testimonials from "@/components/Testimonials";
import FaqPreview from "@/components/FaqPreview";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import PaymentSecurity from "@/components/PaymentSecurity";
import TeamMembers from "@/components/TeamMembers";
import BlogPreview from "@/components/BlogPreview";
import LiveChat from "@/components/LiveChat";
import TradingBotPreview from "@/components/TradingBotPreview";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      <Navbar />

      <Hero />
      
      <AboutPreview />

      <HowItWorks />

      <PlansPreview />

      <TradingBotPreview />

      <ReferralPreview />

      <SharedPlanPreview />

      <Testimonials />

      <TeamMembers />

      <BlogPreview />

      <CTA />

      <FaqPreview />

      <PaymentSecurity />
      
      <LiveChat />


      <Footer />

    </main>
  );
}