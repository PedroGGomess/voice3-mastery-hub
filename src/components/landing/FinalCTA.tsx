import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BusinessMasterModal from "./BusinessMasterModal";

const FinalCTA = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* New CTA section before footer */}
      <section className="fade-up" style={{
        padding: "120px 0",
        textAlign: "center",
        background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)",
        position: "relative",
      }}>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div style={{ width: 60, height: 2, background: "#C9A84C", margin: "0 auto 32px" }} />
            <h2 className="font-serif" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: 16, color: "#F4F2ED" }}>
              Ready to perform with precision?
            </h2>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", maxWidth: 480, margin: "0 auto 40px" }}>
              Join 200+ executives who communicate with authority.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/auth"
                style={{
                  height: 56, padding: "0 44px", fontSize: 16, fontWeight: 700,
                  background: "#C9A84C", color: "#060f1d", borderRadius: 8,
                  border: "none", cursor: "pointer", display: "inline-flex",
                  alignItems: "center", gap: 8, textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.filter = "brightness(1.1)"; el.style.boxShadow = "0 6px 32px rgba(201,168,76,0.4)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.filter = ""; el.style.boxShadow = ""; }}
              >
                Apply for VOICE³ <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  height: 56, padding: "0 44px", fontSize: 16,
                  border: "1px solid rgba(201,168,76,0.4)", background: "transparent",
                  color: "#C9A84C", borderRadius: 8, cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.05)"; e.currentTarget.style.borderColor = "#C9A84C"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; }}
              >
                Contact Sales
              </button>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 16 }}>
              Free diagnostic session included. No commitment required.
            </p>
          </motion.div>
        </div>
      </section>

      <BusinessMasterModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default FinalCTA;
