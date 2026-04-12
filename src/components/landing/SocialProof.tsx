import { motion } from "framer-motion";

const companies = ["GALP", "NOS", "EDP", "MILLENNIUM BCP", "SONAE", "DELOITTE"];

const SocialProof = () => {
  return (
    <section
      className="py-20"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p
            className="tracking-[0.2em] uppercase text-sm font-medium"
            style={{ color: "var(--gold)" }}
          >
            COMPANIES THAT TRUST VOICE³
          </p>
        </motion.div>

        {/* Companies Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-12 md:gap-16"
        >
          {companies.map((company, index) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <p
                className="font-semibold text-lg tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                {company}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Section divider */}
      <div
        className="h-px w-full mt-12"
        style={{ background: "linear-gradient(90deg, transparent, var(--border-gold), transparent)" }}
      />
    </section>
  );
};

export default SocialProof;
