import CompanyLayout from "@/components/CompanyLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  email: string;
  pack: string;
  completedSessions: number;
  totalSessions: number;
  status: string;
  teacherStatus: string;
}

const packs = ["Starter", "Pro", "Advanced"];

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
    try { localStorage.setItem(storageKey, JSON.stringify(s)); } catch {}
  };

  const [students, setStudents] = useState<Student[]>(getStudents);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", email: "", pack: "Pro" });

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `s-${Date.now()}`,
      name: form.name,
      email: form.email,
      pack: form.pack,
      completedSessions: 0,
      totalSessions: form.pack === "Starter" ? 4 : form.pack === "Advanced" ? 15 : 10,
      status: "Novo",
      teacherStatus: "—",
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    saveStudents(updated);
    setShowAdd(false);
    setForm({ name: "", email: "", pack: "Pro" });
    toast.success("Aluno adicionado com sucesso!");
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    const updated = students.map(s => s.id === editStudent.id ? editStudent : s);
    setStudents(updated);
    saveStudents(updated);
    setEditStudent(null);
    toast.success("Aluno atualizado com sucesso!");
  };

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl font-bold">Alunos</h1>
            <p className="text-muted-foreground">Gere os alunos da tua empresa.</p>
          </div>
          <Button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Aluno
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 mb-6 max-w-sm">
          <Search className="h-4 w-4 text-white/40 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar alunos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
          />
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
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{s.pack}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${s.totalSessions > 0 ? (s.completedSessions / s.totalSessions) * 100 : 0}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{s.completedSessions}/{s.totalSessions}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.status === "Nova" || s.status === "Novo" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>{s.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{s.teacherStatus}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditStudent({ ...s })} className="text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteId(s.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">
                      <Users className="h-8 w-8 mx-auto mb-3 opacity-30" />
                      {search ? "Nenhum aluno encontrado." : "Ainda não há alunos. Adiciona o primeiro!"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add dialog */}
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent>
            <DialogHeader><DialogTitle>Adicionar Aluno</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2"><Label>Nome completo</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="h-11 rounded-xl" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="h-11 rounded-xl" /></div>
              <div className="space-y-2">
                <Label>Pack</Label>
                <select value={form.pack} onChange={e => setForm(f => ({ ...f, pack: e.target.value }))} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                  {packs.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setShowAdd(false)}>Cancelar</Button>
                <Button type="submit" className="flex-1 bg-primary text-primary-foreground rounded-xl">Adicionar</Button>
              </div>
            </form>
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
                <div className="space-y-2">
                  <Label>Pack</Label>
                  <select value={editStudent.pack} onChange={e => setEditStudent(s => s ? { ...s, pack: e.target.value } : s)} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                    {packs.map(p => <option key={p} value={p}>{p}</option>)}
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
