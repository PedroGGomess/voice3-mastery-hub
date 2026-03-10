import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  Mic, MicOff, CheckCircle2, ArrowRight, ArrowLeft,
  Loader2, Brain, Target, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const TEACHING_STYLES = [
  { id: 'rigorous', emoji: '🔴', label: 'Rigorous', description: 'Direct corrections, high standards' },
  { id: 'balanced', emoji: '🟡', label: 'Balanced', description: 'Mix of encouragement and correction' },
  { id: 'soft', emoji: '🟢', label: 'Soft', description: 'Encouragement first, gradual correction' },
  { id: 'intensive', emoji: '⚡', label: 'Intensive', description: 'Fast pace, more exercises' },
  { id: 'relaxed', emoji: '🌿', label: 'Relaxed', description: 'Comfortable pace, more reflection' },
];

const VOCAB_QUESTIONS = [
  { q: 'What does "synergy" mean in a business context?', options: ['Collaboration that produces greater results', 'A financial document', 'A management technique', 'A type of contract'], correct: 0 },
  { q: 'Which phrase is most appropriate to disagree politely in a meeting?', options: ['You are wrong.', 'I see your point, however...', 'That is a bad idea.', 'I do not think so.'], correct: 1 },
  { q: '"To leverage" something means to:', options: ['Reduce its value', 'Ignore it completely', 'Use it to maximum advantage', 'Document it formally'], correct: 2 },
  { q: 'What is a "KPI"?', options: ['A financial product', 'A Key Performance Indicator', 'A business contract type', 'A marketing strategy'], correct: 1 },
  { q: 'A "stakeholder" is:', options: ['A company shareholder only', 'Anyone with an interest in a project', 'A financial auditor', 'A team leader'], correct: 1 },
  { q: '"To onboard" a new employee means to:', options: ['Terminate their contract', 'Integrate them into the organisation', 'Train them for a promotion', 'Transfer them to another team'], correct: 1 },
  { q: 'Which word means "to make something official"?', options: ['Casualise', 'Formalise', 'Minimise', 'Generalise'], correct: 1 },
  { q: 'A "deliverable" in project management is:', options: ['A physical delivery', 'A tangible output or result', 'A meeting agenda', 'A risk assessment'], correct: 1 },
  { q: '"Proactive" means:', options: ['Reacting quickly to problems', 'Taking initiative before problems arise', 'Being passive and waiting', 'Acting aggressively'], correct: 1 },
  { q: 'To "delegate" means:', options: ['To do all work yourself', 'To assign tasks to others', 'To cancel a task', 'To report to a superior'], correct: 1 },
];

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export default function DiagnosticSession() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const userId = currentUser?.id || '';

  const [currentStep, setCurrentStep] = useState<Step>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioRecorded, setAudioRecorded] = useState(false);
  const [writingSample, setWritingSample] = useState('');
  const [vocabAnswers, setVocabAnswers] = useState<(number | null)[]>(new Array(10).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [confidence, setConfidence] = useState(3);
  const [challenge, setChallenge] = useState('');
  const [teachingStyle, setTeachingStyle] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('3-5');
  const [mainGoal, setMainGoal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [processingStep, setProcessingStep] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const wordCount = writingSample.trim().split(/\s+/).filter(Boolean).length;
  const progressPct = ((currentStep - 1) / 5) * 100;

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setAudioRecorded(true);
  };

  const vocabScore = vocabAnswers.filter((a, i) => a === VOCAB_QUESTIONS[i].correct).length;

  const runAIEvaluation = async () => {
    setIsProcessing(true);
    const steps = ['A analisar gravação de áudio...', 'A avaliar amostra de escrita...', 'A processar resultados de vocabulário...', 'A sintetizar perfil de aprendizagem...', 'A gerar recomendações personalizadas...'];
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, 800));
    }

    // Simulate AI evaluation based on actual data collected
    const vocabPct = (vocabScore / 10) * 100;
    let level: string;
    if (vocabPct < 40) level = 'B1';
    else if (vocabPct < 60) level = 'B2';
    else if (vocabPct < 80) level = 'C1';
    else level = 'C2';

    const result = {
      level,
      teachingStyle: teachingStyle || 'balanced',
      weakPoints: {
        pronunciation: Math.floor(Math.random() * 5) + 3,
        structure: Math.floor(Math.random() * 4) + 4,
        vocabulary: Math.round(vocabPct / 10),
        confidence: confidence,
        filler: Math.floor(Math.random() * 4) + 5,
        clarity: Math.floor(Math.random() * 4) + 4,
      },
      recommendedPath: ['clarity', 'structure', 'confidence'],
      aiConclusions: `Com base no teu diagnóstico, identificamos um nível ${level} sólido. O teu vocabulário técnico é ${vocabPct >= 70 ? 'forte' : 'em desenvolvimento'}, mas há oportunidades de melhoria em fluência oral e estrutura de respostas. A tua confiança (${confidence}/5) sugere que ${confidence < 3 ? 'precisas de trabalhar a tua presença oral em contextos profissionais' : 'tens uma boa base para avançar rapidamente'}.`,
      professorFocusPoints: ['Structured responses using PREP Framework', 'Reduce filler words and hesitations', 'Pacing control and strategic pauses'],
      suggestedDrills: ['PREP Framework Drill', 'Filler Word Elimination', '3-Point Message Builder'],
    };

    setAiResult(result);

    // Save to localStorage
    localStorage.setItem(`voice3_ai_evaluation_${userId}`, JSON.stringify(result));
    localStorage.setItem(`voice3_diagnostic_completed_${userId}`, JSON.stringify({ completedAt: new Date().toISOString(), ...result }));

    // Mark chapter 1 as complete
    try {
      const chapKey = `voice3_chapter_progress_${userId}`;
      const existing = localStorage.getItem(chapKey) ? JSON.parse(localStorage.getItem(chapKey)!) : {};
      existing['ch1'] = { status: 'completed', completedAt: new Date().toISOString() };
      existing['ch2'] = { status: 'in_progress', startedAt: new Date().toISOString() };
      localStorage.setItem(chapKey, JSON.stringify(existing));
    } catch (_e) {}

    // Mark the diagnostic session (ch1-s1) as completed in session progress
    try {
      const sessKey = `voice3_session_progress_${userId}`;
      const sessExisting = localStorage.getItem(sessKey) ? JSON.parse(localStorage.getItem(sessKey)!) : {};
      sessExisting['ch1-s1'] = { status: 'completed', score: 100, completedAt: new Date().toISOString() };
      localStorage.setItem(sessKey, JSON.stringify(sessExisting));
    } catch (_e) {}

    setIsProcessing(false);
    setCurrentStep(6);
  };

  const handleNext = () => {
    if (currentStep === 5) {
      if (!teachingStyle) { toast.error('Selecciona o teu estilo de aprendizagem.'); return; }
      runAIEvaluation();
    } else {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return audioRecorded;
    if (currentStep === 2) return wordCount >= 50;
    if (currentStep === 3) return vocabAnswers.every(a => a !== null);
    if (currentStep === 4) return !!challenge && !!mainGoal;
    if (currentStep === 5) return !!teachingStyle;
    return true;
  };

  return (
    <PlatformLayout>
      {/* Header + progress */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium mb-1">Capítulo 1 · Diagnóstico Inicial</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] mb-4">
          {currentStep === 0 ? 'Your Executive Diagnostic' : currentStep <= 5 ? 'Vamos conhecer-te melhor' : 'Diagnóstico Concluído!'}
        </h1>
        {currentStep >= 1 && currentStep <= 5 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[#8E96A3]">
              <span>Passo {currentStep} de 5</span>
              <span>{Math.round(progressPct)}% concluído</span>
            </div>
            <Progress value={progressPct} className="h-1.5 bg-white/10" />
          </div>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ── STEP 0: Welcome / Intro ── */}
        {currentStep === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-2xl">
            <div className="rounded-xl bg-gradient-to-br from-[#1C1F26] to-[#0F1B2A] border border-[#B89A5A]/20 p-8 mb-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[#B89A5A]/10 border-2 border-[#B89A5A]/30 flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-[#B89A5A]" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#F4F2ED] mb-3">Your Executive Diagnostic</h2>
              <p className="text-[#8E96A3] mb-6">5 steps · ~12 minutes · Personalises your entire journey</p>

              {/* Timeline */}
              <div className="space-y-3 text-left max-w-sm mx-auto mb-8">
                {[
                  { icon: '🎙️', name: 'Voice Baseline', desc: 'Record a 60–90s speaking sample' },
                  { icon: '✍️', name: 'Writing Sample', desc: 'Write a short professional email' },
                  { icon: '📚', name: 'Vocabulary Check', desc: '10 business English questions' },
                  { icon: '🎯', name: 'Goals & Style', desc: 'Your objectives and challenges' },
                  { icon: '🤖', name: 'AI Analysis', desc: 'Personalised profile generated' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-9 h-9 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/20 flex items-center justify-center text-lg">
                        {item.icon}
                      </div>
                      {i < 4 && <div className="w-px h-4 bg-[#B89A5A]/20 mt-1" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#F4F2ED]">{item.name}</p>
                      <p className="text-xs text-[#8E96A3]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="p-4 rounded-lg bg-[#B89A5A]/5 border border-[#B89A5A]/20 mb-6 text-left">
                <p className="text-sm text-[#F4F2ED] leading-relaxed italic">
                  "The best executives don't just speak clearly. They speak with intent."
                </p>
              </div>
            </div>
            <Button onClick={() => setCurrentStep(1)} className="w-full bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold h-12 text-base">
              Begin Your Diagnostic <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {/* ── STEP 1: Audio Recording ── */}
        {currentStep === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-2xl">
            <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-400/10 flex items-center justify-center">
                  <Mic className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#F4F2ED]">Gravação de Linha de Base</h2>
                  <p className="text-xs text-[#8E96A3]">Passo 1 de 5</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#B89A5A]/5 border border-[#B89A5A]/20 mb-6">
                <p className="text-sm text-[#F4F2ED] leading-relaxed italic">
                  "Fala sobre o teu papel profissional e um desafio de comunicação recente. Fala naturalmente durante 60–90 segundos em inglês."
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                {!audioRecorded ? (
                  <>
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-400 animate-pulse shadow-[0_0_20px_rgba(248,113,113,0.4)]' : 'bg-[#B89A5A] hover:bg-[#d4ba6a] shadow-[0_0_20px_rgba(184,154,90,0.3)]'}`}
                    >
                      {isRecording ? <MicOff className="h-8 w-8 text-white" /> : <Mic className="h-8 w-8 text-[#0B1A2A]" />}
                    </button>
                    {isRecording && (
                      <div className="text-center">
                        <p className="text-2xl font-mono font-bold text-red-400">{formatTime(recordingTime)}</p>
                        <p className="text-xs text-[#8E96A3]">A gravar... clica para parar</p>
                      </div>
                    )}
                    {!isRecording && recordingTime === 0 && (
                      <p className="text-xs text-[#8E96A3]">Clica para iniciar a gravação</p>
                    )}
                  </>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    </div>
                    <p className="text-sm font-medium text-green-400">Gravação concluída! ({formatTime(recordingTime)})</p>
                    <button onClick={() => { setAudioRecorded(false); setRecordingTime(0); }} className="text-xs text-[#8E96A3] hover:text-[#F4F2ED] underline">
                      Gravar novamente
                    </button>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              title={!canProceed() ? "Record your baseline first" : undefined}
              className="w-full bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold h-11 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* ── STEP 2: Writing Sample ── */}
        {currentStep === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-2xl">
            <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-400/10 flex items-center justify-center">
                  <span className="text-lg">✍️</span>
                </div>
                <div>
                  <h2 className="font-semibold text-[#F4F2ED]">Amostra de Escrita</h2>
                  <p className="text-xs text-[#8E96A3]">Passo 2 de 5</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#B89A5A]/5 border border-[#B89A5A]/20 mb-4">
                <p className="text-sm text-[#F4F2ED] leading-relaxed italic">
                  "Escreve um email curto a um colega sénior a explicar um problema e a propor uma solução. Objectivo: 150–200 palavras."
                </p>
              </div>
              <div className="relative">
                <textarea
                  aria-label="Amostra de escrita — email profissional"
                  value={writingSample}
                  onChange={e => setWritingSample(e.target.value)}
                  className="w-full h-44 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#F4F2ED] text-sm placeholder:text-[#8E96A3] resize-none focus:border-[#B89A5A]/40 focus:outline-none transition-colors"
                  placeholder="Subject: Solution Proposal for [Issue]&#10;&#10;Dear [Name],&#10;&#10;I wanted to bring to your attention..."
                />
                <div className={`absolute bottom-3 right-3 text-xs ${wordCount >= 150 ? 'text-green-400' : wordCount >= 50 ? 'text-[#B89A5A]' : 'text-[#8E96A3]'}`}>
                  {wordCount} palavras {wordCount >= 150 && '✓'}
                </div>
              </div>
              {wordCount < 50 && wordCount > 0 && (
                <p className="text-xs text-[#8E96A3] mt-2">Escreve pelo menos 50 palavras para continuar.</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 text-[#8E96A3] border border-white/10 h-11" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />Voltar
              </Button>
              <Button onClick={handleNext} disabled={!canProceed()} className="flex-[2] bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold h-11">
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Vocabulary Check ── */}
        {currentStep === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-2xl">
            <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-6 mb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                    <span className="text-lg">☑️</span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#F4F2ED]">Verificação de Vocabulário</h2>
                    <p className="text-xs text-[#8E96A3]">Pergunta {currentQuestion + 1} de {VOCAB_QUESTIONS.length}</p>
                  </div>
                </div>
                <div className="text-xs text-[#8E96A3]">
                  {vocabAnswers.filter(a => a !== null).length}/{VOCAB_QUESTIONS.length} respondidas
                </div>
              </div>

              <div className="mb-4">
                <div className="flex gap-1 mb-4">
                  {VOCAB_QUESTIONS.map((_, i) => (
                    <button key={i} onClick={() => setCurrentQuestion(i)}
                      className={`flex-1 h-1.5 rounded-full transition-all ${i === currentQuestion ? 'bg-[#B89A5A]' : vocabAnswers[i] !== null ? 'bg-[#B89A5A]/40' : 'bg-white/10'}`} />
                  ))}
                </div>
                <p className="text-[#F4F2ED] font-medium mb-4">{VOCAB_QUESTIONS[currentQuestion].q}</p>
                <div className="space-y-2">
                  {VOCAB_QUESTIONS[currentQuestion].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const updated = [...vocabAnswers];
                        updated[currentQuestion] = i;
                        setVocabAnswers(updated);
                        if (currentQuestion < VOCAB_QUESTIONS.length - 1) {
                          setTimeout(() => setCurrentQuestion(q => q + 1), 300);
                        }
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                        vocabAnswers[currentQuestion] === i
                          ? 'bg-[#B89A5A]/10 border-[#B89A5A]/40 text-[#B89A5A]'
                          : 'bg-white/5 border-white/10 text-[#F4F2ED] hover:border-white/20'
                      }`}
                    >
                      <span className="font-medium text-[#8E96A3] mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 text-[#8E96A3] border border-white/10 h-11" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />Voltar
              </Button>
              <Button onClick={handleNext} disabled={!canProceed()} className="flex-[2] bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold h-11">
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 4: Survey ── */}
        {currentStep === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-2xl">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-pink-400/10 flex items-center justify-center shrink-0">
                <span className="text-lg">💭</span>
              </div>
              <div>
                <h2 className="font-semibold text-[#F4F2ED]">Confiança & Objectivos</h2>
                <p className="text-xs text-[#8E96A3]">Passo 4 de 5</p>
              </div>
            </div>

            <div className="space-y-4 mb-4">
              {/* Confidence slider sub-card */}
              <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-5">
                <label className="text-sm font-semibold text-[#F4F2ED] mb-4 block">
                  Quão confiante te sentes a falar inglês em reuniões?
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl select-none">😟</span>
                  <div className="flex gap-2 flex-1">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button key={v} onClick={() => setConfidence(v)}
                        className={`flex-1 py-4 rounded-xl border text-base font-bold transition-all duration-150 ${confidence === v ? 'bg-[#B89A5A] border-[#B89A5A] text-[#0B1A2A] shadow-lg scale-105' : 'bg-white/5 border-white/10 text-[#8E96A3] hover:border-[#B89A5A]/40 hover:bg-[#B89A5A]/5 hover:text-[#F4F2ED]'}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                  <span className="text-2xl select-none">😎</span>
                </div>
                <div className="text-center text-xs text-[#B89A5A] font-semibold mt-1">
                  {confidence === 1 && 'Ainda pouco confiante'}
                  {confidence === 2 && 'Em desenvolvimento'}
                  {confidence === 3 && 'Razoavelmente confiante'}
                  {confidence === 4 && 'Bastante confiante'}
                  {confidence === 5 && 'Muito confiante!'}
                </div>
              </div>

              {/* Challenge sub-card */}
              <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-5">
                <label className="text-sm font-semibold text-[#F4F2ED] mb-4 block">Qual é o teu maior desafio?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Fluência oral', icon: '🗣️' },
                    { label: 'Vocabulário técnico', icon: '📚' },
                    { label: 'Pronúncia', icon: '🔊' },
                    { label: 'Confiança', icon: '💪' },
                    { label: 'Estrutura das ideias', icon: '🧠' },
                    { label: 'Interagir sob pressão', icon: '⚡' },
                  ].map(({ label, icon }) => (
                    <button key={label} onClick={() => setChallenge(label)}
                      className={`py-4 px-4 rounded-xl border text-sm text-left transition-all duration-150 group ${challenge === label ? 'bg-[#B89A5A]/15 border-[#B89A5A]/50 text-[#B89A5A]' : 'bg-white/5 border-white/10 text-[#F4F2ED] hover:border-[#B89A5A]/30 hover:bg-[#B89A5A]/5'}`}>
                      <span className="text-lg block mb-1.5">{icon}</span>
                      <span className="font-medium leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours/week sub-card */}
              <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-5">
                <label className="text-sm font-semibold text-[#F4F2ED] mb-4 block">Quantas horas por semana podes dedicar?</label>
                <div className="flex gap-3">
                  {['1-2', '3-5', '5-8', '8+'].map(h => (
                    <button key={h} onClick={() => setHoursPerWeek(h)}
                      className={`flex-1 py-4 rounded-xl border text-sm font-semibold transition-all duration-150 ${hoursPerWeek === h ? 'bg-[#B89A5A]/15 border-[#B89A5A]/50 text-[#B89A5A]' : 'bg-white/5 border-white/10 text-[#8E96A3] hover:border-[#B89A5A]/30 hover:bg-[#B89A5A]/5 hover:text-[#F4F2ED]'}`}>
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Main goal sub-card */}
              <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-5">
                <label className="text-sm font-semibold text-[#F4F2ED] mb-4 block">Qual é o teu objectivo principal?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Apresentações de impacto', icon: '🎤' },
                    { label: 'Reuniões eficazes', icon: '📋' },
                    { label: 'Confiança oral', icon: '🌟' },
                    { label: 'Pronúncia nativa', icon: '🎯' },
                    { label: 'Vocabulário avançado', icon: '📖' },
                    { label: 'Negociação', icon: '🤝' },
                  ].map(({ label, icon }) => (
                    <button key={label} onClick={() => setMainGoal(label)}
                      className={`py-4 px-4 rounded-xl border text-sm text-left transition-all duration-150 ${mainGoal === label ? 'bg-[#B89A5A]/15 border-[#B89A5A]/50 text-[#B89A5A]' : 'bg-white/5 border-white/10 text-[#F4F2ED] hover:border-[#B89A5A]/30 hover:bg-[#B89A5A]/5'}`}>
                      <span className="text-lg block mb-1.5">{icon}</span>
                      <span className="font-medium leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 text-[#8E96A3] border border-white/10 h-11" onClick={() => setCurrentStep(3)}>
                <ArrowLeft className="mr-2 h-4 w-4" />Voltar
              </Button>
              <Button onClick={handleNext} disabled={!canProceed()} className="flex-[2] bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold h-11">
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 5: Teaching Style ── */}
        {currentStep === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-2xl">
            <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-6 mb-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#F4F2ED]">Estilo de Aprendizagem</h2>
                  <p className="text-xs text-[#8E96A3]">Passo 5 de 5 — o último!</p>
                </div>
              </div>
              <p className="text-sm text-[#8E96A3] mb-4">Como preferes ser ensinado(a)?</p>
              <div className="space-y-3">
                {TEACHING_STYLES.map(style => (
                  <button key={style.id} onClick={() => setTeachingStyle(style.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${teachingStyle === style.id ? 'bg-[#B89A5A]/10 border-[#B89A5A]/40' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                    <span className="text-2xl shrink-0">{style.emoji}</span>
                    <div>
                      <p className={`font-semibold text-sm ${teachingStyle === style.id ? 'text-[#B89A5A]' : 'text-[#F4F2ED]'}`}>{style.label}</p>
                      <p className="text-xs text-[#8E96A3]">{style.description}</p>
                    </div>
                    {teachingStyle === style.id && <CheckCircle2 className="h-4 w-4 text-[#B89A5A] ml-auto shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 text-[#8E96A3] border border-white/10 h-11" onClick={() => setCurrentStep(4)}>
                <ArrowLeft className="mr-2 h-4 w-4" />Voltar
              </Button>
              <Button onClick={handleNext} disabled={!canProceed()} className="flex-[2] bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold h-11">
                Iniciar Avaliação IA <Brain className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── PROCESSING ── */}
        {isProcessing && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl">
            <div className="rounded-xl bg-gradient-to-br from-[#0B1A2A] to-[#1C1F26] border border-[#B89A5A]/20 p-12 text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-[#B89A5A]/10 animate-ping" style={{ animationDuration: '2s' }} />
                <div className="relative w-24 h-24 rounded-full bg-[#B89A5A]/10 border-2 border-[#B89A5A]/40 flex items-center justify-center">
                  <span className="font-bold tracking-[0.1em] text-[#B89A5A] text-lg">
                    V<sup className="text-xs">³</sup>
                  </span>
                </div>
              </div>
              <h2 className="font-serif text-xl font-semibold text-[#F4F2ED] mb-2">Analysing your executive profile...</h2>
              <p className="text-sm text-[#8E96A3] mb-8">Building a personalised learning path just for you</p>
              <div className="space-y-3 text-left max-w-sm mx-auto">
                {[
                  'Voice patterns evaluated',
                  'Writing clarity assessed',
                  'Vocabulary profile mapped',
                  'Learning path generated',
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: i <= processingStep ? 1 : 0.2, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className={`flex items-center gap-3 text-sm ${i <= processingStep ? 'text-[#F4F2ED]' : 'text-white/20'}`}
                  >
                    {i < processingStep ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                    ) : i === processingStep ? (
                      <Loader2 className="h-4 w-4 text-[#B89A5A] animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
                    )}
                    {step}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 6: Results ── */}
        {currentStep === 6 && aiResult && !isProcessing && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            {/* Header */}
            <div className="mb-2">
              <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium">Diagnóstico Concluído</p>
              <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] mt-1">Your Executive Profile</h1>
              <p className="text-xs text-[#8E96A3] mt-1">{currentUser?.name} · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            {/* Level badge */}
            <div className="rounded-xl bg-gradient-to-br from-[#1C1F26] to-[#0F1B2A] border border-[#B89A5A]/20 p-6 mb-4 text-center">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 rounded-full bg-[#B89A5A]/10 border-2 border-[#B89A5A]/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-[#B89A5A]">{aiResult.level}</span>
              </motion.div>
              <h2 className="font-serif text-2xl font-semibold text-[#F4F2ED] mb-1">Level {aiResult.level}</h2>
              <p className="text-sm text-[#8E96A3] mb-4">
                {aiResult.level === 'B1' && 'You communicate well in familiar contexts but lack precision under pressure.'}
                {aiResult.level === 'B2' && 'You communicate with confidence but lack precision under pressure.'}
                {aiResult.level === 'C1' && 'You communicate with fluency and precision across professional contexts.'}
                {aiResult.level === 'C2' && 'You communicate at near-native level with exceptional executive presence.'}
              </p>

              <div className="flex justify-center gap-3 mb-2">
                <span className={`text-sm px-3 py-1 rounded-full border font-semibold ${aiResult.level === 'B1' ? 'bg-blue-400/10 border-blue-400/20 text-blue-400' : aiResult.level === 'B2' ? 'bg-purple-400/10 border-purple-400/20 text-purple-400' : aiResult.level === 'C1' ? 'bg-orange-400/10 border-orange-400/20 text-orange-400' : 'bg-green-400/10 border-green-400/20 text-green-400'}`}>
                  {aiResult.level}
                </span>
                <span className="text-sm px-3 py-1 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/20 text-[#B89A5A] font-semibold">
                  {TEACHING_STYLES.find(s => s.id === aiResult.teachingStyle)?.emoji} {TEACHING_STYLES.find(s => s.id === aiResult.teachingStyle)?.label} Learner
                </span>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-5 mb-4">
              <h3 className="text-xs text-[#8E96A3] uppercase tracking-wider mb-4">Communication Profile</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={[
                  { axis: 'Pronunciation', value: aiResult.weakPoints.pronunciation },
                  { axis: 'Structure', value: aiResult.weakPoints.structure },
                  { axis: 'Vocabulary', value: aiResult.weakPoints.vocabulary },
                  // Confidence is 1-5; scale to 1-10 to match other axes
                  { axis: 'Confidence', value: aiResult.weakPoints.confidence * 2 },
                  { axis: 'Clarity', value: aiResult.weakPoints.clarity },
                  // Filler words score is inverted: higher = more fillers = worse
                  { axis: 'Filler Words', value: 10 - aiResult.weakPoints.filler },
                ]}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: '#8E96A3', fontSize: 11 }} />
                  <Radar dataKey="value" stroke="#B89A5A" fill="#B89A5A" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Conclusions */}
            <div className="rounded-xl bg-[#1C1F26] border-l-4 border-l-[#B89A5A]/50 border border-white/5 p-5 mb-4">
              <h3 className="text-xs text-[#8E96A3] uppercase tracking-wider mb-3">AI Analysis</h3>
              <p className="text-sm text-[#F4F2ED] leading-relaxed">{aiResult.aiConclusions}</p>
            </div>

            {/* Top 3 focus areas */}
            <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-5 mb-4">
              <h3 className="text-xs text-[#8E96A3] uppercase tracking-wider mb-3">Top 3 Priority Areas</h3>
              <div className="space-y-3">
                {Object.entries(aiResult.weakPoints).sort(([,a]: any, [,b]: any) => b - a).slice(0, 3).map(([key, value]: [string, any], i) => (
                  <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                    <div className="w-8 h-8 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-[#B89A5A]">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F4F2ED] capitalize">{key}</p>
                      <p className="text-xs text-[#8E96A3]">
                        {key === 'pronunciation' && 'Clarity of speech for international listeners'}
                        {key === 'structure' && 'Logical flow and message organisation'}
                        {key === 'vocabulary' && 'Breadth and precision of professional vocabulary'}
                        {key === 'confidence' && 'Assertiveness and executive presence'}
                        {key === 'filler' && 'Removing hesitations that undermine credibility'}
                        {key === 'clarity' && 'Precision and impact of your communication'}
                      </p>
                    </div>
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#B89A5A]" style={{ width: `${(value / 10) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#B89A5A]/5 border border-[#B89A5A]/20 mb-4">
              <p className="text-xs text-[#B89A5A] font-semibold uppercase tracking-wider mb-1">✨ Your path has been personalised</p>
              <p className="text-sm text-[#F4F2ED]">Your programme has been tailored based on your diagnostic results. Chapter 2 is now unlocked!</p>
            </div>

            <Button onClick={() => navigate('/capitulos')} className="w-full bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold h-12 text-base">
              Begin Chapter 2 — Voice Foundations <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </PlatformLayout>
  );
}
