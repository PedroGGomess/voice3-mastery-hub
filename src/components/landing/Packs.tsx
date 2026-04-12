import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import BusinessMasterModal from "./BusinessMasterModal";

const packs = [
  {
    name: "Starter",
    price: "149",
    popular: false,
    slug: "starter",
    tagline: "Para começar a tua jornada",
    cta: "Começar Agora",
    features: ["4 Sessões AI", "1 Sessão com Professor (45 min)", "Acompanhamento básico", "Suporte por email", "Certificado de conclusão"],
  },
  {
    name: "Pro",
    price: "349",
    popular: true,
    slug: "pro",
    tagline: "Para performance de alto nível",
    cta: "Escolher Pro",
    features: ["8 Sessões AI", "3 Sessões com Professor (45 min)", "Analytics completo", "Chat AI 24/7", "Suporte prioritário", "Certificado", "Gravações das sessões"],
  },
  {
    name: "Advanced",
    price: "499",
    popular: false,
    slug: "advanced",
    tagline: "Para líderes seniores",
    cta: "Escolher Advanced",
    features: ["12 Sessões AI", "5 Sessões com Professor (45 min)", "Analytics avançado", "Chat AI 24/7", "Suporte prioritário", "Certificado premium", "Gravações", "Percurso personalizado"],
  },
  {
    name: "Business Master",
    price: "Sob Consulta",
    popular: false,
    slug: "business-master",
    tagline: "C-suite & equipas",
    cta: "Falar com Comercial",
    business: true,
    features: ["Sessões AI ilimitadas", "10+ Sessões ao Vivo", "Analytics executivo", "Gestor dedicado", "Integração empresa", "Relatórios mensais", "Currículo personalizado", "Gestão de equipa"],
  },
];

const Packs = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="py-32" style={{ backgroundColor: "#0B1A2A" }} id="packs">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs mb-4 font-semibold">Investimento</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#F4F2ED] mb-5">Escolhe o Teu Nível</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-5" />
          <p className="text-[#8E96A3] text-lg max-w-lg mx-auto">Seleciona o programa que corresponde à tua ambição</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {packs.map((pack, i) => (
            <motion.div key={pack.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 group ${pack.popular ? "border-2 border-[#C9A84C]/50 shadow-[0_0_40px_rgba(201,168,76,0.12)] -translate-y-2" : "border border-white/[0.06] hover:border-[#C9A84C]/20"}`}
              style={{ background: pack.popular ? "linear-gradient(180deg, rgba(201,168,76,0.04), rgba(17,38,58,1))" : "#11263A" }}>
              {pack.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap tracking-wider"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E8C87A)", color: "#0B1A2A" }}>
                  <Sparkles className="h-3 w-3" /> MAIS POPULAR
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-serif text-xl font-semibold text-[#F4F2ED] mb-1">{pack.name}</h3>
                <p className="text-xs text-[#8E96A3] italic mb-4">{pack.tagline}</p>
                <div className="text-3xl font-bold text-[#F4F2ED]">
                  {pack.price === "Sob Consulta" ? (
                    <span className="text-2xl font-serif italic text-[#C9A84C]">Sob Consulta</span>
                  ) : (
                    <>€{pack.price} <span className="text-sm font-normal text-[#8E96A3]">/pack</span></>
                  )}
                </div>
              </div>
              <div className="w-full h-px bg-[#C9A84C]/10 mb-6" />
              <ul className="space-y-3 mb-8 flex-1">
                {pack.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#8E96A3] group-hover:text-[#a0a8b5] transition-colors">
                    <Check className="h-4 w-4 text-[#C9A84C] mt-0.5 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              {pack.business ? (
                <Button onClick={() => setModalOpen(true)} className="w-full h-12 rounded-xl font-semibold bg-[#C9A84C] text-[#0B1A2A] hover:bg-[#d4b56a] hover:shadow-[0_0_24px_rgba(201,168,76,0.3)] hover:-translate-y-0.5 transition-all duration-300">
                  {pack.cta} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              ) : pack.popular ? (
                <Button className="w-full h-12 rounded-xl font-semibold bg-[#C9A84C] text-[#0B1A2A] hover:bg-[#d4b56a] hover:shadow-[0_0_32px_rgba(201,168,76,0.3)] hover:-translate-y-0.5 transition-all duration-300" asChild>
                  <Link to={`/auth?mode=register&pack=${pack.slug}`}>{pack.cta} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                </Button>
              ) : (
                <Button variant="outline" className="w-full h-12 rounded-xl font-medium border border-[#C9A84C]/30 text-[#C9A84C] bg-transparent hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/5 hover:-translate-y-0.5 transition-all duration-300" asChild>
                  <Link to={`/auth?mode=register&pack=${pack.slug}`}>{pack.cta} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <BusinessMasterModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="h-px w-full mt-12" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)' }} />
    </section>
  );
};

export default Packs;
