import { motion } from "framer-motion";
import { Check, Users, TrendingUp, BarChart3, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Formação de comunicação executiva para toda a equipa",
  "Dashboard centralizado com progresso individual",
  "Account manager dedicado para clientes enterprise",
  "Currículo personalizado para a tua indústria",
  "Relatórios mensais detalhados de performance",
  "Gestão flexível de equipas e alocação de lugares",
];

const ForCompanies = () => {
  return (
    <section className="py-28" style={{ backgroundColor: "#0A0A0F" }} id="empresas">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#D4A853] tracking-[0.2em] uppercase text-sm mb-4 font-medium">
              07 — PARA EMPRESAS
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#F5F5F5] mb-6 leading-tight">
              Desenhado para Empresas que Exigem Performance
            </h2>
            <p className="text-[#9A9AB0] text-lg mb-8 leading-relaxed">
              Implementa formação de comunicação executiva em toda a tua equipa. Acompanha resultados. Mede ROI.
            </p>

            <ul className="space-y-3 mb-10">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[#9A9AB0]">
                  <Check className="h-5 w-5 text-[#D4A853] mt-0.5 shrink-0" />
                  <span className="text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/demo"
                className="h-12 px-8 bg-[#D4A853] text-[#0A0A0F] hover:bg-[#E8C97A] hover:shadow-[0_0_24px_rgba(212,168,83,0.4)] hover:-translate-y-0.5 font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center"
              >
                Agendar Demo Empresarial
              </Link>
              <Link
                to="/empresas"
                className="h-12 px-8 border border-[#D4A853]/40 text-[#D4A853] bg-transparent hover:border-[#D4A853] hover:bg-[#D4A853]/5 hover:shadow-[0_0_16px_rgba(212,168,83,0.2)] hover:-translate-y-0.5 rounded-lg transition-all duration-300 inline-flex items-center justify-center"
              >
                Saber Mais →
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
              style={{ backgroundColor: "#12121A", borderColor: "rgba(212, 168, 83, 0.15)" }}
            >
              {/* Mock dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[#9A9AB0] text-xs uppercase tracking-widest mb-1">
                    Company Dashboard
                  </p>
                  <h4 className="font-serif text-lg text-[#F5F5F5]">Atlantic Ventures</h4>
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
                    style={{ backgroundColor: "#0A0A0F", borderColor: "rgba(212, 168, 83, 0.1)" }}
                  >
                    <Icon className="h-4 w-4 text-[#D4A853] mb-2" />
                    <div className="text-[#F5F5F5] font-bold text-lg">{value}</div>
                    <div className="text-[#9A9AB0] text-xs mt-0.5">{label}</div>
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
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#D4A853]"
                      style={{ backgroundColor: "#1A1A25" }}
                    >
                      {learner.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#F5F5F5] font-medium truncate">{learner.name}</span>
                        <span className="text-[#D4A853] ml-2">{learner.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[#1A1A25] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4A853] to-[#E8C97A] rounded-full"
                          style={{ width: `${learner.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-[#D4A853]/10 flex items-center gap-2 text-xs text-[#9A9AB0]">
                <Globe className="h-3.5 w-3.5 text-[#D4A853]" />
                <span>3 escritórios internacionais · Totalmente remoto</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section divider */}
      <div
        className="h-px w-full mt-8"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.2), transparent)" }}
      />
    </section>
  );
};

export default ForCompanies;
