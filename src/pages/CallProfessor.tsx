import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Star } from 'lucide-react';
import PlatformLayout from '@/components/PlatformLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/use-notifications';

// ─── Data ────────────────────────────────────────────────────────────────────

const packages = [
  {
    id: 'single' as const,
    name: 'Single Call',
    price: 39,
    sessions: 1,
    duration: '30 min',
    features: [
      '1 sessão de 30 minutos',
      'Foco num tópico específico',
      'Feedback escrito após a call',
    ],
    cta: 'Marcar Call',
    badge: null,
  },
  {
    id: 'double' as const,
    name: 'Double Pack',
    price: 69,
    sessions: 2,
    duration: '30 min cada',
    features: [
      '2 sessões de 30 minutos',
      'Agendamento flexível',
      'Feedback escrito após cada sessão',
      'Reserva prioritária',
    ],
    cta: 'Escolher Pack',
    badge: 'POUPA €9',
  },
  {
    id: 'intensive' as const,
    name: 'Intensive',
    price: 149,
    sessions: 5,
    duration: '30 min cada',
    features: [
      '5 sessões de 30 minutos',
      'Programa personalizado',
      'Relatório detalhado de progresso',
      'Feedback escrito após cada sessão',
      'Reserva + remarcação prioritárias',
    ],
    cta: 'Escolher Intensivo',
    badge: 'MELHOR VALOR',
  },
];

const professors = [
  { name: 'Sarah Mitchell', specialty: 'Business Communication Specialist' },
  { name: 'James Crawford', specialty: 'Executive Presentation Coach' },
  { name: 'Emma Thompson', specialty: 'Negotiation & Persuasion Expert' },
  { name: 'David Williams', specialty: 'Interview & Career English Coach' },
];

