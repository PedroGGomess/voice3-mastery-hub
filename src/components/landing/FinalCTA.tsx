import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section
      className="py-32 text-center relative"
      style={{
        backgroundColor: "#0A0A0F",
        background: "linear-gradient(180deg, #0A0A0F 0%, rgba(212, 168, 83, 0.05) 100%)",
      }}
    >
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="w-12 h-0.5 bg-[#D4A853] mx-auto mb-8" />

          <h2
            className="font-serif text-4xl md:text-5xl font-semibold text-[#F5F5F5] mb-6"
          >
            Pronto para Comandar Qualquer Sala?
          </h2>

          <p
            className="font-serif italic text-xl text-[#D4A853] mb-10"
          >
            Clarity. Control. Command.
          </p>

          <p className="text-[#9A9AB0] text-lg mb-12 max-w-2xl mx-auto">
            Junta-te aos líderes que dominam qualquer espaço com confiança e precisão.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/candidatar"
              className="h-14 px-10 bg-[#D4A853] text-[#0A0A0F] hover:bg-[#E8C97A] hover:shadow-[0_0_32px_rgba(212,168,83,0.4)] hover:-translate-y-0.5 font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center"
            >
              Candidatar-me ao VOICE³ →
            </Link>

            <Link
              to="/falar-equipa"
              className="h-14 px-10 border border-[#D4A853]/40 text-[#D4A853] bg-transparent hover:border-[#D4A853] hover:bg-[#D4A853]/5 hover:shadow-[0_0_20px_rgba(212,168,83,0.2)] hover:-translate-y-0.5 rounded-lg transition-all duration-300 inline-flex items-center justify-center font-semibold"
            >
              Falar com a Equipa
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
