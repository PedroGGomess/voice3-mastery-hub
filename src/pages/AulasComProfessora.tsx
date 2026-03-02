import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, Video, CheckCircle2, ArrowRight, RefreshCw, X, ClipboardList, Lock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ChatWidget from "@/components/ChatWidget";

const availableSlots = [
  { date: "2026-03-04", time: "18:00", duration: "45 min" },
  { date: "2026-03-04", time: "19:00", duration: "45 min" },
  { date: "2026-03-06", time: "18:30", duration: "45 min" },
  { date: "2026-03-06", time: "20:00", duration: "45 min" },
  { date: "2026-03-07", time: "10:00", duration: "45 min" },
  { date: "2026-03-07", time: "11:00", duration: "45 min" },
];

const pastLessons = [
  { date: "2026-02-20", time: "18:00", topic: "Introdução e avaliação inicial", notes: "Nível B1 confirmado. Foco em fluência oral." },
];

// Mock: teacher lessons and their unlock requirements
const teacherLessons = [
  { id: 1, requiresSessions: 4, label: "Aula com Professora #1" },
  { id: 2, requiresSessions: 8, label: "Aula com Professora #2" },
];

// Mock completed sessions count
const completedSessions = 2;

const AulasComProfessora = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const formattedSelected = selectedDate?.toISOString().split("T")[0];
  const slotsForDate = availableSlots.filter((s) => s.date === formattedSelected);

  const handleConfirm = () => {
    setBooked(true);
  };

  // Check which lessons are unlocked
  const unlockedLessons = teacherLessons.filter(l => completedSessions >= l.requiresSessions);
  const nextLockedLesson = teacherLessons.find(l => completedSessions < l.requiresSessions);
  const hasUnlocked = unlockedLessons.length > 0;

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-2">Aulas com Professora</h1>
        <p className="text-muted-foreground mb-8">Marca, gere e acompanha as tuas aulas com professora.</p>

        {/* Status of teacher lessons */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {teacherLessons.map((lesson) => {
            const unlocked = completedSessions >= lesson.requiresSessions;
            return (
              <div
                key={lesson.id}
                className={`premium-card ${unlocked ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30 opacity-70"}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {unlocked ? (
                    <CalendarDays className="h-5 w-5 text-primary" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                  <h3 className="font-semibold text-sm">{lesson.label}</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {unlocked
                    ? "Desbloqueada! Marca a tua aula abaixo."
                    : `Completa ${lesson.requiresSessions} sessões para desbloquear (${completedSessions}/${lesson.requiresSessions})`}
                </p>
                {!unlocked && (
                  <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/40 transition-all"
                      style={{ width: `${(completedSessions / lesson.requiresSessions) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* If no lessons unlocked — show message */}
        {!hasUnlocked && (
          <div className="premium-card text-center py-12 mb-8">
            <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Ainda não desbloqueaste nenhuma aula</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Completa as sessões AI do teu pack para desbloquear as aulas com professora. 
              Enquanto isso, podes tirar dúvidas com o nosso chatbot 24/7!
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                <Link to="/app">
                  <ArrowRight className="mr-2 h-4 w-4" /> Continuar Sessões
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="/app/chat">
                  <MessageCircle className="mr-2 h-4 w-4" /> Chat AI 24/7
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Calendar booking — only if there's an unlocked lesson */}
        {hasUnlocked && !booked && (
          <>
            <div className="premium-card border-primary/30 bg-primary/5 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Sessão com Professora desbloqueada</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Marca a tua aula com base na disponibilidade da professora.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="premium-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" /> Escolhe uma data
                </h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => { setSelectedDate(d); setSelectedSlot(null); }}
                  className="pointer-events-auto rounded-xl"
                  disabled={(date) => {
                    const d = date.toISOString().split("T")[0];
                    return !availableSlots.some((s) => s.date === d);
                  }}
                />
              </div>

              <div className="premium-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Horários disponíveis
                </h3>
                {slotsForDate.length > 0 ? (
                  <div className="space-y-3">
                    {slotsForDate.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                          selectedSlot === slot.time
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <span className="font-medium">{slot.time}</span>
                        <span className="text-muted-foreground">{slot.duration}</span>
                      </button>
                    ))}
                    {selectedSlot && (
                      <Button
                        onClick={handleConfirm}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 mt-4"
                      >
                        Confirmar — {formattedSelected} às {selectedSlot}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    {selectedDate ? "Sem horários disponíveis nesta data." : "Seleciona uma data no calendário."}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {hasUnlocked && booked && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="premium-card border-success/30 bg-success/5 mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="h-6 w-6 text-success" />
                <h2 className="font-semibold text-lg">Aula marcada!</h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Data</p>
                  <p className="font-medium">{formattedSelected}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Hora</p>
                  <p className="font-medium">{selectedSlot}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Duração</p>
                  <p className="font-medium">45 min</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                  <Video className="mr-2 h-4 w-4" /> Entrar na aula
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setBooked(false)}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Remarcar
                </Button>
                <Button variant="outline" className="rounded-xl text-destructive hover:text-destructive" onClick={() => setBooked(false)}>
                  <X className="mr-2 h-4 w-4" /> Cancelar
                </Button>
              </div>
            </motion.div>

            <div className="premium-card mb-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" /> Prepara-te para a aula
              </h3>
              <ul className="space-y-3">
                {["Revê o que aprendeste nas sessões anteriores", "Prepara 2-3 perguntas", "Testa o áudio e câmara", "Tem papel e caneta por perto"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded border border-border flex items-center justify-center shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Past lessons */}
        {pastLessons.length > 0 && (
          <div className="mt-12">
            <h3 className="font-semibold mb-4">Aulas anteriores</h3>
            <div className="space-y-3">
              {pastLessons.map((lesson, i) => (
                <div key={i} className="premium-card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="font-medium text-sm">{lesson.date} — {lesson.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{lesson.topic}</p>
                  <p className="text-xs text-muted-foreground mt-2 italic">Notas: {lesson.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
      <ChatWidget />
    </PlatformLayout>
  );
};

export default AulasComProfessora;
