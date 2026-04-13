import CalendarWidget from "./CalendarWidget";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { getUserPoints } from "@/lib/persistence";
import "./SidebarRight.css";

const quickAccessLinks = [
  { label: "Rescue Mode", path: "/app/toolkit/rescue-mode", color: "var(--gold)" },
  { label: "Grammar Tool", path: "/app/toolkit/grammar", color: "#3b82f6" },
  { label: "Q&A Gauntlet", path: "/app/practice/hostile-qa", color: "#f59e0b" },
];

const SidebarRight = () => {
  const { currentUser } = useAuth();

  // Load next booking from localStorage
  let nextSessionDate = "";
  let nextSessionTopic = "";

  try {
    const userId = currentUser?.id || "";
    const stored = localStorage.getItem(`voice3_student_assignments_${userId}`);
    if (stored) {
      const assignments = JSON.parse(stored) as Array<{ dueDate?: string; title?: string; status?: string }>;
      const upcoming = assignments.find(a => a.status !== "completed" && a.dueDate);
      if (upcoming) {
        nextSessionDate = new Date(upcoming.dueDate!).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        nextSessionTopic = upcoming.title || "Live Session";
      }
    }
  } catch (_e) {
    // ignore
  }

  // Fallback to 3 days out if no booking
  if (!nextSessionDate) {
    nextSessionDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    nextSessionTopic = "Upcoming Session";
  }

  return (
    <div className="sidebar-right">
      {/* Quick Access */}
      <div className="section">
        <h4 className="section-label">QUICK ACCESS</h4>
        <ul className="quick-links">
          {quickAccessLinks.map(link => (
            <li key={link.path}>
              <Link to={link.path} className="quick-link">
                <span className="dot" style={{ backgroundColor: link.color }}></span>
                <span className="label">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Session */}
      <div className="section">
        <h4 className="section-label">NEXT SESSION</h4>
        <div className="session-card">
          <p className="session-date">{nextSessionDate}</p>
          <p className="session-title">Live Coaching</p>
          <p className="session-topic">{nextSessionTopic}</p>
          <Link to="/app/aulas" className="join-btn">
            Join Call
          </Link>
        </div>
      </div>

      {/* Calendar */}
      <div className="section flex-1">
        <h4 className="section-label">SCHEDULE</h4>
        <div className="calendar-container">
          <CalendarWidget />
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
