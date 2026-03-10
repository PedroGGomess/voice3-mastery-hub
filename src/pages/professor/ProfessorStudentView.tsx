import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft, User, BookOpen, ClipboardList, Mic,
  TrendingUp, Save, Plus, X, CheckSquare, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";
import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";

interface StudentInfo {
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

interface AIEvaluation {
  level: string;
  teachingStyle: string;
  weakPoints: Record<string, number>;
  aiConclusions: string;
  professorFocusPoints: string[];
  suggestedDrills: string[];
  recommendedPath: string[];
}

interface ProfessorNotes {
  privateNotes: string;
  actionPlan: string;
  nextSessionFocus: { id: string; text: string; done: boolean }[];
}

const STYLE_LABELS: Record<string, string> = {
  rigorous: '🔴 Rigorous',
  balanced: '🟡 Balanced',
  soft: '🟢 Soft',
  intensive: '⚡ Intensive',
  relaxed: '🌿 Relaxed',
  Rigorous: '🔴 Rigorous',
  Balanced: '🟡 Balanced',
  Soft: '🟢 Soft',
  Intensive: '⚡ Intensive',
  Relaxed: '🌿 Relaxed',
};

const LEVEL_COLORS: Record<string, string> = {
  B1: 'bg-blue-400/10 border-blue-400/20 text-blue-400',
  B2: 'bg-purple-400/10 border-purple-400/20 text-purple-400',
  C1: 'bg-orange-400/10 border-orange-400/20 text-orange-400',
  C2: 'bg-green-400/10 border-green-400/20 text-green-400',
};

export default function ProfessorStudentView() {
  const { studentId } = useParams<{ studentId: string }>();
  const { currentUser } = useAuth();
  const professorId = currentUser?.id || 'demo-professor';

  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [aiEval, setAiEval] = useState<AIEvaluation | null>(null);
  const [notes, setNotes] = useState<ProfessorNotes>({
    privateNotes: '',
    actionPlan: '',
    nextSessionFocus: [],
  });
  const [newFocusText, setNewFocusText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load student info
    try {
      const stored = localStorage.getItem(`voice3_professor_students_${professorId}`);
      if (stored) {
        const students: StudentInfo[] = JSON.parse(stored);
        const found = students.find(s => s.id === studentId);
        if (found) setStudent(found);
      }
    } catch (_e) {}

    // Load AI evaluation for the student
    try {
      const stored = localStorage.getItem(`voice3_ai_evaluation_${studentId}`);
      if (stored) {
        setAiEval(JSON.parse(stored));
      } else {
        // Demo evaluation
        const demoEval: AIEvaluation = {
          level: student?.level || 'B2',
          teachingStyle: student?.teachingStyle || 'Balanced',
          weakPoints: { pronunciation: 4, structure: 7, vocabulary: 6, confidence: 3, filler: 8, clarity: 5 },
          aiConclusions: 'O aluno demonstra vocabulário sólido mas recorre frequentemente a palavras de preenchimento ("um", "err"). Tem dificuldades em estruturar respostas sob pressão. O ritmo de fala é irregular — acelera quando nervoso.',
          professorFocusPoints: ['Structured responses using PREP', 'Reduce filler words under pressure', 'Pacing control and strategic pauses'],
          suggestedDrills: ['PREP Framework Drill', 'Filler Word Elimination', '3-Point Message Builder'],
          recommendedPath: ['clarity', 'structure', 'confidence'],
        };
        setAiEval(demoEval);
      }
    } catch (_e) {}

    // Load professor notes
    try {
      const key = `voice3_professor_notes_${professorId}_${studentId}`;
      const stored = localStorage.getItem(key);
      if (stored) setNotes(JSON.parse(stored));
    } catch (_e) {}
  }, [studentId, professorId]);

