import { motion } from "framer-motion";
import { Check, Users, TrendingUp, BarChart3, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Executive communication training for your entire team",
  "Centralised dashboard with individual progress tracking",
  "Dedicated account manager for enterprise clients",
  "Curriculum customised for your industry",
  "Detailed monthly performance reports",
  "Flexible team management and seat allocation",
];

const ForCompanies = () => {
  return (
    <section className="py-28" style={{ backgroundColor: "var(--bg-base)" }} id="empresas">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[var(--gold)] tracking-[0.2em] uppercase text-sm mb-4 font-medium">
              07 — FOR COMPANIES
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6 leading-tight" style={{ color: "var(--text-primary)" }}>
              Designed for Companies That Demand Performance
            </h2>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Deploy executive communication training across your teams. Track results. Measure ROI.
            </p>

            <ul className="space-y-3 mb-10">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3" style={{ color: "var(--text-secondary)" }}>
                  <Check className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />
                  <span className="text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/demo"
                className="h-12 px-8 text-[#0A0A0F] hover:shadow-[0_0_24px_rgba(212,168,83,0.4)] hover:-translate-y-0.5 font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center"
                style={{ background: "var(--gold)", color: "#000" }}
              >
                Schedule Enterprise Demo
              </Link>
              <Link
                to="/empresas"
                className="h-12 px-8 bg-transparent hover:shadow-[0_0_16px_rgba(212,168,83,0.2)] hover:-translate-y-0.5 rounded-lg transition-all duration-300 inline-flex items-center justify-center font-semibold"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--gold)",
                }}
              >
                Learn More →
              </Link>
            </div>
          </motion.div>

          {/* Right: Mock Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="rounded-2xl border p-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-gold)" }}
            >
              {/* Mock dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--text-secondary)" }}>
                    Company Dashboard
                  </p>
                  <h4 className="font-serif text-lg" style={{ color: "var(--text-primary)" }}>Atlantic Ventures</h4>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Users, label: "Active Learners", value: "24" },
                  { icon: TrendingUp, label: "Avg. Progress", value: "76%" },
                  { icon: BarChart3, label: "Sessions Done", value: "148" },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3.5 border"
                    style={{ backgroundColor: "var(--bg-base)", borderColor: "var(--border-gold)" }}
                  >
                    <Icon className="h-4 w-4 mb-2" style={{ color: "var(--gold)" }} />
                    <div className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{value}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Learner rows */}
              <div className="space-y-3">
                {[
                  { name: "Ricardo A.", progress: 92 },
                  { name: "Catarina F.", progress: 76 },
                  { name: "Miguel S.", progress: 65 },
                ].map((learner) => (
                  <div key={learner.name} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: "var(--bg-elevated)", color: "var(--gold)" }}
                    >
                      {learner.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium truncate" style={{ color: "var(--text-primary)" }}>{learner.name}</span>
                        <span className="ml-2" style={{ color: "var(--gold)" }}>{learner.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
                        <div
                          className="h-full bg-gradient-to-r rounded-full"
                          style={{ width: `${learner.progress}%`, background: "linear-gradient(to right, var(--gold), var(--gold-light))" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t flex items-center gap-2 text-xs" style={{ borderColor: "var(--border-gold)", color: "var(--text-secondary)" }}>
                <Globe className="h-3.5 w-3.5" style={{ color: "var(--gold)" }} />
                <span>3 international offices · Fully remote</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section divider */}
      <div
        className="h-px w-full mt-8"
        style={{ background: "linear-gradient(90deg, transparent, var(--border-gold), transparent)" }}
      />
    </section>
  );
};

export default ForCompanies;
