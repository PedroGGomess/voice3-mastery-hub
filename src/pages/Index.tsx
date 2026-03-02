import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Packs from "@/components/landing/Packs";
import WhatYouLearn from "@/components/landing/WhatYouLearn";
import SessionFormats from "@/components/landing/SessionFormats";
import ForCompanies from "@/components/landing/ForCompanies";
import SocialProof from "@/components/landing/SocialProof";
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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Packs />
        <WhatYouLearn />
        <SessionFormats />
        <ForCompanies />
        <SocialProof />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <ChatWidget />

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-8 right-6 z-50 w-11 h-11 rounded-full bg-[#B89A5A] text-[#0B1A2A] flex items-center justify-center shadow-lg hover:bg-[#d4ba6a] transition-colors duration-200"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Index;
