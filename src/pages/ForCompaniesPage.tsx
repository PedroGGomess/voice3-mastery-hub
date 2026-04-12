import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, BarChart3, Users, Globe, Shield, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";

const features = [
  { icon: BarChart3, title: "Centralised Dashboard", desc: "A complete view of your entire team's progress, scores and learning trajectories." },
  { icon: BookOpen, title: "Custom Learning Paths", desc: "Content adapted to your industry, clients and specific executive challenges." },
  { icon: Users, title: "Team Management", desc: "Flexible seat allocation, simplified onboarding and licence management." },
  { icon: Shield, title: "Enterprise Security", desc: "SSO, GDPR compliance and secure infrastructure for corporate data." },
  { icon: TrendingUp, title: "ROI Reports", desc: "Detailed monthly reports demonstrating the return on investment in communication." },
  { icon: Globe, title: "Global Support", desc: "Dedicated account manager, support in Portuguese and English, fully remote." },
];

const benefits = [
  "Executive communication training for your entire team",
  "Centralised dashboard with individual progress",
  "Dedicated account manager for enterprise clients",
  "Custom curriculum for your industry",
  "Detailed monthly performance reports",
  "Flexible team management and seat allocation",
];

export default function ForCompaniesPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <span
            className="inline-block text-[11px] font-semibold uppercase tracking-[3px] mb-6"
            style={{ color: "var(--gold)" }}
          >
            For Companies
          </span>
          <h1 className="font-serif text-[clamp(32px,5vw,52px)] font-bold leading-[1.15] mb-6">
            Designed for Companies That Demand{" "}
            <span className="italic" style={{ color: "var(--gold)" }}>Performance</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
            Deploy executive communication training across your entire team. Track results. Measure ROI. Give your leadership the competitive edge in every international interaction.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="h-12 px-8 font-semibold rounded-md text-base"
              style={{ background: "var(--gold)", color: "#000" }}
              asChild
            >
              <Link to="/contact">
                Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-12 px-8 rounded-md text-base"
              style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
              asChild
            >
              <Link to="/packs">View Packs</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="h-px max-w-5xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, var(--border-gold), transparent)" }} />

      {/* Benefits grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[3px]" style={{ color: "var(--gold)" }}>
            Features
          </span>
          <h2 className="font-serif text-3xl font-bold mt-3">
            Everything You Need to Scale
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-6 transition-all duration-200"
              style={{ background: "var(--bg-surface)", border: `1px solid var(--border)` }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-gold)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "var(--gold-10)" }}
              >
                <f.icon className="h-5 w-5" style={{ color: "var(--gold)" }} />
              </div>
              <h3 className="text-base font-semibold mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px max-w-5xl mx-auto" style={{ background: "linear-gradient(90deg, transparent, var(--border-gold), transparent)" }} />

      {/* Why VOICE³ */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">
            Why VOICE³ for Your Company?
          </h2>
          <div className="space-y-4">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 py-3"
              >
                <Check className="h-5 w-5 shrink-0" style={{ color: "var(--gold)" }} />
                <span className="text-base" style={{ color: "var(--text-secondary)" }}>{b}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: "linear-gradient(180deg, var(--bg-base), var(--gold-10))" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl font-bold mb-3">
            Ready to Transform Your Team?
          </h2>
          <p className="font-serif italic text-lg mb-8" style={{ color: "var(--gold)" }}>
            Book a 15-minute call.
          </p>
          <Button
            className="h-12 px-8 font-semibold rounded-md text-base"
            style={{ background: "var(--gold)", color: "#000" }}
            asChild
          >
            <Link to="/contact">
              Contact Sales Team <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
