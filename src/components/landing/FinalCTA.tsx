import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BusinessMasterModal from "./BusinessMasterModal";

const FinalCTA = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="fade-up" style={{
        padding: "120px 0", textAlign: "center",
        background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)",
        position: "relative",
      }}>
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
            <div style={{ width: 60, height: 2, background: "#C9A84C", margin: "0 auto 32px" }} />
            <h2 className="font-serif" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: 16, color: "#F4F2ED" }}>
              Pronto para actuar com precisão?
            </h2>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", maxWidth: 480, margin: "0 auto 40px" }}>
              Junta-te a 200+ executivos que comunicam com autoridade.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth?mode=register" style={{
                height: 56, padding: "0 44px", fontSize: 16, fontWeight: 700,
                background: "#C9A84C", color: "#060f1d", borderRadius: 12,
                border: "none", cursor: "pointer", display: "inline-flex",
                alignItems: "center", gap: 8, textDecoration: "none", transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.boxShadow = "0 6px 32px rgba(201,168,76,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}>
                Criar Conta <ArrowRight className="h-4 w-4" />
              </Link>
              <button onClick={() => setModalOpen(true)} style={{
                height: 56, padding: "0 44px", fontSize: 16,
                border: "1px solid rgba(201,168,76,0.4)", background: "transparent",
                color: "#C9A84C", borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.05)"; e.currentTarget.style.borderColor = "#C9A84C"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; }}>
                Falar com Comercial
              </button>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 16 }}>
              Sessão de diagnóstico gratuita incluída. Sem compromisso.
            </p>
          </motion.div>
        </div>
      </section>
      <BusinessMasterModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default FinalCTA;
