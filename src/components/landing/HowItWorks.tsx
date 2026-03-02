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
    <section className="py-28" style={{ backgroundColor: "#0B1A2A" }} id="como-funciona">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">Process</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#F4F2ED]">How It Works</h2>
        </motion.div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block relative">
          {/* Connector line */}
          <div className="absolute top-[2.25rem] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#B89A5A]/20 via-[#B89A5A]/40 to-[#B89A5A]/20" />

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Gold dot on timeline */}
                <div className="relative z-10 w-[4.5rem] h-[4.5rem] rounded-full bg-[#1C1F26] border-2 border-[#B89A5A]/40 flex items-center justify-center mb-6 group-hover:border-[#B89A5A] transition-colors">
                  <step.icon className="h-6 w-6 text-[#B89A5A]" />
                </div>
                <div className="text-[#B89A5A]/30 text-5xl font-serif font-bold absolute top-16 opacity-20 select-none">{step.number}</div>
                <h3 className="font-serif text-lg font-semibold text-[#F4F2ED] mb-2 mt-2">{step.title}</h3>
                <p className="text-sm text-[#8E96A3] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
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
              className="flex gap-5 items-start bg-[#1C1F26] rounded-xl p-5 border border-[#B89A5A]/10"
            >
              <div className="w-12 h-12 shrink-0 rounded-full bg-[#0B1A2A] border border-[#B89A5A]/40 flex items-center justify-center">
                <step.icon className="h-5 w-5 text-[#B89A5A]" />
              </div>
              <div>
                <p className="text-[#B89A5A]/60 text-xs font-medium mb-1">{step.number}</p>
                <h3 className="font-serif text-base font-semibold text-[#F4F2ED] mb-1">{step.title}</h3>
                <p className="text-sm text-[#8E96A3]">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
