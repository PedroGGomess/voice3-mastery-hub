import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";
import { supabase } from "@/integrations/supabase/client";

type Pack = {
  id: string;
  name: string;
  slug: string | null;
  price: number;
  sessionsIncluded: number;
  badge: string | null;
  tagline: string;
  promise: string;
  features: string[];
};

const staticPacks: Pack[] = [
  {
    id: "starter",
    name: "Starter",
    slug: "starter",
    price: 149,
    sessionsIncluded: 1,
    badge: null,
    tagline: "Begin your executive journey",
    promise: "You will command meetings with greater structure and confidence",
    features: [
      "All 10 chapters & AI tools",
      "Personalised learning path",
      "1 live professor session",
      "Progress tracking & certificate",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    slug: "pro",
    price: 349,
    sessionsIncluded: 3,
    badge: "Most Popular",
    tagline: "For high-stakes English performance",
    promise: "You will negotiate, present and lead with authority in English",
    features: [
      "All 10 chapters & AI tools",
      "Personalised learning path",
      "3 live professor sessions",
      "Progress tracking & certificate",
      "Priority booking",
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    slug: "advanced",
    price: 499,
    sessionsIncluded: 5,
    badge: null,
    tagline: "Senior leaders, global exposure",
    promise: "You will lead global teams and close deals entirely in English",
    features: [
      "All 10 chapters & AI tools",
      "Personalised learning path",
      "5 live professor sessions",
      "Progress tracking & certificate",
      "Priority booking",
      "Session recordings",
    ],
  },
  {
    id: "business-master",
    name: "Business Master",
    slug: "business-master",
    price: 799,
    sessionsIncluded: 10,
    badge: null,
    tagline: "C-suite & business owners",
    promise: "You will command any room, any boardroom, in any country",
    features: [
      "All 10 chapters & AI tools",
      "Personalised learning path",
      "10 live professor sessions",
      "Progress tracking & certificate",
      "Priority booking",
      "Session recordings",
      "Team dashboard + custom scenarios",
    ],
  },
];

const comparison = [
  { label: "All Chapters & AI Tools",    values: [true,  true,  true,  true]  },
  { label: "Personalised Learning Path", values: [true,  true,  true,  true]  },
  { label: "Professor Sessions",         values: ["1×",  "3×",  "5×",  "10×"] },
  { label: "Progress Tracking",          values: [true,  true,  true,  true]  },
  { label: "Priority Booking",           values: [false, true,  true,  true]  },
  { label: "Session Recordings",         values: [false, false, true,  true]  },
  { label: "Team Dashboard",             values: [false, false, false, true]  },
  { label: "Custom Scenarios",           values: [false, false, false, true]  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const } }),
};

function CellValue({ v, colIdx }: { v: boolean | string; colIdx: number }) {
  if (v === true)
    return <span style={{ color: "#52C41A", fontWeight: 700 }}>✓</span>;
  if (v === false)
    return <span style={{ color: "#8E96A3" }}>—</span>;
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded"
      style={
        colIdx === 1
          ? { color: "#C9A84C", background: "rgba(201,168,76,0.1)" }
          : { color: "#F4F2ED" }
      }
    >
      {v}
    </span>
  );
}

