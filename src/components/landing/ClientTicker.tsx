import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const companies = ["GALP", "NOS", "EDP", "SONAE", "MILLENNIUM BCP", "CTT", "ALTICE", "SIEMENS", "DELOITTE", "EY"];

const ClientTicker = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-12 overflow-hidden border-y" style={{ borderColor: "hsla(var(--primary) / 0.1)", background: "hsla(var(--background))" }}>
      <p className="text-center text-[10px] tracking-[0.25em] uppercase mb-8 font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
        {t("clients.trusted")}
      </p>
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-16 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...companies, ...companies].map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="text-sm tracking-[0.2em] uppercase font-semibold shrink-0"
              style={{ color: "hsla(var(--primary) / 0.4)" }}
            >
              {c}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientTicker;
