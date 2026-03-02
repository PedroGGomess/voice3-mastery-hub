import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PlatformLayout from "@/components/PlatformLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, CheckCircle2, Clock, BookOpen, HelpCircle, PenLine, Star,
  Play, Pause, Volume2, ChevronRight, ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { sessionsData } from "@/lib/sessionsData";
import { toast } from "sonner";

type ActiveStep = "video" | "audio" | "content" | "exercises" | "complete";

interface StepProgress {
  video: boolean;
  audio: boolean;
  content: boolean;
  exercises: boolean;
  complete: boolean;
}

const STEPS: { key: ActiveStep; icon: string; label: string }[] = [
  { key: "video", icon: "📹", label: "Vídeo" },
  { key: "audio", icon: "🎧", label: "Áudio" },
  { key: "content", icon: "📖", label: "Conteúdo" },
  { key: "exercises", icon: "✍️", label: "Exercícios" },
  { key: "complete", icon: "✅", label: "Concluir" },
];

const SessaoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";

  const sessionId = parseInt(id || "0");
  const session = sessionsData.find(s => s.id === sessionId);

  const stepStorageKey = `voice3_step_progress_${userId}_${sessionId}`;

  const defaultStepProgress: StepProgress = { video: false, audio: false, content: false, exercises: false, complete: false };

  const [stepProgress, setStepProgress] = useState<StepProgress>(defaultStepProgress);
  const [activeStep, setActiveStep] = useState<ActiveStep>("video");
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [existingScore, setExistingScore] = useState<number | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [exerciseText, setExerciseText] = useState("");

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
      if (stored) {
        const progress = JSON.parse(stored);
        if (progress[sessionId]?.completed) {
          setAlreadyCompleted(true);
          setExistingScore(progress[sessionId].score);
          // If already completed, unlock all steps
          setStepProgress({ video: true, audio: true, content: true, exercises: true, complete: true });
        }
      }
    } catch (_e) { /* ignore */ }
  }, [userId, sessionId]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(stepStorageKey);
      if (stored) {
        const sp: StepProgress = JSON.parse(stored);
        setStepProgress(sp);
      }
    } catch (_e) { /* ignore */ }
  }, [stepStorageKey]);

  const saveStepProgress = (sp: StepProgress) => {
    setStepProgress(sp);
    try {
      localStorage.setItem(stepStorageKey, JSON.stringify(sp));
    } catch (_e) { /* ignore */ }
  };

  // Audio playback simulation — fills progress bar over ~30s of real time (displays as 2:30)
  useEffect(() => {
    if (isPlaying) {
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
            return 100;
          }
          const AUDIO_DURATION_MS = 30000;
          const AUDIO_UPDATE_INTERVAL_MS = 200;
          const increment = 100 / (AUDIO_DURATION_MS / AUDIO_UPDATE_INTERVAL_MS);
          return prev + increment;
        });
      }, 200);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }
    return () => { if (audioIntervalRef.current) clearInterval(audioIntervalRef.current); };
  }, [isPlaying]);

  if (!session) {
    return (
      <PlatformLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Sessão não encontrada</h1>
          <Button asChild><Link to="/app/sessoes">Voltar às Sessões</Link></Button>
        </div>
      </PlatformLayout>
    );
  }

  const stepIndex = STEPS.findIndex(s => s.key === activeStep);

  const handleAnswer = (qi: number, oi: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qi]: oi }));
  };

  const calculateScore = () => {
    let correct = 0;
    session.quiz.forEach((q, i) => { if (quizAnswers[i] === q.correct) correct++; });
    return Math.round((correct / session.quiz.length) * 100);
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(quizAnswers).length < session.quiz.length) {
      toast.error("Responde a todas as perguntas antes de submeter.");
      return;
    }
    const score = calculateScore();
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score >= 60) {
      const sp = { ...stepProgress, exercises: true };
      saveStepProgress(sp);
    }
  };

  const handleCompleteSession = () => {
    try {
      const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
      const progress = stored ? JSON.parse(stored) : {};
      progress[sessionId] = { completed: true, score: quizScore, completedAt: new Date().toISOString() };
      localStorage.setItem(`voice3_sessions_progress_${userId}`, JSON.stringify(progress));
      const sp = { ...stepProgress, complete: true };
      saveStepProgress(sp);
      toast.success(`Parabéns! Sessão concluída com ${quizScore}%! 🎉`);
      setTimeout(() => navigate("/app"), 1500);
    } catch {
      toast.error("Erro ao guardar o progresso. Tenta novamente.");
    }
  };

  const goToStep = (step: ActiveStep) => setActiveStep(step);

  const renderVideoStep = () => (
    <div className="space-y-6">
      <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10">
        <iframe
          src={session.videoUrl}
          title={session.videoTitle}
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <h2 className="font-serif text-xl font-bold">{session.videoTitle}</h2>
      <p className="text-sm text-white/60 leading-relaxed">
        Assiste ao vídeo completo e toma nota das expressões e conceitos mais importantes. Depois clica em "Marcar como Visto" para avançar.
      </p>
      <Button
        onClick={() => {
          const sp = { ...stepProgress, video: true };
          saveStepProgress(sp);
          setActiveStep("audio");
        }}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11"
      >
        Marcar como Visto <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  const renderAudioStep = () => {
    const audioSeconds = Math.round((audioProgress / 100) * 150);
    const audioDisplay = `${Math.floor(audioSeconds / 60)}:${String(audioSeconds % 60).padStart(2, "0")}`;
    return (
    <div className="space-y-6">
      <div className="premium-card space-y-4">
        <div className="flex items-center gap-3">
          <Volume2 className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-xl font-bold">{session.audioTitle}</h2>
        </div>
        {/* Play controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(p => !p)}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>
          <div className="flex-1 space-y-1">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-200"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/40">
              <span>{audioDisplay}</span>
              <span>2:30</span>
            </div>
          </div>
        </div>
        {/* Transcript toggle */}
        <button
          onClick={() => setShowTranscript(v => !v)}
          className="text-xs text-primary hover:underline"
        >
          {showTranscript ? "Ocultar" : "Mostrar"} transcrição
        </button>
        {showTranscript && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-white/60 leading-relaxed bg-white/5 rounded-xl p-4 border border-white/10"
          >
            {session.audioTranscript}
          </motion.p>
        )}
      </div>
      <Button
        onClick={() => {
          const sp = { ...stepProgress, audio: true };
          saveStepProgress(sp);
          setActiveStep("content");
        }}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11"
      >
        Exercício concluído <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
  };

  const renderContentStep = () => (
    <div className="space-y-6">
      {session.content.map((section, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="premium-card">
          <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
            {section.type === "vocabulary" && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-normal">Vocabulário</span>}
            {section.type === "phrases" && <span className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning font-normal">Frases</span>}
            {section.type === "text" && <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-normal">Conteúdo</span>}
            {section.title}
          </h2>
          {section.type === "text" && section.body && (
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{section.body}</p>
          )}
          {(section.type === "vocabulary" || section.type === "phrases") && section.items && (
            <ul className="space-y-2">
              {section.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      ))}
      <Button
        onClick={() => {
          const sp = { ...stepProgress, content: true };
          saveStepProgress(sp);
          setActiveStep("exercises");
        }}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11"
      >
        Conteúdo Lido ✓ <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  const renderExercisesStep = () => (
    <div className="space-y-8">
      {/* Exercise */}
      <div className="premium-card border-warning/20 bg-warning/5">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <PenLine className="h-4 w-4 text-warning" /> Exercício Prático
        </h2>
        <p className="text-sm text-white/70 leading-relaxed mb-4">{session.exercise}</p>
        <textarea
          value={exerciseText}
          onChange={e => setExerciseText(e.target.value)}
          placeholder="Escreve a tua resposta aqui..."
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white/80 placeholder:text-white/30 resize-none focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Quiz */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-xl font-bold">Quiz de Avaliação</h2>
          <span className="text-xs text-white/40 ml-2">Precisas de 60% para concluir</span>
        </div>
        <div className="space-y-6 mb-6">
          {session.quiz.map((q, qi) => (
            <div key={qi} className="premium-card">
              <p className="font-medium text-sm mb-4">{qi + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = quizAnswers[qi] === oi;
                  const isCorrect = oi === q.correct;
                  let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ";
                  if (!quizSubmitted) {
                    cls += isSelected ? "border-primary bg-primary/10 text-primary" : "border-white/10 hover:border-primary/30 text-white/70";
                  } else {
                    if (isCorrect) cls += "border-success bg-success/10 text-success";
                    else if (isSelected && !isCorrect) cls += "border-destructive bg-destructive/10 text-destructive";
                    else cls += "border-white/5 text-white/30";
                  }
                  return (
                    <button key={oi} onClick={() => handleAnswer(qi, oi)} className={cls} disabled={quizSubmitted}>
                      <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span> {opt}
                      {quizSubmitted && isCorrect && <span className="float-right">✓</span>}
                      {quizSubmitted && isSelected && !isCorrect && <span className="float-right">✗</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {quizSubmitted && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`premium-card mb-6 ${quizScore >= 60 ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
            <div className="flex items-center gap-3">
              {quizScore >= 60 ? <CheckCircle2 className="h-6 w-6 text-success" /> : <Star className="h-6 w-6 text-warning" />}
              <div>
                <p className="font-semibold">{quizScore >= 60 ? "Parabéns! Passaste no quiz!" : "Continua a praticar!"}</p>
                <p className="text-sm text-muted-foreground">
                  Pontuação: {quizScore}% ({session.quiz.filter((q, i) => quizAnswers[i] === q.correct).length}/{session.quiz.length} corretas)
                </p>
              </div>
            </div>
            {quizScore < 60 && <p className="text-sm text-muted-foreground mt-2">Precisas de pelo menos 60% para concluir. Revê o conteúdo e tenta novamente.</p>}
          </motion.div>
        )}

        <div className="flex gap-3 flex-wrap">
          {!quizSubmitted && (
            <Button
              onClick={handleSubmitQuiz}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11"
              disabled={Object.keys(quizAnswers).length < session.quiz.length}
            >
              Submeter Quiz
            </Button>
          )}
          {quizSubmitted && quizScore >= 60 && (
            <Button onClick={() => setActiveStep("complete")} className="bg-success text-white hover:bg-success/90 rounded-xl h-11">
              <ChevronRight className="mr-2 h-4 w-4" /> Avançar para Conclusão
            </Button>
          )}
          {quizSubmitted && quizScore < 60 && (
            <Button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(0); }} variant="outline" className="rounded-xl h-11">
              Tentar Novamente
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-7xl"
      >
        🎉
      </motion.div>
      <div className="flex justify-center gap-4">
        {["🌟", "🏆", "🎊", "✨", "🎯"].map((e, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="text-2xl"
          >
            {e}
          </motion.span>
        ))}
      </div>
      <h2 className="font-serif text-3xl font-bold text-primary">Sessão Concluída!</h2>
      <p className="text-muted-foreground">
        Parabéns! Completaste a sessão <strong>{session.title}</strong>.
      </p>
      {quizScore > 0 && (
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20">
          <Star className="h-5 w-5 text-primary" />
          <span className="font-bold text-primary text-xl">{quizScore}%</span>
          <span className="text-muted-foreground text-sm">no quiz</span>
        </div>
      )}
      {alreadyCompleted ? (
        <div>
          <p className="text-sm text-white/50 mb-4">Esta sessão já foi concluída anteriormente.</p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11">
            <Link to="/app">Voltar ao Dashboard</Link>
          </Button>
        </div>
      ) : (
        <Button onClick={handleCompleteSession} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 px-8">
          <CheckCircle2 className="mr-2 h-5 w-5" /> Completar Sessão
        </Button>
      )}
    </div>
  );

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" asChild className="text-white/60 hover:text-white">
            <Link to="/app/sessoes"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Link>
          </Button>
        </div>

        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
              <BookOpen className="h-3 w-3" /> Sessão {session.id} de {sessionsData.length}
            </div>
            <h1 className="font-serif text-3xl font-bold mb-2">{session.title}</h1>
            <p className="text-muted-foreground">{session.objective}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-xs text-white/40"><Clock className="h-3 w-3" /> {session.time}</span>
              <span className="flex items-center gap-1 text-xs text-white/40"><HelpCircle className="h-3 w-3" /> {session.quiz.length} perguntas</span>
            </div>
          </div>
          {alreadyCompleted && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium text-success">Sessão Concluída</p>
                <p className="text-xs text-white/50">Pontuação: {existingScore}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Main layout: content + sidebar */}
        <div className="flex gap-8">
          {/* Content area */}
          <div className="flex-1 min-w-0">
            {/* Step content */}
            <div className="mb-8">
              {activeStep === "video" && renderVideoStep()}
              {activeStep === "audio" && renderAudioStep()}
              {activeStep === "content" && renderContentStep()}
              {activeStep === "exercises" && renderExercisesStep()}
              {activeStep === "complete" && renderCompleteStep()}
            </div>

            {/* Prev / Next nav */}
            {activeStep !== "complete" && (
              <div className="flex gap-3">
                {stepIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => goToStep(STEPS[stepIndex - 1].key)}
                    className="rounded-xl h-10"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                  </Button>
                )}
                {stepIndex < STEPS.length - 1 && stepProgress[STEPS[stepIndex].key] && (
                  <Button
                    variant="outline"
                    onClick={() => goToStep(STEPS[stepIndex + 1].key)}
                    className="rounded-xl h-10"
                  >
                    Próximo <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar: step navigation */}
          <div className="w-64 hidden lg:block shrink-0">
            <div className="sticky top-6 premium-card space-y-2">
              <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-4">Progresso</p>
              {STEPS.map((step, i) => {
                const isDone = stepProgress[step.key];
                const isCurrent = step.key === activeStep;
                const isAccessible = i === 0 || stepProgress[STEPS[i - 1].key] || alreadyCompleted;
                return (
                  <button
                    key={step.key}
                    onClick={() => isAccessible && goToStep(step.key)}
                    disabled={!isAccessible}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all text-left ${
                      isCurrent ? "bg-primary/10 border border-primary/30 text-primary" :
                      isDone ? "text-success hover:bg-success/5" :
                      isAccessible ? "text-white/60 hover:bg-white/5" :
                      "text-white/20 cursor-not-allowed"
                    }`}
                  >
                    <span className="text-base">{step.icon}</span>
                    <span className="flex-1">{step.label}</span>
                    {isDone && <CheckCircle2 className="h-4 w-4 text-success" />}
                    {isCurrent && !isDone && <span className="w-2 h-2 rounded-full bg-primary" />}
                    {!isDone && !isCurrent && isAccessible && <span className="w-2 h-2 rounded-full bg-white/20" />}
                    {!isAccessible && <span className="w-2 h-2 rounded-full bg-white/10" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </PlatformLayout>
  );
};

export default SessaoDetalhe;