export default function PacksPage() {
  const [packs, setPacks] = useState<Pack[]>(staticPacks);

  useEffect(() => {
    const controller = new AbortController();

    const extractFeatures = (
      rawFeatures: unknown,
      fallback: string[]
    ): string[] => {
      if (Array.isArray(rawFeatures)) {
        const filtered = (rawFeatures as unknown[]).filter(
          (f): f is string => typeof f === "string"
        );
        if (filtered.length > 0) return filtered;
      }
      return fallback;
    };

    const loadPacks = async () => {
      try {
        const { data, error } = await supabase
          .from("packs")
          .select("*")
          .eq("status", "active")
          .order("sort_order");

        if (controller.signal.aborted) return;
        if (error || !data || data.length === 0) return;

        // Merge DB data with static metadata (tagline, promise, features)
        const merged: Pack[] = data.map((dbPack) => {
          const staticFallback = staticPacks.find((p) => p.slug === dbPack.slug);
          return {
            id: dbPack.id,
            name: dbPack.name,
            slug: dbPack.slug,
            price: dbPack.price,
            sessionsIncluded: dbPack.sessions_included,
            badge: dbPack.badge,
            tagline: staticFallback?.tagline ?? "",
            promise: staticFallback?.promise ?? "",
            features: extractFeatures(dbPack.features, staticFallback?.features ?? []),
          };
        });

        setPacks(merged);
      } catch {
        // Silently fall back to static data
      }
    };

    loadPacks();
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1A2A]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p className="text-xs tracking-[0.2em] text-[#C9A84C] uppercase mb-4">Investment</p>
          <h1 className="font-serif text-[clamp(36px,5vw,52px)] font-bold text-[#F4F2ED] leading-tight mb-4">
            Choose Your Track
          </h1>
          <div className="w-[60px] h-[2px] bg-[#C9A84C] mx-auto mb-5" />
          <p className="text-[18px] text-[#8E96A3] max-w-lg mx-auto leading-relaxed">
            Every pack includes live professor sessions, AI coaching, and a certificate of mastery.
          </p>
        </motion.div>
      </section>

      {/* ── Pack Cards ── */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {packs.map((pack, i) => {
            const isPro = pack.slug === "pro";
            return (
              <motion.div
                key={pack.id}
                className="relative rounded-2xl p-7 flex flex-col"
                style={{
                  background: "#1C1F26",
                  border: isPro
                    ? "1px solid rgba(184,154,90,0.5)"
                    : "1px solid rgba(184,154,90,0.1)",
                  transform: isPro ? "scale(1.04)" : undefined,
                  boxShadow: isPro ? "0 0 40px rgba(184,154,90,0.15)" : undefined,
                }}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={!isPro ? { borderColor: "rgba(184,154,90,0.3)" } : undefined}
              >
                {/* Badge */}
                {pack.badge && (
                  <div
                    className="absolute -top-px left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-b-xl font-black text-[11px]"
                    style={{
                      background: "linear-gradient(135deg, #C9A84C, #E8C87A)",
                      color: "#060f1d",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {pack.badge.toUpperCase()}
                  </div>
                )}

                <div className={pack.badge ? "pt-4" : ""}>
                  <h3 className="text-xl font-bold text-[#F4F2ED] mb-1">{pack.name}</h3>
                  <p className="text-[13px] italic text-[#8E96A3] mb-5">{pack.tagline}</p>

                  {/* Price */}
                  <div className="flex items-end gap-1 mb-4">
                    <span
                      className="font-serif font-bold leading-none"
                      style={{ fontSize: 64, color: "#C9A84C" }}
                    >
                      €{pack.price}
                    </span>
                    <span className="text-[#8E96A3] text-sm mb-3">/pack</span>
                  </div>

                  {/* Promise */}
                  <p className="text-sm italic mb-4" style={{ color: "#C9A84C" }}>
                    "{pack.promise}"
                  </p>

                  {/* Divider */}
                  <div className="w-full h-px bg-[#B89A5A]/15 mb-4" />

                  {/* Sessions pill */}
                  <div className="mb-5">
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(201,168,76,0.1)",
                        border: "1px solid rgba(201,168,76,0.2)",
                        color: "#C9A84C",
                      }}
                    >
                      Includes {pack.sessionsIncluded} × 45-min Professor Sessions
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-8 flex-1">
                    {pack.features.map((f) => (
                      <li key={f} className="text-sm text-[#F4F2ED] flex items-start gap-2">
                        <span style={{ color: "#C9A84C", flexShrink: 0 }}>✦</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link to={`/auth?pack=${pack.slug}`}>
                    {pack.slug === "starter" && (
                      <Button
                        variant="outline"
                        className="w-full h-11 text-sm font-bold rounded-xl border-white/30 text-white hover:bg-white/5"
                      >
                        Get Started <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    )}
                    {isPro && (
                      <Button
                        className="w-full h-11 text-sm font-bold rounded-xl"
                        style={{ background: "#C9A84C", color: "#060f1d" }}
                      >
                        Get Started <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    )}
                    {(pack.slug === "advanced" || pack.slug === "business-master") && (
                      <Button
                        variant="outline"
                        className="w-full h-11 text-sm font-bold rounded-xl text-[#F4F2ED] hover:border-[#C9A84C]"
                        style={{ borderColor: "rgba(201,168,76,0.5)" }}
                      >
                        Get Started <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    )}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <motion.h2
          className="text-center font-serif text-3xl font-bold text-[#F4F2ED] mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Compare All Tracks
        </motion.h2>

        <motion.div
          className="overflow-x-auto rounded-2xl border border-[#B89A5A]/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "rgba(201,168,76,0.06)" }}>
                <th className="text-left py-4 px-5 text-[#C9A84C] font-bold tracking-wide">Feature</th>
                {packs.map((p) => (
                  <th key={p.id} className="py-4 px-4 text-center text-[#C9A84C] font-bold">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, ri) => (
                <tr
                  key={row.label}
                  style={{ background: ri % 2 === 0 ? "#1C1F26" : "#0B1A2A" }}
                >
                  <td className="py-3.5 px-5 text-[#8E96A3]">{row.label}</td>
                  {row.values.map((v, ci) => (
                    <td
                      key={ci}
                      className="py-3.5 px-4 text-center"
                      style={ci === 1 ? { background: "rgba(201,168,76,0.03)" } : undefined}
                    >
                      <CellValue v={v} colIdx={ci} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* ── Not sure card ── */}
      <section className="px-6 pb-32 max-w-2xl mx-auto">
        <motion.div
          className="text-center rounded-2xl p-10"
          style={{
            background: "rgba(201,168,76,0.04)",
            border: "1px solid rgba(201,168,76,0.12)",
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-serif text-2xl font-bold text-[#F4F2ED] mb-3">
            Not sure which track is right for you?
          </h3>
          <p className="text-[#8E96A3] mb-7">Book a free 15-minute discovery call.</p>
          <Link to="/contact">
            <Button
              variant="outline"
              className="h-12 px-8 font-bold text-[#C9A84C] rounded-xl"
              style={{ borderColor: "rgba(201,168,76,0.5)" }}
            >
              Book Discovery Call <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
