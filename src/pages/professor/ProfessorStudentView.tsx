import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft, User, BookOpen,
  TrendingUp, Plus, X, CheckSquare, Brain, FileText, Sparkles, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAICoach } from "@/hooks/useAICoach";

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

interface SessionReport {
  id: string;
  session_title: string;
  session_type: string;
  grammar_score: number;
  vocabulary_score: number;
  fluency_score: number;
  confidence_score: number;
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  learning_style_detected: string;
  recommendations: string[];
  professor_prep_notes: string;
  created_at: string;
}

interface LearningProfile {
  preferred_learning_style: string;
  strong_areas: string[];
  weak_areas: string[];
  progress_velocity: string;
  total_sessions: number;
  avg_score: number;
  best_response_format: string;
  ai_teaching_notes: string;
  last_session_at: string;
}

const STYLE_LABELS: Record<string, string> = {
  rigorous: '🔴 Rigorous', balanced: '🟡 Balanced', soft: '🟢 Soft',
  intensive: '⚡ Intensive', relaxed: '🌿 Relaxed',
  Rigorous: '🔴 Rigorous', Balanced: '🟡 Balanced', Soft: '🟢 Soft',
  Intensive: '⚡ Intensive', Relaxed: '🌿 Relaxed',
};

const LEVEL_COLORS: Record<string, string> = {
  B1: 'bg-blue-400/10 border-blue-400/20 text-blue-400',
  B2: 'bg-purple-400/10 border-purple-400/20 text-purple-400',
  C1: 'bg-orange-400/10 border-orange-400/20 text-orange-400',
  C2: 'bg-green-400/10 border-green-400/20 text-green-400',
};

const LEARNING_STYLE_ICONS: Record<string, string> = {
  visual: '👁️', auditory: '👂', kinesthetic: '🤸', reading: '📖', balanced: '⚖️',
};

