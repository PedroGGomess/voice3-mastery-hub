import { motion } from "framer-motion";

const testimonials = [
  {
    text: "VOICE³ transformed how I communicate in English with international clients. My confidence skyrocketed after just 3 sessions.",
    name: "Ana Rodrigues",
    role: "Head of Sales",
    company: "Lisbon Tech",
    initials: "AR",
    color: "#1a3a5c",
  },
  {
    text: "The AI sessions give me exactly what I need, when I need it. The structured approach to executive communication is unlike anything else.",
    name: "Miguel Santos",
    role: "CFO",
    company: "Porto Ventures",
    initials: "MS",
    color: "#2a1a4a",
  },
  {
    text: "Worth every cent. My team now leads meetings with international partners confidently. The ROI is clear.",
    name: "Carla Mendes",
    role: "CEO",
    company: "Braga Solutions",
    initials: "CM",
    color: "#1a3a2a",
  },
];

const Testimonials = () => {
  return (
    <section style={{ backgroundColor: "#11263A" }} className="py-24 border-t border-[#C9A84C]/10">
      <div className="container px-4">
        <div className="text-center mb-16 fade-up">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#F4F2ED] mb-4">
            What Professionals Say
          </h2>
          <p className="text-[#8E96A3] text-lg">
            Trusted by executives across Portugal and beyond.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={"fade-up d" + (i + 1)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20,
                padding: "40px 32px",
                position: "relative",
                overflow: "hidden",
                transition: "border-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(201,168,76,0.25)";
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.transform = "";
              }}
            >
              {/* Decorative large quote */}
              <span style={{
                position: "absolute", top: 12, left: 20,
                fontSize: 88, fontFamily: "serif", lineHeight: 1,
                color: "rgba(201,168,76,0.12)", userSelect: "none", pointerEvents: "none",
              }}>"</span>

              {/* 5 stars */}
              <div style={{ marginBottom: 16, position: "relative", zIndex: 1 }}>
                {"★★★★★".split("").map((s, j) => (
                  <span key={j} style={{ color: "#C9A84C", fontSize: 14 }}>{s}</span>
                ))}
              </div>

              <p className="text-[#F4F2ED]/80 leading-relaxed text-sm flex-1 relative z-10" style={{ marginBottom: 24 }}>{t.text}</p>

              <div className="flex items-center gap-3 pt-4 border-t border-[#C9A84C]/10">
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: t.color,
                  border: "2px solid rgba(201,168,76,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#C9A84C", fontWeight: 600, fontSize: 13, flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-[#F4F2ED] font-semibold text-sm">{t.name}</p>
                  <p className="text-[#8E96A3] text-xs">{t.role}, {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video testimonial placeholder */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="relative rounded-xl overflow-hidden border border-[#C9A84C]/15 bg-[#0B1A2A] aspect-video flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.3] saturate-[0.5]"
            />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full border-2 border-[#C9A84C]/60 bg-[#C9A84C]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#C9A84C] ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-[#8E96A3] text-xs tracking-widest uppercase">Watch Executive Testimonial</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-px w-full mt-8" style={{ background: "linear-gradient(90deg, transparent, #C9A84C33, transparent)" }} />
    </section>
  );
};

export default Testimonials;
