import CompanyLayout from "@/components/CompanyLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Bell, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CompanySettings {
  companyName: string;
  website: string;
  sector: string;
  phone: string;
  notifySessionCompleted: boolean;
  notifyNewStudent: boolean;
  notifyWeeklyReport: boolean;
}

const Definicoes = () => {
  const { currentUser, updateProfile } = useAuth();
  const storageKey = `voice3_company_settings_${currentUser?.id}`;

  const getSettings = (): CompanySettings => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch (_e) {
      // ignore
    }
    return {
      companyName: currentUser?.company || "",
      website: "",
      sector: "",
      phone: "",
      notifySessionCompleted: true,
      notifyNewStudent: true,
      notifyWeeklyReport: false,
    };
  };

  const [settings, setSettings] = useState<CompanySettings>(getSettings);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
      updateProfile({ company: settings.companyName });
      toast.success("Definições guardadas com sucesso!");
    } catch {
      toast.error("Erro ao guardar. Tenta novamente.");
    } finally {
      setSaving(false);
    }
  };

  const toggleNotification = (key: keyof CompanySettings) => {
    setSettings(s => ({ ...s, [key]: !s[key] }));
  };

  return (
    <CompanyLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold">Definições</h1>
          <p className="text-muted-foreground">Configura a tua conta e preferências de empresa.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Company profile */}
          <div className="premium-card">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Building className="h-4 w-4 text-primary" /> Perfil da Empresa</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da empresa</Label>
                <Input value={settings.companyName} onChange={e => setSettings(s => ({ ...s, companyName: e.target.value }))} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input value={settings.website} onChange={e => setSettings(s => ({ ...s, website: e.target.value }))} placeholder="https://empresa.pt" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Setor</Label>
                <Input value={settings.sector} onChange={e => setSettings(s => ({ ...s, sector: e.target.value }))} placeholder="ex: Tecnologia, Serviços..." className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={settings.phone} onChange={e => setSettings(s => ({ ...s, phone: e.target.value }))} placeholder="+351 210 000 000" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Email de contacto</Label>
                <Input value={currentUser?.email || ""} disabled className="h-11 rounded-xl opacity-60" />
                <p className="text-xs text-muted-foreground">O email não pode ser alterado aqui.</p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="premium-card">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Notificações</h2>
            <div className="space-y-4">
              {[
                { key: "notifySessionCompleted" as const, label: "Sessão concluída por aluno", description: "Recebe notificação quando um aluno completa uma sessão" },
                { key: "notifyNewStudent" as const, label: "Novo aluno adicionado", description: "Recebe notificação quando um novo aluno é registado" },
                { key: "notifyWeeklyReport" as const, label: "Relatório semanal", description: "Recebe um resumo semanal do progresso da equipa" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification(n.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[n.key] ? "bg-primary" : "bg-white/20"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[n.key] ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security info */}
          <div className="premium-card">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Segurança</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Para alterar a password da tua conta, contacta o suporte ou usa a opção de recuperação de password na página de login.</p>
              <p>Os dados da tua empresa são armazenados de forma segura e nunca são partilhados com terceiros.</p>
            </div>
          </div>

          <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 px-8">
            {saving ? "A guardar..." : "Guardar Definições"}
          </Button>
        </form>
      </motion.div>
    </CompanyLayout>
  );
};

export default Definicoes;
