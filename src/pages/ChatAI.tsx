import PlatformLayout from "@/components/PlatformLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Send, User, Trash2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  role: "bot" | "user";
  text: string;
  timestamp: string;
}

const quickQuestions = [
  "Analyse my writing",
  "Give me a drill",
  "Explain this grammar",
  "Practise a scenario",
  "Review my last session",
  "Vocabulary help",
];

function getBotResponse(text: string): string {
  const lower = text.toLowerCase();

  // Greetings — check first
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

  return "Excelente pergunta! Na VOICE³, trabalhamos cada aspeto da comunicação executiva. Pode reformular a tua pergunta ou escolher um dos tópicos acima?\n\nPosso ajudar-te com: gramática, vocabulário, reuniões, emails, apresentações, pronúncia, confiança ou negociação. 😊";
}

const ChatAI = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";
  const storageKey = `voice3_chat_history_${userId}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Read AI evaluation data for personalised system message
  const aiEval = (() => {
    try {
      const raw = localStorage.getItem(`voice3_ai_evaluation_${userId}`);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const levelDetail = aiEval?.level && aiEval?.teachingStyle
    ? ` (${aiEval.level}), teaching style (${aiEval.teachingStyle}),`
    : ",";
  const systemMessage = `Your AI Coach knows your level${levelDetail} and weak points. Ask anything about your sessions, get feedback on your writing, or request a drill.`;

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

  const handleChipClick = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl font-bold">Chat AI</h1>
            <p className="text-muted-foreground text-sm">Pratica, tira dúvidas e melhora o teu Inglês.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-white/40 hover:text-white/70">
            <Trash2 className="h-4 w-4 mr-1" /> Limpar
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
          {/* System message card */}
          <div className="border-l-2 border-[#B89A5A] bg-[#B89A5A]/5 rounded-r-xl px-4 py-3">
            <p className="text-xs text-[#B89A5A] font-semibold mb-0.5 uppercase tracking-wider">AI Coach</p>
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
                  <div className="w-8 h-8 rounded-full bg-[#B89A5A]/20 border border-[#B89A5A]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-[#B89A5A] leading-none">V³</span>
                  </div>
                )}
                <div className="flex flex-col gap-1 max-w-md">
                  <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary rounded-bl-sm border-l-2 border-[#B89A5A]/40"
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`text-[10px] text-white/30 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B89A5A]/20 border border-[#B89A5A]/40 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-[#B89A5A] leading-none">V³</span>
              </div>
              <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-sm border-l-2 border-[#B89A5A]/40 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">VOICE³ Coach is typing</span>
                <span className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-[#B89A5A]/60 inline-block"
                      animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick reply chips — 2 rows of 3 */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {quickQuestions.map((q, i) => (
            <button key={i} onClick={() => handleChipClick(q)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-[#B89A5A]/10 hover:border-[#B89A5A]/30 hover:text-[#B89A5A] transition-colors truncate">
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder="Ask your AI Coach..."
            className="flex-1 px-5 py-3 rounded-xl bg-secondary text-sm outline-none placeholder:text-muted-foreground border border-border focus:border-primary transition-colors"
          />
          <Button variant="ghost" size="icon"
            className="h-12 w-12 rounded-xl text-white/40 hover:text-[#B89A5A] hover:bg-[#B89A5A]/10 border border-border"
            title="Voice input (coming soon)" disabled>
            <Mic className="h-4 w-4" />
          </Button>
          <Button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 w-12">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </PlatformLayout>
  );
};

export default ChatAI;
