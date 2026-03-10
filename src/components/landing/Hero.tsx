import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
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

const stats = [
  { target: 200, suffix: "+", label: "Professionals Trained" },
  { target: 94, suffix: "%", label: "Success Rate" },
  // target=49 → divide by 10 to display as "4.9★" rating
  { target: 49, suffix: "", label: "Rating", display: (n: number) => `${(n / 10).toFixed(1)}★` },
] as const;

const Hero = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const c0 = useCountUp(stats[0].target, 1200, statsStarted);
  const c1 = useCountUp(stats[1].target, 1200, statsStarted);
  const c2 = useCountUp(stats[2].target, 1200, statsStarted);
  const counts = [c0, c1, c2];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grain-overlay"
      style={{ backgroundColor: "#0B1A2A" }}
    >
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.3] saturate-[0.7] pointer-events-none"
      />

      {/* Gold light reflection bottom-right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom right, rgba(184,154,90,0.08), transparent 60%)" }}
      />

      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-[0.2] saturate-[0.5] pointer-events-none"
        aria-hidden="true"
        poster="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
      >
        {/* TODO: Replace with 10s cinematic executive boardroom loop */}
        <source src="" type="video/mp4" />
      </video>

      {/* Overlay: navy fade in/out */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, #0B1A2A 0%, transparent 40%, transparent 60%, #0B1A2A 100%)" }}
      />
      {/* Overlay: depth layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(11,26,42,0.95), rgba(11,26,42,0.6))" }}
      />

      {/* Cinematic gold light sweep */}
      <div
        className="absolute inset-y-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, #B89A5A, transparent)",
          width: "40%",
          animation: "hero-light-sweep 10s ease-in-out infinite",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#B89A5A]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 container text-center px-4 py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#B89A5A]/20 bg-[#B89A5A]/5 text-sm text-[#8E96A3] mb-10 tracking-[0.15em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89A5A]" />
              Executive Communication Programme
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-[0.02em] text-[#F4F2ED] mb-6 max-w-5xl mx-auto"
          >
            You will not improve your English.{" "}
            <em className="not-italic text-[#B89A5A]">You will perform with precision.</em>
          </motion.h1>

          {/* Gold divider line */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="w-20 h-0.5 bg-[#B89A5A]" />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xl text-[#F4F2ED]/60 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Executive communication training for professionals who operate under pressure.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="h-12 px-8 bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#C9AB6B] hover:shadow-[0_0_24px_rgba(184,154,90,0.3)] hover:-translate-y-0.5 font-semibold rounded-xl transition-all duration-300"
              asChild
            >
              <Link to="/login">
                Apply for VOICE<sup className="text-[#0B1A2A]">³</sup>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 border border-[#B89A5A]/40 text-[#B89A5A] bg-transparent hover:border-[#B89A5A] hover:bg-[#B89A5A]/5 hover:shadow-[0_0_16px_rgba(184,154,90,0.15)] hover:-translate-y-0.5 rounded-xl transition-all duration-300"
              asChild
            >
              <Link to="/for-companies">For Companies</Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center items-center gap-2 text-sm text-[#8E96A3]">
            <span>200+ Executives Trained</span>
            <span className="text-[#B89A5A]/40">·</span>
            <span>4.9/5 Satisfaction</span>
            <span className="text-[#B89A5A]/40">·</span>
            <span>12 Countries</span>
          </motion.div>

          {/* Animated stats */}
          <div ref={statsRef} className="flex flex-wrap justify-center items-center gap-0 mt-16">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                <div className="px-8 text-center">
                  <p className="font-serif text-3xl md:text-4xl font-semibold text-[#B89A5A]">
                    {"display" in stat
                      ? (stat as typeof stats[2]).display(counts[i])
                      : `${counts[i]}${stat.suffix}`}
                  </p>
                  <p className="text-xs text-[#8E96A3] mt-1 tracking-wider uppercase">{stat.label}</p>
                </div>
                {i < stats.length - 1 && (
                  <div className="w-px h-10 bg-[#B89A5A]/30" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-[#8E96A3]/60"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>

      {/* Gold divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-[#B89A5A]/40 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
