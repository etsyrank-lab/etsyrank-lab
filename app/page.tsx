import { Faq } from "@/components/landing/Faq";
import { Features, HowItWorks } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { CtaSection, Footer, PricingTeaser } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <PricingTeaser />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
