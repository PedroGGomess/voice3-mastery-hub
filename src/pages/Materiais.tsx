import { useState } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { sessionsData } from "@/lib/sessionsData";
import { toast } from "sonner";
import {
  FolderOpen, BookOpen, Lock, CheckCircle2, Download, Eye, Mic,
  Play, FileText, Headphones, Video, AlignLeft, Award, ChevronDown, ChevronUp, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TOTAL_SESSIONS = 8;

interface MaterialItem {
  icon: React.ReactNode;
  label: string;
  type: string;
  content: string;
}

function getSessionMaterials(session: typeof sessionsData[0]): MaterialItem[] {
  return [
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Transcrição",
      type: "Texto",
      content: session.audioTranscript,
    },
    {
      icon: <AlignLeft className="h-4 w-4" />,
      label: "Exercício",
      type: "PDF",
      content: session.exercise,
    },
    {
      icon: <Headphones className="h-4 w-4" />,
      label: session.audioTitle,
      type: "Áudio",
      content: `Áudio: ${session.audioTitle}`,
    },
    {
      icon: <Video className="h-4 w-4" />,
      label: session.videoTitle,
      type: "Vídeo",
      content: `Vídeo: ${session.videoTitle}`,
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: "Resumo da Sessão",
      type: "Texto",
      content: session.content.map(c => `**${c.title}**\n${c.body || (c.items || []).join("\n")}`).join("\n\n"),
    },
  ];
}

const VOCAB_WORDS = [
  "Colleague — colega de trabalho",
  "Stakeholder — parte interessada",
  "Deadline — prazo",
  "Agenda — agenda / ordem de trabalhos",
  "Follow up — dar seguimento",
  "Action item — ponto de ação",
  "Feedback — retorno / comentário",
  "Brief — resumo / informar",
  "Deliverable — entregável",
  "KPI — indicador-chave de desempenho",
  "Benchmark — referência de comparação",
  "Pipeline — fluxo de trabalho/vendas",
  "Onboarding — integração de colaboradores",
  "Pitch — apresentação de venda",
  "Scope — âmbito do projeto",
];

const TEMPLATES = [
  { id: 1, title: "Template: Email Profissional", icon: <FileText className="h-5 w-5" />, type: "download", desc: "Estrutura completa para emails formais em inglês" },
  { id: 2, title: "Template: Estrutura de Apresentação", icon: <AlignLeft className="h-5 w-5" />, type: "download", desc: "Framework para presentations executivas" },
  { id: 3, title: "Guia: Frases para Reuniões", icon: <BookOpen className="h-5 w-5" />, type: "view", desc: "Expressões essenciais para meeting management" },
  { id: 4, title: "Guia: Vocabulário de Negociação", icon: <BookOpen className="h-5 w-5" />, type: "view", desc: "Termos e frases para negociações em inglês" },
];

const GUIDE_CONTENT: Record<number, { title: string; sections: { heading: string; items: string[] }[] }> = {
  3: {
    title: "Frases Essenciais para Reuniões",
    sections: [
      { heading: "Iniciar a Reunião", items: ["Shall we get started?", "Let's kick things off.", "Thank you all for joining today.", "The purpose of today's meeting is..."] },
      { heading: "Dar a Palavra", items: ["I'd like to hand over to...", "Could you walk us through...?", "Please go ahead.", "Over to you."] },
      { heading: "Pedir Clarificação", items: ["Could you elaborate on that?", "What do you mean by...?", "Could you give us an example?", "Just to clarify..."] },
      { heading: "Encerrar", items: ["Let's wrap up.", "To summarise the key points...", "The next steps are...", "Thanks everyone for your time."] },
    ],
  },
  4: {
    title: "Vocabulário de Negociação",
    sections: [
      { heading: "Posições e Propostas", items: ["Our initial offer is...", "We'd like to propose...", "This is our best offer.", "There's some room to negotiate."] },
      { heading: "Contrapropostas", items: ["We appreciate your offer, however...", "Could you go any lower/higher?", "We'd need you to meet us halfway.", "That's beyond our budget."] },
      { heading: "Fechar o Acordo", items: ["I think we have a deal.", "Let's shake on it.", "We're prepared to move forward.", "We can commit to that."] },
      { heading: "Adiar Decisões", items: ["We'll need to take this back to the team.", "Let me check and get back to you.", "We require some time to consider.", "Can we revisit this tomorrow?"] },
    ],
  },
};

interface ViewerModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string | null;
  guideData?: typeof GUIDE_CONTENT[number];
}

