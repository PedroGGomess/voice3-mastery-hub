import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  { target: 200, suffix: "+", labelKey: "hero.stat1" },
  { target: 94, suffix: "%", labelKey: "hero.stat2" },
  { target: 49, suffix: "", labelKey: "hero.stat3", display: (n: number) => `${(n / 10).toFixed(1)}★` },
] as const;

const Hero = () => {
  const { t } = useTranslation();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const c0 = useCountUp(stats[0].target, 1200, statsStarted);
  const c1 = useCountUp(stats[1].target, 1200, statsStarted);
  const c2 = useCountUp(stats[2].target, 1200, statsStarted);
  const counts = [c0, c1, c2];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true);
          observer.disconnect();
        }
      },
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
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.3] saturate-[0.7] pointer-events-none"
      />

      {/* Gold light reflection */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom right, hsla(var(--primary) / 0.08), transparent 60%)" }}
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
        <source src="" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, transparent 40%, transparent 60%, hsl(var(--background)) 100%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, hsla(var(--background) / 0.95), hsla(var(--background) / 0.6))" }}
      />

      {/* Gold light sweep */}
      <div
        className="absolute inset-y-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)",
          width: "40%",
          animation: "hero-light-sweep 10s ease-in-out infinite",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ background: "hsla(var(--primary) / 0.05)" }} />
      </div>

      <div className="relative z-10 container text-center px-4 py-32">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm text-muted-foreground mb-10 tracking-[0.15em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {t("hero.badge")}
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-[0.02em] text-foreground mb-6 max-w-5xl mx-auto"
          >
            {t("hero.h1a")}{" "}
            <em className="not-italic text-primary">{t("hero.h1b")}</em>
          </motion.h1>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="w-20 h-0.5 bg-primary" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-foreground/60 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            {t("hero.sub")}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_24px_hsla(var(--primary)/0.3)] hover:-translate-y-0.5 font-semibold rounded-xl transition-all duration-300"
              asChild
            >
              <Link to="/login">
                {t("hero.cta1")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 border border-primary/40 text-primary bg-transparent hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 rounded-xl transition-all duration-300"
              asChild
            >
              <Link to="/for-companies">{t("hero.cta2")}</Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center items-center gap-2 text-sm text-muted-foreground">
            <span>{t("hero.stat1")}</span>
            <span className="text-primary/40">·</span>
            <span>{t("hero.stat3")}</span>
            <span className="text-primary/40">·</span>
            <span>{t("hero.stat4")}</span>
          </motion.div>

          {/* Animated stats */}
          <div ref={statsRef} className="flex flex-wrap justify-center items-center gap-0 mt-16">
            {stats.map((stat, i) => (
              <div key={stat.labelKey} className="flex items-center">
                <div className="px-8 text-center">
                  <p className="font-serif text-3xl md:text-4xl font-semibold text-primary">
                    {"display" in stat
                      ? (stat as typeof stats[2]).display(counts[i])
                      : `${counts[i]}${stat.suffix}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
                    {t(stat.labelKey).replace(/^[\d+%★.\s]+/, "")}
                  </p>
                </div>
                {i < stats.length - 1 && <div className="w-px h-10 bg-primary/30" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-muted-foreground/60"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
