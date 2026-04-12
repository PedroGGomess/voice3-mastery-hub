import { motion } from "framer-motion";

const testimonials = [
  {
    text: "Nas apresentações ao board, mudei completamente a minha abordagem. Agora transmito confiança e autoridade. VOICE³ acelerou tudo.",
    name: "Thomas K.",
    role: "CFO",
    company: "Global Tech",
    location: "Berlin",
    initials: "TK",
    color: "#1a3a5c",
  },
  {
    text: "Fechei uma deal de €2M depois de usar VOICE³. O feedback em tempo real sobre o meu tom fez toda a diferença na negociação.",
    name: "Sofia M.",
    role: "Sales Director",
    company: "Enterprise SaaS",
    location: "Milan",
    initials: "SM",
    color: "#2a1a4a",
  },
  {
    text: "Liderança de equipas internacionais exige presença vocal. VOICE³ transformou como eu sou percebido em calls globais.",
    name: "Henrik L.",
    role: "CEO",
    company: "International Ventures",
    location: "Stockholm",
    initials: "HL",
    color: "#1a3a2a",
  },
];

const Testimonials = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ backgroundColor: "#0A0A0F" }}
      id="resultados"
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 40% 60%, rgba(212, 168, 83, 0.06) 0%, transparent 65%)",
        }}
      />

      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p
            className="tracking-[0.2em] uppercase text-sm mb-6 font-medium"
            style={{ color: "#D4A853" }}
          >
            08 — RESULTADOS
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl font-semibold mb-6"
            style={{ color: "#F5F5F5" }}
          >
            Resultados Mensuráveis.{" "}
            <span style={{ color: "#D4A853" }}>Transformações Reais.</span>
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "#9A9AB0" }}>
            87% dos participantes reportam melhoria mensurável em 4 semanas.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
              className="group relative"
            >
              <div
                className="relative h-full rounded-lg p-8 backdrop-blur-sm transition-all duration-300 overflow-hidden"
                style={{
                  backgroundColor: "#12121A",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212, 168, 83, 0.3)";
                  e.currentTarget.style.boxShadow =
                    "0 0 24px rgba(212, 168, 83, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Gold left accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
                  style={{ background: "#D4A853" }}
                />

                {/* Decorative quote mark */}
                <svg
                  className="absolute top-6 right-6 h-12 w-12 opacity-[0.08]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "#D4A853" }}
                >
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5m0 0c-4.287 0-7 4-7 8v10c0 5 2 8 6 8" />
                </svg>

                {/* Star rating */}
                <div className="relative z-10 mb-6 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: "#D4A853", fontSize: 14 }}>
                      ★
                    </span>
                  ))}
                </div>

                {/* Testimonial text */}
                <p
                  className="text-sm leading-relaxed relative z-10 mb-8"
                  style={{ color: "rgba(245, 245, 245, 0.85)" }}
                >
                  "{testimonial.text}"
                </p>

                {/* Author info */}
                <div
                  className="relative z-10 pt-6 border-t"
                  style={{ borderColor: "rgba(212, 168, 83, 0.1)" }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm"
                      style={{
                        backgroundColor: testimonial.color,
                        border: "2px solid rgba(212, 168, 83, 0.3)",
                        color: "#D4A853",
                      }}
                    >
                      {testimonial.initials}
                    </div>
                    <div>
                      <p
                        className="font-serif font-semibold"
                        style={{ color: "#F5F5F5" }}
                      >
                        {testimonial.name}
                      </p>
                      <p className="text-xs" style={{ color: "#9A9AB0" }}>
                        {testimonial.role}, {testimonial.company}
                      </p>
                      <p className="text-xs" style={{ color: "#9A9AB0" }}>
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Video testimonial placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div
            className="relative rounded-lg overflow-hidden aspect-video flex items-center justify-center group cursor-pointer"
            style={{
              backgroundColor: "#12121A",
              border: "1px solid rgba(212, 168, 83, 0.15)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
              alt="Video testimonial"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.25] saturate-[0.4] group-hover:brightness-[0.35] transition-all duration-300"
            />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{
                  border: "2px solid #D4A853",
                  backgroundColor: "rgba(212, 168, 83, 0.08)",
                }}
                whileHover={{ scale: 1.1 }}
              >
                <svg
                  className="w-7 h-7 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "#D4A853" }}
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
              <p
                className="text-xs tracking-widest uppercase font-medium"
                style={{ color: "#9A9AB0" }}
              >
                Ver Testemunho Executivo
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div
        className="h-px w-full mt-20"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.2), transparent)",
        }}
      />
    </section>
  );
};

export default Testimonials;