function ViewerModal({ open, onClose, title, content, guideData }: ViewerModalProps) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto border border-[#B89A5A]/20"
        style={{ background: "#0F1C2E", color: "#F4F2ED" }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-serif text-xl text-[#F4F2ED]">{title}</DialogTitle>
            <button onClick={onClose} className="text-[#8E96A3] hover:text-[#F4F2ED] transition-colors ml-4">
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {guideData ? (
            guideData.sections.map((section, i) => (
              <div key={i}>
                <h3 className="text-[#B89A5A] font-semibold text-sm mb-2 uppercase tracking-wider">{section.heading}</h3>
                <ul className="space-y-1">
                  {section.items.map((item, j) => (
                    <li key={j} className="text-[#F4F2ED] text-sm pl-3 border-l border-[#B89A5A]/30 py-0.5">{item}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-[#8E96A3] text-sm leading-relaxed whitespace-pre-line">{content}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface VocabModalProps {
  open: boolean;
  onClose: () => void;
}

function VocabModal({ open, onClose }: VocabModalProps) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[75vh] overflow-y-auto border border-[#B89A5A]/20"
        style={{ background: "#0F1C2E", color: "#F4F2ED" }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-serif text-xl text-[#F4F2ED]">Vocabulário Essencial</DialogTitle>
            <button onClick={onClose} className="text-[#8E96A3] hover:text-[#F4F2ED] transition-colors ml-4">
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          {VOCAB_WORDS.map((word, i) => {
            const [en, pt] = word.split(" — ");
            return (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[#F4F2ED] text-sm font-medium">{en}</span>
                <span className="text-[#B89A5A] text-sm">{pt}</span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const Materiais = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";

  let progress: Record<number, { completed: boolean; score: number; completedAt: string }> = {};
  try {
    const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
    if (stored) progress = JSON.parse(stored);
  } catch (_e) { /* ignore */ }

  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const allComplete = completedCount === TOTAL_SESSIONS;

  const [expandedSession, setExpandedSession] = useState<number | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerTitle, setViewerTitle] = useState("");
  const [viewerContent, setViewerContent] = useState<string | null>(null);
  const [viewerGuide, setViewerGuide] = useState<typeof GUIDE_CONTENT[number] | undefined>(undefined);
  const [vocabOpen, setVocabOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  function openViewer(title: string, content: string, guide?: typeof GUIDE_CONTENT[number]) {
    setViewerTitle(title);
    setViewerContent(content);
    setViewerGuide(guide);
    setViewerOpen(true);
  }

  return (
    <PlatformLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium mb-1">Executive Communication Programme</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight">Materiais</h1>
        <p className="text-[#8E96A3] text-sm mt-1">Recursos de apoio para cada sessão do teu percurso.</p>
      </motion.div>

      {/* Section A: Pré-Sessão */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Pré-Sessão</h2>
          <div className="h-px flex-1 bg-[#B89A5A]/20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Instruções Pré-Sessão */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1C1F26] border border-white/5 hover:border-[#B89A5A]/20 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
              <FolderOpen className="h-5 w-5 text-[#B89A5A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F4F2ED]">Instruções Pré-Sessão</p>
              <p className="text-xs text-[#8E96A3]">Lê antes de iniciar cada sessão</p>
            </div>
            <Button
              size="sm"
              className="bg-[#B89A5A]/10 text-[#B89A5A] hover:bg-[#B89A5A]/20 border-0 rounded-lg h-8 text-xs px-3 shrink-0"
              onClick={() => toast.success("Download iniciado!")}
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Download
            </Button>
          </div>

          {/* Guia de Vocabulário */}
          <button
            onClick={() => setVocabOpen(true)}
            className="flex items-center gap-4 p-4 rounded-xl bg-[#1C1F26] border border-white/5 hover:border-[#B89A5A]/20 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-[#B89A5A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F4F2ED]">Guia de Vocabulário Essencial</p>
              <p className="text-xs text-[#8E96A3]">Clica para ver a lista de palavras</p>
            </div>
            <Eye className="h-4 w-4 text-[#8E96A3] shrink-0" />
          </button>
        </div>
      </motion.div>

      {/* Section B: Por Sessão */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Por Sessão</h2>
          <div className="h-px flex-1 bg-[#B89A5A]/20" />
        </div>
        <div className="rounded-xl bg-[#1C1F26] border border-white/5 overflow-hidden">
          {sessionsData.map((session, i) => {
            const isCompleted = !!progress[session.id]?.completed;
            const isExpanded = expandedSession === session.id;
            const materials = getSessionMaterials(session);

            return (
              <div key={session.id} className={i > 0 ? "border-t border-white/[0.04]" : ""}>
                <button
                  onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isCompleted ? "bg-[#B89A5A]/15" : "bg-white/5"}`}>
                    {isCompleted
                      ? <CheckCircle2 className="h-4 w-4 text-[#B89A5A]" />
                      : <Lock className="h-4 w-4 text-white/20" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isCompleted ? "text-[#F4F2ED]" : "text-white/40"}`}>
                      Sessão {session.id} — {session.title}
                    </p>
                    <p className="text-xs text-[#8E96A3]">{materials.length} materiais</p>
                  </div>
                  {isExpanded
                    ? <ChevronUp className="h-4 w-4 text-[#8E96A3] shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-[#8E96A3] shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-4 space-y-2">
                    {materials.map((mat, j) => (
                      <div key={j} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                        <div className="w-7 h-7 rounded bg-[#B89A5A]/10 flex items-center justify-center shrink-0 text-[#B89A5A]">
                          {mat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#F4F2ED] truncate">{mat.label}</p>
                          <p className="text-xs text-[#8E96A3]">{mat.type}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#B89A5A] hover:bg-[#B89A5A]/10 h-7 text-xs px-3 shrink-0"
                          onClick={() => openViewer(mat.label, mat.content)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Section C: Gravação de Diagnóstico */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Gravação de Diagnóstico</h2>
          <div className="h-px flex-1 bg-[#B89A5A]/20" />
        </div>
        <div className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/20 p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
              <Mic className="h-6 w-6 text-[#B89A5A]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-base font-semibold text-[#F4F2ED] mb-0.5">Diagnóstico Inicial de Voz</h3>
              <p className="text-xs text-[#8E96A3] mb-3">Data: 05 Jan 2026 · Duração: 4:32</p>

              {/* Simulated waveform */}
              <div className="h-10 bg-[#0B1A2A] rounded-lg border border-white/5 flex items-center px-3 gap-0.5 mb-3 overflow-hidden">
                {Array.from({ length: 48 }).map((_, k) => (
                  <div
                    key={k}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${20 + Math.sin(k * 0.7) * 12 + Math.random() * 8}px`,
                      background: audioPlaying ? "#B89A5A" : "#B89A5A33",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg h-8 px-4 text-sm"
                  onClick={() => setAudioPlaying(p => !p)}
                >
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                  {audioPlaying ? "A ouvir..." : "Ouvir Gravação"}
                </Button>
                <span className="text-xs text-[#8E96A3]">4:32</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section D: Templates & Recursos */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Templates & Recursos</h2>
          <div className="h-px flex-1 bg-[#B89A5A]/20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATES.map(tpl => (
            <div key={tpl.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#1C1F26] border border-white/5 hover:border-[#B89A5A]/20 transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0 text-[#B89A5A]">
                {tpl.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F4F2ED]">{tpl.title}</p>
                <p className="text-xs text-[#8E96A3] truncate">{tpl.desc}</p>
              </div>
              {tpl.type === "download" ? (
                <Button
                  size="sm"
                  className="bg-[#B89A5A]/10 text-[#B89A5A] hover:bg-[#B89A5A]/20 border-0 rounded-lg h-8 text-xs px-3 shrink-0"
                  onClick={() => toast.success("Download iniciado!")}
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[#B89A5A] hover:bg-[#B89A5A]/10 h-8 text-xs px-3 shrink-0"
                  onClick={() => openViewer(tpl.title, "", GUIDE_CONTENT[tpl.id])}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Ver
                </Button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section E: Certificado */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Certificado</h2>
          <div className="h-px flex-1 bg-[#B89A5A]/20" />
        </div>
        {allComplete ? (
          <div
            className="rounded-xl border border-[#B89A5A]/40 p-6 text-center"
            style={{ background: "linear-gradient(135deg, #0F2235 0%, #1C2A3A 100%)" }}
          >
            <div className="w-14 h-14 rounded-full bg-[#B89A5A]/20 flex items-center justify-center mx-auto mb-3">
              <Award className="h-7 w-7 text-[#B89A5A]" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#F4F2ED] mb-1">Certificado de Conclusão</h3>
            <p className="text-[#8E96A3] text-sm mb-4">Executive Communication Programme — VOICE³</p>
            <Button
              className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg h-9 px-6 text-sm"
              onClick={() => toast.success("Download do certificado iniciado!")}
            >
              <Download className="h-4 w-4 mr-2" />
              Descarregar Certificado
            </Button>
          </div>
        ) : (
          <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <Lock className="h-7 w-7 text-white/20" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-white/40 mb-1">Certificado Bloqueado</h3>
            <p className="text-[#8E96A3] text-sm mb-2">Completa todas as sessões para desbloquear o teu certificado.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-xs text-[#8E96A3]">
              <span className="text-[#B89A5A] font-semibold">{completedCount}/{TOTAL_SESSIONS}</span> sessões concluídas
            </div>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <VocabModal open={vocabOpen} onClose={() => setVocabOpen(false)} />
      <ViewerModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        title={viewerTitle}
        content={viewerContent}
        guideData={viewerGuide}
      />
    </PlatformLayout>
  );
};

export default Materiais;
