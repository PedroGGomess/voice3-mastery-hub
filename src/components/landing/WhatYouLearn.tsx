import { motion } from "framer-motion";
import { Target, Shield, Zap } from "lucide-react";

const pillars = [
  {
    number: "01",
    name: "CLARITY",
    icon: Target,
    desc: "Position your message with absolute precision. Eliminate ambiguity. Speak so that every word carries weight.",
  },
  {
    number: "02",
    name: "CONTROL",
    icon: Shield,
    desc: "Justify your argument with structured authority. Command the room with composure and strategic language.",
  },
  {
    number: "03",
    name: "COMMAND",
    icon: Zap,
    desc: "Close with impact and executive presence. Drive outcomes through confident, decisive communication.",
  },
];

const WhatYouLearn = () => {
  return (
    <section className="py-28" style={{ backgroundColor: "#1C1F26" }} id="metodo">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">Methodology</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#F4F2ED]">The VOICE³ Method</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative overflow-hidden rounded-xl p-8 bg-[#0B1A2A] border-t-2 border-[#B89A5A] border-x border-b border-x-[#B89A5A]/10 border-b-[#B89A5A]/10 group hover:border-t-[#B89A5A] transition-all duration-300"
            >
              {/* Large bg number */}
              <div className="absolute -bottom-4 -right-2 font-serif text-[8rem] font-bold leading-none text-[#B89A5A]/5 select-none pointer-events-none">
                {pillar.number}
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center mb-6 group-hover:bg-[#B89A5A]/20 transition-colors">
                  <pillar.icon className="h-6 w-6 text-[#B89A5A]" />
                </div>
                <p className="text-[#B89A5A]/50 text-xs tracking-[0.2em] uppercase font-medium mb-2">{pillar.number}</p>
                <h3 className="font-serif text-3xl font-semibold text-[#F4F2ED] mb-4 tracking-wide">{pillar.name}</h3>
                <p className="text-[#8E96A3] leading-relaxed">{pillar.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouLearn;
