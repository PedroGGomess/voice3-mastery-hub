import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grain-overlay"
      style={{ backgroundColor: "#0B1A2A" }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#B89A5A]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 container text-center px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Logo badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#B89A5A]/20 bg-[#B89A5A]/5 text-sm text-[#8E96A3] mb-10 tracking-[0.15em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89A5A]" />
            Executive Communication Programme
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] tracking-tight text-[#F4F2ED] mb-8 max-w-5xl mx-auto">
            You will not improve your English.{" "}
            <em className="not-italic text-[#B89A5A]">You will perform with precision.</em>
          </h1>

          <p className="text-xl text-[#F4F2ED]/60 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Executive communication training for professionals who operate under pressure.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold px-10 h-13 text-base rounded-lg shadow-[0_0_30px_rgba(184,154,90,0.25)] transition-all duration-300"
              asChild
            >
              <Link to="/login">
                Apply for VOICE³
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#B89A5A]/40 text-[#F4F2ED] hover:bg-[#B89A5A]/10 hover:border-[#B89A5A]/70 px-10 h-13 text-base rounded-lg"
              asChild
            >
              <a href="#empresas">For Companies</a>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Gold divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-[#B89A5A]/40 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
