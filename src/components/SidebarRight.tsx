import CalendarWidget from "./CalendarWidget";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { getUserPoints } from "@/lib/persistence";

const quickTools = [
  { icon: "🚨", label: "Rescue Mode", path: "/app/toolkit/rescue-mode", color: "#ef4444" },
  { icon: "📝", label: "Grammar Tool", path: "/app/toolkit/grammar", color: "#3b82f6" },
  { icon: "⚔️", label: "Q&A Gauntlet", path: "/app/practice/hostile-qa", color: "#f59e0b" },
];

const SidebarRight = () => {
  const { currentUser } = useAuth();

  const initials = (currentUser?.name || "U")
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const { total: totalPoints } = currentUser ? getUserPoints(currentUser.id) : { total: 0 };
  const packLabel = currentUser?.pack ? `Pack ${currentUser.pack.charAt(0).toUpperCase() + currentUser.pack.slice(1)}` : "Pack Pro";

  // Load next booking from localStorage if available
  let nextBooking: { date: string; topic: string } | null = null;
  try {
    const userId = currentUser?.id || "";
    const stored = localStorage.getItem(`voice3_student_assignments_${userId}`);
    if (stored) {
      const assignments = JSON.parse(stored) as Array<{ dueDate?: string; title?: string; status?: string }>;
      const upcoming = assignments.find(a => a.status !== "completed" && a.dueDate);
      if (upcoming) {
        nextBooking = { date: upcoming.dueDate!, topic: upcoming.title || "Session" };
      }
    }
  } catch (_e) {
    // ignore
  }

  const nextSessionDate = nextBooking
    ? new Date(nextBooking.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const nextSessionTopic = nextBooking?.topic || "Confidence & Presence";

  return (
    <div className="h-full flex flex-col p-5 gap-0 overflow-y-auto" style={{ background: "#070f1e" }}>

      {/* User card with points */}
      <div style={{
        background: "rgba(201,168,76,0.06)",
        border: "1px solid rgba(201,168,76,0.15)",
        borderRadius: 14, padding: 16, marginBottom: 20,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg,#C9A84C,#8B6914)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 800, color: "#060f1d",
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: "#F4F2ED" }}>
            {currentUser?.name || "Utilizador"}
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{packLabel}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#C9A84C" }}>{totalPoints}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>points</div>
        </div>
      </div>

      {/* Quick Access */}
      <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>
        QUICK ACCESS
      </p>
      {quickTools.map(t => (
        <Link key={t.path} to={t.path} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
          borderRadius: 9, marginBottom: 4, textDecoration: "none",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
          }}
        >
          <span style={{ fontSize: 18 }}>{t.icon}</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{t.label}</span>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>›</span>
        </Link>
      ))}

      {/* Next Session */}
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>
          NEXT SESSION
        </p>
        <div style={{
          background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)",
          borderRadius: 12, padding: 14,
        }}>
          <p style={{ fontSize: 12, color: "rgba(201,168,76,0.8)", fontWeight: 600 }}>
            📅 {nextSessionDate} · 10:00
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, marginTop: 4, color: "#F4F2ED" }}>Live Coaching Session</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{nextSessionTopic}</p>
          <Link to="/app/aulas" style={{
            display: "block", marginTop: 10, width: "100%", height: 32, lineHeight: "32px",
            textAlign: "center", textDecoration: "none",
            background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)",
            borderRadius: 7, color: "#C9A84C", fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>
            Join Call →
          </Link>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-xl bg-white/5 border border-white/5 flex-1">
        <div className="px-4 pt-4 pb-2 border-b border-white/5">
          <h3 className="text-sm font-semibold text-[#F4F2ED]">Schedule</h3>
          <p className="text-xs text-[#8E96A3] mt-0.5">Upcoming sessions</p>
        </div>
        <CalendarWidget />
      </div>
    </div>
  );
};

export default SidebarRight;
