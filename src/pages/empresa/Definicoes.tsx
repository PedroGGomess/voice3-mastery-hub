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
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Error saving. Please try again.");
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
          <h1 className="font-serif text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your account and company preferences.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Company profile */}
          <div className="premium-card">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Building className="h-4 w-4 text-primary" /> Company Profile</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company name</Label>
                <Input value={settings.companyName} onChange={e => setSettings(s => ({ ...s, companyName: e.target.value }))} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input value={settings.website} onChange={e => setSettings(s => ({ ...s, website: e.target.value }))} placeholder="https://company.com" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Sector</Label>
                <Input value={settings.sector} onChange={e => setSettings(s => ({ ...s, sector: e.target.value }))} placeholder="e.g. Technology, Services..." className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={settings.phone} onChange={e => setSettings(s => ({ ...s, phone: e.target.value }))} placeholder="+44 20 7946 0958" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Contact email</Label>
                <Input value={currentUser?.email || ""} disabled className="h-11 rounded-xl opacity-60" />
                <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
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
              <p>To change your password, contact support or use the password recovery option on the login page.</p>
              <p>Your company data is stored securely and is never shared with third parties.</p>
            </div>
          </div>

          <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 px-8">
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </motion.div>
    </CompanyLayout>
  );
};

export default Definicoes;
