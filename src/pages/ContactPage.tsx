import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/ChatWidget";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
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
      <section className="pt-32 pb-16 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-6 font-medium">Get In Touch</p>
          <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#F4F2ED] mb-6 leading-tight">
            Contact Us
          </h1>
          <div className="flex justify-center mb-8">
            <div className="w-20 h-0.5 bg-[#B89A5A]" />
          </div>
          <p className="text-[#8E96A3] text-lg leading-relaxed">
            Questions about the programme, enterprise solutions, or press enquiries — our team responds within 24 hours.
          </p>
        </motion.div>
      </section>

      {/* Contact Grid */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="font-serif text-2xl font-semibold text-[#F4F2ED] mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-[#B89A5A]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[#8E96A3] text-xs uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:hello@voice3.com" className="text-[#F4F2ED] text-sm hover:text-[#B89A5A] transition-colors">hello@voice3.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="h-4 w-4 text-[#B89A5A]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[#8E96A3] text-xs uppercase tracking-wider mb-1">Live Chat</p>
                    <p className="text-[#F4F2ED] text-sm">Available via the chat widget</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-[#B89A5A]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[#8E96A3] text-xs uppercase tracking-wider mb-1">Based In</p>
                    <p className="text-[#F4F2ED] text-sm">Lisbon, Portugal</p>
                    <p className="text-[#8E96A3] text-xs">Serving clients globally</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="pt-6 border-t border-[#B89A5A]/10">
              <p className="text-[#8E96A3] text-xs leading-relaxed">
                For enterprise enquiries and custom solutions, visit our{" "}
                <a href="/for-companies" className="text-[#B89A5A] hover:underline">For Companies</a>{" "}
                page.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1C1F26] rounded-2xl border border-[#B89A5A]/30 p-12 text-center h-full flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/40 flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-6 w-6 text-[#B89A5A]" />
                </div>
                <h3 className="font-serif text-2xl text-[#F4F2ED] mb-3">Message Sent</h3>
                <p className="text-[#8E96A3]">Thank you for reaching out. We'll respond within 24 hours.</p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                onSubmit={handleSubmit}
                className="bg-[#1C1F26] rounded-2xl border border-[#B89A5A]/15 p-8 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#8E96A3] text-sm mb-2 tracking-wide">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#0B1A2A] border border-[#B89A5A]/20 rounded-lg px-4 py-3 text-[#F4F2ED] text-sm outline-none focus:border-[#B89A5A]/60 transition-colors placeholder:text-[#8E96A3]/40"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8E96A3] text-sm mb-2 tracking-wide">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#0B1A2A] border border-[#B89A5A]/20 rounded-lg px-4 py-3 text-[#F4F2ED] text-sm outline-none focus:border-[#B89A5A]/60 transition-colors placeholder:text-[#8E96A3]/40"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#8E96A3] text-sm mb-2 tracking-wide">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#0B1A2A] border border-[#B89A5A]/20 rounded-lg px-4 py-3 text-[#F4F2ED] text-sm outline-none focus:border-[#B89A5A]/60 transition-colors placeholder:text-[#8E96A3]/40"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-[#8E96A3] text-sm mb-2 tracking-wide">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#0B1A2A] border border-[#B89A5A]/20 rounded-lg px-4 py-3 text-[#F4F2ED] text-sm outline-none focus:border-[#B89A5A]/60 transition-colors placeholder:text-[#8E96A3]/40 resize-none"
                    placeholder="Tell us more about your needs..."
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-xl py-4 text-base shadow-lg shadow-[#B89A5A]/20 hover:shadow-xl hover:shadow-[#B89A5A]/30 transition-all duration-300"
                >
                  Send Message
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.form>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default ContactPage;
