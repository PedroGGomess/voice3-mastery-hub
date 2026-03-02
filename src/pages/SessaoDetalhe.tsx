import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PlatformLayout from "@/components/PlatformLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Clock, BookOpen, HelpCircle, PenLine, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { sessionsData } from "@/lib/sessionsData";
import { toast } from "sonner";

const SessaoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";

  const sessionId = parseInt(id || "0");
  const session = sessionsData.find(s => s.id === sessionId);

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [existingScore, setExistingScore] = useState<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
      if (stored) {
        const progress = JSON.parse(stored);
        if (progress[sessionId]?.completed) {
          setAlreadyCompleted(true);
          setExistingScore(progress[sessionId].score);
        }
      }
    } catch (_e) {
      // ignore
    }
  }, [userId, sessionId]);

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

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(quizAnswers).length < session.quiz.length) {
      toast.error("Responde a todas as perguntas antes de submeter.");
      return;
    }
    setQuizSubmitted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    session.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) correct++;
    });
    return Math.round((correct / session.quiz.length) * 100);
  };

  const handleCompleteSession = () => {
    const score = calculateScore();
    if (score < 60) {
      toast.error(`Precisas de pelo menos 60% para completar esta sessão. Obtiveste ${score}%. Tenta novamente!`);
      return;
    }
    try {
      const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
      const progress = stored ? JSON.parse(stored) : {};
      progress[sessionId] = { completed: true, score, completedAt: new Date().toISOString() };
      localStorage.setItem(`voice3_sessions_progress_${userId}`, JSON.stringify(progress));
      toast.success(`Parabéns! Sessão concluída com ${score}%! 🎉`);
      setTimeout(() => navigate("/app"), 1500);
    } catch {
      toast.error("Erro ao guardar o progresso. Tenta novamente.");
    }
  };

  const score = quizSubmitted ? calculateScore() : 0;

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

        {/* Content sections */}
        <div className="space-y-6 mb-10">
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
        </div>

        {/* Exercise */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="premium-card mb-10 border-warning/20 bg-warning/5">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <PenLine className="h-4 w-4 text-warning" /> Exercício Prático
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">{session.exercise}</p>
        </motion.div>

        {/* Quiz */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-xl font-bold">Quiz de Avaliação</h2>
            <span className="text-xs text-white/40 ml-2">Precisas de 60% para concluir</span>
          </div>

          <div className="space-y-6 mb-8">
            {session.quiz.map((q, qi) => (
              <div key={qi} className="premium-card">
                <p className="font-medium text-sm mb-4">{qi + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = quizAnswers[qi] === oi;
                    const isCorrect = oi === q.correct;
                    let optClass = "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ";
                    if (!quizSubmitted) {
                      optClass += isSelected ? "border-primary bg-primary/10 text-primary" : "border-white/10 hover:border-primary/30 text-white/70";
                    } else {
                      if (isCorrect) optClass += "border-success bg-success/10 text-success";
                      else if (isSelected && !isCorrect) optClass += "border-destructive bg-destructive/10 text-destructive";
                      else optClass += "border-white/5 text-white/30";
                    }
                    return (
                      <button key={oi} onClick={() => handleAnswer(qi, oi)} className={optClass} disabled={quizSubmitted}>
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

          {/* Quiz results */}
          {quizSubmitted && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className={`premium-card mb-6 ${score >= 60 ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
              <div className="flex items-center gap-3">
                {score >= 60 ? <CheckCircle2 className="h-6 w-6 text-success" /> : <Star className="h-6 w-6 text-warning" />}
                <div>
                  <p className="font-semibold">{score >= 60 ? "Parabéns! Passaste no quiz!" : "Continua a praticar!"}</p>
                  <p className="text-sm text-muted-foreground">Pontuação: {score}% ({session.quiz.filter((q, i) => quizAnswers[i] === q.correct).length}/{session.quiz.length} corretas)</p>
                </div>
              </div>
              {score < 60 && (
                <p className="text-sm text-muted-foreground mt-2">Precisas de pelo menos 60% para concluir esta sessão. Revê o conteúdo e tenta novamente.</p>
              )}
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
            {quizSubmitted && score >= 60 && !alreadyCompleted && (
              <Button onClick={handleCompleteSession} className="bg-success text-white hover:bg-success/90 rounded-xl h-11">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Completar Sessão
              </Button>
            )}
            {quizSubmitted && score < 60 && (
              <Button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} variant="outline" className="rounded-xl h-11">
                Tentar Novamente
              </Button>
            )}
            {alreadyCompleted && (
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11">
                <Link to="/app">Voltar ao Dashboard</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </PlatformLayout>
  );
};

export default SessaoDetalhe;
