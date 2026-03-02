import PlatformLayout from "@/components/PlatformLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  role: "bot" | "user";
  text: string;
  timestamp: string;
}

const quickQuestions = [
  "Como me preparo para uma reunião em inglês?",
  "Como escrevo um email formal?",
  "Dicas para negociação?",
  "O que são as sessões do curso?",
  "Como marco uma aula com professora?",
];

function getBotResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("sessão") || lower.includes("sessoes") || lower.includes("sessões") || lower.includes("curso")) {
    return "O teu pack inclui 8 sessões de Inglês Empresarial! Cada sessão tem conteúdo em texto, vocabulário, frases essenciais e um quiz. Precisas de obter 60% no quiz para concluir cada sessão. Vai a 'Meu Curso' para começar! 📚";
  }
  if (lower.includes("aula") || lower.includes("professora")) {
    return "As aulas com professora são desbloqueadas após completares sessões: após 4 sessões tens a Aula #1, e após 8 sessões tens a Aula #2. Cada aula dura 45 minutos e é personalizada para o teu nível. Vai a 'Aulas' para marcar! 📅";
  }
  if (lower.includes("progresso") || lower.includes("resultado")) {
    return "Estás a fazer um excelente trabalho! 💪 Continua a completar as sessões ao teu ritmo. A consistência é a chave para fluência em inglês empresarial. Cada sessão completada aproxima-te do teu objetivo!";
  }
  if (lower.includes("email")) {
    return "Para um email profissional em inglês, segue esta estrutura:\n1. **Abertura**: 'Dear [Name],' ou 'Hi [Name],'\n2. **Propósito**: 'I am writing to...'\n3. **Detalhes**: O conteúdo principal\n4. **Ação**: 'Could you please...'\n5. **Fecho**: 'Kind regards,' + teu nome\n\nEvita contrações (I'm, don't) em emails formais! ✉️";
  }
  if (lower.includes("reunião") || lower.includes("meeting") || lower.includes("reuniao")) {
    return "Para participares ativamente numa reunião em inglês:\n• Usa 'In my opinion...' para dar a tua perspetiva\n• 'I see your point, but...' para discordar educadamente\n• 'Could you elaborate?' para pedir mais detalhes\n• 'Sorry to interrupt, but...' para intervir\n\nPratica estas frases na Sessão 3! 🎯";
  }
  if (lower.includes("negoci") || lower.includes("negociação")) {
    return "Dicas de negociação em inglês:\n• Conhece o teu BATNA (melhor alternativa)\n• Começa com a tua posição ideal\n• Usa 'We could be flexible on X if...' para concessões\n• 'I understand your position, however...' para contraproposta\n• Procura sempre um win-win!\n\nVê a Sessão 6 para mais detalhes! 🤝";
  }
  if (lower.includes("preparar") || lower.includes("prepara")) {
    return "Para te preparares para uma reunião em inglês:\n• Revê o vocabulário relevante ao tema\n• Prepara 2-3 opiniões ou perguntas\n• Pratica as frases de interação (concordar, discordar, sugerir)\n• Se possível, lê a agenda com antecedência\n\nA preparação é 80% do sucesso! 💡";
  }
  if (lower.includes("grammar") || lower.includes("tense") || lower.includes("verb") || lower.includes("conjugation") || lower.includes("gramática") || lower.includes("tempo verbal")) {
    return "Dica de gramática! 📖 Em inglês de negócios, domina estes tempos verbais:\n• **Present Simple**: rotinas e factos — 'We hold weekly meetings.'\n• **Present Perfect**: experiências recentes — 'We have completed the project.'\n• **Past Simple**: eventos concluídos — 'We launched the product last year.'\n• **Conditional**: propostas e negociações — 'If you could confirm by Friday, we would...' \n\nPratica um por vez para consolidar!";
  }
  if (lower.includes("word") || lower.includes("meaning") || lower.includes("vocabulary") || lower.includes("synonym") || lower.includes("translate") || lower.includes("vocabulário") || lower.includes("palavra") || lower.includes("significado")) {
    return "Ótima questão de vocabulário! 📚 Algumas substituições úteis em inglês de negócios:\n• Em vez de 'do' → 'execute', 'implement', 'deliver'\n• Em vez de 'show' → 'demonstrate', 'highlight', 'present'\n• Em vez de 'help' → 'assist', 'support', 'facilitate'\n• Em vez de 'use' → 'leverage', 'utilise', 'apply'\n\nVocabulário mais rico transmite mais profissionalismo! Se tens uma palavra específica, pergunta-me!";
  }
  if (lower.includes("difficult") || lower.includes("hard") || lower.includes("help") || lower.includes("stuck") || lower.includes("difícil") || lower.includes("ajuda") || lower.includes("dificuldade")) {
    return "Não te preocupes! 💛 Aprender inglês empresarial é um processo gradual e estás no caminho certo. Cada dificuldade que sentes é uma oportunidade de crescimento. Tenta voltar ao conteúdo da sessão, toma notas das frases que achaste difíceis, e pratica-as em voz alta. Estás a fazer melhor do que pensas! 🌟";
  }
  if (lower.includes("interview") || lower.includes("entrevista")) {
    return "Dicas para a entrevista de emprego em inglês! 💼\n• Usa o método STAR: Situation → Task → Action → Result\n• Prepara respostas para: 'Tell me about yourself', 'Greatest strength?', 'Where do you see yourself in 5 years?'\n• Evita falar mal de empregadores anteriores\n• Termina sempre com uma pergunta ao entrevistador: 'What does success look like in this role?'\n\nVê a Sessão 7 para praticar! 🎯";
  }
  if (lower.includes("pronunciation") || lower.includes("pronúncia") || lower.includes("pronunci")) {
    return "Dicas de pronúncia para inglês de negócios! 🎙️\n• Faz pausa antes de palavras-chave para dar ênfase\n• Reduz palavras funcionais (the, a, of, to) para soar mais natural\n• Pratica connected speech: 'I want to' soa como 'I wanna' em contexto informal\n• Grava-te a falar e ouve depois — é o método mais eficaz!\n• Foca-te em ser claro, não em ter sotaque perfeito\n\nA Sessão 8 tem exercícios avançados de pronúncia! 🎧";
  }
  if (lower.includes("small talk") || lower.includes("conversa") || lower.includes("casual") || lower.includes("informal")) {
    return "Small talk em inglês de negócios — frases essenciais! 💬\n• 'How's everything going?' / 'How's business?'\n• 'Did you have a good weekend?'\n• 'How was your trip / the conference?'\n• 'Have you been working with [company] long?'\n• Para terminar: 'It was great catching up! Let's connect again soon.'\n\nO small talk cria relações profissionais fortes — não o subestimes! 😊";
  }
  return "Boa pergunta! 😊 Estou aqui para te ajudar com o teu Inglês empresarial. Podes perguntar-me sobre sessões, reuniões, emails profissionais, negociações, entrevistas de emprego, vocabulário, gramática ou dicas de pronúncia. O que queres aprender hoje?";
}

const ChatAI = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";
  const storageKey = `voice3_chat_history_${userId}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-md px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary rounded-bl-sm"
                }`}>
                  {msg.text}
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
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                <span className="text-xs text-muted-foreground">a escrever</span>
                <span className="flex gap-0.5">
                  {[0, 1, 2].map(i => (
                    <motion.span key={i} className="w-1 h-1 rounded-full bg-primary/60 inline-block"
                      animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {quickQuestions.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors">
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder="Escreve a tua mensagem..."
            className="flex-1 px-5 py-3 rounded-xl bg-secondary text-sm outline-none placeholder:text-muted-foreground border border-border focus:border-primary transition-colors"
          />
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
