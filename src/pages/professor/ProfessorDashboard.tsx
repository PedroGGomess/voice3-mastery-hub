import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users, Calendar, BookOpen, ClipboardList,
  Search, ChevronRight, Clock,
  AlertTriangle, Plus, CalendarDays, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";

interface ProfessorStudent {
  id: string;
  name: string;
  email: string;
  pack: string;
  completedChapters: number;
  totalChapters: number;
  nextSession: string | null;
  level: string | null;
  teachingStyle: string | null;
}

interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  pack: string;
}

interface Assignment {
  id: string;
  studentId: string;
  studentName: string;
  type: 'ai_drill' | 'writing_task' | 'voice_recording' | 'redo_session';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  createdAt: string;
}

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

const DAY_NAMES_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const progressLabel = (completed: number, total: number) => {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  if (pct < 30) return { label: 'Struggling', color: 'text-red-400 bg-red-400/10 border-red-400/20' };
  if (pct < 70) return { label: 'On Track', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' };
  return { label: 'Advanced', color: 'text-green-400 bg-green-400/10 border-green-400/20' };
};

export default function ProfessorDashboard() {
  const { currentUser } = useAuth();
  const professorId = currentUser?.id || 'demo-professor';

  const [students, setStudents] = useState<ProfessorStudent[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(
    Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      startTime: '09:00',
      endTime: '18:00',
      isActive: i >= 1 && i <= 5,
    }))
  );
  const [slotDuration, setSlotDuration] = useState(45);
  const [bufferMinutes, setBufferMinutes] = useState(10);
  const [timezone, setTimezone] = useState('Europe/Lisbon');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPack, setFilterPack] = useState('all');
  const [filterProgress, setFilterProgress] = useState('all');
  const [showStrugglingOnly, setShowStrugglingOnly] = useState(false);

  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [assignTarget, setAssignTarget] = useState('');
  const [assignType, setAssignType] = useState<Assignment['type']>('ai_drill');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');

  const [bookingListFilter, setBookingListFilter] = useState<'today' | 'week' | 'all'>('week');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`voice3_professor_students_${professorId}`);
      if (stored) setStudents(JSON.parse(stored));
    } catch (_e) {}

    try {
      const stored = localStorage.getItem(`voice3_professor_bookings_${professorId}`);
      if (stored) {
        setBookings(JSON.parse(stored));
      } else {
        const demoBookings: Booking[] = [
          { id: 'b1', studentId: 'cs1', studentName: 'Ana Costa', date: '2026-03-15', startTime: '10:00', endTime: '10:45', status: 'confirmed', pack: 'Pro' },
          { id: 'b2', studentId: 'cs2', studentName: 'Pedro Lopes', date: '2026-03-18', startTime: '14:00', endTime: '14:45', status: 'confirmed', pack: 'Advanced' },
          { id: 'b3', studentId: 'cs4', studentName: 'João Mendes', date: '2026-03-20', startTime: '11:00', endTime: '11:45', status: 'confirmed', pack: 'Pro' },
          { id: 'b4', studentId: 'cs1', studentName: 'Ana Costa', date: '2026-02-20', startTime: '10:00', endTime: '10:45', status: 'completed', pack: 'Pro' },
        ];
        setBookings(demoBookings);
        localStorage.setItem(`voice3_professor_bookings_${professorId}`, JSON.stringify(demoBookings));
      }
    } catch (_e) {}

    try {
      const stored = localStorage.getItem(`voice3_professor_assignments_${professorId}`);
      if (stored) {
        setAssignments(JSON.parse(stored));
      } else {
        const demoAssignments: Assignment[] = [
          { id: 'a1', studentId: 'cs3', studentName: 'Maria Silva', type: 'ai_drill', title: 'Filler Word Elimination', description: 'Practice 5-minute monologue without filler words', status: 'pending', dueDate: '2026-03-20', createdAt: '2026-03-10' },
          { id: 'a2', studentId: 'cs1', studentName: 'Ana Costa', type: 'writing_task', title: 'Executive Summary', description: 'Write a 200-word executive summary for a project', status: 'in_progress', dueDate: '2026-03-18', createdAt: '2026-03-08' },
        ];
        setAssignments(demoAssignments);
        localStorage.setItem(`voice3_professor_assignments_${professorId}`, JSON.stringify(demoAssignments));
      }
    } catch (_e) {}

    try {
      const stored = localStorage.getItem(`voice3_professor_availability_${professorId}`);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.slots) setAvailability(data.slots);
        if (data.slotDuration) setSlotDuration(data.slotDuration);
        if (data.bufferMinutes) setBufferMinutes(data.bufferMinutes);
        if (data.timezone) setTimezone(data.timezone);
      }
    } catch (_e) {}
  }, [professorId]);

  const saveAvailability = () => {
    localStorage.setItem(`voice3_professor_availability_${professorId}`, JSON.stringify({ slots: availability, slotDuration, bufferMinutes, timezone }));
    toast.success('Disponibilidade guardada com sucesso!');
  };

  const createAssignment = () => {
    if (!assignTarget || !assignTitle || !assignDueDate) {
      toast.error('Preenche todos os campos obrigatórios.');
      return;
    }
    const student = students.find(s => s.id === assignTarget);
    const newAssignment: Assignment = {
      id: `a-${Date.now()}`,
      studentId: assignTarget,
      studentName: student?.name || '',
      type: assignType,
      title: assignTitle,
      description: assignDesc,
      status: 'pending',
      dueDate: assignDueDate,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [...assignments, newAssignment];
    setAssignments(updated);
    localStorage.setItem(`voice3_professor_assignments_${professorId}`, JSON.stringify(updated));

    try {
      const studentKey = `voice3_student_assignments_${assignTarget}`;
      const existing = localStorage.getItem(studentKey);
      const studentAssignments = existing ? JSON.parse(existing) : [];
      studentAssignments.push({ ...newAssignment, professorName: currentUser?.name });
      localStorage.setItem(studentKey, JSON.stringify(studentAssignments));
    } catch (_e) {}

    setShowAssignDialog(false);
    setAssignTarget('');
    setAssignTitle('');
    setAssignDesc('');
    setAssignDueDate('');
    toast.success('Tarefa criada com sucesso!');
  };

  const cancelBooking = (bookingId: string) => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b);
    setBookings(updated);
    localStorage.setItem(`voice3_professor_bookings_${professorId}`, JSON.stringify(updated));
    toast.success('Sessão cancelada.');
  };

  const filteredStudents = students.filter(s => {
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterPack !== 'all' && s.pack !== filterPack) return false;
    if (filterProgress !== 'all') {
      const pct = s.totalChapters > 0 ? (s.completedChapters / s.totalChapters) * 100 : 0;
      if (filterProgress === 'struggling' && pct >= 30) return false;
      if (filterProgress === 'on_track' && (pct < 30 || pct >= 70)) return false;
      if (filterProgress === 'advanced' && pct < 70) return false;
    }
    if (showStrugglingOnly) {
      const pct = s.totalChapters > 0 ? (s.completedChapters / s.totalChapters) * 100 : 0;
      if (pct >= 30) return false;
    }
    return true;
  });

  const upcomingBookings = bookings.filter(b => {
    if (b.status === 'cancelled') return false;
    const now = new Date();
    const bookingDate = new Date(b.date);
    if (bookingListFilter === 'today') return bookingDate.toDateString() === now.toDateString();
    if (bookingListFilter === 'week') {
      const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return bookingDate >= now && bookingDate <= weekAhead;
    }
    return bookingDate >= now;
  });

  const packs = [...new Set(students.map(s => s.pack))];
  const statsStudents = students.length;
  const statsUpcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.date) >= new Date()).length;
  const statsPending = assignments.filter(a => a.status === 'pending').length;
  const statsStruggling = students.filter(s => s.totalChapters > 0 && (s.completedChapters / s.totalChapters) < 0.3).length;

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium mb-1">Professor Dashboard</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight">
          Bem-vinda, <span className="text-[#B89A5A]">{currentUser?.name?.split(' ')[0] || 'Professora'}</span>
        </h1>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Users, label: 'Alunos', value: statsStudents, color: 'text-blue-400' },
          { icon: CalendarDays, label: 'Sessões Marcadas', value: statsUpcoming, color: 'text-green-400' },
          { icon: ClipboardList, label: 'Tarefas Pendentes', value: statsPending, color: 'text-yellow-400' },
          { icon: AlertTriangle, label: 'Em Dificuldade', value: statsStruggling, color: 'text-red-400' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Card className="bg-[#1C1F26] border-white/5">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-[#F4F2ED]">{stat.value}</p>
                  <p className="text-xs text-[#8E96A3]">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Tabs defaultValue="students">
        <TabsList className="bg-[#1C1F26] border border-white/5 mb-6 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="students" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">
            <Users className="h-3.5 w-3.5 mr-1.5" />Alunos
          </TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />Horário
          </TabsTrigger>
          <TabsTrigger value="bookings" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">
            <CalendarDays className="h-3.5 w-3.5 mr-1.5" />Reservas
          </TabsTrigger>
          <TabsTrigger value="assignments" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">
            <ClipboardList className="h-3.5 w-3.5 mr-1.5" />Tarefas
          </TabsTrigger>
        </TabsList>

        {/* Students */}
        <TabsContent value="students">
          <Card className="bg-[#1C1F26] border-white/5">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <CardTitle className="text-sm font-semibold text-[#8E96A3] uppercase tracking-wider">Os Meus Alunos</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8E96A3]" />
                    <Input
                      placeholder="Pesquisar..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9 h-8 w-44 bg-white/5 border-white/10 text-[#F4F2ED] text-xs placeholder:text-[#8E96A3]"
                    />
                  </div>
                  <Select value={filterPack} onValueChange={setFilterPack}>
                    <SelectTrigger className="h-8 w-28 bg-white/5 border-white/10 text-xs text-[#F4F2ED]">
                      <SelectValue placeholder="Pack" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {packs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filterProgress} onValueChange={setFilterProgress}>
                    <SelectTrigger className="h-8 w-32 bg-white/5 border-white/10 text-xs text-[#F4F2ED]">
                      <SelectValue placeholder="Progresso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Progresso</SelectItem>
                      <SelectItem value="struggling">Struggling</SelectItem>
                      <SelectItem value="on_track">On Track</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => setShowStrugglingOnly(!showStrugglingOnly)}
                    className={`flex items-center gap-1.5 h-8 px-3 rounded-md text-xs border transition-all ${showStrugglingOnly ? 'bg-red-400/10 border-red-400/30 text-red-400' : 'bg-white/5 border-white/10 text-[#8E96A3] hover:border-white/20'}`}
                  >
                    <AlertTriangle className="h-3 w-3" />
                    Dificuldade
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-[#8E96A3]">
                  <Users className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">Nenhum aluno encontrado</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {filteredStudents.map((student, i) => {
                    const prog = progressLabel(student.completedChapters, student.totalChapters);
                    const pct = student.totalChapters > 0 ? Math.round((student.completedChapters / student.totalChapters) * 100) : 0;
                    return (
                      <motion.div key={student.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                        <Link to={`/professor/aluno/${student.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors group">
                          <div className="w-9 h-9 rounded-full bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-[#B89A5A]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium text-sm text-[#F4F2ED]">{student.name}</h3>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${prog.color}`}>{prog.label}</span>
                              {student.level && <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-400 font-medium">{student.level}</span>}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-[#8E96A3]">{student.pack}</span>
                              <span className="text-xs text-[#8E96A3]">{student.completedChapters}/{student.totalChapters} cap.</span>
                              {student.nextSession && <span className="text-xs text-[#8E96A3] flex items-center gap-1"><Clock className="h-3 w-3" />{student.nextSession}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="w-20 hidden sm:block">
                              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-[#B89A5A]" style={{ width: `${pct}%` }} />
                              </div>
                              <p className="text-[10px] text-right text-[#8E96A3] mt-0.5">{pct}%</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-[#B89A5A] transition-colors" />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule */}
        <TabsContent value="schedule">
          <Card className="bg-[#1C1F26] border-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-[#8E96A3] uppercase tracking-wider">Disponibilidade Semanal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {availability.map((slot) => (
                  <div key={slot.dayOfWeek} className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${slot.isActive ? 'bg-[#B89A5A]/5 border-[#B89A5A]/20' : 'bg-white/5 border-white/5'}`}>
                    <Checkbox
                      checked={slot.isActive}
                      onCheckedChange={(checked) => setAvailability(availability.map(s => s.dayOfWeek === slot.dayOfWeek ? { ...s, isActive: !!checked } : s))}
                    />
                    <span className={`text-sm font-medium w-20 ${slot.isActive ? 'text-[#F4F2ED]' : 'text-[#8E96A3]'}`}>
                      {DAY_NAMES_FULL[slot.dayOfWeek]}
                    </span>
                    {slot.isActive && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <input type="time" value={slot.startTime}
                          onChange={e => setAvailability(availability.map(s => s.dayOfWeek === slot.dayOfWeek ? { ...s, startTime: e.target.value } : s))}
                          className="h-7 px-2 rounded bg-white/5 border border-white/10 text-[#F4F2ED] text-xs" />
                        <span className="text-[#8E96A3] text-xs">até</span>
                        <input type="time" value={slot.endTime}
                          onChange={e => setAvailability(availability.map(s => s.dayOfWeek === slot.dayOfWeek ? { ...s, endTime: e.target.value } : s))}
                          className="h-7 px-2 rounded bg-white/5 border border-white/10 text-[#F4F2ED] text-xs" />
                      </div>
                    )}
                    {!slot.isActive && <span className="text-xs text-[#8E96A3]">Indisponível</span>}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs text-[#8E96A3] uppercase tracking-wider mb-2 block">Duração da sessão</label>
                  <Select value={String(slotDuration)} onValueChange={v => setSlotDuration(Number(v))}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-[#F4F2ED] text-sm h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                      <SelectItem value="60">60 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-[#8E96A3] uppercase tracking-wider mb-2 block">Buffer entre sessões</label>
                  <Select value={String(bufferMinutes)} onValueChange={v => setBufferMinutes(Number(v))}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-[#F4F2ED] text-sm h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sem buffer</SelectItem>
                      <SelectItem value="10">10 min</SelectItem>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-[#8E96A3] uppercase tracking-wider mb-2 block">Fuso horário</label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-[#F4F2ED] text-sm h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Lisbon">Lisboa</SelectItem>
                      <SelectItem value="Europe/London">Londres</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="America/New_York">Nova Iorque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={saveAvailability} className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold">
                Guardar Disponibilidade
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings */}
        <TabsContent value="bookings">
          <Card className="bg-[#1C1F26] border-white/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <CardTitle className="text-sm font-semibold text-[#8E96A3] uppercase tracking-wider">Reservas</CardTitle>
                <div className="flex items-center gap-2">
                  {(['today', 'week', 'all'] as const).map(f => (
                    <button key={f} onClick={() => setBookingListFilter(f)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${bookingListFilter === f ? 'bg-[#B89A5A]/10 border-[#B89A5A]/30 text-[#B89A5A]' : 'bg-white/5 border-white/10 text-[#8E96A3]'}`}>
                      {f === 'today' ? 'Hoje' : f === 'week' ? 'Esta Semana' : 'Todas'}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-[#8E96A3]">
                  <CalendarDays className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">Sem reservas para este período</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className="w-10 h-10 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
                        <CalendarDays className="h-4 w-4 text-[#B89A5A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-sm text-[#F4F2ED]">{booking.studentName}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/20 text-[#B89A5A] font-medium">{booking.pack}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${booking.status === 'confirmed' ? 'bg-green-400/10 border border-green-400/20 text-green-400' : booking.status === 'completed' ? 'bg-blue-400/10 border border-blue-400/20 text-blue-400' : 'bg-red-400/10 border border-red-400/20 text-red-400'}`}>
                            {booking.status === 'confirmed' ? 'Confirmada' : booking.status === 'completed' ? 'Concluída' : 'Cancelada'}
                          </span>
                        </div>
                        <p className="text-xs text-[#8E96A3] mt-0.5 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />{booking.date} · {booking.startTime}–{booking.endTime}
                        </p>
                      </div>
                      {booking.status === 'confirmed' && (
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => cancelBooking(booking.id)}>
                          Cancelar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments */}
        <TabsContent value="assignments">
          <Card className="bg-[#1C1F26] border-white/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-[#8E96A3] uppercase tracking-wider">Tarefas</CardTitle>
                <Button size="sm" className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] h-8 text-xs" onClick={() => setShowAssignDialog(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />Nova Tarefa
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {assignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-[#8E96A3]">
                  <ClipboardList className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">Sem tarefas criadas</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {assignments.map((a) => (
                    <div key={a.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className="w-9 h-9 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-4 w-4 text-[#B89A5A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-sm text-[#F4F2ED]">{a.title}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${a.status === 'pending' ? 'bg-yellow-400/10 border border-yellow-400/20 text-yellow-400' : a.status === 'in_progress' ? 'bg-blue-400/10 border border-blue-400/20 text-blue-400' : 'bg-green-400/10 border border-green-400/20 text-green-400'}`}>
                            {a.status === 'pending' ? 'Pendente' : a.status === 'in_progress' ? 'Em progresso' : 'Concluída'}
                          </span>
                        </div>
                        <p className="text-xs text-[#8E96A3] mt-0.5">{a.studentName} · prazo: {a.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="bg-[#1C1F26] border-white/10 text-[#F4F2ED]">
          <DialogHeader>
            <DialogTitle className="text-[#F4F2ED]">Nova Tarefa para Aluno</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-[#8E96A3] uppercase tracking-wider mb-1.5 block">Aluno *</label>
              <Select value={assignTarget} onValueChange={setAssignTarget}>
                <SelectTrigger className="bg-white/5 border-white/10 text-[#F4F2ED]">
                  <SelectValue placeholder="Seleccionar aluno" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-[#8E96A3] uppercase tracking-wider mb-1.5 block">Tipo de tarefa</label>
              <Select value={assignType} onValueChange={v => setAssignType(v as Assignment['type'])}>
                <SelectTrigger className="bg-white/5 border-white/10 text-[#F4F2ED]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai_drill">AI Drill</SelectItem>
                  <SelectItem value="writing_task">Tarefa de Escrita</SelectItem>
                  <SelectItem value="voice_recording">Gravação de Voz</SelectItem>
                  <SelectItem value="redo_session">Repetir Sessão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-[#8E96A3] uppercase tracking-wider mb-1.5 block">Título *</label>
              <Input value={assignTitle} onChange={e => setAssignTitle(e.target.value)} className="bg-white/5 border-white/10 text-[#F4F2ED]" placeholder="ex. Filler Word Elimination" />
            </div>
            <div>
              <label className="text-xs text-[#8E96A3] uppercase tracking-wider mb-1.5 block">Descrição</label>
              <textarea value={assignDesc} onChange={e => setAssignDesc(e.target.value)}
                className="w-full h-20 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-[#F4F2ED] text-sm placeholder:text-[#8E96A3] resize-none"
                placeholder="Instruções detalhadas para o aluno..." />
            </div>
            <div>
              <label className="text-xs text-[#8E96A3] uppercase tracking-wider mb-1.5 block">Prazo *</label>
              <input type="date" value={assignDueDate} onChange={e => setAssignDueDate(e.target.value)}
                className="w-full h-9 px-3 rounded-md bg-white/5 border border-white/10 text-[#F4F2ED] text-sm" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="text-[#8E96A3]" onClick={() => setShowAssignDialog(false)}>Cancelar</Button>
            <Button className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a]" onClick={createAssignment}>Criar Tarefa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PlatformLayout>
  );
}
