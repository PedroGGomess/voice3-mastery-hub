import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const stats = [
  { value: 94, suffix: "%", label: "Session completion rate" },
  { value: 200, suffix: "+", label: "Executives trained" },
  { value: 4.9, suffix: "/5", label: "Average satisfaction" },
  { value: 87, suffix: "%", label: "Report measurable improvement within 4 weeks" },
];

const testimonials = [
  {
    quote: "VOICE³ transformed how I present in board meetings. My confidence is at a different level.",
    name: "Ricardo Almeida",
    position: "CFO",
    company: "Grupo Horizonte",
  },
  {
    quote: "The structured approach made the difference. I negotiated a €2M deal entirely in English.",
    name: "Catarina Ferreira",
    position: "Sales Director",
    company: "NovaTech Solutions",
  },
  {
    quote: "Worth every euro. My team now leads international calls with authority.",
    name: "Miguel Santos",
    position: "CEO",
    company: "Atlantic Ventures",
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(parseFloat(current.toFixed(1)));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {Number.isInteger(value) ? Math.round(count) : count.toFixed(1)}{suffix}
    </span>
  );
}

const SocialProof = () => {
  return (
    <section className="py-28" style={{ backgroundColor: "#1C1F26" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">Results</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#F4F2ED]">Measurable Results</h2>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 bg-[#0B1A2A] rounded-xl border border-[#B89A5A]/10"
            >
              <div className="font-serif text-4xl font-bold text-[#B89A5A] mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-[#8E96A3] text-sm leading-tight">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0B1A2A] rounded-xl p-7 border border-[#B89A5A]/10 flex flex-col"
            >
              <div className="text-[#B89A5A] font-serif text-6xl leading-none mb-4 opacity-60">"</div>
              <p className="text-[#F4F2ED]/80 italic leading-relaxed flex-1 mb-6">"{t.quote}"</p>
              <div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-[#B89A5A] text-[#B89A5A]" />
                  ))}
                </div>
                <p className="font-semibold text-[#F4F2ED] text-sm">{t.name}</p>
                <p className="text-[#8E96A3] text-xs">{t.position}, {t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
