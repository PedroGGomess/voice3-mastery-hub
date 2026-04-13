import CompanyLayout from "@/components/CompanyLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageSquare, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const faqs = [
  { q: "How do I add new students to the platform?", a: "Go to 'Students' in the sidebar and click 'Add Student'. Fill in the name, email and choose a pack. The student will receive an email invitation." },
  { q: "How do I track team progress?", a: "In the 'Progress' section you'll see an overview with progress bars by student, team statistics and a leaderboard with top performers." },
  { q: "Can I change a student's pack?", a: "Yes. In the students list, click the edit icon next to the student and select the new pack." },
  { q: "How does billing work?", a: "Packs are purchased per student. Go to 'Packs & Payments' to see available plans and payment history." },
  { q: "Can I have custom reports?", a: "Contact us for Enterprise solutions with custom reports, data export and dedicated account manager." },
  { q: "How do I cancel the subscription?", a: "Contact our support via email or using the form below. We process cancellations within 48 business hours." },
];

const EmpresaSuporte = () => {
  const { currentUser } = useAuth();
  const storageKey = `voice3_support_tickets_${currentUser?.id}`;

  const getTickets = () => {
    try { const s = localStorage.getItem(storageKey); return s ? JSON.parse(s) : []; } catch (_e) {
      // ignore
      return [];
    }
  };

  const [tickets, setTickets] = useState(getTickets);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = { id: `t-${Date.now()}`, subject, message, createdAt: new Date().toISOString(), status: "open" };
    const updated = [ticket, ...tickets];
    setTickets(updated);
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch (_e) {
      // ignore
    }
    toast.success("Support request sent!");
    setSubject("");
    setMessage("");
  };

  return (
    <CompanyLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold">Company Support</h1>
          <p className="text-muted-foreground">Help for company administrators.</p>
        </div>

        <div className="premium-card mb-8">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" /> Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="premium-card">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Contact Support</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Company</Label><Input value={currentUser?.company || ""} disabled className="h-11 rounded-xl opacity-60" /></div>
              <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="h-11 rounded-xl" /></div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={4}
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11">Send Request</Button>
            </form>
          </div>
          <div className="premium-card">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Previous Requests</h2>
            {tickets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-30" /><p>No previous requests.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t: unknown) => {
                  const ticket = t as Record<string, unknown>;
                  return (
                    <div key={ticket.id as string} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-sm">{ticket.subject as string}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${ticket.status === "resolved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                          {ticket.status === "resolved" ? "Resolved" : "Under Review"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{ticket.message as string}</p>
                      <p className="text-xs text-white/30 mt-1">{new Date(ticket.createdAt as string).toLocaleDateString("en-GB")}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </CompanyLayout>
  );
};

export default EmpresaSuporte;
