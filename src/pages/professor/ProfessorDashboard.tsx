import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Search, LogOut, Calendar, BarChart3, Users, BookOpen, Zap, Settings } from "lucide-react";
import { toast } from "sonner";
import { Card, Badge, VoiceButton } from "@/components/ui/VoiceUI";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const BG = "#0a1628";
const SIDEBAR = "#1a1a2e";
const CARD_BG = "#0d1829";
const GOLD = "#D4AF37";
const GOLD_DIM = "rgba(212,175,55,0.15)";
const GOLD_BORDER = "rgba(212,175,55,0.3)";
const WHITE_06 = "rgba(255,255,255,0.06)";
const WHITE_08 = "rgba(255,255,255,0.08)";
const MUTED = "rgba(255,255,255,0.45)";

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
const demoDashboardStats = {
  activeStudents: 12,
  sessionsThisWeek: 8,
  avgStudentProgress: 67,
  pendingReviews: 5,
};

const demoStudents = [
  { id: "s1", name: "James Chen", company: "TechVentures Global", programme: "GROW", chapter: 4, voiceDnaScore: 82, lastSession: "2026-04-12", status: "active" },
  { id: "s2", name: "Sarah Mitchell", company: "BioHealth Corp", programme: "COMMUNICATE", chapter: 6, voiceDnaScore: 91, lastSession: "2026-04-11", status: "active" },
  { id: "s3", name: "Marcus Johnson", company: "TechVentures Global", programme: "MY MARKET Finance", chapter: 3, voiceDnaScore: 76, lastSession: "2026-04-10", status: "inactive" },
  { id: "s4", name: "Emma Rodriguez", company: "FinanceFirst Ltd", programme: "GROW", chapter: 7, voiceDnaScore: 88, lastSession: "2026-04-12", status: "active" },
  { id: "s5", name: "David Liu", company: "InsureMax", programme: "COMMUNICATE", chapter: 5, voiceDnaScore: 79, lastSession: "2026-04-08", status: "active" },
  { id: "s6", name: "Lisa Park", company: "BioHealth Corp", programme: "GROW", chapter: 8, voiceDnaScore: 94, lastSession: "2026-04-11", status: "active" },
  { id: "s7", name: "Robert Garcia", company: "FinanceFirst Ltd", programme: "MY MARKET Finance", chapter: 2, voiceDnaScore: 71, lastSession: "2026-04-09", status: "inactive" },
  { id: "s8", name: "Sophie Durant", company: "InsureMax", programme: "GROW", chapter: 9, voiceDnaScore: 86, lastSession: "2026-04-12", status: "active" },
  { id: "s9", name: "Thomas Mueller", company: "TechVentures Global", programme: "COMMUNICATE", chapter: 4, voiceDnaScore: 80, lastSession: "2026-04-10", status: "active" },
  { id: "s10", name: "Olivia Brown", company: "BioHealth Corp", programme: "MY MARKET Finance", chapter: 6, voiceDnaScore: 85, lastSession: "2026-04-11", status: "active" },
  { id: "s11", name: "Carlos Santos", company: "FinanceFirst Ltd", programme: "GROW", chapter: 3, voiceDnaScore: 73, lastSession: "2026-04-07", status: "inactive" },
  { id: "s12", name: "Nina Petrov", company: "InsureMax", programme: "COMMUNICATE", chapter: 7, voiceDnaScore: 92, lastSession: "2026-04-12", status: "active" },
];

const demoUpcomingSessions = [
  { id: "sess1", studentName: "James Chen", date: "2026-04-14", time: "10:00 AM", duration: 30 },
  { id: "sess2", studentName: "Emma Rodriguez", date: "2026-04-14", time: "2:00 PM", duration: 30 },
  { id: "sess3", studentName: "Sophie Durant", date: "2026-04-15", time: "9:30 AM", duration: 30 },
];

const demoNeedingAttention = [
  { name: "Marcus Johnson", score: 76, trend: "down", note: "Declining participation, missed last session" },
  { name: "Robert Garcia", score: 71, trend: "down", note: "Slow progress, needs 1-on-1 coaching" },
];

const progressChartData = [
  { week: "W1", progress: 45 }, { week: "W2", progress: 52 },
  { week: "W3", progress: 58 }, { week: "W4", progress: 63 },
  { week: "W5", progress: 67 }, { week: "W6", progress: 72 },
  { week: "W7", progress: 75 }, { week: "W8", progress: 78 },
  { week: "W9", progress: 80 }, { week: "W10", progress: 82 },
  { week: "W11", progress: 84 }, { week: "W12", progress: 87 },
];

