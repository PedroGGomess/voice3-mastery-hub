import { motion } from "framer-motion";
import { Search, Brain, GraduationCap, Award } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Pre-Session Diagnostic",
    desc: "Precision assessment of your current performance level",
    number: "01",
  },
  {
    icon: Brain,
    title: "AI-Powered Sessions",
    desc: "Structured modules with video, audio, and interactive exercises",
    number: "02",
  },
  {
    icon: GraduationCap,
    title: "Live Professor Sessions",
    desc: "1-on-1 with specialist professors for targeted correction",
    number: "03",
  },
  {
    icon: Award,
    title: "Certification",
    desc: "VOICE³ Executive Communication Certificate",
    number: "04",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-28 fade-up" style={{ backgroundColor: "#11263A" }} id="como-funciona">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-sm mb-4 font-medium">Process</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#F4F2ED]">How It Works</h2>
        </motion.div>

        {/* Desktop: horizontal cards */}
        <div className="hidden md:grid grid-cols-4 gap-6 relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={"fade-up d" + (i + 1) + " relative group"}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "36px 28px",
                overflow: "hidden",
                transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(201,168,76,0.25)";
                el.style.transform = "translateY(-5px)";
                el.style.boxShadow = "0 16px 48px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.transform = "";
                el.style.boxShadow = "";
              }}
            >
              {/* Large background number */}
              <span style={{
                position: "absolute", top: -16, right: 16,
                fontSize: 96, fontFamily: "serif", fontWeight: 800,
                color: "rgba(201,168,76,0.05)", lineHeight: 1, userSelect: "none",
                pointerEvents: "none",
              }}>{step.number}</span>

              {/* Icon */}
              <div className="relative z-10 w-12 h-12 rounded-full border border-[#C9A84C]/40 flex items-center justify-center mb-5 group-hover:border-[#C9A84C] transition-colors"
                style={{ background: "rgba(201,168,76,0.06)" }}>
                <step.icon className="h-5 w-5 text-[#C9A84C]" />
              </div>

              <p className="text-[#C9A84C]/50 text-xs font-medium mb-2 relative z-10">{step.number}</p>
              <h3 className="font-serif text-lg font-semibold text-[#F4F2ED] mb-2 relative z-10">{step.title}</h3>
              <p className="text-sm text-[#8E96A3] leading-relaxed relative z-10">{step.desc}</p>

              {/* Connector line (except last card) */}
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute", top: 48, left: "calc(100% + 12px)",
                  width: 24, height: 1,
                  background: "rgba(201,168,76,0.2)",
                  borderTop: "1px dashed rgba(201,168,76,0.3)",
                }} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-5 items-start rounded-xl p-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="w-12 h-12 shrink-0 rounded-full border border-[#C9A84C]/40 flex items-center justify-center"
                style={{ background: "rgba(201,168,76,0.06)" }}>
                <step.icon className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-[#C9A84C]/60 text-xs font-medium mb-1">{step.number}</p>
                <h3 className="font-serif text-base font-semibold text-[#F4F2ED] mb-1">{step.title}</h3>
                <p className="text-sm text-[#8E96A3]">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="h-px w-full mt-8" style={{ background: "linear-gradient(90deg, transparent, #C9A84C33, transparent)" }} />
    </section>
  );
};

export default HowItWorks;
