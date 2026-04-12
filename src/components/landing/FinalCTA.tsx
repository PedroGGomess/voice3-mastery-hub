import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section
      className="py-32 text-center relative"
      style={{
        backgroundColor: "var(--bg-base)",
        background: "linear-gradient(180deg, var(--bg-base) 0%, rgba(212, 168, 83, 0.05) 100%)",
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
          <div className="w-12 h-0.5 mx-auto mb-8" style={{ background: "var(--gold)" }} />

          <h2
            className="font-serif text-4xl md:text-5xl font-semibold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Designed for professionals who must perform.
          </h2>

          <p
            className="font-serif italic text-xl mb-10"
            style={{ color: "var(--gold)" }}
          >
            Clarity. Control. Command.
          </p>

          <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Join executives who command any space with confidence and precision.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/auth?mode=register"
              className="h-14 px-10 text-[#0A0A0F] hover:shadow-[0_0_32px_rgba(212,168,83,0.4)] hover:-translate-y-0.5 font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center"
              style={{ background: "var(--gold)" }}
            >
              Apply Now →
            </Link>

            <Link
              to="/for-companies"
              className="h-14 px-10 bg-transparent hover:shadow-[0_0_20px_rgba(212,168,83,0.2)] hover:-translate-y-0.5 rounded-lg transition-all duration-300 inline-flex items-center justify-center font-semibold"
              style={{
                border: "1px solid var(--border-gold)",
                color: "var(--gold)",
              }}
            >
              For Teams
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