const programmeCompletionData = [
  { programme: "GROW", completed: 8, total: 10 },
  { programme: "COMMUNICATE", completed: 7, total: 10 },
  { programme: "MY MARKET Finance", completed: 5, total: 10 },
];

const voiceDnaRadarData = [
  { category: "Clarity", value: 85 },
  { category: "Pace", value: 78 },
  { category: "Tone", value: 82 },
  { category: "Confidence", value: 88 },
  { category: "Engagement", value: 80 },
  { category: "Authority", value: 76 },
];

const aiInsights = [
  "Students show strongest improvement in Weeks 3-5 of their programme",
  "Video-based lessons have 23% higher completion rates than audio-only",
  "Peak engagement time: Tuesday-Thursday, 10 AM-12 PM",
  "Students who complete voice recordings have 31% better progress scores",
];

const commonErrors = [
  "Filler words (um, uh, like) - 34 students",
  "Speaking too quickly - 28 students",
  "Unclear pronunciation - 15 students",
  "Lack of pauses - 22 students",
];

const getGreeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
};

const getInitials = (name: string) => {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const NavItem = ({ icon: Icon, label, id, active, onClick }: any) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: active ? GOLD_DIM : "transparent",
      border: `1px solid ${active ? GOLD_BORDER : "transparent"}`,
      borderRadius: 8,
      color: active ? GOLD : MUTED,
      cursor: "pointer",
      transition: "all 0.25s",
      fontSize: 14,
      fontWeight: active ? 600 : 500,
    }}
    onMouseEnter={(e) => {
      if (!active) {
        (e.target as HTMLElement).style.background = WHITE_06;
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        (e.target as HTMLElement).style.background = "transparent";
      }
    }}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

