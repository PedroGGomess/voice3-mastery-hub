import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Packs from "@/components/landing/Packs";
import WhatYouLearn from "@/components/landing/WhatYouLearn";
import SessionFormats from "@/components/landing/SessionFormats";
import ForCompanies from "@/components/landing/ForCompanies";
import SocialProof from "@/components/landing/SocialProof";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
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
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
