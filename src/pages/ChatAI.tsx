import PlatformLayout from "@/components/PlatformLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Send, User, Trash2, Mic, MicOff, X, PenLine, Target, BookOpen, Users, ClipboardList, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// SpeechRecognition type declarations
interface SpeechRecognitionResult {
  readonly [index: number]: { transcript: string; confidence: number };
  readonly isFinal: boolean;
  readonly length: number;
}
interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
  readonly length: number;
}
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
}

interface Message {
  role: "bot" | "user";
  text: string;
  timestamp: string;
}

const quickActions = [
  {
    icon: PenLine,
    emoji: "✍️",
    label: "Analyse my writing",
    type: "analyze" as const,
  },
  {
    icon: Target,
    emoji: "🎯",
    label: "Give me a drill",
    prompt: "Give me a targeted drill based on my weak points. Make it specific and give me clear instructions.",
  },
  {
    icon: BookOpen,
    emoji: "📖",
    label: "Explain this grammar",
    prompt: "Explain an important grammar point for professional business English with clear examples.",
  },
  {
    icon: Users,
    emoji: "🎭",
    label: "Practise a scenario",
    prompt: "Let's practise a professional scenario. You start the conversation as a colleague or client.",
  },
  {
    icon: ClipboardList,
    emoji: "📋",
    label: "Review my last session",
    prompt: "Based on my recent progress, what should I focus on to improve my executive communication?",
  },
  {
    icon: GraduationCap,
    emoji: "📚",
    label: "Vocabulary help",
    prompt: "Give me 5 advanced business English vocabulary words or expressions with example sentences in professional contexts.",
  },
];

