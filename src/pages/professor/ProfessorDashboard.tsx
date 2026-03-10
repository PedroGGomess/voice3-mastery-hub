import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface ProfessorStudent {
  id: string;
  name: string;
  email: string;
  pack: string;
  completedChapters: number;
  totalChapters: number;
  nextSession: string | null;
  level: string | null;
  teachingStyle: string | null;
}

interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "cancelled" | "completed" | "rescheduled";
  pack: string;
}

interface Assignment {
  id: string;
  studentId: string;
  studentName: string;
  type: "ai_drill" | "writing_task" | "voice_recording" | "redo_session";
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  dueDate: string;
  createdAt: string;
}

const levelColors: Record<string, string> = {
  B1: "rgba(120,120,120,0.2)",
  B2: "rgba(59,130,246,0.15)",
  C1: "rgba(201,168,76,0.15)",
  C2: "rgba(34,197,94,0.15)",
};
const levelTextColors: Record<string, string> = {
  B1: "rgba(180,180,180,0.9)",
  B2: "rgba(147,197,253,0.9)",
  C1: "rgba(201,168,76,0.9)",
  C2: "rgba(134,239,172,0.9)",
};

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" });
}

export default function ProfessorDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const professorId = currentUser?.id || "demo-professor";

  const [activeTab, setActiveTab] = useState("My Students");
  const [students, setStudents] = useState<ProfessorStudent[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPack, setFilterPack] = useState("all");

  // Assignment form
  const [assignTarget, setAssignTarget] = useState("");
  const [assignType, setAssignType] = useState<Assignment["type"]>("ai_drill");
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDesc, setAssignDesc] = useState("");
  const [assignDueDate, setAssignDueDate] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`voice3_professor_students_${professorId}`);
      if (stored) {
        setStudents(JSON.parse(stored));
      } else {
        const demo: ProfessorStudent[] = [
          { id: "cs1", name: "Ana Costa", email: "ana.costa@empresa.pt", pack: "Pro", completedChapters: 5, totalChapters: 8, nextSession: "2026-03-15", level: "B2", teachingStyle: "visual" },
          { id: "cs2", name: "Pedro Lopes", email: "pedro.lopes@tech.pt", pack: "Advanced", completedChapters: 7, totalChapters: 12, nextSession: "2026-03-18", level: "C1", teachingStyle: "analytical" },
          { id: "cs3", name: "Maria Silva", email: "maria.silva@corp.pt", pack: "Starter", completedChapters: 2, totalChapters: 4, nextSession: null, level: "B1", teachingStyle: "structured" },
          { id: "cs4", name: "João Mendes", email: "joao.mendes@galp.pt", pack: "Pro", completedChapters: 4, totalChapters: 8, nextSession: "2026-03-20", level: "B2", teachingStyle: "conversational" },
        ];
        setStudents(demo);
        localStorage.setItem(`voice3_professor_students_${professorId}`, JSON.stringify(demo));
      }
    } catch (_e) {}

    try {
      const stored = localStorage.getItem(`voice3_professor_bookings_${professorId}`);
      if (stored) {
        setBookings(JSON.parse(stored));
      } else {
        const demo: Booking[] = [
          { id: "b1", studentId: "cs1", studentName: "Ana Costa", date: "2026-03-15", startTime: "10:00", endTime: "10:45", status: "confirmed", pack: "Pro" },
          { id: "b2", studentId: "cs2", studentName: "Pedro Lopes", date: "2026-03-18", startTime: "14:00", endTime: "14:45", status: "confirmed", pack: "Advanced" },
          { id: "b3", studentId: "cs4", studentName: "João Mendes", date: "2026-03-20", startTime: "11:00", endTime: "11:45", status: "confirmed", pack: "Pro" },
          { id: "b4", studentId: "cs1", studentName: "Ana Costa", date: "2026-02-20", startTime: "10:00", endTime: "10:45", status: "completed", pack: "Pro" },
        ];
        setBookings(demo);
        localStorage.setItem(`voice3_professor_bookings_${professorId}`, JSON.stringify(demo));
      }
    } catch (_e) {}

    try {
      const stored = localStorage.getItem(`voice3_professor_assignments_${professorId}`);
      if (stored) {
        setAssignments(JSON.parse(stored));
      } else {
        const demo: Assignment[] = [
          { id: "a1", studentId: "cs3", studentName: "Maria Silva", type: "ai_drill", title: "Filler Word Elimination", description: "Practice 5-minute monologue without filler words", status: "pending", dueDate: "2026-03-20", createdAt: "2026-03-10" },
          { id: "a2", studentId: "cs1", studentName: "Ana Costa", type: "writing_task", title: "Executive Summary", description: "Write a 200-word executive summary for a project", status: "in_progress", dueDate: "2026-03-18", createdAt: "2026-03-08" },
        ];
        setAssignments(demo);
        localStorage.setItem(`voice3_professor_assignments_${professorId}`, JSON.stringify(demo));
      }
    } catch (_e) {}
  }, [professorId]);

  const upcomingBookings = bookings.filter(b => b.status === "confirmed" && new Date(b.date) >= new Date());
  const avgScore = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + (s.totalChapters > 0 ? (s.completedChapters / s.totalChapters) * 100 : 0), 0) / students.length)
    : 0;
  const pendingAssignments = assignments.filter(a => a.status === "pending").length;

  const kpis = [
    { icon: "👥", value: String(students.length), label: "Students Active" },
    { icon: "📅", value: String(upcomingBookings.length), label: "Sessions This Week" },
    { icon: "⭐", value: `${avgScore}%`, label: "Avg Score" },
    { icon: "📝", value: String(pendingAssignments), label: "Pending Assignments" },
  ];

  const filteredStudents = students.filter(s => {
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterPack !== "all" && s.pack !== filterPack) return false;
    return true;
  });

  const cancelBooking = (bookingId: string) => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: "cancelled" as const } : b);
    setBookings(updated);
    localStorage.setItem(`voice3_professor_bookings_${professorId}`, JSON.stringify(updated));
    toast.success("Sessão cancelada.");
  };

  const createAssignment = () => {
    if (!assignTarget || !assignTitle || !assignDueDate) {
      toast.error("Preenche todos os campos obrigatórios.");
      return;
    }
    const student = students.find(s => s.id === assignTarget);
    const newAssignment: Assignment = {
      id: `a-${Date.now()}`,
      studentId: assignTarget,
      studentName: student?.name || "",
      type: assignType,
      title: assignTitle,
      description: assignDesc,
      status: "pending",
      dueDate: assignDueDate,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [...assignments, newAssignment];
    setAssignments(updated);
    localStorage.setItem(`voice3_professor_assignments_${professorId}`, JSON.stringify(updated));
    try {
      const key = `voice3_student_assignments_${assignTarget}`;
      const existing = localStorage.getItem(key);
      const arr = existing ? JSON.parse(existing) : [];
      arr.push({ ...newAssignment, professorName: currentUser?.name });
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (_e) {}
    setAssignTarget(""); setAssignTitle(""); setAssignDesc(""); setAssignDueDate("");
    toast.success("Tarefa criada com sucesso!");
  };

  const deleteAssignment = (id: string) => {
    const updated = assignments.filter(a => a.id !== id);
    setAssignments(updated);
    localStorage.setItem(`voice3_professor_assignments_${professorId}`, JSON.stringify(updated));
    toast.success("Tarefa eliminada.");
  };

  const tabs = ["My Students", "Schedule", "Assignments"];

  const glassInput: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8, color: "white", fontSize: 14,
    outline: "none", padding: "0 12px", height: 36,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a1628", color: "white" }}>
      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50, height: 64,
        background: "#0a1628",
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", gap: 16,
      }}>
        {/* Logo */}
        <span style={{ fontSize: 22, fontWeight: 800, fontFamily: "serif", color: "#C9A84C", letterSpacing: "0.1em", flexShrink: 0 }}>
          VOICE³
        </span>

        {/* Badge */}
        <span style={{
          fontSize: 11, letterSpacing: "0.18em", color: "rgba(201,168,76,0.8)",
          fontWeight: 700, textTransform: "uppercase" as const,
          background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: 100, padding: "6px 16px", flexShrink: 0,
        }}>PROFESSOR PORTAL</span>

        {/* Tabs nav */}
        <nav style={{ display: "flex", gap: 4 }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "8px 20px", borderRadius: 6, fontSize: 14, fontWeight: 500,
              background: activeTab === tab ? "rgba(201,168,76,0.12)" : "transparent",
              color: activeTab === tab ? "#C9A84C" : "rgba(255,255,255,0.6)",
              border: activeTab === tab ? "1px solid rgba(201,168,76,0.25)" : "1px solid transparent",
              cursor: "pointer", transition: "all 0.2s",
            }}>{tab}</button>
          ))}
        </nav>

        {/* User menu */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
            {currentUser?.name?.split(" ")[0] || "Professor"}
          </span>
          <button onClick={() => { logout(); navigate("/auth"); }}
            style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer", background: "none", border: "none" }}>
            Sign out
          </button>
        </div>
      </header>

      {/* ── KPI BAR ── */}
      <div style={{
        display: "flex", background: "rgba(201,168,76,0.04)",
        borderBottom: "1px solid rgba(201,168,76,0.08)",
      }}>
        {kpis.map((kpi, i) => (
          <div key={kpi.label} style={{
            flex: 1, padding: "16px 28px", textAlign: "center",
            borderRight: i < kpis.length - 1 ? "1px solid rgba(201,168,76,0.1)" : "none",
          }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#C9A84C", margin: "0 0 4px" }}>
              {kpi.icon} {kpi.value}
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ padding: "32px", maxWidth: 1400, margin: "0 auto" }}>

        {/* ── TAB 1: MY STUDENTS ── */}
        {activeTab === "My Students" && (
          <div>
            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input placeholder="Search students..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ ...glassInput, paddingLeft: 36, width: 220 }} />
              </div>
              <select value={filterPack} onChange={e => setFilterPack(e.target.value)} style={glassInput}>
                <option value="all">All Packs</option>
                {["Starter", "Pro", "Advanced", "Business Master"].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {filteredStudents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)" }}>
                <p style={{ fontSize: 18 }}>No students found.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
                {filteredStudents.map(student => {
                  const progressPct = student.totalChapters > 0
                    ? Math.round((student.completedChapters / student.totalChapters) * 100)
                    : 0;
                  const lvl = student.level || "B1";
                  return (
                    <div key={student.id}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16, padding: 28,
                        transition: "border-color 0.25s, transform 0.25s",
                      }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(201,168,76,0.25)"; el.style.transform = "translateY(-3px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.transform = ""; }}
                    >
                      {/* Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: "50%",
                            background: "linear-gradient(135deg,#C9A84C,#8B6914)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 15, fontWeight: 700, color: "#060f1d", flexShrink: 0,
                          }}>{getInitials(student.name)}</div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: 16, margin: "0 0 2px", color: "white" }}>{student.name}</p>
                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0 }}>{student.email}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <span style={{
                            fontSize: 11, padding: "3px 10px", borderRadius: 100,
                            background: levelColors[lvl] || "rgba(120,120,120,0.2)",
                            color: levelTextColors[lvl] || "rgba(180,180,180,0.9)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}>{lvl}</span>
                          <span style={{
                            fontSize: 11, padding: "3px 10px", borderRadius: 100,
                            background: "rgba(201,168,76,0.1)",
                            color: "rgba(201,168,76,0.8)",
                            border: "1px solid rgba(201,168,76,0.15)",
                          }}>{student.pack}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                          <span style={{ color: "rgba(255,255,255,0.5)" }}>Progress</span>
                          <span style={{ color: "#C9A84C", fontWeight: 600 }}>{progressPct}%</span>
                        </div>
                        <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                          <div style={{
                            height: "100%", width: `${progressPct}%`,
                            background: "linear-gradient(90deg,#C9A84C,#E8C87A)",
                            borderRadius: 3, transition: "width 1s ease-out",
                          }} />
                        </div>
                      </div>

                      {/* Stats row */}
                      <div style={{ display: "flex", gap: 12, fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 16, flexWrap: "wrap" }}>
                        <span>Sessions: {student.completedChapters}/{student.totalChapters}</span>
                        <span>·</span>
                        <span>Avg: {progressPct}%</span>
                        {student.nextSession && (
                          <>
                            <span>·</span>
                            <span style={{ color: "rgba(201,168,76,0.7)" }}>📅 Next: {formatDate(student.nextSession)}</span>
                          </>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => navigate(`/professor/aluno/${student.id}`)}
                          style={{
                            flex: 1, height: 36,
                            background: "rgba(201,168,76,0.1)",
                            border: "1px solid rgba(201,168,76,0.2)", color: "#C9A84C",
                            borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.18)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.1)"; }}>
                          View Profile
                        </button>
                        <button onClick={() => { setActiveTab("Assignments"); setAssignTarget(student.id); }}
                          style={{
                            height: 36, padding: "0 14px",
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.6)",
                            borderRadius: 7, fontSize: 13, cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "white"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
                          + Task
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: SCHEDULE ── */}
        {activeTab === "Schedule" && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 24, fontFamily: "serif" }}>Upcoming Sessions</h2>
            {upcomingBookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)" }}>
                <p style={{ fontSize: 18 }}>No upcoming sessions.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 600 }}>
                {upcomingBookings.map(booking => (
                  <div key={booking.id} style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12, padding: "20px 24px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    gap: 16,
                  }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.85)", margin: "0 0 4px" }}>
                        📅 {formatDate(booking.date)} · {booking.startTime} · 45 min
                      </p>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                        {booking.studentName}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{
                        fontSize: 12, padding: "4px 12px", borderRadius: 100,
                        background: "rgba(34,197,94,0.1)", color: "rgba(134,239,172,0.9)",
                        border: "1px solid rgba(34,197,94,0.15)",
                      }}>✅ Confirmed</span>
                      <button onClick={() => cancelBooking(booking.id)} style={{
                        background: "transparent", border: "1px solid rgba(239,68,68,0.2)",
                        color: "rgba(239,68,68,0.6)", borderRadius: 6, padding: "4px 10px",
                        fontSize: 12, cursor: "pointer",
                      }}>Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Past sessions */}
            {bookings.filter(b => b.status === "completed").length > 0 && (
              <div style={{ marginTop: 40 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>Past Sessions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 600 }}>
                  {bookings.filter(b => b.status === "completed").map(booking => (
                    <div key={booking.id} style={{
                      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: 10, padding: "14px 20px",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <div>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 2px" }}>
                          {formatDate(booking.date)} · {booking.startTime}
                        </p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>{booking.studentName}</p>
                      </div>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Completed</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: ASSIGNMENTS ── */}
        {activeTab === "Assignments" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>
            {/* List */}
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 24, fontFamily: "serif" }}>Assignments</h2>
              {assignments.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)" }}>
                  <p>No assignments yet.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {assignments.map(a => {
                    const statusColor = a.status === "completed"
                      ? { bg: "rgba(34,197,94,0.1)", text: "rgba(134,239,172,0.9)", label: "✅ Submitted" }
                      : a.status === "in_progress"
                      ? { bg: "rgba(59,130,246,0.1)", text: "rgba(147,197,253,0.9)", label: "🔵 In Progress" }
                      : { bg: "rgba(234,179,8,0.1)", text: "rgba(253,224,71,0.9)", label: "🟡 Pending" };
                    return (
                      <div key={a.id} style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 12, padding: "16px 20px",
                        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
                      }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, fontSize: 15, color: "white", margin: "0 0 4px" }}>{a.title}</p>
                          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>{a.studentName} · Due {formatDate(a.dueDate)}</p>
                          <span style={{
                            fontSize: 11, padding: "3px 10px", borderRadius: 100,
                            background: statusColor.bg, color: statusColor.text,
                          }}>{statusColor.label}</span>
                        </div>
                        <button onClick={() => deleteAssignment(a.id)} style={{
                          background: "transparent", border: "none", color: "rgba(239,68,68,0.5)",
                          cursor: "pointer", padding: 4, flexShrink: 0,
                        }}><X className="h-4 w-4" /></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Create form */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: 24,
              position: "sticky", top: 100,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, fontFamily: "serif" }}>
                <Plus className="inline h-4 w-4 mr-2" style={{ color: "#C9A84C" }} />
                New Assignment
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Student</label>
                  <select value={assignTarget} onChange={e => setAssignTarget(e.target.value)}
                    style={{ ...glassInput, width: "100%", height: 40 }}>
                    <option value="">Select student...</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Type</label>
                  <select value={assignType} onChange={e => setAssignType(e.target.value as Assignment["type"])}
                    style={{ ...glassInput, width: "100%", height: 40 }}>
                    <option value="ai_drill">AI Drill</option>
                    <option value="writing_task">Writing Task</option>
                    <option value="voice_recording">Voice Recording</option>
                    <option value="redo_session">Redo Session</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Title</label>
                  <input value={assignTitle} onChange={e => setAssignTitle(e.target.value)}
                    placeholder="Assignment title..." style={{ ...glassInput, width: "100%", height: 40, boxSizing: "border-box" as const }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Description</label>
                  <textarea value={assignDesc} onChange={e => setAssignDesc(e.target.value)}
                    placeholder="Details..." rows={3}
                    style={{ ...glassInput, width: "100%", height: "auto", padding: "10px 12px", resize: "vertical" as const, boxSizing: "border-box" as const }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Due Date</label>
                  <input type="date" value={assignDueDate} onChange={e => setAssignDueDate(e.target.value)}
                    style={{ ...glassInput, width: "100%", height: 40, boxSizing: "border-box" as const }} />
                </div>
                <button onClick={createAssignment} style={{
                  width: "100%", height: 44,
                  background: "linear-gradient(135deg,#C9A84C,#B8912A)",
                  color: "#060f1d", fontWeight: 700, fontSize: 14,
                  borderRadius: 8, border: "none", cursor: "pointer",
                  transition: "filter 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
                  onMouseLeave={e => (e.currentTarget.style.filter = "")}>
                  Create Assignment →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
