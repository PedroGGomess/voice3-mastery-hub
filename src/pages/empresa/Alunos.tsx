import CompanyLayout from "@/components/CompanyLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Pencil, Trash2, Users, ChevronRight, CheckCircle2, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  pack: string;
  completedSessions: number;
  totalSessions: number;
  status: string;
  teacherStatus: string;
  createdAt?: string;
}

type PackName = "Starter" | "Pro" | "Advanced" | "Business Master";

const PACK_OPTIONS: { name: PackName; price: string; sessions: string; live: string; totalSessions: number; popular?: boolean }[] = [
  { name: "Starter", price: "€149", sessions: "4 AI Sessions", live: "1 Live Professor Session", totalSessions: 4 },
  { name: "Pro", price: "€349", sessions: "8 AI Sessions", live: "2 Live Professor Sessions", totalSessions: 10, popular: true },
  { name: "Advanced", price: "€499", sessions: "12 AI Sessions", live: "3 Live Professor Sessions", totalSessions: 15 },
  { name: "Business Master", price: "Personalizado", sessions: "Unlimited Sessions", live: "Dedicated manager", totalSessions: 20 },
];

const STATUS_OPTIONS = ["All", "Novo", "Ativo", "Ativa", "Concluído"];

const defaultAddForm = () => ({
  name: "",
  email: "",
  department: "",
  position: "",
  pack: "Pro" as PackName,
  billToCompany: false,
  cardNumber: "",
  expiry: "",
  cvv: "",
  nameOnCard: "",
});

