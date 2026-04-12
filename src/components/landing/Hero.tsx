import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,168,76,0.08), transparent 70%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(36,58,90,0.3), transparent 60%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 50% 50% at 20% 60%, rgba(201,168,76,0.04), transparent 50%)"
        }} />
      </div>

      {/* Geometric pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" aria-hidden="true">
        <defs>
          <pattern id="hero-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M80 0L0 80M40 0L0 40M80 40L40 80" stroke="#C9A84C" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Gold light sweep */}
      <div
        className="absolute inset-y-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)",
          width: "40%",
          animation: "hero-light-sweep 10s ease-in-out infinite",
        }}
      />

      {/* Floating gold particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: "#C9A84C",
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              opacity: 0.2 + (i % 3) * 0.1,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container text-center px-4 py-32">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 text-sm text-muted-foreground mb-10 tracking-[0.15em] uppercase backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              {t("hero.badge")}
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-[1.05] tracking-[0.02em] text-foreground mb-8 max-w-5xl mx-auto"
          >
            {t("hero.h1a")}{" "}
            <span className="relative inline-block">
              <em className="not-italic text-primary">{t("hero.h1b")}</em>
              <motion.span
                className="absolute -bottom-2 left-0 h-[2px] bg-primary"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              />
            </span>
          </motion.h1>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto mb-14 leading-relaxed font-light"
          >
            {t("hero.sub")}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_40px_hsla(var(--primary)/0.35)] hover:-translate-y-1 font-semibold rounded-xl transition-all duration-300 text-base"
              asChild
            >
              <Link to="/auth">
                {t("hero.cta1")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-10 border border-primary/40 text-primary bg-transparent hover:border-primary hover:bg-primary/5 hover:-translate-y-1 rounded-xl transition-all duration-300 text-base backdrop-blur-sm"
              asChild
            >
              <Link to="/for-companies">{t("hero.cta2")}</Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap justify-center items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="text-primary">★★★★★</span>
              <span>4.9/5 rating</span>
            </span>
            <span className="text-primary/30">|</span>
            <span>200+ executives trained</span>
            <span className="text-primary/30">|</span>
            <span>94% success rate</span>
          </motion.div>

          {/* Animated stats */}
          <div ref={statsRef} className="flex flex-wrap justify-center items-center gap-0 mt-20">
            {stats.map((stat, i) => (
              <div key={stat.labelKey} className="flex items-center">
                <div className="px-10 text-center">
                  <p className="font-serif text-4xl md:text-5xl font-semibold text-primary">
                    {"display" in stat
                      ? (stat as typeof stats[2]).display(counts[i])
                      : `${counts[i]}${stat.suffix}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 tracking-wider uppercase">
                    {t(stat.labelKey).replace(/^[\d+%★.\s]+/, "")}
                  </p>
                </div>
                {i < stats.length - 1 && <div className="w-px h-12 bg-primary/20" />}
              </div>
            ))}
          </div>

          {/* Client logos */}
          <motion.div variants={itemVariants} className="mt-16 flex items-center justify-center gap-10">
            {["GALP", "NOS", "EDP", "MILLENNIUM", "SONAE"].map(name => (
              <span key={name} className="text-xs tracking-[0.15em] text-foreground/15 font-semibold hover:text-foreground/30 transition-colors duration-300">
                {name}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted-foreground/40"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
