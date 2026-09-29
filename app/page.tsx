import { Features, HowItWorks } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { Footer, PricingTeaser } from "@/components/landing/Pricing";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <PricingTeaser />
      </main>
      <Footer />
    </div>
  );
}