// ─── OVERVIEW VIEW ────────────────────────────────────────────────────────────
const OverviewView = ({ coachName }: { coachName: string }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
    {/* Welcome Banner */}
    <div style={{
      background: `linear-gradient(135deg, ${GOLD_DIM} 0%, rgba(212,175,55,0.08) 100%)`,
      border: `1px solid ${GOLD_BORDER}`,
      borderRadius: 16,
      padding: 32,
      marginBottom: 32,
    }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: "white", margin: "0 0 8px" }}>
        {getGreeting()}, Coach {coachName.split(" ")[0]}
      </h1>
      <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
        You have {demoDashboardStats.activeStudents} active students and {demoDashboardStats.sessionsThisWeek} sessions scheduled this week.
      </p>
    </div>

    {/* Stats Cards */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16,
      marginBottom: 32,
    }}>
      {[
        { label: "Active Students", value: String(demoDashboardStats.activeStudents), icon: "👥" },
        { label: "Sessions This Week", value: String(demoDashboardStats.sessionsThisWeek), icon: "📅" },
        { label: "Avg Student Progress", value: `${demoDashboardStats.avgStudentProgress}%`, icon: "📈" },
        { label: "Pending Reviews", value: String(demoDashboardStats.pendingReviews), icon: "📝" },
      ].map((stat, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <Card style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{stat.icon}</div>
            <p style={{ fontSize: 24, fontWeight: 700, color: GOLD, margin: "0 0 4px" }}>
              {stat.value}
            </p>
            <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{stat.label}</p>
          </Card>
        </motion.div>
      ))}
    </div>

    {/* Today's Schedule & Attention Needed */}
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, marginBottom: 32 }}>
      {/* Today's Schedule */}
      <Card>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: "0 0 20px" }}>
          📅 Today's Schedule
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {demoUpcomingSessions.slice(0, 2).map((sess, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <div style={{
                background: WHITE_06,
                border: `1px solid ${WHITE_08}`,
                borderRadius: 8,
                padding: 16,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "white", margin: 0 }}>
                    {sess.studentName}
                  </p>
                  <Badge variant="gold" size="xs">{sess.time}</Badge>
                </div>
                <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
                  {sess.date} • {sess.duration} min
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Attention Needed */}
      <Card style={{ borderColor: "rgba(239,68,68,0.2)", borderWidth: 2 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: "0 0 20px" }}>
          ⚠️ Needs Attention
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {demoNeedingAttention.map((student, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <div style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8,
                padding: 12,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "white", margin: 0 }}>
                    {student.name}
                  </p>
                  <Badge variant="error" size="xs">Score: {student.score}</Badge>
                </div>
                <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>
                  {student.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  </motion.div>
);

// ─── MY STUDENTS VIEW ─────────────────────────────────────────────────────────
const MyStudentsView = ({ searchQuery, setSearchQuery }: any) => {
  const filteredStudents = demoStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div style={{ marginBottom: 24, display: "flex", gap: 12 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={16} style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: MUTED,
          }} />
          <input
            type="text"
            placeholder="Search students by name or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: 40,
              paddingRight: 16,
              height: 40,
              background: WHITE_06,
              border: `1px solid ${WHITE_08}`,
              borderRadius: 8,
              color: "white",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${WHITE_08}`, background: WHITE_06 }}>
              {["Student Name", "Company", "Programme", "Chapter", "Voice DNA Score", "Last Session", "Status"].map((header, i) => (
                <th key={i} style={{
                  padding: "16px",
                  textAlign: i === 0 ? "left" : "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: MUTED,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, i) => (
              <tr key={student.id} style={{
                borderBottom: i < filteredStudents.length - 1 ? `1px solid ${WHITE_08}` : "none",
                transition: "background 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = WHITE_06)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "16px", fontSize: 13, color: "white" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${GOLD}, #A88A37)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#0a1628",
                    }}>
                      {getInitials(student.name)}
                    </div>
                    <span>{student.name}</span>
                  </div>
                </td>
                <td style={{ padding: "16px", fontSize: 13, color: MUTED, textAlign: "center" }}>
                  {student.company}
                </td>
                <td style={{ padding: "16px", fontSize: 13, color: MUTED, textAlign: "center" }}>
                  {student.programme}
                </td>
                <td style={{ padding: "16px", fontSize: 13, color: "white", textAlign: "center" }}>
                  {student.chapter}
                </td>
                <td style={{ padding: "16px", textAlign: "center" }}>
                  <Badge variant="gold" size="sm">{student.voiceDnaScore}</Badge>
                </td>
                <td style={{ padding: "16px", fontSize: 12, color: MUTED, textAlign: "center" }}>
                  {formatDate(student.lastSession)}
                </td>
                <td style={{ padding: "16px", textAlign: "center" }}>
                  <Badge variant={student.status === "active" ? "success" : "muted"} size="xs">
                    {student.status === "active" ? "✓ Active" : "Inactive"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
};

// ─── SESSIONS VIEW ────────────────────────────────────────────────────────────
const SessionsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
    <h2 style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 24 }}>
      📅 Upcoming Sessions
    </h2>
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 800 }}>
      {demoUpcomingSessions.map((sess, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "white", margin: "0 0 6px" }}>
                  {sess.studentName}
                </p>
                <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
                  {sess.date} at {sess.time} • {sess.duration} minutes
                </p>
              </div>
              <Badge variant="success" size="sm">Confirmed</Badge>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>

    <h2 style={{ fontSize: 22, fontWeight: 700, color: "white", margin: "40px 0 24px" }}>
      ✓ Past Sessions
    </h2>
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 800 }}>
      {[
        { name: "James Chen", date: "2026-04-13", time: "11:00 AM" },
        { name: "Sarah Mitchell", date: "2026-04-13", time: "3:00 PM" },
      ].map((sess, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <Card style={{ background: "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
                  {sess.date} at {sess.time}
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>
                  {sess.name}
                </p>
              </div>
              <Badge variant="muted" size="sm">Completed</Badge>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// ─── PROGRESS VIEW ────────────────────────────────────────────────────────────
const ProgressView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
    {/* Cohort Progress */}
    <Card style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: "0 0 24px" }}>
        📊 Cohort Progress (12 Weeks)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={progressChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={WHITE_08} />
          <XAxis dataKey="week" stroke={MUTED} />
          <YAxis stroke={MUTED} />
          <Tooltip contentStyle={{
            background: CARD_BG,
            border: `1px solid ${WHITE_08}`,
            borderRadius: 8,
            color: "white",
          }} />
          <Line type="monotone" dataKey="progress" stroke={GOLD} strokeWidth={3} dot={{ fill: GOLD, r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>

    {/* Voice DNA Scores */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
      <Card>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: "0 0 24px" }}>
          🎯 Average Voice DNA Profile
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={voiceDnaRadarData}>
            <PolarGrid stroke={WHITE_08} />
            <PolarAngleAxis dataKey="category" stroke={MUTED} tick={{ fontSize: 11 }} />
            <PolarRadiusAxis stroke={WHITE_08} tick={{ fontSize: 11 }} />
            <Radar name="Score" dataKey="value" stroke={GOLD} fill={GOLD} fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: "0 0 24px" }}>
          📈 Programme Completion Rates
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={programmeCompletionData}>
            <CartesianGrid strokeDasharray="3 3" stroke={WHITE_08} />
            <XAxis dataKey="programme" stroke={MUTED} />
            <YAxis stroke={MUTED} />
            <Tooltip contentStyle={{
              background: CARD_BG,
              border: `1px solid ${WHITE_08}`,
              borderRadius: 8,
            }} />
            <Legend />
            <Bar dataKey="completed" fill={GOLD} name="Completed" />
            <Bar dataKey="total" fill={WHITE_08} name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  </motion.div>
);

// ─── AI INSIGHTS VIEW ─────────────────────────────────────────────────────────
const AIInsightsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
      {/* Key Insights */}
      <Card>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: "0 0 20px" }}>
          💡 Key Insights
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {aiInsights.map((insight, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <div style={{
                background: GOLD_DIM,
                border: `1px solid ${GOLD_BORDER}`,
                borderRadius: 8,
                padding: 12,
                fontSize: 13,
                color: "white",
              }}>
                {insight}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Common Error Patterns */}
      <Card>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: "0 0 20px" }}>
          🔍 Common Error Patterns
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {commonErrors.map((error, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <div style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8,
                padding: 12,
              }}>
                <p style={{ fontSize: 13, color: "white", margin: "0 0 4px", fontWeight: 500 }}>
                  {error.split(" - ")[0]}
                </p>
                <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
                  {error.split(" - ")[1]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  </motion.div>
);

// ─── SETTINGS VIEW ────────────────────────────────────────────────────────────
const SettingsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
    <Card style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "white", margin: "0 0 24px" }}>
        ⚙️ Coach Settings
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {[
          { label: "Notification Preferences", desc: "Manage email and in-app alerts" },
          { label: "Session Availability", desc: "Set your coaching hours" },
          { label: "Student Cohorts", desc: "Organize students into groups" },
          { label: "Export Reports", desc: "Download student progress reports" },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 16,
              borderBottom: i < 3 ? `1px solid ${WHITE_08}` : "none",
            }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "white", margin: 0 }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 12, color: MUTED, margin: "4px 0 0" }}>
                  {item.desc}
                </p>
              </div>
              <button style={{
                background: "transparent",
                border: `1px solid ${GOLD_BORDER}`,
                color: GOLD,
                padding: "8px 16px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
              }}>
                Configure
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  </motion.div>
);

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function ProfessorDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  const coachName = currentUser?.name || "Coach";

  const handleSignOut = () => {
    logout();
    navigate("/auth");
  };

  const navItems = [
    { icon: BarChart3, label: "Overview", id: "overview" },
    { icon: Users, label: "My Students", id: "my-students" },
    { icon: Calendar, label: "Sessions", id: "sessions" },
    { icon: BookOpen, label: "Student Progress", id: "progress" },
    { icon: Zap, label: "AI Insights", id: "ai-insights" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG }}>
      {/* SIDEBAR */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: 260,
          background: SIDEBAR,
          borderRight: `1px solid ${WHITE_08}`,
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div style={{
          fontSize: 20,
          fontWeight: 800,
          color: GOLD,
          marginBottom: 32,
          letterSpacing: "0.12em",
          fontFamily: "serif",
        }}>
          VOICE³
        </div>

        {/* Coach Info */}
        <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${WHITE_08}` }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${GOLD}, #A88A37)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 700,
            color: BG,
            marginBottom: 12,
          }}>
            {getInitials(coachName)}
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "white", margin: "0 0 4px" }}>
            {coachName}
          </p>
          <Badge variant="gold" size="xs">Coach</Badge>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, marginBottom: 32 }}>
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              id={item.id}
              active={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
            />
          ))}
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          style={{
            width: "100%",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "transparent",
            border: `1px solid ${WHITE_08}`,
            borderRadius: 8,
            color: MUTED,
            cursor: "pointer",
            transition: "all 0.25s",
            fontSize: 14,
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.borderColor = "rgba(239,68,68,0.3)";
            (e.target as HTMLElement).style.color = "rgba(239,68,68,0.7)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.borderColor = WHITE_08;
            (e.target as HTMLElement).style.color = MUTED;
          }}
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </motion.div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ padding: "32px 40px", maxWidth: 1400, margin: "0 auto" }}>
          {/* Content Views */}
          {activeSection === "overview" && <OverviewView coachName={coachName} />}
          {activeSection === "my-students" && <MyStudentsView searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
          {activeSection === "sessions" && <SessionsView />}
          {activeSection === "progress" && <ProgressView />}
          {activeSection === "ai-insights" && <AIInsightsView />}
          {activeSection === "settings" && <SettingsView />}
        </div>
      </div>
    </div>
  );
}
