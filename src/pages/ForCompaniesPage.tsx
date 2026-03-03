import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Upload, Target, BarChart2, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";

const features = [
  {
    icon: Users,
    title: "Team Registration & Management",
    desc: "Onboard your entire leadership team in minutes. Manage seats, track individual progress, and adjust access levels from a central dashboard.",
  },
  {
    icon: Upload,
    title: "Custom Scenario Upload",
    desc: "Upload industry-specific scenarios — your actual negotiations, client presentations, or crisis situations — for hyper-relevant training.",
  },
  {
    icon: Target,
    title: "AI Arena",
    desc: "A dedicated team practice environment where colleagues compete, compare performance, and elevate each other's standards.",
  },
  {
    icon: BarChart2,
    title: "Analytics Dashboard",
    desc: "Real-time progress tracking across all team members. Identify strengths, gaps, and improvement trajectories at a glance.",
  },
  {
    icon: TrendingUp,
    title: "Performance Benchmarks",
    desc: "Compare your team's performance against industry benchmarks. Understand where you stand and where to focus development.",
  },
  {
    icon: Shield,
    title: "Dedicated Account Manager",
    desc: "Enterprise clients receive a dedicated account manager for onboarding, curriculum alignment, and ongoing optimisation.",
  },
];

const GoldDivider = () => (
  <div className="flex justify-center my-16">
    <div className="w-20 h-0.5 bg-[#B89A5A]/40" />
  </div>
);

const ForCompaniesPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    employees: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
          <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-6 font-medium">Enterprise</p>
          <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#F4F2ED] mb-6 leading-tight">
            Elevate Your Team's Executive Communication
          </h1>
          <div className="flex justify-center mb-8">
            <div className="w-20 h-0.5 bg-[#B89A5A]" />
          </div>
          <p className="text-[#8E96A3] text-lg leading-relaxed">
            VOICE<sup className="text-[#B89A5A]">³</sup> Enterprise transforms how your leadership team communicates in English — with measurable results, custom scenarios, and a centralised performance dashboard.
          </p>
        </motion.div>
      </section>

      <GoldDivider />

      {/* Dashboard Mockup */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-[#1C1F26] rounded-2xl border border-[#B89A5A]/20 p-6 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[#8E96A3] text-xs uppercase tracking-widest mb-1">Company Dashboard</p>
                  <h4 className="font-serif text-lg text-[#F4F2ED]">Enterprise Overview</h4>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Active Users", value: "12" },
                  { label: "Sessions Completed", value: "87" },
                  { label: "Avg. Progress", value: "64%" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#0B1A2A] rounded-xl p-4 border border-[#B89A5A]/10 text-center">
                    <div className="font-serif text-2xl font-bold text-[#B89A5A] mb-1">{stat.value}</div>
                    <div className="text-[#8E96A3] text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { name: "Sarah Chen", role: "VP Operations", progress: 88 },
                  { name: "James Whitfield", role: "Sales Director", progress: 72 },
                  { name: "Ana Rodrigues", role: "CFO", progress: 61 },
                ].map((user) => (
                  <div key={user.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#243A5A] flex items-center justify-center text-xs font-bold text-[#B89A5A]">
                      {user.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#F4F2ED] font-medium">{user.name}</span>
                        <span className="text-[#B89A5A]">{user.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[#0B1A2A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#B89A5A] to-[#d4ba6a] rounded-full"
                          style={{ width: `${user.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <GoldDivider />

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">Platform Features</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#F4F2ED]">Built for Enterprise Performance</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#1C1F26] rounded-xl p-7 border border-[#B89A5A]/10 hover:border-[#B89A5A]/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center mb-5">
                  <feature.icon className="h-5 w-5 text-[#B89A5A]" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#F4F2ED] mb-3">{feature.title}</h3>
                <p className="text-[#8E96A3] text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* Contact Form */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">Get Started</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#F4F2ED]">Request Enterprise Demo</h2>
            <p className="text-[#8E96A3] mt-4">Our team will contact you within 24 hours to arrange a personalised demonstration.</p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1C1F26] rounded-2xl border border-[#B89A5A]/30 p-12 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/40 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-6 w-6 text-[#B89A5A]" />
              </div>
              <h3 className="font-serif text-2xl text-[#F4F2ED] mb-3">Request Received</h3>
              <p className="text-[#8E96A3]">We'll be in touch within 24 hours to schedule your enterprise demonstration.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#1C1F26] rounded-2xl border border-[#B89A5A]/15 p-8 space-y-5">
              <div>
                <label className="block text-[#8E96A3] text-sm mb-2 tracking-wide">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0B1A2A] border border-[#B89A5A]/20 rounded-lg px-4 py-3 text-[#F4F2ED] text-sm outline-none focus:border-[#B89A5A]/60 transition-colors placeholder:text-[#8E96A3]/40"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-[#8E96A3] text-sm mb-2 tracking-wide">Company</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-[#0B1A2A] border border-[#B89A5A]/20 rounded-lg px-4 py-3 text-[#F4F2ED] text-sm outline-none focus:border-[#B89A5A]/60 transition-colors placeholder:text-[#8E96A3]/40"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label className="block text-[#8E96A3] text-sm mb-2 tracking-wide">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0B1A2A] border border-[#B89A5A]/20 rounded-lg px-4 py-3 text-[#F4F2ED] text-sm outline-none focus:border-[#B89A5A]/60 transition-colors placeholder:text-[#8E96A3]/40"
                  placeholder="your@company.com"
                />
              </div>
              <div>
                <label className="block text-[#8E96A3] text-sm mb-2 tracking-wide">Number of Employees</label>
                <select
                  required
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                  className="w-full bg-[#0B1A2A] border border-[#B89A5A]/20 rounded-lg px-4 py-3 text-[#F4F2ED] text-sm outline-none focus:border-[#B89A5A]/60 transition-colors"
                >
                  <option value="" className="text-[#8E96A3]">Select team size</option>
                  <option value="1-10">1–10 employees</option>
                  <option value="11-50">11–50 employees</option>
                  <option value="51-200">51–200 employees</option>
                  <option value="200+">200+ employees</option>
                </select>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-xl py-4 text-base shadow-lg shadow-[#B89A5A]/20 hover:shadow-xl hover:shadow-[#B89A5A]/30 transition-all duration-300"
              >
                Request Enterprise Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default ForCompaniesPage;
