import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, MessageSquare, BarChart2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";

const arrcSteps = [
  {
    letter: "A",
    title: "Activate",
    desc: "Context setting and warm-up. You enter the scenario with clear objectives and background information, priming your executive mindset.",
  },
  {
    letter: "R",
    title: "Receive",
    desc: "Learn the key communication structures relevant to the scenario — negotiation tactics, presentation frameworks, crisis language.",
  },
  {
    letter: "R",
    title: "Rehearse",
    desc: "Practice with AI simulation. You are challenged with real-time prompts, objections, and pressure situations.",
  },
  {
    letter: "C",
    title: "Confirm",
    desc: "Quiz, score, and debrief. Your performance is assessed across Clarity, Wobble, and Velocity metrics.",
  },
];

const metrics = [
  {
    icon: MessageSquare,
    name: "Clarity",
    desc: "How precise and unambiguous is your communication? Measured by structure, vocabulary, and message alignment.",
  },
  {
    icon: BarChart2,
    name: "Wobble",
    desc: "How consistent is your performance under pressure? Measures variance between your best and worst responses.",
  },
  {
    icon: Brain,
    name: "Velocity",
    desc: "How quickly do you respond with precision? Tracks response speed without sacrificing quality or authority.",
  },
];

const GoldDivider = () => (
  <div className="flex justify-center my-16">
    <div className="w-20 h-0.5 bg-[#B89A5A]/40" />
  </div>
);

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-[#0B1A2A]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-24 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-6 font-medium">The Method</p>
          <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#F4F2ED] mb-6 leading-tight">
            The VOICE<sup className="text-[#B89A5A]">³</sup> Method
          </h1>
          <div className="flex justify-center mb-8">
            <div className="w-20 h-0.5 bg-[#B89A5A]" />
          </div>
          <p className="text-[#8E96A3] text-lg leading-relaxed">
            This is not a language course. It is an executive performance system — engineered to transform how you communicate under pressure, in negotiations, presentations, and high-stakes conversations.
          </p>
        </motion.div>
      </section>

      <GoldDivider />

      {/* AI Executive Simulation */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">Executive Simulation</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#F4F2ED] mb-6 leading-tight">
              Practice Real Executive Scenarios
            </h2>
            <p className="text-[#8E96A3] leading-relaxed mb-4">
              Our performance sessions simulate real executive scenarios — negotiations with difficult counterparts, high-pressure presentations to the board, and crisis communications requiring immediate authority.
            </p>
            <p className="text-[#8E96A3] leading-relaxed">
              Each simulation is designed to expose and correct communication weaknesses before they cost you in the real world.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Mock session interface */}
            <div className="bg-[#1C1F26] rounded-2xl border border-[#B89A5A]/20 p-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-3 text-[#8E96A3] text-xs tracking-wider uppercase">Performance Session</span>
              </div>
              <div className="bg-[#0B1A2A] rounded-xl p-4 mb-3 border border-[#B89A5A]/10">
                <p className="text-[#B89A5A] text-xs uppercase tracking-wider mb-2">Scenario</p>
                <p className="text-[#F4F2ED] text-sm">Board presentation — Q3 results under scrutiny. The CFO challenges your projections.</p>
              </div>
              <div className="space-y-2 mb-4">
                <div className="bg-[#0B1A2A]/60 rounded-lg p-3 border-l-2 border-[#B89A5A]/30">
                  <p className="text-[#8E96A3] text-xs">"Your projections seem overly optimistic given current market conditions."</p>
                </div>
                <div className="bg-[#B89A5A]/10 rounded-lg p-3 border-l-2 border-[#B89A5A]">
                  <p className="text-[#F4F2ED] text-xs">Your response is being evaluated...</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {["Clarity", "Wobble", "Velocity"].map((m) => (
                  <div key={m} className="bg-[#0B1A2A] rounded-lg p-2 border border-[#B89A5A]/10">
                    <div className="text-[#B89A5A] font-bold text-sm">—</div>
                    <div className="text-[#8E96A3] text-xs">{m}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <GoldDivider />

      {/* ARRC Framework */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">Framework</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#F4F2ED]">The ARRC Framework</h2>
            <p className="text-[#8E96A3] mt-4 max-w-xl mx-auto">Every session follows this four-stage process, engineered for maximum performance transfer.</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {arrcSteps.map((step, i) => (
              <motion.div
                key={step.letter}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1C1F26] rounded-xl p-6 border border-[#B89A5A]/10 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/40 flex items-center justify-center mx-auto mb-4">
                  <span className="font-serif text-xl font-bold text-[#B89A5A]">{step.letter}</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#F4F2ED] mb-3">{step.title}</h3>
                <p className="text-[#8E96A3] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* Performance Metrics */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">Performance</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#F4F2ED]">Three Core Metrics</h2>
            <p className="text-[#8E96A3] mt-4 max-w-xl mx-auto">Your executive communication is measured across three precision indicators — tracked over every session.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1C1F26] rounded-xl p-8 border border-[#B89A5A]/10 hover:border-[#B89A5A]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center mb-5">
                  <metric.icon className="h-5 w-5 text-[#B89A5A]" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#F4F2ED] mb-3">{metric.name}</h3>
                <p className="text-[#8E96A3] leading-relaxed text-sm">{metric.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* Coaching Integration */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">Coaching Integration</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#F4F2ED]">Sessions + Professor Checkpoints</h2>
            <p className="text-[#8E96A3] mt-4 max-w-xl mx-auto">Performance sessions are interspersed with live professor checkpoints for targeted correction and strategic guidance.</p>
          </motion.div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
            {[
              { label: "Performance Sessions", sub: "AI-driven simulation" },
              { label: "Professor Checkpoint", sub: "Live correction", highlight: true },
              { label: "Performance Sessions", sub: "Advanced scenarios" },
              { label: "Professor Checkpoint", sub: "Final calibration", highlight: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center flex-1 w-full md:w-auto">
                <div className={`flex-1 p-5 rounded-xl border text-center ${item.highlight ? "bg-[#B89A5A]/10 border-[#B89A5A]/40" : "bg-[#1C1F26] border-[#B89A5A]/10"}`}>
                  <p className={`font-serif text-sm font-semibold mb-1 ${item.highlight ? "text-[#B89A5A]" : "text-[#F4F2ED]"}`}>{item.label}</p>
                  <p className="text-[#8E96A3] text-xs">{item.sub}</p>
                </div>
                {i < 3 && <div className="hidden md:block w-8 h-px bg-[#B89A5A]/40 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#F4F2ED] mb-6">
            Apply to VOICE<sup className="text-[#B89A5A]">³</sup>
          </h2>
          <p className="text-[#8E96A3] mb-10 leading-relaxed">
            Join professionals who have transformed how they communicate at the highest level.
          </p>
          <Button
            size="lg"
            className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold px-10 py-4 text-base rounded-xl shadow-lg shadow-[#B89A5A]/20 hover:shadow-xl hover:shadow-[#B89A5A]/30 transition-all duration-300"
            asChild
          >
            <Link to="/login">
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default HowItWorksPage;
