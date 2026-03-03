import { motion } from "framer-motion";
import { Check, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";

const packs = [
  {
    name: "Starter",
    price: 149,
    popular: false,
    forWho: "For professionals beginning their executive communication journey",
    transformation: "You will command meetings with greater structure and confidence",
    coaching: "Includes 1 × 45-min Professor Session",
    features: [
      "4 Executive Performance Sessions",
      "1 Professor Session (45 min)",
      "Core ARRC framework access",
      "Clarity, Wobble & Velocity metrics",
      "Email support",
      "Certificate of Completion",
    ],
  },
  {
    name: "Pro",
    price: 349,
    popular: true,
    forWho: "For executives who need to perform in high-stakes English environments",
    transformation: "You will negotiate, present and lead with authority in English",
    coaching: "Includes 2 × 45-min Professor Sessions",
    features: [
      "8 Executive Performance Sessions",
      "2 Professor Sessions (45 min each)",
      "Full performance analytics",
      "VOICE³ Assistant 24/7",
      "Priority email support",
      "Certificate of Completion",
      "Session recordings",
    ],
  },
  {
    name: "Advanced",
    price: 499,
    popular: false,
    forWho: "For senior leaders preparing for international exposure",
    transformation: "You will lead global teams and close deals entirely in English",
    coaching: "Includes 3 × 45-min Professor Sessions",
    features: [
      "12 Executive Performance Sessions",
      "3 Professor Sessions (45 min each)",
      "Advanced analytics & reports",
      "VOICE³ Assistant 24/7",
      "Priority support",
      "Certificate of Completion",
      "All session recordings",
      "Personalised learning path",
    ],
  },
  {
    name: "Business Master",
    price: 799,
    popular: false,
    forWho: "For C-suite executives and business owners operating globally",
    transformation: "You will command any room, any boardroom, in any country",
    coaching: "Includes 4 × 60-min Professor Sessions",
    features: [
      "20 Executive Performance Sessions",
      "4 Professor Sessions (60 min each)",
      "Executive analytics suite",
      "VOICE³ Assistant 24/7",
      "Dedicated support manager",
      "Premium certificate",
      "All recordings",
      "Personalised path",
      "Enterprise integration",
      "Monthly progress report",
    ],
  },
];

const comparisonFeatures = [
  { label: "Executive Performance Sessions", values: ["4", "8", "12", "20"] },
  { label: "Professor Sessions", values: ["1 × 45min", "2 × 45min", "3 × 45min", "4 × 60min"] },
  { label: "Performance Analytics", values: [false, true, true, true] },
  { label: "VOICE³ Assistant", values: [false, true, true, true] },
  { label: "Session Recordings", values: [false, true, true, true] },
  { label: "Personalised Learning Path", values: [false, false, true, true] },
  { label: "Monthly Progress Report", values: [false, false, false, true] },
  { label: "Dedicated Support Manager", values: [false, false, false, true] },
];

const PacksPage = () => {
  return (
    <div className="min-h-screen bg-[#0B1A2A]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-6 font-medium">Investment</p>
          <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#F4F2ED] mb-6 leading-tight">
            Packs & Pricing
          </h1>
          <div className="flex justify-center mb-8">
            <div className="w-20 h-0.5 bg-[#B89A5A]" />
          </div>
          <p className="text-[#8E96A3] text-lg max-w-xl mx-auto leading-relaxed">
            Choose the pack that matches your ambition. Every pack includes live professor sessions, performance metrics, and a certificate of completion.
          </p>
        </motion.div>
      </section>

      {/* Pack cards */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {packs.map((pack, i) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative flex flex-col bg-[#1C1F26] rounded-2xl p-7 border transition-all duration-300 ${
                pack.popular
                  ? "border-[#B89A5A]/50 shadow-[0_0_40px_rgba(184,154,90,0.15)]"
                  : "border-[#B89A5A]/10 hover:border-[#B89A5A]/30"
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#B89A5A] text-[#0B1A2A] text-xs font-semibold flex items-center gap-1 whitespace-nowrap">
                  <Star className="h-3 w-3" /> Most Popular
                </div>
              )}

              <h3 className="font-serif text-2xl font-semibold text-[#F4F2ED] mb-2">{pack.name}</h3>

              <div className="mb-4">
                <span className="font-serif text-4xl font-bold text-[#F4F2ED]">€{pack.price}</span>
                <span className="text-[#8E96A3] text-sm">/pack</span>
              </div>

              <p className="text-[#8E96A3] text-xs mb-2 leading-relaxed italic">{pack.forWho}</p>
              <p className="text-[#B89A5A] text-xs mb-1 leading-relaxed font-medium">{pack.transformation}</p>
              <p className="text-[#8E96A3] text-xs mb-6 leading-relaxed">{pack.coaching}</p>

              <div className="h-px bg-[#B89A5A]/10 mb-6" />

              <ul className="space-y-3 mb-8 flex-1">
                {pack.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#8E96A3]">
                    <Check className="h-4 w-4 text-[#B89A5A] mt-0.5 shrink-0" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/login">
                <Button
                  className={`w-full rounded-xl h-11 transition-all duration-300 ${
                    pack.popular
                      ? "bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] shadow-lg shadow-[#B89A5A]/20 hover:shadow-xl hover:shadow-[#B89A5A]/30 font-semibold"
                      : "bg-transparent border-2 border-[#B89A5A]/50 text-[#F4F2ED] hover:border-[#B89A5A] hover:shadow-lg hover:shadow-[#B89A5A]/20"
                  }`}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="pb-28 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">Compare</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#F4F2ED]">Feature Comparison</h2>
          </motion.div>

          <div className="overflow-x-auto rounded-2xl border border-[#B89A5A]/15">
            <table className="w-full">
              <thead>
                <tr className="bg-[#B89A5A]/10 border-b border-[#B89A5A]/20">
                  <th className="text-left px-6 py-4 text-[#B89A5A] text-sm font-semibold tracking-wider">Feature</th>
                  {packs.map((p) => (
                    <th key={p.name} className="px-4 py-4 text-[#F4F2ED] text-sm font-semibold text-center">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={row.label} className={`border-b border-[#B89A5A]/10 ${i % 2 === 0 ? "bg-[#1C1F26]" : "bg-[#0B1A2A]"}`}>
                    <td className="px-6 py-4 text-[#8E96A3] text-sm">{row.label}</td>
                    {row.values.map((val, j) => (
                      <td key={j} className="px-4 py-4 text-center">
                        {typeof val === "boolean" ? (
                          val ? (
                            <Check className="h-4 w-4 text-[#B89A5A] mx-auto" strokeWidth={2} />
                          ) : (
                            <span className="text-[#8E96A3]/30 text-xs">—</span>
                          )
                        ) : (
                          <span className="text-[#F4F2ED] text-xs">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-[#8E96A3] text-sm mt-8">
            Need a custom solution for your company?{" "}
            <Link to="/for-companies" className="text-[#B89A5A] hover:underline">
              View enterprise options
            </Link>
            .
          </p>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default PacksPage;
