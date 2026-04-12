import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import WhatYouLearn from "@/components/landing/WhatYouLearn";
import HowItWorks from "@/components/landing/HowItWorks";
import SessionFormats from "@/components/landing/SessionFormats";
import ForCompanies from "@/components/landing/ForCompanies";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0F", color: "#F5F5F5" }}>
      <Navbar />
      <main>
        {/* 01 — HERO + SOCIAL PROOF BAR */}
        <Hero />

        {/* 02 — COMPANY LOGOS */}
        <SocialProof />

        {/* 03 — PAIN & PROMISE + METHOD */}
        <WhatYouLearn />

        {/* 05 — HOW IT WORKS (4 steps) */}
        <HowItWorks />

        {/* 06 — FEATURES */}
        <SessionFormats />

        {/* 07 — FOR COMPANIES */}
        <ForCompanies />

        {/* 08 — TESTIMONIALS */}
        <Testimonials />

        {/* 09 — FAQ */}
        <FAQ />

        {/* 10 — FINAL CTA */}
        <FinalCTA />
      </main>
      <Footer />
      <ChatWidget />

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Voltar ao topo"
          className="fixed bottom-8 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:brightness-110"
          style={{ background: "#D4A853", color: "#0A0A0F" }}
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Index;
