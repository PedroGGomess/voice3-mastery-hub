import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
  const proofRef = useRef<HTMLDivElement>(null);
  const [proofStarted, setProofStarted] = useState(false);
  const executives = useCountUp(500, 1400, proofStarted);
  const successRate = useCountUp(94, 1200, proofStarted);
  const rating = useCountUp(49, 1200, proofStarted);
  const countries = useCountUp(12, 1000, proofStarted);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProofStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (proofRef.current) observer.observe(proofRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section
        className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden"
        style={{
          backgroundColor: "var(--bg-base)",
          background: "linear-gradient(180deg, rgba(10,10,15,0.3) 0%, var(--bg-base) 100%)",
        }}
      >
        {/* Radial gold glow background effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(212,168,83,0.12) 0%, rgba(212,168,83,0.04) 35%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-6 md:px-16 py-32 max-w-[860px] mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-[11px] tracking-[0.2em] uppercase font-medium"
              style={{
                border: "1px solid var(--border-gold)",
                color: "var(--gold)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#4CAF50" }} />
              Executive Communication Programme
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mt-10 font-serif leading-[1.15]"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "var(--text-primary)" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            You will not improve your English.{" "}
            <span className="italic" style={{ color: "var(--gold)" }}>
              You will perform with precision.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-8 mx-auto max-w-[600px] leading-[1.7]"
            style={{ color: "var(--text-secondary)", fontSize: "clamp(16px, 1.8vw, 18px)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            The AI-powered communication platform for global executives who must operate under pressure.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <Link
              to="/auth?mode=register"
              className="h-[52px] px-8 font-semibold rounded-md text-base transition-all duration-300 hover:brightness-110 inline-flex items-center justify-center"
              style={{ background: "var(--gold)", color: "#000" }}
            >
              Apply to VOICE³ <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/for-companies"
              className="h-[52px] px-8 rounded-md text-base transition-all duration-300 inline-flex items-center justify-center hover:bg-opacity-10"
              style={{
                border: "1px solid var(--gold)",
                color: "var(--gold)",
                backgroundColor: "transparent",
              }}
            >
              For Companies
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF BAR ═══ */}
      <div
        ref={proofRef}
        className="flex flex-wrap justify-center gap-16 md:gap-20 py-10 md:py-12 px-6"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderTop: "1px solid var(--border-gold)",
          borderBottom: "1px solid var(--border-gold)",
        }}
      >
        {[
          { value: `${executives}+`, label: "Executives Trained" },
          { value: `${successRate}%`, label: "Success Rate" },
          { value: `${(rating / 10).toFixed(1)}★`, label: "Average Rating" },
          { value: `${countries}+`, label: "Countries" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-serif text-4xl font-bold" style={{ color: "var(--gold)" }}>
              {stat.value}
            </p>
            <p className="mt-1 text-[13px] uppercase tracking-[0.1em]" style={{ color: "var(--text-secondary)" }}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default Hero;
