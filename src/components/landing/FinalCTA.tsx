import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BusinessMasterModal from "./BusinessMasterModal";

const FinalCTA = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="relative py-28 overflow-hidden" style={{ backgroundColor: "#0B1A2A" }}>
      {/* Gold top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B89A5A]/50 to-transparent" />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#B89A5A]/5 blur-[100px]" />
      </div>

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-[#F4F2ED] mb-6 leading-tight">
            Designed for professionals who must perform.
          </h2>
          <p className="text-[#B89A5A] text-xl font-serif italic mb-12 tracking-wide">
            Clarity. Control. Command.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold px-10 h-13 text-base rounded-lg shadow-[0_0_30px_rgba(184,154,90,0.2)] transition-all duration-300"
              asChild
            >
              <Link to="/login">
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setModalOpen(true)}
              className="border-[#B89A5A]/40 text-[#F4F2ED] hover:bg-[#B89A5A]/10 hover:border-[#B89A5A]/70 px-10 h-13 text-base rounded-lg"
            >
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </div>

      <BusinessMasterModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};

export default FinalCTA;
