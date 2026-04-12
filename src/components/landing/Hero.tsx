import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Shield, Target, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

function useCountUp(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target, duration]);
  return count;
}

const Hero = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const executives = useCountUp(500, 1400, statsStarted);
  const successRate = useCountUp(94, 1200, statsStarted);
  const rating = useCountUp(49, 1200, statsStarted);
  const countries = useCountUp(12, 1000, statsStarted);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: "linear-gradient(180deg, #060911 0%, #0a1628 40%, #0d1117 100%)" }}>
      {/* ═══ Ambient lighting ═══ */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(201,168,76,0.06), transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 50% at 80% 90%, rgba(36,58,90,0.2), transparent 50%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 40% 40% at 10% 70%, rgba(201,168,76,0.03), transparent 50%)" }} />
      </div>

      {/* Fine grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.015]" aria-hidden="true">
        <defs>
          <pattern id="hero-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0H0V60" stroke="#C9A84C" strokeWidth="0.3" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Floating gold particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              background: "#C9A84C",
              left: `${8 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              opacity: 0.08,
            }}
            animate={{ y: [-20, 20, -20], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* ═══ Content ═══ */}
      <div className="relative z-10 container text-center px-6 py-32 max-w-6xl mx-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">

          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[11px] tracking-[0.2em] uppercase mb-12 backdrop-blur-sm"
              style={{ border: "1px solid rgba(201,168,76,0.15)", background: "rgba(201,168,76,0.04)", color: "rgba(201,168,76,0.7)" }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C9A84C]" />
              </span>
              Executive Communication Performance
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="font-serif leading-[1.05] tracking-[0.01em] text-[#F4F2ED] mb-6 max-w-5xl mx-auto"
            style={{ fontSize: "clamp(40px, 6vw, 86px)", fontWeight: 600 }}>
            Tu não vais{" "}
            <em className="not-italic" style={{ color: "#8E96A3" }}>melhorar</em>{" "}
            o teu inglês.
            <br />
            Vais{" "}
            <span className="relative inline-block">
              <em className="not-italic" style={{
                background: "linear-gradient(135deg, #C9A84C, #E8C97A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                performar com precisão.
              </em>
              <motion.span
                className="absolute -bottom-1 left-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, #C9A84C, transparent)" }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
              />
            </span>
          </motion.h1>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="w-20 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }} />
          </motion.div>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-[#8E96A3] max-w-2xl mx-auto mb-14 leading-relaxed font-light"
            style={{ fontSize: "clamp(16px, 2vw, 21px)" }}>
            O primeiro programa de performance em comunicação executiva em inglês.
            <br className="hidden md:block" />
            Treino com IA. Coaching ao vivo. Resultados que se medem.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-6">
            <Button
              size="lg"
              className="h-14 px-10 font-semibold rounded-xl text-base transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,168,76,0.3)] hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, #C9A84C, #d4b56a)", color: "#0a0a0f", border: "none" }}
              asChild
            >
              <Link to="/auth?mode=register">
                Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-10 rounded-xl text-base backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
              style={{ borderColor: "rgba(201,168,76,0.3)", color: "#C9A84C", background: "transparent" }}
              asChild
            >
              <Link to="/for-companies">Para Empresas</Link>
            </Button>
          </motion.div>

          {/* Trust line */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-4 text-[13px] text-[#8E96A3]/60 mb-20">
            <span className="flex items-center gap-1.5"><span style={{ color: "#C9A84C" }}>★★★★★</span> 4.9/5</span>
            <span style={{ color: "rgba(201,168,76,0.2)" }}>·</span>
            <span>500+ executivos</span>
            <span style={{ color: "rgba(201,168,76,0.2)" }}>·</span>
            <span>94% taxa de sucesso</span>
            <span style={{ color: "rgba(201,168,76,0.2)" }}>·</span>
            <span>12+ países</span>
          </motion.div>

          {/* Stats with icons */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            {[
              { icon: Target, value: `${executives}+`, label: "Executivos Treinados" },
              { icon: Zap, value: `${successRate}%`, label: "Taxa de Sucesso" },
              { icon: Shield, value: `${(rating / 10).toFixed(1)}★`, label: "Avaliação Média" },
              { icon: Globe, value: `${countries}+`, label: "Países" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsStarted ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center p-6 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <stat.icon className="h-5 w-5 mx-auto mb-3" style={{ color: "rgba(201,168,76,0.5)" }} />
                <p className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: "#C9A84C" }}>{stat.value}</p>
                <p className="text-[11px] text-[#8E96A3]/50 mt-2 tracking-[0.1em] uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Company logos */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-10">
            {["GALP", "NOS", "EDP", "MILLENNIUM", "SONAE", "DELOITTE"].map(name => (
              <span
                key={name}
                className="text-[11px] tracking-[0.2em] font-semibold transition-colors duration-300"
                style={{ color: "rgba(244,242,237,0.08)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(244,242,237,0.2)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(244,242,237,0.08)")}
              >
                {name}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ color: "rgba(142,150,163,0.25)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <span className="text-[9px] tracking-[0.25em] uppercase">Explorar</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)" }} />
      </div>
    </section>
  );
};

export default Hero;
