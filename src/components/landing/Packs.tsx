import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import BusinessMasterModal from "./BusinessMasterModal";

const packs = [
  {
    name: "Starter",
    price: "€149",
    popular: false,
    cta: "Começar Agora",
    ctaVariant: "outline" as const,
    features: [
      "4 AI Sessions",
      "1 Live Professor Session (45 min)",
      "Basic progress tracking",
      "Email support",
      "Completion certificate",
    ],
  },
  {
    name: "Pro",
    price: "€349",
    popular: true,
    cta: "Escolher Pro",
    ctaVariant: "gold" as const,
    features: [
      "8 AI Sessions",
      "2 Live Professor Sessions (45 min)",
      "Full analytics dashboard",
      "AI Chat Assistant 24/7",
      "Priority support",
      "Completion certificate",
      "Session recordings",
    ],
  },
  {
    name: "Advanced",
    price: "€499",
    popular: false,
    cta: "Escolher Advanced",
    ctaVariant: "outline" as const,
    features: [
      "12 AI Sessions",
      "3 Live Professor Sessions (45 min)",
      "Advanced analytics & reports",
      "AI Chat Assistant 24/7",
      "Priority support",
      "Premium certificate",
      "All session recordings",
      "Custom learning path",
    ],
  },
  {
    name: "Business Master",
    price: "Sob Consulta",
    popular: false,
    cta: "Falar com Comercial",
    ctaVariant: "gold" as const,
    business: true,
    features: [
      "Unlimited AI Sessions",
      "Unlimited Live Sessions",
      "Executive-level analytics",
      "Dedicated account manager",
      "Company integration",
      "Monthly progress reports",
      "Custom curriculum",
      "Team management",
    ],
  },
];

const Packs = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="py-28" style={{ backgroundColor: "#0B1A2A" }} id="packs">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">Pricing</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#F4F2ED] mb-4">
            Investment in Your Performance
          </h2>
          <p className="text-[#8E96A3] text-lg">Choose the track that matches your ambition</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {packs.map((pack, i) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col rounded-xl p-7 bg-[#11263A] border transition-all duration-300 ${
                pack.popular
                  ? "border-[#B89A5A] shadow-[0_0_30px_rgba(184,154,90,0.15)] -translate-y-2"
                  : "border-[#B89A5A]/15 hover:border-[#B89A5A]/30"
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#B89A5A] text-[#0B1A2A] text-xs font-bold flex items-center gap-1 whitespace-nowrap">
                  <Star className="h-3 w-3 fill-[#0B1A2A]" /> MOST POPULAR
                </div>
              )}

              {/* Pro pack subtle background image */}
              {pack.popular && (
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-[0.08] pointer-events-none"
                />
              )}

              <div className="mb-6">
                <h3 className="font-serif text-xl font-semibold text-[#F4F2ED] mb-3">{pack.name}</h3>
                <div className="text-3xl font-bold text-[#F4F2ED]">
                  {pack.price === "Sob Consulta" ? (
                    <span className="text-2xl font-serif italic text-[#B89A5A]">Sob Consulta</span>
                  ) : (
                    <>{pack.price} <span className="text-base font-normal text-[#8E96A3]">/pack</span></>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {pack.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#8E96A3]">
                    <Check className="h-4 w-4 text-[#B89A5A] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {pack.business ? (
                <Button
                  onClick={() => setModalOpen(true)}
                  className="w-full h-12 rounded-xl font-semibold bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#C9AB6B] hover:shadow-[0_0_24px_rgba(184,154,90,0.3)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  {pack.cta}
                </Button>
              ) : pack.ctaVariant === "gold" ? (
                <Button
                  className="w-full h-12 rounded-xl font-semibold bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#C9AB6B] hover:shadow-[0_0_24px_rgba(184,154,90,0.3)] hover:-translate-y-0.5 transition-all duration-300"
                  asChild
                >
                  <Link to="/login">{pack.cta}</Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl font-medium border border-[#B89A5A]/40 text-[#B89A5A] bg-transparent hover:border-[#B89A5A] hover:bg-[#B89A5A]/5 hover:shadow-[0_0_16px_rgba(184,154,90,0.15)] hover:-translate-y-0.5 transition-all duration-300"
                  asChild
                >
                  <Link to="/login">{pack.cta}</Link>
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <BusinessMasterModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {/* Section divider */}
      <div className="h-px w-full mt-8" style={{ background: 'linear-gradient(90deg, transparent, #B89A5A33, transparent)' }} />
    </section>
  );
};

export default Packs;