function getBotResponse(text: string): string {
  const lower = text.toLowerCase();

  if (lower.includes("olá") || lower.includes("ola") || lower.includes("hello") || lower.includes("hi ") || lower === "hi" || lower.includes("bom dia") || lower.includes("boa tarde")) {
    return "Olá! 👋 Sou o teu VOICE³ Performance Coach. Estou aqui para te ajudar a melhorar a tua comunicação executiva em inglês. Sobre o que queres falar hoje? Gramática, vocabulário, reuniões, apresentações?";
  }

  if (lower.includes("grammar") || lower.includes("gramática") || lower.includes("tense") || lower.includes("verb") || lower.includes("conjugation") || lower.includes("tempo verbal")) {
    return "Grammar is the foundation of executive communication. Let me help you with that. What specific grammar point are you struggling with — conditionals, tenses, or articles?\n\nEm inglês de negócios, domina estes tempos verbais:\n• Present Perfect: 'We have completed the project.'\n• Conditional: 'If you could confirm by Friday, we would...'\n• Past Simple: 'We launched the product last year.'";
  }

  if (lower.includes("vocabulary") || lower.includes("vocabulário") || lower.includes("palavras") || lower.includes("palavra") || lower.includes("word") || lower.includes("meaning") || lower.includes("synonym") || lower.includes("translate") || lower.includes("significado")) {
    return "Expanding your executive vocabulary is crucial. I recommend focusing on transition phrases for presentations: 'As I mentioned...', 'Building on that point...', 'The key takeaway here is...'\n\nSubstituições úteis em inglês de negócios:\n• Em vez de 'do' → 'execute', 'implement', 'deliver'\n• Em vez de 'show' → 'demonstrate', 'highlight', 'present'\n• Em vez de 'help' → 'assist', 'support', 'facilitate'";
  }

  if (lower.includes("meeting") || lower.includes("reunião") || lower.includes("reuniao") || lower.includes("meetings") || lower.includes("melhorar em reuniões")) {
    return "For meetings, use these power phrases: Start with 'I'd like to open by...', disagree diplomatically with 'I see your point, however...', close with 'Let me summarize the key decisions...'\n\nMais frases úteis:\n• 'Could you elaborate on that?'\n• 'In my opinion...'\n• 'Sorry to interrupt, but...'";
  }

  if (lower.includes("email") || lower.includes("emails formais")) {
    return "Executive emails should be: Direct (no filler), Specific (clear ask), Professional (no contractions in formal). Start with: 'I am writing to...' or 'Following our conversation...'\n\nEstrutura recomendada:\n1. 'Dear [Name],' / 'Hi [Name],'\n2. 'I am writing to...'\n3. Conteúdo principal\n4. 'Could you please...'\n5. 'Kind regards,' + teu nome";
  }

  if (lower.includes("presentation") || lower.includes("apresentação") || lower.includes("apresentacoes") || lower.includes("vocabulário de apresentações")) {
    return "A strong executive presentation follows the PREP framework: Point, Reason, Example, Point again. Open with impact: 'The question I'm here to answer today is...'\n\nFrases essenciais:\n• 'I'd like to take you through...'\n• 'As you can see from this slide...'\n• 'The key takeaway here is...'\n• 'To summarize what we've covered...'";
  }

  if (lower.includes("pronunciation") || lower.includes("pronúncia") || lower.includes("pronunci") || lower.includes("exercício de pronúncia")) {
    return "Focus on stress and rhythm over accent. In English, stress the most important word: 'We NEED to increase REVENUE.' Record yourself and compare with native speakers.\n\nExercício prático:\n1. Escolhe um parágrafo de um email profissional\n2. Lê em voz alta, gravando\n3. Ouve e identifica onde hesitas\n4. Repete até soar natural 🎙️";
  }

  if (lower.includes("confidence") || lower.includes("confiança")) {
    return "Confidence in English comes from preparation and exposure. Start every day by listening to 10 minutes of English business news. Speak first in meetings, even briefly.\n\nDicas práticas:\n• Prepara 2-3 frases antes de cada reunião\n• Aceita os erros — fazem parte do processo\n• A consistência diária supera a perfeição ocasional 💪";
  }

  if (lower.includes("negotiation") || lower.includes("negociação") || lower.includes("negoci")) {
    return "In negotiations, these phrases are powerful: 'Let me understand your position...', 'What would make this work for you?', 'I can offer X, but I'll need Y in return.'\n\nEstrutura de negociação:\n• Abre: 'I'd like to explore how we can...'\n• Concessão: 'We could be flexible on X if...'\n• Fecho: 'I think we've found a good solution here.'";
  }

  if (lower.includes("sessão") || lower.includes("sessoes") || lower.includes("sessões") || lower.includes("curso")) {
    return "O teu pack inclui 8 sessões de Inglês Empresarial! Cada sessão tem conteúdo em texto, vocabulário, frases essenciais e um quiz. Precisas de obter 60% no quiz para concluir cada sessão. Vai a 'Meu Curso' para começar! 📚";
  }

  if (lower.includes("aula") || lower.includes("professora")) {
    return "As aulas com professora são desbloqueadas após completares sessões: após 4 sessões tens a Aula #1, e após 8 sessões tens a Aula #2. Cada aula dura 45 minutos e é personalizada para o teu nível. Vai a 'Aulas' para marcar! 📅";
  }

  if (lower.includes("progresso") || lower.includes("resultado")) {
    return "Estás a fazer um excelente trabalho! 💪 Continua a completar as sessões ao teu ritmo. A consistência é a chave para fluência em inglês empresarial. Cada sessão completada aproxima-te do teu objetivo!";
  }

  if (lower.includes("preparar") || lower.includes("prepara")) {
    return "Para te preparares para uma reunião em inglês:\n• Revê o vocabulário relevante ao tema\n• Prepara 2-3 opiniões ou perguntas\n• Pratica as frases de interação (concordar, discordar, sugerir)\n• Se possível, lê a agenda com antecedência\n\nA preparação é 80% do sucesso! 💡";
  }

  if (lower.includes("difficult") || lower.includes("hard") || lower.includes("help") || lower.includes("stuck") || lower.includes("difícil") || lower.includes("ajuda") || lower.includes("dificuldade")) {
    return "Não te preocupes! 💛 Aprender inglês empresarial é um processo gradual e estás no caminho certo. Cada dificuldade que sentes é uma oportunidade de crescimento. Tenta voltar ao conteúdo da sessão, toma notas das frases que achaste difíceis, e pratica-as em voz alta. Estás a fazer melhor do que pensas! 🌟";
  }

  if (lower.includes("interview") || lower.includes("entrevista")) {
    return "Dicas para a entrevista de emprego em inglês! 💼\n• Usa o método STAR: Situation → Task → Action → Result\n• Prepara respostas para: 'Tell me about yourself', 'Greatest strength?', 'Where do you see yourself in 5 years?'\n• Evita falar mal de empregadores anteriores\n• Termina sempre com uma pergunta ao entrevistador: 'What does success look like in this role?'";
  }

  if (lower.includes("small talk") || lower.includes("casual") || lower.includes("informal")) {
    return "Small talk em inglês de negócios — frases essenciais! 💬\n• 'How's everything going?' / 'How's business?'\n• 'Did you have a good weekend?'\n• 'How was your trip / the conference?'\n• Para terminar: 'It was great catching up! Let's connect again soon.'";
  }

  if (lower.includes("analyse my writing") || lower.includes("analyze my writing")) {
    return "I'd be happy to analyse your writing! Please paste the text you'd like me to review. I'll give you detailed feedback on grammar, vocabulary, professional tone, and structure.";
  }

  if (lower.includes("drill") || lower.includes("weak points")) {
    return "Here's a targeted drill for executive communication:\n\n**DRILL: Diplomatic Disagreement**\nTransform these blunt statements into professional, diplomatic versions:\n\n1. 'That's wrong.' → ?\n2. 'I don't agree.' → ?\n3. 'We can't do that.' → ?\n\n*Model answers:*\n1. 'I see this slightly differently — could we explore...'\n2. 'I appreciate that perspective, however...'\n3. 'That presents some challenges. What if we were to...'\n\nTry writing your own versions! 💪";
  }

  if (lower.includes("grammar point") || (lower.includes("explain") && lower.includes("grammar"))) {
    return "**Grammar Focus: Conditional Sentences in Business English**\n\nConditionals are essential for professional communication — proposals, negotiations, and hypotheticals.\n\n**Type 1** (real possibility): 'If we confirm by Friday, *we will* meet the deadline.'\n**Type 2** (hypothetical): 'If we *had* more budget, *we would* expand the team.'\n**Type 3** (past hypothetical): 'If we *had started* earlier, *we would have avoided* this delay.'\n\n**Business tip:** Use Type 2 for polite requests: 'It *would* be helpful *if you could* send the report by EOD.'";
  }

  if (lower.includes("scenario") || lower.includes("practise") || lower.includes("practice")) {
    return "Let's practise! I'll be your client in this scenario:\n\n---\n*[Client — David Chen, Procurement Director]*\n'Good morning. I've been reviewing the proposal your team sent over, and while I find the solution interesting, I'm concerned about the implementation timeline. Can you walk me through how you'd handle that?'\n\n---\nYour turn! Respond professionally, address his concern directly, and show confidence. Remember to acknowledge his concern before presenting your solution. 🎭";
  }

  if (lower.includes("recent progress") || lower.includes("last session") || lower.includes("focus on")) {
    return "Based on your learning profile, here's what I recommend focusing on next:\n\n**Priority 1: Hedging Language** — Softening statements for diplomatic communication\n*e.g., 'It seems that...', 'It might be worth considering...', 'Arguably...'\n\n**Priority 2: Signposting in Presentations** — Guiding your audience clearly\n*e.g., 'Let me turn now to...', 'As I mentioned earlier...', 'To recap...'\n\n**Priority 3: Concision** — Saying more with fewer words — a hallmark of executive communication.\n\nWould you like a drill on any of these? 🎯";
  }

  if (lower.includes("vocabulary") || lower.includes("5 advanced") || lower.includes("business english vocabulary")) {
    return "**5 Advanced Business English Expressions:**\n\n1. **To cascade** — to communicate information down through an organization\n*'We need to cascade this decision to all team leads by tomorrow.'\n\n2. **To leverage** — to use something to maximum advantage\n*'We can leverage our existing client relationships for this expansion.'\n\n3. **Bandwidth** — capacity to take on more work\n*'I don't have the bandwidth for this project right now.'\n\n4. **To circle back** — to return to a topic later\n*'Let's circle back on the budget once we have the figures.'\n\n5. **Stakeholder alignment** — ensuring all relevant parties agree\n*'Before we proceed, we need full stakeholder alignment.'\n\nTry using one in a sentence! ✍️";
  }

  return "Excelente pergunta! Na VOICE³, trabalhamos cada aspeto da comunicação executiva. Pode reformular a tua pergunta ou escolher um dos tópicos acima?\n\nPosso ajudar-te com: gramática, vocabulário, reuniões, emails, apresentações, pronúncia, confiança ou negociação. 😊";
}

