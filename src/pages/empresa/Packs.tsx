import CompanyLayout from "@/components/CompanyLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const packOptions = [
  { name: "Starter", price: "€149", sessions: 4, features: ["4 Sessões AI", "1 Aula com Professora", "Chat AI 24/7", "Certificado de conclusão"] },
  { name: "Pro", price: "€249", sessions: 10, features: ["10 Sessões AI", "2 Aulas com Professora", "Chat AI 24/7", "Relatório de progresso", "Certificado de conclusão"], popular: true },
  { name: "Advanced", price: "€349", sessions: 15, features: ["15 Sessões AI", "3 Aulas com Professora", "Chat AI 24/7", "Relatório detalhado", "Acesso prioritário", "Certificado de conclusão"] },
  { name: "Enterprise", price: "Contactar", sessions: 0, features: ["Sessões ilimitadas", "Aulas ilimitadas", "Dashboard empresa", "Relatórios personalizados", "Gestor dedicado", "SLA garantido"] },
];

const Packs = () => {
  const { currentUser } = useAuth();
  const storageKey = `voice3_payment_history_${currentUser?.id}`;

  const getHistory = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (_e) {
      // ignore
      return [];
    }
  };

  const [history, setHistory] = useState(getHistory);

  const handleBuy = (pack: typeof packOptions[0]) => {
    if (pack.name === "Enterprise") {
      toast.info("Contacta-nos em enterprise@voice3.pt para uma proposta personalizada.");
      return;
    }
    const payment = { id: `pay-${Date.now()}`, pack: pack.name, price: pack.price, date: new Date().toISOString().split("T")[0], status: "Pago" };
    const updated = [payment, ...history];
    setHistory(updated);
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch (_e) {
      // ignore
    }
    toast.success(`Pack ${pack.name} adquirido com sucesso! (demonstração)`);
  };

  return (
    <CompanyLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold">Packs & Pagamentos</h1>
          <p className="text-muted-foreground">Escolhe o pack ideal para a tua equipa.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {packOptions.map((pack) => (
            <motion.div key={pack.name} whileHover={{ y: -2 }} className={`premium-card flex flex-col ${pack.popular ? "border-primary/40 bg-primary/5" : ""}`}>
              {pack.popular && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary w-fit mb-3">Mais popular</span>}
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-primary" />
                <h3 className="font-bold">{pack.name}</h3>
              </div>
              <p className="text-3xl font-bold mb-1">{pack.price}</p>
              {pack.sessions > 0 && <p className="text-xs text-muted-foreground mb-4">por aluno</p>}
              <ul className="space-y-2 flex-1 mb-6">
                {pack.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button onClick={() => handleBuy(pack)} className={`w-full rounded-xl ${pack.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`} variant={pack.popular ? "default" : "outline"}>
                {pack.name === "Enterprise" ? "Contactar" : "Adquirir"}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Payment history */}
        <div className="premium-card">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Histórico de Pagamentos</h2>
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <CreditCard className="h-8 w-8 mx-auto mb-3 opacity-30" />
              <p>Ainda não há pagamentos registados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Pack</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</th>
                    <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody>
                    {history.map((h: unknown) => {
                  const item = h as Record<string, unknown>;
                  return (
                    <tr key={item.id as string} className="border-b border-border/30">
                      <td className="py-3 text-sm font-medium">{item.pack}</td>
                      <td className="py-3 text-sm">{item.price}</td>
                      <td className="py-3 text-sm text-muted-foreground">{item.date}</td>
                      <td className="py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">{item.status}</span></td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </CompanyLayout>
  );
};

export default Packs;
