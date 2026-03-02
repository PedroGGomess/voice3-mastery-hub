import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BarChart3, Users, TrendingUp, Globe } from "lucide-react";
import BusinessMasterModal from "./BusinessMasterModal";

const benefits = [
  "Team-wide executive communication training",
  "Centralised dashboard with individual progress tracking",
  "Dedicated account manager for enterprise clients",
  "Custom curriculum aligned to your industry",
  "Monthly detailed performance reports",
  "Flexible team management and seat allocation",
  "Priority support and dedicated onboarding",
];

const ForCompanies = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="py-28" style={{ backgroundColor: "#0B1A2A" }} id="empresas">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">For Companies</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#F4F2ED] mb-6 leading-tight">
              Designed for Companies That Demand Performance
            </h2>
            <p className="text-[#8E96A3] text-lg mb-8 leading-relaxed">
              Deploy executive communication training across your entire team. Track results. Measure ROI.
            </p>

            <ul className="space-y-3 mb-10">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[#8E96A3]">
                  <CheckCircle2 className="h-5 w-5 text-[#B89A5A] mt-0.5 shrink-0" />
                  <span className="text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => setModalOpen(true)}
              size="lg"
              className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg h-12 px-8"
            >
              Agendar Demonstração
            </Button>
          </motion.div>

          {/* Right: Mock Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-[#1C1F26] rounded-2xl border border-[#B89A5A]/15 p-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
              {/* Mock dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[#8E96A3] text-xs uppercase tracking-widest mb-1">Company Dashboard</p>
                  <h4 className="font-serif text-lg text-[#F4F2ED]">Atlantic Ventures</h4>
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
                  <div key={label} className="bg-[#0B1A2A] rounded-xl p-3.5 border border-[#B89A5A]/10">
                    <Icon className="h-4 w-4 text-[#B89A5A] mb-2" />
                    <div className="text-[#F4F2ED] font-bold text-lg">{value}</div>
                    <div className="text-[#8E96A3] text-xs mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Learner rows */}
              <div className="space-y-3">
                {[
                  { name: "Ricardo Almeida", role: "CFO", progress: 92 },
                  { name: "Catarina Ferreira", role: "Sales Director", progress: 78 },
                  { name: "Miguel Santos", role: "CEO", progress: 65 },
                ].map((learner) => (
                  <div key={learner.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#243A5A] flex items-center justify-center text-xs font-bold text-[#B89A5A]">
                      {learner.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#F4F2ED] font-medium truncate">{learner.name}</span>
                        <span className="text-[#B89A5A] ml-2">{learner.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[#0B1A2A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#B89A5A] to-[#d4ba6a] rounded-full"
                          style={{ width: `${learner.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-[#B89A5A]/10 flex items-center gap-2 text-xs text-[#8E96A3]">
                <Globe className="h-3.5 w-3.5 text-[#B89A5A]" />
                <span>3 international offices · Fully remote-capable</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <BusinessMasterModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};

export default ForCompanies;