const ChatAI = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";
  const storageKey = `voice3_chat_history_${userId}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [analyzeMode, setAnalyzeMode] = useState(false);
  const [analyzeText, setAnalyzeText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const supportsSpeech = !!SpeechRecognitionConstructor;

  const aiEval = (() => {
    try {
      const raw = localStorage.getItem(`voice3_ai_evaluation_${userId}`);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const levelDetail = aiEval?.level && aiEval?.teachingStyle
    ? ` (${aiEval.level}), teaching style (${aiEval.teachingStyle}),`
    : "";
  const systemMessage = aiEval?.level
    ? `Your AI Coach knows your level${levelDetail} and weak points. Ask anything about your sessions, get feedback on your writing, or request a drill.`
    : "Your AI Coach is ready to help. Ask anything about your sessions, get feedback on your writing, or request a drill.";

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        const initial: Message[] = [{
          role: "bot",
          text: "Olá! 👋 Sou o assistente Voice³. Posso ajudar-te com dúvidas sobre o teu curso, sessões ou Inglês empresarial. Como posso ajudar?",
          timestamp: new Date().toISOString(),
        }];
        setMessages(initial);
        localStorage.setItem(storageKey, JSON.stringify(initial));
      }
    } catch (_e) {
      // ignore
    }
  }, [storageKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const saveMessages = (msgs: Message[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(msgs));
    } catch (_e) {
      // ignore
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text: text.trim(), timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        role: "bot",
        text: getBotResponse(text),
        timestamp: new Date().toISOString(),
      };
      const withBot = [...newMessages, botMsg];
      setMessages(withBot);
      saveMessages(withBot);
      setIsTyping(false);
    }, 1000);
  };

  const handleAnalyzeSend = () => {
    if (!analyzeText.trim()) return;
    const prompt = `Please analyse my writing and give me detailed feedback on grammar, vocabulary, and professional tone:\n\n${analyzeText}`;
    setAnalyzeMode(false);
    setAnalyzeText("");
    sendMessage(prompt);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (action.type === "analyze") {
      setAnalyzeMode(true);
      return;
    }
    if (action.prompt) {
      sendMessage(action.prompt);
    }
  };

  const handleVoiceInput = () => {
    if (!supportsSpeech) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition: SpeechRecognitionInstance = new SpeechRecognitionConstructor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-GB";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev ? `${prev} ${transcript}` : transcript);
      inputRef.current?.focus();
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const handleClear = () => {
    const initial: Message[] = [{
      role: "bot",
      text: "Chat limpo! Como posso ajudar-te hoje?",
      timestamp: new Date().toISOString(),
    }];
    setMessages(initial);
    saveMessages(initial);
  };

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ letterSpacing: "0.12em" }} className="text-[10px] font-semibold uppercase text-[#C9A84C] mb-0.5">AI Coach</p>
            <p className="text-xs text-[#8E96A3]">Your personal language intelligence — AI-powered coaching</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-[#8E96A3]">Online · Ready to help</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-white/40 hover:text-white/70">
              <Trash2 className="h-4 w-4 mr-1" /> Limpar
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1" style={{ background: "transparent" }}>
          {/* System message card */}
          <div
            className="rounded-xl px-4 py-3"
            style={{
              background: "rgba(201,168,76,0.06)",
              borderLeft: "2px solid #C9A84C",
              backdropFilter: "blur(20px)",
            }}
          >
            <p style={{ letterSpacing: "0.1em" }} className="text-[10px] text-[#C9A84C] font-semibold mb-0.5 uppercase">AI Coach</p>
            <p className="text-sm text-[#F4F2ED]/80">{systemMessage}</p>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "bot" && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.35)" }}
                  >
                    <span className="text-[10px] font-bold text-[#C9A84C] leading-none">V³</span>
                  </div>
                )}
                <div className="flex flex-col gap-1 max-w-md">
                  {msg.role === "bot" ? (
                    <div
                      className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm whitespace-pre-line text-[#F4F2ED]"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                        borderRight: "1px solid rgba(255,255,255,0.08)",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        borderLeft: "2px solid rgba(201,168,76,0.4)",
                        backdropFilter: "blur(20px)",
                      }}
                    >
                      {msg.text}
                    </div>
                  ) : (
                    <div
                      className="px-4 py-3 rounded-2xl rounded-br-sm text-sm whitespace-pre-line font-medium"
                      style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0A0A0F" }}
                    >
                      {msg.text}
                    </div>
                  )}
                  <span className={`text-[10px] text-white/30 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-4 w-4 text-white/60" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.35)" }}
              >
                <span className="text-[10px] font-bold text-[#C9A84C] leading-none">V³</span>
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "2px solid rgba(201,168,76,0.4)" }}
              >
                <span className="text-xs text-[#8E96A3]">VOICE³ Coach is typing</span>
                <span className="flex gap-1">
                  {[0, 1, 2].map(idx => (
                    <motion.span key={idx} className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/60 inline-block"
                      animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: idx * 0.2 }} />
                  ))}
                </span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Analyse Writing Mode */}
        <AnimatePresence>
          {analyzeMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 overflow-hidden"
            >
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.25)", backdropFilter: "blur(20px)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ letterSpacing: "0.08em" }} className="text-[10px] text-[#C9A84C] uppercase font-semibold">Paste your writing below</span>
                  <button onClick={() => { setAnalyzeMode(false); setAnalyzeText(""); }} className="text-white/30 hover:text-white/60 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <textarea
                  value={analyzeText}
                  onChange={e => setAnalyzeText(e.target.value)}
                  placeholder="Paste your email, report, or any business writing here..."
                  rows={4}
                  className="w-full bg-transparent text-sm text-[#F4F2ED] placeholder:text-white/25 outline-none resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={handleAnalyzeSend}
                    disabled={!analyzeText.trim()}
                    className="rounded-full h-8 px-5 text-xs font-semibold"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0A0A0F", border: "none" }}
                  >
                    Analyse →
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick action buttons — 3×2 grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleQuickAction(action)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all duration-200 group hover:shadow-[0_0_12px_rgba(201,168,76,0.2)]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            >
              <span className="text-base shrink-0">{action.emoji}</span>
              <span className="text-[11px] text-white/60 group-hover:text-[#C9A84C] transition-colors leading-tight">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="flex gap-2">
          <div
            className="flex-1 flex items-center px-4 rounded-xl transition-all duration-200 focus-within:shadow-[0_0_0_1px_rgba(201,168,76,0.4)]"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder="Ask your AI Coach..."
              className="flex-1 py-3 bg-transparent text-sm outline-none placeholder:text-white/25 text-[#F4F2ED]"
            />
          </div>
          {supportsSpeech && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceInput}
              className={`h-12 w-12 rounded-xl border transition-all duration-200 ${
                isRecording
                  ? "bg-red-500/15 border-red-500/40 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                  : "text-white/40 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 border-white/10"
              }`}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {isRecording ? (
                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                  <MicOff className="h-4 w-4" />
                </motion.div>
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="h-12 w-12 rounded-xl disabled:opacity-40 transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0A0A0F", border: "none" }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </PlatformLayout>
  );
};

export default ChatAI;
