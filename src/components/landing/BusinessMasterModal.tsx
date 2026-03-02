import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BusinessMasterModalProps {
  open: boolean;
  onClose: () => void;
}

const BusinessMasterModal = ({ open, onClose }: BusinessMasterModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    empresa: "",
    cargo: "",
    colaboradores: "",
    necessidades: "",
    autorizo: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const leads = JSON.parse(localStorage.getItem("voice3_commercial_leads") || "[]");
    leads.push({ ...form, submittedAt: new Date().toISOString() });
    localStorage.setItem("voice3_commercial_leads", JSON.stringify(leads));
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ nome: "", email: "", empresa: "", cargo: "", colaboradores: "", necessidades: "", autorizo: false });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1C1F26] border border-[#B89A5A]/30 text-[#F4F2ED] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-[#F4F2ED]">Programa Business Master</DialogTitle>
          <DialogDescription className="text-[#8E96A3]">
            Desenhamos um programa à medida da sua equipa.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="text-4xl mb-4">✓</div>
            <p className="text-[#B89A5A] font-serif text-lg mb-2">Obrigado!</p>
            <p className="text-[#8E96A3] text-sm">A nossa equipa comercial entrará em contacto nas próximas 24 horas.</p>
            <Button onClick={handleClose} className="mt-6 bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a]">Fechar</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {[
              { id: "nome", label: "Nome completo", type: "text", placeholder: "João Silva" },
              { id: "email", label: "Email profissional", type: "email", placeholder: "joao@empresa.com" },
              { id: "empresa", label: "Empresa", type: "text", placeholder: "Empresa Lda." },
              { id: "cargo", label: "Cargo / Posição", type: "text", placeholder: "CEO, Director..." },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label className="block text-sm text-[#8E96A3] mb-1">{label}</label>
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[id as keyof typeof form] as string}
                  onChange={(e) => setForm((p) => ({ ...p, [id]: e.target.value }))}
                  className="w-full bg-[#0B1A2A] border border-[#B89A5A]/20 rounded-lg px-4 py-2.5 text-[#F4F2ED] placeholder-[#8E96A3]/40 focus:outline-none focus:border-[#B89A5A]/60 text-sm"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm text-[#8E96A3] mb-1">Número de colaboradores</label>
              <select
                required
                value={form.colaboradores}
                onChange={(e) => setForm((p) => ({ ...p, colaboradores: e.target.value }))}
                className="w-full bg-[#0B1A2A] border border-[#B89A5A]/20 rounded-lg px-4 py-2.5 text-[#F4F2ED] focus:outline-none focus:border-[#B89A5A]/60 text-sm"
              >
                <option value="">Selecionar...</option>
                {["1-5", "6-10", "11-25", "26-50", "50+"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#8E96A3] mb-1">Necessidades específicas</label>
              <textarea
                rows={3}
                placeholder="Descreva as necessidades da sua equipa..."
                value={form.necessidades}
                onChange={(e) => setForm((p) => ({ ...p, necessidades: e.target.value }))}
                className="w-full bg-[#0B1A2A] border border-[#B89A5A]/20 rounded-lg px-4 py-2.5 text-[#F4F2ED] placeholder-[#8E96A3]/40 focus:outline-none focus:border-[#B89A5A]/60 text-sm resize-none"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={form.autorizo}
                onChange={(e) => setForm((p) => ({ ...p, autorizo: e.target.checked }))}
                className="mt-0.5 accent-[#B89A5A]"
              />
              <span className="text-xs text-[#8E96A3]">
                Autorizo o contacto por parte da equipa VOICE³
              </span>
            </label>

            <Button type="submit" className="w-full bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold h-11 rounded-lg">
              Solicitar Proposta
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BusinessMasterModal;