export default function ProfessorStudentView() {
  const { studentId } = useParams<{ studentId: string }>();
  const { currentUser } = useAuth();
  const { sendMessage: sendAIMessage } = useAICoach();
  const professorId = currentUser?.id || 'demo-professor';

  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [aiEval, setAiEval] = useState<AIEvaluation | null>(null);
  const [sessionReports, setSessionReports] = useState<SessionReport[]>([]);
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [lessonPrep, setLessonPrep] = useState<string | null>(null);
  const [loadingPrep, setLoadingPrep] = useState(false);
  const [notes, setNotes] = useState<ProfessorNotes>({
    privateNotes: '', actionPlan: '', nextSessionFocus: [],
  });
  const [newFocusText, setNewFocusText] = useState('');
  const [autoSaved, setAutoSaved] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Load student info from localStorage (existing flow)
    try {
      const stored = localStorage.getItem(`voice3_professor_students_${professorId}`);
      if (stored) {
        const students: StudentInfo[] = JSON.parse(stored);
        const found = students.find(s => s.id === studentId);
        if (found) setStudent(found);
      }
    } catch (_e) {}

    // Load AI evaluation
    try {
      const stored = localStorage.getItem(`voice3_ai_evaluation_${studentId}`);
      if (stored) {
        setAiEval(JSON.parse(stored));
      } else {
        const demoEval: AIEvaluation = {
          level: 'B2', teachingStyle: 'Balanced',
          weakPoints: { pronunciation: 4, structure: 7, vocabulary: 6, confidence: 3, filler: 8, clarity: 5 },
          aiConclusions: 'O aluno demonstra vocabulário sólido mas recorre frequentemente a palavras de preenchimento. Tem dificuldades em estruturar respostas sob pressão.',
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

    // Load session reports from DB
    if (studentId) {
      supabase.from("ai_session_reports")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data) setSessionReports(data as unknown as SessionReport[]);
        });

      supabase.from("student_learning_profiles")
        .select("*")
        .eq("student_id", studentId)
        .single()
        .then(({ data }) => {
          if (data) setLearningProfile(data as unknown as LearningProfile);
        });
    }
  }, [studentId, professorId]);

  const saveNotes = (notesData = notes) => {
    const key = `voice3_professor_notes_${professorId}_${studentId}`;
    localStorage.setItem(key, JSON.stringify(notesData));
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 2000);
  };

  const handleNotesChange = (updated: ProfessorNotes) => {
    setNotes(updated);
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => saveNotes(updated), 2000);
  };

  const generateLessonPrep = async () => {
    setLoadingPrep(true);
    try {
      const result = await sendAIMessage(
        [{ role: "user", content: "Prepare a lesson briefing for this student." }],
        "professor-prep",
        { studentId }
      );
      setLessonPrep(result);
      toast.success("Lesson prep generated!");
    } catch {
      toast.error("Failed to generate lesson prep.");
    } finally {
      setLoadingPrep(false);
    }
  };

  const radarData = aiEval ? Object.entries(aiEval.weakPoints).map(([key, value]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1), score: value,
  })) : [];

  // Build progress data from real session reports
  const progressBarData = sessionReports.length > 0
    ? sessionReports.slice(0, 8).reverse().map((r, i) => ({ name: `S${i + 1}`, score: r.overall_score }))
    : [
      { name: 'Cap. 1', score: 100 }, { name: 'Cap. 2', score: 88 },
      { name: 'Cap. 3', score: 76 }, { name: 'Cap. 4', score: 82 }, { name: 'Cap. 5', score: 90 },
    ];

  const trendData = sessionReports.length >= 2
    ? sessionReports.slice(0, 8).reverse().map((r, i) => ({
        week: `S${i + 1}`, score: r.overall_score, confidence: r.confidence_score,
      }))
    : [
      { week: 'Sem 1', score: 65, confidence: 30 }, { week: 'Sem 2', score: 72, confidence: 40 },
      { week: 'Sem 3', score: 78, confidence: 40 }, { week: 'Sem 4', score: 85, confidence: 50 },
    ];

  if (!student) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a1628", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
          <p>Student not found.</p>
          <Link to="/professor/dashboard" style={{ color: "#C9A84C", marginTop: 12, display: "block" }}>← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const pct = student.totalChapters > 0 ? Math.round((student.completedChapters / student.totalChapters) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0a1628", color: "white" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "0 32px", height: 64, display: "flex", alignItems: "center", background: "#0a1628", position: "sticky", top: 0, zIndex: 50 }}>
        <Link to="/professor/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "white")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <span style={{ fontFamily: "serif", fontSize: 18, fontWeight: 700, color: "#C9A84C", letterSpacing: "0.1em", marginLeft: "auto" }}>VOICE³</span>
      </div>

      <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Student Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#C9A84C,#8B6914)", fontSize: 20, fontWeight: 700, color: "#060f1d" }}>
            {student.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED]">{student.name}</h1>
              {student.level && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${LEVEL_COLORS[student.level] || 'bg-white/10 text-white/60 border-white/20'}`}>
                  {student.level}
                </span>
              )}
              {learningProfile && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400 font-medium">
                  {LEARNING_STYLE_ICONS[learningProfile.preferred_learning_style] || '⚖️'} {learningProfile.preferred_learning_style}
                </span>
              )}
            </div>
            <p className="text-sm text-[#8E96A3] mt-0.5">
              {student.pack} Pack · {student.completedChapters}/{student.totalChapters} capítulos ({pct}%)
              {learningProfile && ` · ${learningProfile.total_sessions} AI sessions · Avg: ${Math.round(learningProfile.avg_score)}%`}
            </p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-[#1C1F26] border border-white/5 mb-6 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">Visão Geral</TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">Progresso</TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">Diagnóstico IA</TabsTrigger>
          <TabsTrigger value="ai-reports" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">
            <Brain className="h-3 w-3 mr-1" /> Relatórios IA
          </TabsTrigger>
          <TabsTrigger value="lesson-prep" className="data-[state=active]:bg-[#B89A5A] data-[state=active]:text-[#0B1A2A] text-[#8E96A3] text-xs">
            <Sparkles className="h-3 w-3 mr-1" /> Prep de Aula
          </TabsTrigger>
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
                  { label: 'Estilo aprendizagem', value: learningProfile?.preferred_learning_style || '—' },
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

            {learningProfile && (
              <Card className="bg-[#1C1F26] border-white/5">
                <CardHeader className="pb-2"><CardTitle className="text-xs text-[#8E96A3] uppercase tracking-wider">Perfil de Aprendizagem</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-2xl">{LEARNING_STYLE_ICONS[learningProfile.preferred_learning_style] || '⚖️'}</span>
                    <div>
                      <p className="text-[#F4F2ED] font-medium capitalize">{learningProfile.preferred_learning_style}</p>
                      <p className="text-xs text-[#8E96A3]">Velocidade: {learningProfile.progress_velocity}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#8E96A3] mb-1">Pontos fortes</p>
                    <div className="flex flex-wrap gap-1">
                      {(learningProfile.strong_areas as string[]).slice(0, 3).map((s, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#8E96A3] mb-1">Áreas a melhorar</p>
                    <div className="flex flex-wrap gap-1">
                      {(learningProfile.weak_areas as string[]).slice(0, 3).map((s, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-red-400/10 text-red-400 border border-red-400/20">{s}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ── PROGRESS TAB ── */}
        <TabsContent value="progress">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-[#1C1F26] border-white/5">
              <CardHeader><CardTitle className="text-sm text-[#8E96A3] uppercase tracking-wider">Pontuação por Sessão</CardTitle></CardHeader>
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
                  <CardContent><p className="text-sm text-[#F4F2ED] leading-relaxed">{aiEval.aiConclusions}</p></CardContent>
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
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── AI REPORTS TAB (NEW) ── */}
        <TabsContent value="ai-reports">
          {sessionReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#8E96A3]">
              <Brain className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">Nenhum relatório de sessão IA disponível ainda.</p>
              <p className="text-xs mt-1">Os relatórios são gerados automaticamente após cada sessão de prática com IA.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessionReports.map((report) => (
                <Card key={report.id} className="bg-[#1C1F26] border-white/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm text-[#F4F2ED]">{report.session_title}</CardTitle>
                        <p className="text-xs text-[#8E96A3] mt-0.5">
                          {new Date(report.created_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className={`text-lg font-bold ${report.overall_score >= 80 ? 'text-green-400' : report.overall_score >= 60 ? 'text-[#B89A5A]' : 'text-red-400'}`}>
                        {report.overall_score}%
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Score breakdown */}
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'Grammar', score: report.grammar_score, color: '#60A5FA' },
                        { label: 'Vocabulary', score: report.vocabulary_score, color: '#34D399' },
                        { label: 'Fluency', score: report.fluency_score, color: '#FBBF24' },
                        { label: 'Confidence', score: report.confidence_score, color: '#A78BFA' },
                      ].map(s => (
                        <div key={s.label} className="text-center">
                          <div className="text-lg font-bold" style={{ color: s.color }}>{s.score}</div>
                          <div className="text-[10px] text-[#8E96A3] uppercase">{s.label}</div>
                          <div className="h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: s.color }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-[#8E96A3] uppercase mb-1.5">✅ Pontos fortes</p>
                        <div className="space-y-1">
                          {(report.strengths as string[]).map((s, i) => (
                            <p key={i} className="text-xs text-[#F4F2ED]/80">• {s}</p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-[#8E96A3] uppercase mb-1.5">🔧 A melhorar</p>
                        <div className="space-y-1">
                          {(report.weaknesses as string[]).map((w, i) => (
                            <p key={i} className="text-xs text-[#F4F2ED]/80">• {w}</p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Professor prep notes */}
                    {report.professor_prep_notes && (
                      <div className="p-3 rounded-lg bg-[#B89A5A]/5 border border-[#B89A5A]/15">
                        <p className="text-xs text-[#B89A5A] font-semibold uppercase mb-1.5">📋 Notas para o Professor</p>
                        <p className="text-xs text-[#F4F2ED]/80 leading-relaxed whitespace-pre-line">{report.professor_prep_notes}</p>
                      </div>
                    )}

                    {/* Learning style detected */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8E96A3]">Estilo detectado:</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20 font-medium">
                        {LEARNING_STYLE_ICONS[report.learning_style_detected] || '⚖️'} {report.learning_style_detected}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── LESSON PREP TAB (NEW) ── */}
        <TabsContent value="lesson-prep">
          <Card className="bg-[#1C1F26] border-white/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-[#8E96A3] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#B89A5A]" /> Preparação de Aula (IA)
                </CardTitle>
                <Button
                  onClick={generateLessonPrep}
                  disabled={loadingPrep}
                  size="sm"
                  className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] h-8 text-xs"
                >
                  {loadingPrep ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                  {loadingPrep ? "A gerar..." : "Gerar Preparação"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lessonPrep ? (
                <div className="prose prose-sm prose-invert max-w-none">
                  <div className="text-sm text-[#F4F2ED]/90 leading-relaxed whitespace-pre-line">
                    {lessonPrep.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) {
                        return <h3 key={i} className="text-[#B89A5A] text-sm font-semibold mt-4 mb-2">{line.replace('## ', '')}</h3>;
                      }
                      if (line.startsWith('- ') || line.startsWith('• ')) {
                        return <p key={i} className="text-xs text-[#F4F2ED]/80 ml-3">• {line.replace(/^[-•] /, '')}</p>;
                      }
                      if (line.trim() === '') return <br key={i} />;
                      return <p key={i} className="text-xs text-[#F4F2ED]/80 mb-1">{line}</p>;
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-[#8E96A3]">
                  <FileText className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">Clica em "Gerar Preparação" para a IA criar um briefing personalizado.</p>
                  <p className="text-xs mt-1 text-center max-w-md">
                    A IA analisa os relatórios de sessão, perfil de aprendizagem e avaliação diagnóstica
                    para preparar uma aula otimizada para este aluno.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── NOTES TAB ── */}
        <TabsContent value="notes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-[#1C1F26] border-white/5">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm text-[#8E96A3] uppercase tracking-wider">Private Notes</CardTitle>
                  {autoSaved && <span className="text-[11px] text-[#B89A5A]/80">Auto-saved ✓</span>}
                </div>
              </CardHeader>
              <CardContent>
                <textarea
                  value={notes.privateNotes}
                  onChange={e => handleNotesChange({ ...notes, privateNotes: e.target.value })}
                  className="w-full h-40 px-3 py-2.5 rounded-lg text-sm resize-none focus:outline-none transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.2)", color: "white" }}
                  placeholder="Private notes about the student..."
                />
              </CardContent>
            </Card>

            <Card className="bg-[#1C1F26] border-white/5">
              <CardHeader><CardTitle className="text-sm text-[#8E96A3] uppercase tracking-wider">Action Plan</CardTitle></CardHeader>
              <CardContent>
                <textarea
                  value={notes.actionPlan}
                  onChange={e => handleNotesChange({ ...notes, actionPlan: e.target.value })}
                  className="w-full h-40 px-3 py-2.5 rounded-lg text-sm resize-none focus:outline-none transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.2)", color: "white" }}
                  placeholder="Action plan for the next weeks..."
                />
              </CardContent>
            </Card>

            <Card className="bg-[#1C1F26] border-white/5 lg:col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-[#8E96A3] uppercase tracking-wider">Next Session Focus Points</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2 mb-3">
                  {notes.nextSessionFocus.map(f => (
                    <div key={f.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <button onClick={() => handleNotesChange({ ...notes, nextSessionFocus: notes.nextSessionFocus.map(fp => fp.id === f.id ? { ...fp, done: !fp.done } : fp) })}
                        className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${f.done ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-white/20'}`}>
                        {f.done && <CheckSquare className="h-3 w-3 text-[#0B1A2A]" />}
                      </button>
                      <span className={`text-sm flex-1 ${f.done ? 'line-through text-[#8E96A3]' : 'text-[#F4F2ED]'}`}>{f.text}</span>
                      <button onClick={() => handleNotesChange({ ...notes, nextSessionFocus: notes.nextSessionFocus.filter(fp => fp.id !== f.id) })}
                        className="text-[#8E96A3] hover:text-red-400 transition-colors">
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
                    onKeyDown={e => { if (e.key === 'Enter' && newFocusText.trim()) { handleNotesChange({ ...notes, nextSessionFocus: [...notes.nextSessionFocus, { id: `f-${Date.now()}`, text: newFocusText, done: false }] }); setNewFocusText(''); } }}
                    className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F4F2ED] text-sm placeholder:text-[#8E96A3] focus:border-[#C9A84C]/40 focus:outline-none"
                    placeholder="Add focus point..."
                  />
                  <Button size="sm" className="bg-[#C9A84C] text-[#0B1A2A] hover:bg-[#d4ba6a] h-9" onClick={() => {
                    if (!newFocusText.trim()) return;
                    handleNotesChange({ ...notes, nextSessionFocus: [...notes.nextSessionFocus, { id: `f-${Date.now()}`, text: newFocusText, done: false }] });
                    setNewFocusText('');
                  }}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