  const saveNotes = () => {
    setIsSaving(true);
    const key = `voice3_professor_notes_${professorId}_${studentId}`;
    localStorage.setItem(key, JSON.stringify(notes));
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Notas guardadas com sucesso!');
    }, 400);
  };

  const addFocusPoint = () => {
    if (!newFocusText.trim()) return;
    const updated = { ...notes, nextSessionFocus: [...notes.nextSessionFocus, { id: `f-${Date.now()}`, text: newFocusText, done: false }] };
    setNotes(updated);
    setNewFocusText('');
  };

  const toggleFocusPoint = (id: string) => {
    const updated = { ...notes, nextSessionFocus: notes.nextSessionFocus.map(f => f.id === id ? { ...f, done: !f.done } : f) };
    setNotes(updated);
  };

  const removeFocusPoint = (id: string) => {
    const updated = { ...notes, nextSessionFocus: notes.nextSessionFocus.filter(f => f.id !== id) };
    setNotes(updated);
  };

  // Demo chart data
  const radarData = aiEval ? Object.entries(aiEval.weakPoints).map(([key, value]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    score: value,
  })) : [];

  const progressBarData = [
    { name: 'Cap. 1', score: 100 },
    { name: 'Cap. 2', score: 88 },
    { name: 'Cap. 3', score: 76 },
    { name: 'Cap. 4', score: 82 },
    { name: 'Cap. 5', score: 90 },
  ];

  const trendData = [
    { week: 'Sem 1', score: 65, confidence: 3 },
    { week: 'Sem 2', score: 72, confidence: 4 },
    { week: 'Sem 3', score: 78, confidence: 4 },
    { week: 'Sem 4', score: 85, confidence: 5 },
  ];

  const submissionsHistory = [
    { title: 'Diagnóstico Inicial', date: '2026-01-10', score: 72, type: 'diagnostic', feedback: 'Nível B2 confirmado. Pontos fortes: vocabulário. Melhorar: filler words e estrutura.' },
    { title: 'Apresentação Profissional', date: '2026-01-18', score: 85, type: 'audio', feedback: 'Boa estrutura. Reduzir hesitações. Ritmo melhorou significativamente.' },
    { title: 'Email Executivo', date: '2026-01-25', score: 90, type: 'writing', feedback: 'Excelente clareza e formalidade adequada. Tom assertivo mas diplomático.' },
  ];

  if (!student) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center py-24 text-[#8E96A3]">
          <p>Aluno não encontrado.</p>
        </div>
      </PlatformLayout>
    );
  }

  const pct = student.totalChapters > 0 ? Math.round((student.completedChapters / student.totalChapters) * 100) : 0;

  return (
    <PlatformLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to="/professor/dashboard" className="inline-flex items-center gap-2 text-xs text-[#8E96A3] hover:text-[#F4F2ED] mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />Voltar ao dashboard
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/20 flex items-center justify-center">
            <User className="h-6 w-6 text-[#B89A5A]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED]">{student.name}</h1>
              {student.level && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${LEVEL_COLORS[student.level] || 'bg-white/10 text-white/60 border-white/20'}`}>
                  {student.level}
                </span>
              )}
              {student.teachingStyle && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/20 text-[#B89A5A] font-medium">
                  {STYLE_LABELS[student.teachingStyle] || student.teachingStyle}
                </span>
              )}
            </div>
            <p className="text-sm text-[#8E96A3] mt-0.5">{student.pack} Pack · {student.completedChapters}/{student.totalChapters} capítulos ({pct}%)</p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-[#1C1F26] border border-white/5 mb-6 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">Visão Geral</TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">Progresso</TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">Diagnóstico IA</TabsTrigger>
          <TabsTrigger value="submissions" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">Submissões</TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">Notas</TabsTrigger>
        </TabsList>

        {/* ── OVERVIEW TAB ── */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-[#1C1F26] border-white/5">
              <CardHeader className="pb-2"><CardTitle className="text-xs text-[#8E96A3] uppercase tracking-wider">Informação Básica</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'Email', value: student.email },
                  { label: 'Pack', value: student.pack },
                  { label: 'Nível', value: student.level || '—' },
                  { label: 'Estilo', value: student.teachingStyle ? (STYLE_LABELS[student.teachingStyle] || student.teachingStyle) : '—' },
                  { label: 'Próxima sessão', value: student.nextSession || 'Por marcar' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-[#8E96A3]">{row.label}</span>
                    <span className="text-[#F4F2ED] font-medium">{row.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-[#1C1F26] border-white/5">
              <CardHeader className="pb-2"><CardTitle className="text-xs text-[#8E96A3] uppercase tracking-wider">Progresso do Curso</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-3xl font-bold text-[#F4F2ED]">{pct}%</span>
                  <span className="text-sm text-[#8E96A3] mb-1">{student.completedChapters}/{student.totalChapters} capítulos</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#B89A5A] to-[#d4ba6a]" style={{ width: `${pct}%` }} />
                </div>
              </CardContent>
            </Card>

            {aiEval && (
              <Card className="bg-[#1C1F26] border-white/5">
                <CardHeader className="pb-2"><CardTitle className="text-xs text-[#8E96A3] uppercase tracking-wider">Focos para a Próxima Sessão</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {aiEval.professorFocusPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-[#B89A5A] shrink-0 mt-0.5">•</span>
                      <span className="text-[#F4F2ED]">{point}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ── PROGRESS TAB ── */}
        <TabsContent value="progress">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-[#1C1F26] border-white/5">
              <CardHeader><CardTitle className="text-sm text-[#8E96A3] uppercase tracking-wider">Pontuação por Capítulo</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={progressBarData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fill: '#8E96A3', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8E96A3', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: '#1C1F26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F4F2ED' }} />
                    <Bar dataKey="score" fill="#B89A5A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-[#1C1F26] border-white/5">
              <CardHeader><CardTitle className="text-sm text-[#8E96A3] uppercase tracking-wider">Tendência de Progresso</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="week" tick={{ fill: '#8E96A3', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8E96A3', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: '#1C1F26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F4F2ED' }} />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#8E96A3' }} />
                    <Line type="monotone" dataKey="score" stroke="#B89A5A" strokeWidth={2} dot={{ fill: '#B89A5A' }} name="Score" />
                    <Line type="monotone" dataKey="confidence" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} name="Confiança" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── AI DIAGNOSTIC TAB ── */}
        <TabsContent value="ai">
          {!aiEval ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#8E96A3]">
              <p className="text-sm">Diagnóstico de IA ainda não disponível para este aluno.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-[#1C1F26] border-white/5">
                <CardHeader><CardTitle className="text-sm text-[#8E96A3] uppercase tracking-wider">Radar de Pontos Fracos</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#8E96A3', fontSize: 11 }} />
                      <Radar name="Score" dataKey="score" stroke="#B89A5A" fill="#B89A5A" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="bg-[#1C1F26] border-white/5">
                  <CardHeader className="pb-2"><CardTitle className="text-xs text-[#8E96A3] uppercase tracking-wider">Conclusões da IA</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#F4F2ED] leading-relaxed">{aiEval.aiConclusions}</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#1C1F26] border-white/5">
                  <CardHeader className="pb-2"><CardTitle className="text-xs text-[#8E96A3] uppercase tracking-wider">Drills Sugeridos</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {aiEval.suggestedDrills.map((drill, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-[#B89A5A]/10 text-[#B89A5A] text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                        <span className="text-[#F4F2ED]">{drill}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-[#1C1F26] border-white/5">
                  <CardHeader className="pb-2"><CardTitle className="text-xs text-[#8E96A3] uppercase tracking-wider">Focos para Sessões ao Vivo</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {aiEval.professorFocusPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-[#B89A5A] shrink-0 mt-0.5">→</span>
                        <span className="text-[#F4F2ED]">{point}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── SUBMISSIONS TAB ── */}
        <TabsContent value="submissions">
          <Card className="bg-[#1C1F26] border-white/5">
            <CardHeader><CardTitle className="text-sm text-[#8E96A3] uppercase tracking-wider">Histórico de Submissões</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/[0.04]">
                {submissionsHistory.map((s, i) => (
                  <div key={i} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0 mt-0.5">
                          {s.type === 'audio' ? <Mic className="h-4 w-4 text-[#B89A5A]" /> : <BookOpen className="h-4 w-4 text-[#B89A5A]" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-[#F4F2ED]">{s.title}</h3>
                          <p className="text-xs text-[#8E96A3] mt-0.5">{s.date}</p>
                          <p className="text-xs text-[#8E96A3] mt-2 leading-relaxed">{s.feedback}</p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className={`text-sm font-bold ${s.score >= 85 ? 'text-green-400' : s.score >= 70 ? 'text-[#B89A5A]' : 'text-red-400'}`}>
                          {s.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── NOTES TAB ── */}
        <TabsContent value="notes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-[#1C1F26] border-white/5">
              <CardHeader><CardTitle className="text-sm text-[#8E96A3] uppercase tracking-wider">Notas Privadas</CardTitle></CardHeader>
              <CardContent>
                <textarea
                  value={notes.privateNotes}
                  onChange={e => setNotes({ ...notes, privateNotes: e.target.value })}
                  className="w-full h-40 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#F4F2ED] text-sm placeholder:text-[#8E96A3] resize-none focus:border-[#B89A5A]/40 focus:outline-none transition-colors"
                  placeholder="Notas privadas sobre o aluno (só visíveis ao professor)..."
                />
              </CardContent>
            </Card>

            <Card className="bg-[#1C1F26] border-white/5">
              <CardHeader><CardTitle className="text-sm text-[#8E96A3] uppercase tracking-wider">Plano de Acção</CardTitle></CardHeader>
              <CardContent>
                <textarea
                  value={notes.actionPlan}
                  onChange={e => setNotes({ ...notes, actionPlan: e.target.value })}
                  className="w-full h-40 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#F4F2ED] text-sm placeholder:text-[#8E96A3] resize-none focus:border-[#B89A5A]/40 focus:outline-none transition-colors"
                  placeholder="Plano de acção para as próximas semanas..."
                />
              </CardContent>
            </Card>

            <Card className="bg-[#1C1F26] border-white/5 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#8E96A3] uppercase tracking-wider">Focos para a Próxima Sessão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-3">
                  {notes.nextSessionFocus.map(f => (
                    <div key={f.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <button onClick={() => toggleFocusPoint(f.id)} className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${f.done ? 'bg-[#B89A5A] border-[#B89A5A]' : 'border-white/20 hover:border-[#B89A5A]/50'}`}>
                        {f.done && <CheckSquare className="h-3 w-3 text-[#0B1A2A]" />}
                      </button>
                      <span className={`text-sm flex-1 ${f.done ? 'line-through text-[#8E96A3]' : 'text-[#F4F2ED]'}`}>{f.text}</span>
                      <button onClick={() => removeFocusPoint(f.id)} className="text-[#8E96A3] hover:text-red-400 transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFocusText}
                    onChange={e => setNewFocusText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addFocusPoint()}
                    className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F4F2ED] text-sm placeholder:text-[#8E96A3] focus:border-[#B89A5A]/40 focus:outline-none"
                    placeholder="Adicionar ponto de foco..."
                  />
                  <Button size="sm" className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] h-9" onClick={addFocusPoint}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 flex justify-end">
              <Button
                onClick={saveNotes}
                disabled={isSaving}
                className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'A guardar...' : 'Guardar Notas'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PlatformLayout>
  );
}