const Alunos = () => {
  const { currentUser } = useAuth();
  const storageKey = `voice3_company_students_${currentUser?.id}`;

  const getStudents = (): Student[] => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  };

  const saveStudents = (s: Student[]) => {
    try { localStorage.setItem(storageKey, JSON.stringify(s)); } catch (_e) { /* ignore */ }
  };

  const [students, setStudents] = useState<Student[]>(getStudents);
  const [search, setSearch] = useState("");
  const [filterPack, setFilterPack] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Multi-step add modal
  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [addForm, setAddForm] = useState(defaultAddForm());
  const [addLoading, setAddLoading] = useState(false);

  // Edit / delete
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = students.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchPack = filterPack === "All" || s.pack === filterPack;
    const matchStatus = filterStatus === "All" || s.status === filterStatus;
    return matchSearch && matchPack && matchStatus;
  });

  // ── Multi-step add ──────────────────────────────────────────────
  const openAdd = () => {
    setAddForm(defaultAddForm());
    setAddStep(1);
    setShowAdd(true);
  };

  const closeAdd = () => {
    setShowAdd(false);
    setAddStep(1);
    setAddForm(defaultAddForm());
  };

  const selectedPack = PACK_OPTIONS.find(p => p.name === addForm.pack)!;

  const handleConfirmPayment = async () => {
    setAddLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const pack = PACK_OPTIONS.find(p => p.name === addForm.pack)!;
    const newStudent: Student = {
      id: `cs-${Date.now()}`,
      name: addForm.name,
      email: addForm.email,
      department: addForm.department,
      position: addForm.position,
      pack: addForm.pack,
      completedSessions: 0,
      totalSessions: pack.totalSessions,
      status: "Novo",
      teacherStatus: "Por marcar",
      createdAt: new Date().toISOString(),
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    saveStudents(updated);
    setAddLoading(false);
    setAddStep(4);
  };

  // ── Edit ────────────────────────────────────────────────────────
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    const updated = students.map(s => s.id === editStudent.id ? editStudent : s);
    setStudents(updated);
    saveStudents(updated);
    setEditStudent(null);
    toast.success("Aluno atualizado com sucesso!");
  };

  // ── Delete ──────────────────────────────────────────────────────
  const handleDelete = () => {
    if (!deleteId) return;
    const updated = students.filter(s => s.id !== deleteId);
    setStudents(updated);
    saveStudents(updated);
    setDeleteId(null);
    toast.success("Aluno removido.");
  };

  return (
    <CompanyLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl font-bold">Alunos</h1>
            <p className="text-muted-foreground">Gere os alunos da tua empresa.</p>
          </div>
          <Button onClick={openAdd} className="bg-[#B89A5A] text-black hover:bg-[#B89A5A]/90 rounded-xl font-semibold">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Aluno
          </Button>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex-1 min-w-[180px] max-w-xs">
            <Search className="h-4 w-4 text-white/40 shrink-0" />
            <input
              type="text"
              placeholder="Pesquisar alunos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
            />
          </div>
          <select
            value={filterPack}
            onChange={e => setFilterPack(e.target.value)}
            className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
          >
            {["All", ...PACK_OPTIONS.map(p => p.name)].map(p => (
              <option key={p} value={p} className="bg-[#0B1A2A]">{p === "All" ? "Todos os Packs" : p}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s} className="bg-[#0B1A2A]">{s === "All" ? "Todos os Estados" : s}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="premium-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Pack</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Progresso</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Aula Prof.</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const pct = s.totalSessions > 0 ? (s.completedSessions / s.totalSessions) * 100 : 0;
                  return (
                    <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                        {(s.department || s.position) && (
                          <p className="text-xs text-muted-foreground/70">{[s.position, s.department].filter(Boolean).join(" · ")}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#B89A5A]/10 text-[#B89A5A]">{s.pack}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#B89A5A] transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{s.completedSessions}/{s.totalSessions}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          s.status === "Novo" || s.status === "Nova" ? "bg-yellow-500/10 text-yellow-400" :
                          s.status === "Concluído" ? "bg-green-500/10 text-green-400" :
                          "bg-blue-500/10 text-blue-400"
                        }`}>{s.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{s.teacherStatus}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toast.info("Funcionalidade em desenvolvimento")}
                            className="text-xs text-[#B89A5A] hover:text-[#B89A5A]/80 border border-[#B89A5A]/30 hover:border-[#B89A5A]/60 rounded-lg px-2 py-1 transition-colors"
                          >
                            Ver Detalhes
                          </button>
                          <button onClick={() => setEditStudent({ ...s })} className="text-muted-foreground hover:text-foreground transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => setDeleteId(s.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground text-sm">
                      <Users className="h-10 w-10 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">Nenhum aluno encontrado</p>
                      {!search && filterPack === "All" && filterStatus === "All" && (
                        <p className="text-xs mt-1 opacity-60">Adiciona o primeiro aluno clicando no botão acima.</p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Multi-step Add Modal ───────────────────────────────── */}
        <Dialog open={showAdd} onOpenChange={v => { if (!v) closeAdd(); }}>
          <DialogContent className="bg-[#0B1A2A] border border-white/10 text-white max-w-lg w-full p-0 overflow-hidden">
            {/* Step indicators */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
              <DialogTitle className="text-lg font-semibold">
                {addStep === 1 && "Informação do Aluno"}
                {addStep === 2 && "Selecionar Pack"}
                {addStep === 3 && "Pagamento"}
                {addStep === 4 && "Confirmação"}
              </DialogTitle>
              {addStep < 4 && (
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map(n => (
                    <div
                      key={n}
                      className={`h-2 rounded-full transition-all ${
                        n < addStep ? "w-5 bg-[#B89A5A]" : n === addStep ? "w-5 bg-[#B89A5A]" : "w-2 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {/* ── Step 1: Student Info ── */}
              {addStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="px-6 py-5 space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label className="text-white/80 text-sm">Nome completo <span className="text-[#B89A5A]">*</span></Label>
                    <Input
                      value={addForm.name}
                      onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="ex: Ana Silva"
                      className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/80 text-sm">Email profissional <span className="text-[#B89A5A]">*</span></Label>
                    <Input
                      type="email"
                      value={addForm.email}
                      onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="ex: ana.silva@empresa.pt"
                      className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-white/80 text-sm">Departamento</Label>
                      <Input
                        value={addForm.department}
                        onChange={e => setAddForm(f => ({ ...f, department: e.target.value }))}
                        placeholder="ex: Marketing"
                        className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/80 text-sm">Cargo / Posição</Label>
                      <Input
                        value={addForm.position}
                        onChange={e => setAddForm(f => ({ ...f, position: e.target.value }))}
                        placeholder="ex: Manager"
                        className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => setAddStep(2)}
                      disabled={!addForm.name.trim() || !addForm.email.trim()}
                      className="bg-[#B89A5A] text-black hover:bg-[#B89A5A]/90 rounded-xl font-semibold disabled:opacity-40"
                    >
                      Próximo <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Select Pack ── */}
              {addStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="px-6 py-5"
                >
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {PACK_OPTIONS.map(pack => (
                      <button
                        key={pack.name}
                        onClick={() => setAddForm(f => ({ ...f, pack: pack.name }))}
                        className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                          addForm.pack === pack.name
                            ? "border-[#B89A5A] bg-[#B89A5A]/10"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        {pack.popular && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-[#B89A5A] text-black px-2 py-0.5 rounded-full whitespace-nowrap">
                            MAIS POPULAR
                          </span>
                        )}
                        <p className="font-semibold text-sm text-white">{pack.name}</p>
                        <p className="text-[#B89A5A] font-bold text-base mt-0.5">{pack.price}</p>
                        <p className="text-xs text-white/60 mt-1.5">{pack.sessions}</p>
                        <p className="text-xs text-white/50">{pack.live}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setAddStep(1)} className="rounded-xl border-white/10 text-white hover:bg-white/5">
                      ← Voltar
                    </Button>
                    <Button onClick={() => setAddStep(3)} className="bg-[#B89A5A] text-black hover:bg-[#B89A5A]/90 rounded-xl font-semibold">
                      Próximo <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Payment ── */}
              {addStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="px-6 py-5 space-y-4"
                >
                  {/* Summary */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Aluno</span>
                      <span className="font-medium">{addForm.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Email</span>
                      <span className="font-medium text-xs">{addForm.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Pack</span>
                      <span className="font-medium text-[#B89A5A]">{selectedPack.name}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-1.5 mt-1.5">
                      <span className="text-white/60">Total</span>
                      <span className="font-bold text-[#B89A5A]">{selectedPack.price}</span>
                    </div>
                  </div>

                  {/* Billing toggle */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={addForm.billToCompany}
                      onChange={e => setAddForm(f => ({ ...f, billToCompany: e.target.checked }))}
                    />
                    <div
                      aria-hidden="true"
                      className={`relative w-10 h-5 rounded-full transition-colors ${addForm.billToCompany ? "bg-[#B89A5A]" : "bg-white/20"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${addForm.billToCompany ? "translate-x-5" : "translate-x-0"}`} />
                    </div>
                    <span className="text-sm text-white/80">Faturar à Empresa</span>
                  </label>

                  {/* Payment form (if not billing to company) */}
                  {!addForm.billToCompany && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-white/80 text-sm flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Número do Cartão</Label>
                        <Input
                          value={addForm.cardNumber}
                          onChange={e => setAddForm(f => ({ ...f, cardNumber: e.target.value }))}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-white/80 text-sm">Validade</Label>
                          <Input
                            value={addForm.expiry}
                            onChange={e => setAddForm(f => ({ ...f, expiry: e.target.value }))}
                            placeholder="MM/AA"
                            maxLength={5}
                            className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-white/80 text-sm">CVV</Label>
                          <Input
                            value={addForm.cvv}
                            onChange={e => setAddForm(f => ({ ...f, cvv: e.target.value }))}
                            placeholder="•••"
                            maxLength={4}
                            className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white/80 text-sm">Nome no Cartão</Label>
                        <Input
                          value={addForm.nameOnCard}
                          onChange={e => setAddForm(f => ({ ...f, nameOnCard: e.target.value }))}
                          placeholder="ex: Ana Silva"
                          className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-1">
                    <Button variant="outline" onClick={() => setAddStep(2)} className="rounded-xl border-white/10 text-white hover:bg-white/5">
                      ← Voltar
                    </Button>
                    <Button
                      onClick={handleConfirmPayment}
                      disabled={addLoading}
                      className="bg-[#B89A5A] text-black hover:bg-[#B89A5A]/90 rounded-xl font-semibold min-w-[150px]"
                    >
                      {addLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          A processar...
                        </span>
                      ) : "Confirmar e Pagar"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 4: Confirmation ── */}
              {addStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-6 py-8 text-center space-y-4"
                >
                  <div className="flex justify-center">
                    <div className="relative">
                      <CheckCircle2 className="h-16 w-16 text-[#B89A5A]" />
                      <span className="absolute -top-1 -right-1 text-2xl">🎉</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Aluno adicionado com sucesso!</h3>
                    <p className="text-white/60 text-sm mt-1">{addForm.name} foi adicionado à tua equipa.</p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-left space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-white/60">Nome</span>
                      <span className="font-medium">{addForm.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Email</span>
                      <span className="font-medium text-xs">{addForm.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Pack</span>
                      <span className="font-medium text-[#B89A5A]">{addForm.pack}</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/40 italic">
                    Um email de boas-vindas foi enviado para {addForm.email}
                  </p>
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl border-white/10 text-white hover:bg-white/5"
                      onClick={() => {
                        setAddForm(defaultAddForm());
                        setAddStep(1);
                      }}
                    >
                      Adicionar Outro Aluno
                    </Button>
                    <Button
                      className="flex-1 bg-[#B89A5A] text-black hover:bg-[#B89A5A]/90 rounded-xl font-semibold"
                      onClick={closeAdd}
                    >
                      Fechar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>

        {/* Edit dialog */}
        <Dialog open={!!editStudent} onOpenChange={() => setEditStudent(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar Aluno</DialogTitle></DialogHeader>
            {editStudent && (
              <form onSubmit={handleEdit} className="space-y-4">
                <div className="space-y-2"><Label>Nome completo</Label><Input value={editStudent.name} onChange={e => setEditStudent(s => s ? { ...s, name: e.target.value } : s)} required className="h-11 rounded-xl" /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={editStudent.email} onChange={e => setEditStudent(s => s ? { ...s, email: e.target.value } : s)} required className="h-11 rounded-xl" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Departamento</Label><Input value={editStudent.department || ""} onChange={e => setEditStudent(s => s ? { ...s, department: e.target.value } : s)} className="h-11 rounded-xl" /></div>
                  <div className="space-y-2"><Label>Cargo</Label><Input value={editStudent.position || ""} onChange={e => setEditStudent(s => s ? { ...s, position: e.target.value } : s)} className="h-11 rounded-xl" /></div>
                </div>
                <div className="space-y-2">
                  <Label>Pack</Label>
                  <select value={editStudent.pack} onChange={e => setEditStudent(s => s ? { ...s, pack: e.target.value } : s)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                    {PACK_OPTIONS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setEditStudent(null)}>Cancelar</Button>
                  <Button type="submit" className="flex-1 bg-primary text-primary-foreground rounded-xl">Guardar</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete confirm */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover aluno?</AlertDialogTitle>
              <AlertDialogDescription>Esta ação não pode ser desfeita. O aluno será permanentemente removido.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remover</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </CompanyLayout>
  );
};

export default Alunos;
