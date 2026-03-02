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
  { q: "Como adiciono novos alunos à plataforma?", a: "Vai a 'Alunos' no menu lateral e clica em 'Adicionar Aluno'. Preenche o nome, email e escolhe o pack. O aluno receberá um convite por email." },
  { q: "Como acompanho o progresso da equipa?", a: "Na secção 'Progresso' tens uma visão geral com barras de progresso por aluno, estatísticas da equipa e um leaderboard com os mais ativos." },
  { q: "Posso alterar o pack de um aluno?", a: "Sim. Na lista de alunos, clica no ícone de edição ao lado do aluno e seleciona o novo pack." },
  { q: "Como funciona a faturação?", a: "Os packs são adquiridos por aluno. Vais a 'Packs & Pagamentos' para ver os planos disponíveis e o histórico de pagamentos." },
  { q: "É possível ter relatórios personalizados?", a: "Contacta-nos para soluções Enterprise com relatórios personalizados, exportação de dados e gestor de conta dedicado." },
  { q: "Como cancelo a subscrição?", a: "Contacta o nosso suporte via email ou pelo formulário abaixo. Processamos cancelamentos em 48 horas úteis." },
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
    toast.success("Pedido de suporte enviado!");
    setSubject("");
    setMessage("");
  };

  return (
    <CompanyLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold">Suporte Empresa</h1>
          <p className="text-muted-foreground">Ajuda para administradores de empresa.</p>
        </div>

        <div className="premium-card mb-8">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" /> Perguntas Frequentes</h2>
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
            <h2 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Contactar Suporte</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Empresa</Label><Input value={currentUser?.company || ""} disabled className="h-11 rounded-xl opacity-60" /></div>
              <div className="space-y-2"><Label htmlFor="subject">Assunto</Label><Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="h-11 rounded-xl" /></div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={4}
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11">Enviar Pedido</Button>
            </form>
          </div>
          <div className="premium-card">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Pedidos Anteriores</h2>
            {tickets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-30" /><p>Sem pedidos anteriores.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t: unknown) => {
                  const ticket = t as Record<string, unknown>;
                  return (
                    <div key={ticket.id as string} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-sm">{ticket.subject}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${ticket.status === "resolved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                          {ticket.status === "resolved" ? "Resolvido" : "Em análise"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{ticket.message}</p>
                      <p className="text-xs text-white/30 mt-1">{new Date(ticket.createdAt as string).toLocaleDateString("pt-PT")}</p>
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
