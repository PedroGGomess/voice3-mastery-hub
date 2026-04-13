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
import { Card } from "@/components/ui/VoiceUI";

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
      label: "Transcript",
      type: "Texto",
      content: session.audioTranscript,
    },
    {
      icon: <AlignLeft className="h-4 w-4" />,
      label: "Exercise",
      type: "PDF",
      content: session.exercise,
    },
    {
      icon: <Headphones className="h-4 w-4" />,
      label: session.audioTitle,
      type: "Audio",
      content: `Audio: ${session.audioTitle}`,
    },
    {
      icon: <Video className="h-4 w-4" />,
      label: session.videoTitle,
      type: "Video",
      content: `Video: ${session.videoTitle}`,
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: "Session Summary",
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
  { id: 1, title: "Template: Professional Email", icon: <FileText className="h-5 w-5" />, type: "download", desc: "Complete structure for formal emails in English" },
  { id: 2, title: "Template: Presentation Structure", icon: <AlignLeft className="h-5 w-5" />, type: "download", desc: "Framework for executive presentations" },
  { id: 3, title: "Guide: Meeting Phrases", icon: <BookOpen className="h-5 w-5" />, type: "view", desc: "Essential expressions for meeting management" },
  { id: 4, title: "Guide: Negotiation Vocabulary", icon: <BookOpen className="h-5 w-5" />, type: "view", desc: "Terms and phrases for English negotiations" },
];

const GUIDE_CONTENT: Record<number, { title: string; sections: { heading: string; items: string[] }[] }> = {
  3: {
    title: "Essential Phrases for Meetings",
    sections: [
      { heading: "Starting the Meeting", items: ["Shall we get started?", "Let's kick things off.", "Thank you all for joining today.", "The purpose of today's meeting is..."] },
      { heading: "Giving the Floor", items: ["I'd like to hand over to...", "Could you walk us through...?", "Please go ahead.", "Over to you."] },
      { heading: "Asking for Clarification", items: ["Could you elaborate on that?", "What do you mean by...?", "Could you give us an example?", "Just to clarify..."] },
      { heading: "Closing", items: ["Let's wrap up.", "To summarise the key points...", "The next steps are...", "Thanks everyone for your time."] },
    ],
  },
  4: {
    title: "Negotiation Vocabulary",
    sections: [
      { heading: "Positions and Proposals", items: ["Our initial offer is...", "We'd like to propose...", "This is our best offer.", "There's some room to negotiate."] },
      { heading: "Counterproposals", items: ["We appreciate your offer, however...", "Could you go any lower/higher?", "We'd need you to meet us halfway.", "That's beyond our budget."] },
      { heading: "Closing the Deal", items: ["I think we have a deal.", "Let's shake on it.", "We're prepared to move forward.", "We can commit to that."] },
      { heading: "Postponing Decisions", items: ["We'll need to take this back to the team.", "Let me check and get back to you.", "We require some time to consider.", "Can we revisit this tomorrow?"] },
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
            <DialogTitle className="font-serif text-xl text-[#F4F2ED]">Essential Vocabulary</DialogTitle>
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
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight">Materials</h1>
        <p className="text-[#8E96A3] text-sm mt-1">Support resources for each session in your journey.</p>
      </motion.div>

      {/* Section A: Pré-Sessão */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Pre-Session</h2>
          <div className="h-px flex-1 bg-[#B89A5A]/20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Pre-Session Instructions */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1C1F26] border border-white/5 hover:border-[#B89A5A]/20 transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
              <FolderOpen className="h-5 w-5 text-[#B89A5A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F4F2ED]">Pre-Session Instructions</p>
              <p className="text-xs text-[#8E96A3]">Read before starting each session</p>
            </div>
            <Button
              size="sm"
              className="bg-[#B89A5A]/10 text-[#B89A5A] hover:bg-[#B89A5A]/20 border-0 rounded-lg h-8 text-xs px-3 shrink-0"
              onClick={() => toast.success("Download started!")}
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Download
            </Button>
          </div>

          {/* Vocabulary Guide */}
          <button
            onClick={() => setVocabOpen(true)}
            className="flex items-center gap-4 p-4 rounded-xl bg-[#1C1F26] border border-white/5 hover:border-[#B89A5A]/20 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-[#B89A5A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F4F2ED]">Essential Vocabulary Guide</p>
              <p className="text-xs text-[#8E96A3]">Click to see the word list</p>
            </div>
            <Eye className="h-4 w-4 text-[#8E96A3] shrink-0" />
          </button>
        </div>
      </motion.div>

      {/* Section B: Por Sessão */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">By Session</h2>
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
                      Session {session.id} — {session.title}
                    </p>
                    <p className="text-xs text-[#8E96A3]">{materials.length} materials</p>
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
                          View
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
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Diagnostic Recording</h2>
          <div className="h-px flex-1 bg-[#B89A5A]/20" />
        </div>
        <div className="rounded-xl bg-[#1C1F26] border border-[#B89A5A]/20 p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#B89A5A]/10 flex items-center justify-center shrink-0">
              <Mic className="h-6 w-6 text-[#B89A5A]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-base font-semibold text-[#F4F2ED] mb-0.5">Initial Voice Diagnostic</h3>
              <p className="text-xs text-[#8E96A3] mb-3">Date: 05 Jan 2026 · Duration: 4:32</p>

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
                  {audioPlaying ? "Listening..." : "Play Recording"}
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
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Templates & Resources</h2>
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
                  onClick={() => toast.success("Download started!")}
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
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Certificate</h2>
          <div className="h-px flex-1 bg-[#B89A5A]/20" />
        </div>
        {allComplete ? (
          <Card gold style={{ textAlign: "center" }}>
            <div className="w-14 h-14 rounded-full bg-[#B89A5A]/20 flex items-center justify-center mx-auto mb-3">
              <Award className="h-7 w-7 text-[#B89A5A]" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#F4F2ED] mb-1">Completion Certificate</h3>
            <p className="text-[#8E96A3] text-sm mb-4">Executive Communication Programme — VOICE³</p>
            <Button
              className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg h-9 px-6 text-sm"
              onClick={() => toast.success("Certificate download started!")}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          </Card>
        ) : (
          <Card style={{ textAlign: "center" }}>
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <Lock className="h-7 w-7 text-white/20" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-white/40 mb-1">Certificate Locked</h3>
            <p className="text-[#8E96A3] text-sm mb-2">Complete all sessions to unlock your certificate.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-xs text-[#8E96A3]">
              <span className="text-[#B89A5A] font-semibold">{completedCount}/{TOTAL_SESSIONS}</span> sessions completed
            </div>
          </Card>
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