const ALL_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
const UNAVAILABLE_SLOTS = ['10:00', '15:00'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getNext14Weekdays(): Date[] {
  const days: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1); // start tomorrow
  while (days.length < 14) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDisplayDate(d: Date): string {
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProfessorCall {
  id: string;
  package: string;
  date: string;
  time: string;
  duration: string;
  professorName: string;
  professorSpecialty: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  price: number;
  feedback: string | null;
  rating: number | null;
  bookedAt: string;
}

const DEMO_SEED: ProfessorCall = {
  id: 'call-demo-1',
  package: 'single',
  date: '2026-02-15',
  time: '18:00',
  duration: '30 min',
  professorName: 'Emma Thompson',
  professorSpecialty: 'Negotiation & Persuasion Expert',
  status: 'completed',
  price: 39,
  feedback: 'Great session! Strong vocabulary but work on filler words. Focus on pausing for effect.',
  rating: 5,
  bookedAt: '2026-02-10T10:00:00Z',
};

// ─── Component ───────────────────────────────────────────────────────────────

const CallProfessor = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || '';
  const storageKey = `voice3_professor_calls_${userId}`;
  const { addNotification } = useNotifications(userId);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPackage, setSelectedPackage] = useState<'single' | 'double' | 'intensive' | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Payment form
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  // Feedback modal
  const [feedbackCall, setFeedbackCall] = useState<ProfessorCall | null>(null);

  const [calls, setCalls] = useState<ProfessorCall[]>(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored) as ProfessorCall[];
      } catch {
        // fall through
      }
    }
    if (userId === 'demo-student') {
      const seeded = [DEMO_SEED];
      localStorage.setItem(storageKey, JSON.stringify(seeded));
      return seeded;
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(calls));
  }, [calls, storageKey]);

  const weekdays = getNext14Weekdays();
  const selectedPkgData = packages.find(p => p.id === selectedPackage);

  const randomProfessor = professors[Math.floor(Math.random() * professors.length)];

  const handleConfirmPay = () => {
    if (!selectedPackage || !selectedDate || !selectedTime || !selectedPkgData) return;
    setPaying(true);
    setTimeout(() => {
      const newCall: ProfessorCall = {
        id: `call-${Date.now()}`,
        package: selectedPackage,
        date: formatDate(selectedDate),
        time: selectedTime,
        duration: '30 min',
        professorName: randomProfessor.name,
        professorSpecialty: randomProfessor.specialty,
        status: 'confirmed',
        price: selectedPkgData.price,
        feedback: null,
        rating: null,
        bookedAt: new Date().toISOString(),
      };
      setCalls(prev => [newCall, ...prev]);
      addNotification({
        type: 'call_confirmed',
        title: 'Call Confirmada!',
        description: `A tua call com ${newCall.professorName} foi marcada para ${formatDisplayDate(selectedDate)} às ${selectedTime}.`,
        timestamp: new Date().toISOString(),
        read: false,
      });
      setPaying(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setStep(1);
        setSelectedPackage(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setCardNumber('');
        setExpiry('');
        setCvv('');
        setCardName('');
      }, 2000);
    }, 1500);
  };

  const handleCancel = (id: string) => {
    setCalls(prev => prev.filter(c => c.id !== id));
    addNotification({
      type: 'booking_confirmed',
      title: 'Call cancelada',
      description: 'A tua call foi cancelada com sucesso.',
      timestamp: new Date().toISOString(),
      read: false,
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingCalls = calls.filter(c => {
    if (c.status === 'cancelled' || c.status === 'completed') return false;
    const d = new Date(c.date + 'T00:00:00');
    return d >= today;
  });

  const pastCalls = calls.filter(c => {
    if (c.status === 'cancelled') return false;
    if (c.status === 'completed') return true;
    const d = new Date(c.date + 'T00:00:00');
    return d < today;
  });

  return (
    <PlatformLayout>
      <div className="space-y-10">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-serif text-white">Marcar Call com Professor</h1>
          <p className="text-white/50 mt-1 text-sm">Escolhe o teu pack, data e hora — e fala diretamente com um especialista.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {(['Pacote', 'Data', 'Hora', 'Pagamento'] as const).map((label, i) => {
            const s = (i + 1) as 1 | 2 | 3 | 4;
            const active = step === s;
            const done = step > s;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done ? 'bg-[#B89A5A] text-black' : active ? 'bg-[#B89A5A]/20 border border-[#B89A5A] text-[#B89A5A]' : 'bg-white/10 text-white/30'
                }`}>
                  {done ? '✓' : s}
                </div>
                <span className={`text-xs hidden sm:block ${active ? 'text-[#B89A5A]' : done ? 'text-white/60' : 'text-white/30'}`}>{label}</span>
                {i < 3 && <div className="w-8 h-px bg-white/10 mx-1" />}
              </div>
            );
          })}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packages.map(pkg => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative rounded-2xl border p-6 cursor-pointer transition-all duration-200 bg-[#0B1A2A] ${
                      selectedPackage === pkg.id
                        ? 'border-[#B89A5A] shadow-lg shadow-[#B89A5A]/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    {pkg.badge && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#B89A5A] text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        {pkg.badge}
                      </span>
                    )}
                    <div className="text-white font-bold text-lg">{pkg.name}</div>
                    <div className="mt-1 text-[#B89A5A] text-2xl font-bold">€{pkg.price}</div>
                    <div className="text-white/40 text-xs mt-0.5">{pkg.sessions} sessão{pkg.sessions > 1 ? 'ões' : ''} · {pkg.duration}</div>
                    <ul className="mt-4 space-y-1.5">
                      {pkg.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                          <span className="text-[#B89A5A] mt-0.5">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {selectedPackage && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-[#B89A5A] hover:bg-[#B89A5A]/90 text-black font-semibold px-6 py-2.5 rounded-xl transition-colors"
                  >
                    Próximo <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h2 className="text-white font-semibold mb-4">Escolhe uma data</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {weekdays.map(d => {
                  const isSelected = selectedDate?.toDateString() === d.toDateString();
                  return (
                    <button
                      key={d.toISOString()}
                      onClick={() => setSelectedDate(d)}
                      className={`flex flex-col items-center py-3 px-2 rounded-xl border transition-all text-center ${
                        isSelected
                          ? 'border-[#B89A5A] bg-[#B89A5A]/10 text-[#B89A5A]'
                          : 'border-white/10 bg-[#0B1A2A] text-white/70 hover:border-white/30'
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wide">{DAY_NAMES[d.getDay()]}</span>
                      <span className="text-lg font-bold mt-0.5">{d.getDate()}</span>
                      <span className="text-[10px]">{MONTH_NAMES[d.getMonth()]}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-white/50 hover:text-white transition-colors text-sm">
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </button>
                {selectedDate && (
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 bg-[#B89A5A] hover:bg-[#B89A5A]/90 text-black font-semibold px-6 py-2.5 rounded-xl transition-colors"
                  >
                    Próximo <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              {selectedDate && (
                <p className="text-white/60 text-sm mb-4">
                  Data selecionada: <span className="text-white font-medium">{formatDisplayDate(selectedDate)}</span>
                </p>
              )}
              <h2 className="text-white font-semibold mb-4">Escolhe um horário</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {ALL_SLOTS.map(slot => {
                  const unavailable = UNAVAILABLE_SLOTS.includes(slot);
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      disabled={unavailable}
                      onClick={() => !unavailable && setSelectedTime(slot)}
                      className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                        unavailable
                          ? 'border-white/5 bg-white/5 text-white/20 cursor-not-allowed'
                          : isSelected
                          ? 'border-[#B89A5A] bg-[#B89A5A]/10 text-[#B89A5A]'
                          : 'border-white/10 bg-[#0B1A2A] text-white/70 hover:border-white/30'
                      }`}
                    >
                      {slot}
                      {unavailable && <span className="block text-[10px] text-white/20">Indisponível</span>}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep(2)} className="flex items-center gap-1 text-white/50 hover:text-white transition-colors text-sm">
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </button>
                {selectedTime && (
                  <button
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 bg-[#B89A5A] hover:bg-[#B89A5A]/90 text-black font-semibold px-6 py-2.5 rounded-xl transition-colors"
                  >
                    Próximo <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === 4 && selectedPkgData && selectedDate && selectedTime && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">
              {/* Summary */}
              <div className="bg-[#0B1A2A] border border-white/10 rounded-2xl p-5 space-y-3">
                <h3 className="text-white font-semibold">Resumo da Reserva</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-white/40 text-xs">Pacote</p>
                    <p className="text-white font-medium">{selectedPkgData.name}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Preço</p>
                    <p className="text-[#B89A5A] font-bold text-base">€{selectedPkgData.price}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Data</p>
                    <p className="text-white font-medium">{formatDisplayDate(selectedDate)}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Hora</p>
                    <p className="text-white font-medium">{selectedTime}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-white/40 text-xs">Professor</p>
                    <p className="text-white font-medium">{randomProfessor.name}</p>
                    <p className="text-white/50 text-xs">{randomProfessor.specialty}</p>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="bg-[#0B1A2A] border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-white font-semibold">Dados de Pagamento</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      maxLength={19}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#B89A5A]/50 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/40 block mb-1">Validade (MM/AA)</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={e => setExpiry(e.target.value)}
                        maxLength={5}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#B89A5A]/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 block mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={e => setCvv(e.target.value)}
                        maxLength={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#B89A5A]/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 block mb-1">Nome no Cartão</label>
                    <input
                      type="text"
                      placeholder="Nome como aparece no cartão"
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#B89A5A]/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(3)} className="flex items-center gap-1 text-white/50 hover:text-white transition-colors text-sm">
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </button>
                <button
                  onClick={handleConfirmPay}
                  disabled={paying}
                  className="flex items-center gap-2 bg-[#B89A5A] hover:bg-[#B89A5A]/90 disabled:opacity-60 text-black font-semibold px-8 py-3 rounded-xl transition-colors"
                >
                  {paying ? (
                    <><span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" /> A processar...</>
                  ) : (
                    <>Confirmar e Pagar €{selectedPkgData.price}</>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── My Calls ─────────────────────────────────────────────────────── */}
        <div className="space-y-6 pt-4 border-t border-white/10">
          <h2 className="text-white text-xl font-semibold">As Minhas Calls</h2>

          {/* Upcoming */}
          <div>
            <h3 className="text-white/70 text-sm font-medium mb-3">Próximas Calls</h3>
            {upcomingCalls.length === 0 ? (
              <div className="bg-[#0B1A2A] border border-white/10 rounded-xl p-6 text-center text-white/30 text-sm">
                Sem calls marcadas
              </div>
            ) : (
              <div className="bg-[#0B1A2A] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-xs">
                      <th className="text-left px-4 py-3 font-medium">Data</th>
                      <th className="text-left px-4 py-3 font-medium">Hora</th>
                      <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Professor</th>
                      <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Duração</th>
                      <th className="text-left px-4 py-3 font-medium">Estado</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {upcomingCalls.map(c => (
                      <tr key={c.id} className="text-white/80">
                        <td className="px-4 py-3">{c.date}</td>
                        <td className="px-4 py-3">{c.time}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <div>{c.professorName}</div>
                          <div className="text-white/40 text-xs">{c.professorSpecialty}</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">{c.duration}</td>
                        <td className="px-4 py-3">
                          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">Confirmada</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleCancel(c.id)}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            Cancelar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Past */}
          <div>
            <h3 className="text-white/70 text-sm font-medium mb-3">Calls Anteriores</h3>
            {pastCalls.length === 0 ? (
              <div className="bg-[#0B1A2A] border border-white/10 rounded-xl p-6 text-center text-white/30 text-sm">
                Sem calls anteriores
              </div>
            ) : (
              <div className="bg-[#0B1A2A] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-xs">
                      <th className="text-left px-4 py-3 font-medium">Data</th>
                      <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Professor</th>
                      <th className="text-left px-4 py-3 font-medium">Avaliação</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pastCalls.map(c => (
                      <tr key={c.id} className="text-white/80">
                        <td className="px-4 py-3">{c.date}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <div>{c.professorName}</div>
                          <div className="text-white/40 text-xs">{c.professorSpecialty}</div>
                        </td>
                        <td className="px-4 py-3">
                          {c.rating ? (
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${i < c.rating! ? 'text-[#B89A5A] fill-[#B89A5A]' : 'text-white/20'}`}
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="text-white/30 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setFeedbackCall(c)}
                            className="text-xs text-[#B89A5A] hover:text-[#B89A5A]/80 transition-colors"
                          >
                            Ver Feedback
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Success Overlay ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center gap-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-7xl"
            >
              ✅
            </motion.div>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white text-2xl font-bold"
            >
              Call marcada com sucesso!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Feedback Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {feedbackCall && (
          <motion.div
            key="feedback-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setFeedbackCall(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#1C1F26] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Feedback do Professor</h3>
                <button
                  onClick={() => setFeedbackCall(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="text-white/60 text-sm">
                <span className="text-white font-medium">{feedbackCall.professorName}</span>
                <span className="text-white/40"> · </span>
                {feedbackCall.date}
              </div>
              {feedbackCall.rating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < feedbackCall.rating! ? 'text-[#B89A5A] fill-[#B89A5A]' : 'text-white/20'}`} />
                  ))}
                </div>
              )}
              <div className="bg-white/5 rounded-xl p-4 text-sm text-white/80 leading-relaxed">
                {feedbackCall.feedback ?? 'O professor ainda não deixou feedback.'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PlatformLayout>
  );
};

export default CallProfessor;
