import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageSquare, CheckCircle2, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, Badge } from "@/components/ui/VoiceUI";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "open" | "resolved";
}

const faqs = [
  { q: "Como completo uma sessão?", a: "Para completar uma sessão, abre-a em 'Sessões', lê o conteúdo, realiza o exercício e responde ao quiz com pelo menos 60% de acertos. Clica em 'Completar Sessão' para guardar o progresso." },
  { q: "Como desbloquear as aulas com professora?", a: "As aulas com professora são desbloqueadas ao completar sessões: Aula #1 após 4 sessões, Aula #2 após 8 sessões. Vai a 'Aulas com Professora' para marcar." },
  { q: "Posso repetir uma sessão?", a: "Sim! Podes rever qualquer sessão já concluída a qualquer momento. A tua pontuação mais alta fica guardada." },
  { q: "O chat AI funciona offline?", a: "O chat AI requer ligação à internet para funcionar. As mensagens ficam guardadas localmente no teu browser." },
  { q: "Como altero os meus dados?", a: "Vai a 'Perfil' para editar o teu nome, empresa e password." },
  { q: "Quantas sessões tem o meu pack?", a: "O Pack Pro inclui 8 sessões de Inglês Empresarial, cobrindo desde vocabulário base até comunicação oral avançada, mais 2 aulas com professora." },
  { q: "Posso aceder à plataforma no telemóvel?", a: "Sim! A plataforma é totalmente responsiva e funciona em dispositivos móveis e tablets." },
];

const Suporte = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";
  const storageKey = `voice3_support_tickets_${userId}`;

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getTickets = (): Ticket[] => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  };

  const [tickets, setTickets] = useState<Ticket[]>(getTickets);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const ticket: Ticket = {
        id: `t-${Date.now()}`,
        subject,
        message,
        createdAt: new Date().toISOString(),
        status: "open",
      };
      const updated = [ticket, ...tickets];
      setTickets(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      toast.success("Pedido de suporte enviado! Responderemos em 24-48 horas.");
      setSubject("");
      setMessage("");
    } catch {
      toast.error("Erro ao enviar pedido. Tenta novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl font-bold mb-2">Suporte</h1>
        <p className="text-muted-foreground mb-8">Encontra respostas às tuas dúvidas ou contacta a nossa equipa.</p>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <Card hover>
          <h2 className="font-semibold mb-4 flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" /> Perguntas Frequentes</h2>
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contact form */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card hover>
            <h2 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Contactar Suporte</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={currentUser?.name || ""} disabled className="h-11 rounded-xl opacity-60" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={currentUser?.email || ""} disabled className="h-11 rounded-xl opacity-60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Descreve o teu problema brevemente" required className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <textarea
                  id="message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Descreve em detalhe o que precisas de ajuda..."
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11">
                {submitting ? "A enviar..." : "Enviar Pedido"}
              </Button>
            </form>
            </Card>
          </motion.div>

          {/* Ticket history */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card hover>
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Histórico de Pedidos</h2>
            {tickets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p>Ainda não tens pedidos de suporte.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map(t => (
                  <div key={t.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm">{t.subject}</p>
                      <Badge variant={t.status === "resolved" ? "success" : "gold"} size="xs">
                        {t.status === "resolved" ? "Resolvido" : "Em análise"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{t.message}</p>
                    <p className="text-xs text-white/30 mt-2">{new Date(t.createdAt).toLocaleDateString("pt-PT")}</p>
                  </div>
                ))}
              </div>
            )}
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PlatformLayout>
  );
};

export default Suporte;
