import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import TourOverlay from "@/components/TourOverlay";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { Card, VoiceButton, Badge, Avatar, ProgressBar } from '@/components/ui/VoiceUI';

// ── Constants ────────────────────────────────────────────────────────────────

const GOLD = "#C9A84C";
const BG = "#0a1628";
const DARK_BG = "rgba(6,15,29,0.95)";

const TABS = ["Overview", "Team", "Progress", "Analytics", "Settings"] as const;
type Tab = typeof TABS[number];

const TEAM_MEMBERS = [
  { id: "m1", name: "João Silva",    email: "joao@atlantic.pt",   level: "B2", sessions: 12, avgScore: 88, professor: "Sandra S." },
  { id: "m2", name: "Maria Costa",   email: "maria@atlantic.pt",  level: "B1", sessions: 6,  avgScore: 71, professor: "Sandra S." },
  { id: "m3", name: "Pedro Alves",   email: "pedro@atlantic.pt",  level: "C1", sessions: 20, avgScore: 92, professor: "Sandra S." },
  { id: "m4", name: "Sandra Moura",  email: "sandra@atlantic.pt", level: "B2", sessions: 8,  avgScore: 76, professor: "Sandra S." },
  { id: "m5", name: "Rui Barbosa",   email: "rui@atlantic.pt",    level: "B1", sessions: 4,  avgScore: 64, professor: "Sandra S." },
  { id: "m6", name: "Catarina Neves",email: "cat@atlantic.pt",    level: "B2", sessions: 10, avgScore: 80, professor: "Sandra S." },
  { id: "m7", name: "Tiago Ferreira",email: "tiago@atlantic.pt",  level: "B1", sessions: 3,  avgScore: 59, professor: "Sandra S." },
  { id: "m8", name: "Ana Lima",      email: "ana@atlantic.pt",    level: "C1", sessions: 18, avgScore: 95, professor: "Sandra S." },
];

const ACTIVITY_FEED = [
  { time: "2h ago",    text: "João Silva completed Session 3 — Voice Foundations", score: 88, icon: "✅" },
  { time: "5h ago",    text: "Maria Costa started Chapter 2", score: null, icon: "▶️" },
  { time: "Yesterday", text: "Pedro Alves used Rescue Mode — Emergency Meeting Prep", score: null, icon: "🚨" },
  { time: "2 days ago",text: "Sandra scheduled a live session with João Silva", score: null, icon: "📅" },
  { time: "3 days ago",text: "Team average score improved to 76%", score: null, icon: "📈" },
];

const ACTIVITY_CHART_DATA = [
  { day: "Mar 1",  sessions: 3 }, { day: "Mar 3",  sessions: 5 }, { day: "Mar 5",  sessions: 2 },
  { day: "Mar 7",  sessions: 7 }, { day: "Mar 9",  sessions: 4 }, { day: "Mar 11", sessions: 6 },
  { day: "Mar 13", sessions: 8 }, { day: "Mar 15", sessions: 5 }, { day: "Mar 17", sessions: 9 },
  { day: "Mar 19", sessions: 6 }, { day: "Mar 21", sessions: 4 }, { day: "Mar 23", sessions: 7 },
  { day: "Mar 25", sessions: 11 },{ day: "Mar 27", sessions: 8 }, { day: "Mar 29", sessions: 6 },
];

const RADAR_DATA = [
  { skill: "Pronunciation", avg: 72, top: 90 },
  { skill: "Structure",     avg: 80, top: 95 },
  { skill: "Vocabulary",    avg: 68, top: 88 },
  { skill: "Confidence",    avg: 74, top: 92 },
  { skill: "Fluency",       avg: 70, top: 87 },
  { skill: "Clarity",       avg: 78, top: 93 },
];

const SCORE_TREND = [
  { week: "W1", score: 62 }, { week: "W2", score: 65 }, { week: "W3", score: 63 },
  { week: "W4", score: 68 }, { week: "W5", score: 70 }, { week: "W6", score: 72 },
  { week: "W7", score: 74 }, { week: "W8", score: 76 },
];

const WEEKLY_SESSIONS = [
  { week: "W1", sessions: 14 }, { week: "W2", sessions: 18 }, { week: "W3", sessions: 22 },
  { week: "W4", sessions: 19 }, { week: "W5", sessions: 25 }, { week: "W6", sessions: 21 },
  { week: "W7", sessions: 28 }, { week: "W8", sessions: 24 },
];

const TOOLS_USAGE = [
  { name: "Sessions",    value: 60, color: GOLD },
  { name: "Rescue Mode", value: 20, color: "#8B6914" },
  { name: "Chat AI",     value: 12, color: "#E8C87A" },
  { name: "Toolkit",     value: 8,  color: "rgba(201,168,76,0.4)" },
];

const CHAPTER_DATA = TEAM_MEMBERS.map(m => ({
  name: m.name.split(" ")[0],
  chapters: Array.from({ length: 10 }, (_, i) => ({
    ch: i + 1,
    pct: i < Math.floor(m.sessions / 2) ? 100 : i === Math.floor(m.sessions / 2) ? 60 : 0,
  })),
}));

const makeCompanyTourSteps = (firstName: string, companyName: string) => [
  { target: '[data-tour="company-header"]', title: `Welcome, ${firstName}! 🎉`,
    description: `This is your ${companyName} dashboard. From here you manage your entire team's executive training.`,
    position: "bottom" },
  { target: '[data-tour="company-kpis"]', title: "Team KPIs at a glance",
    description: "See active learners, seats, sessions completed, and average scores — all updated in real time.",
    position: "bottom" },
  { target: '[data-tour="team-tab"]', title: "Manage your team",
    description: "Add members, view individual progress, and assign them to your dedicated professor.",
    position: "bottom" },
  { target: '[data-tour="progress-tab"]', title: "Deep Progress Analytics",
    description: "Radar charts, score trends, and chapter completion heatmaps for your entire team.",
    position: "bottom" },
];

// ── Helper components ─────────────────────────────────────────────────────────

/** Max sessions used to calculate the team table progress bar width (100% = this value). */
const MAX_SESSIONS_FOR_PROGRESS = 20;

/** Percentage threshold above which heatmap cell text switches to dark for contrast. */
const HEATMAP_TEXT_CONTRAST_THRESHOLD = 50;

// ── Tab: Overview ─────────────────────────────────────────────────────────────

function OverviewTab({ companyName }: { companyName: string }) {
  const seatsTotal = 15;
  const seatsUsed = 8;
  const seatsAvailable = seatsTotal - seatsUsed;
  const totalSessions = 148;
  const avgScore = 76;
  const avgProgress = 62;

  const kpis = [
    { icon: "👥", value: String(seatsUsed),    label: "Active Learners",   sub: "+2 this month" },
    { icon: "💺", value: String(seatsAvailable),label: "Seats Available",   sub: `of ${seatsTotal} total` },
    { icon: "📚", value: String(totalSessions), label: "Sessions Done",     sub: "this programme" },
    { icon: "🎯", value: `${avgScore}%`,        label: "Avg. Score",        sub: "↑ from 68%" },
    { icon: "📈", value: `${avgProgress}%`,     label: "Avg. Progress",     sub: "across team" },
    { icon: "📅", value: "Mar 14",              label: "Next Session",      sub: "João Silva" },
  ];

  return (
    <div>
      {/* Company hero card */}
      <div style={{
        background: "linear-gradient(135deg,rgba(201,168,76,0.08),rgba(6,15,29,0))",
        border: "1px solid rgba(201,168,76,0.15)",
        borderRadius: 20, padding: 36, marginBottom: 32,
        display: "flex", alignItems: "center", gap: 24,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 18,
          background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
        }}>🏢</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>
            ENTERPRISE ACCOUNT
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{companyName}</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
            Business Master Pack · {seatsUsed}/{seatsTotal} seats active · Renews Dec 2026
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: GOLD, fontFamily: "serif" }}>{avgProgress}%</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Team Avg. Progress</div>
        </div>
      </div>

      {/* 6 KPIs */}
      <div data-tour="company-kpis"
        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
        {kpis.map((kpi, i) => (
          <Card key={i} hover>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{kpi.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: GOLD, fontFamily: "serif", marginBottom: 2 }}>{kpi.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{kpi.label}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* Activity chart */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, color: "rgba(255,255,255,0.8)" }}>
          Team Activity — Last 30 Days
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={ACTIVITY_CHART_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, color: "white" }} />
            <Line type="monotone" dataKey="sessions" stroke={GOLD} strokeWidth={2}
              dot={false} fill="rgba(201,168,76,0.08)" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent activity */}
      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "rgba(255,255,255,0.8)" }}>
          Recent Activity
        </h3>
        {ACTIVITY_FEED.map((a, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            padding: "12px 0",
            borderBottom: i < ACTIVITY_FEED.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{a.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                {a.text}
                {a.score !== null && (
                  <span style={{ marginLeft: 8, fontSize: 12, color: "rgba(34,197,94,0.8)", fontWeight: 600 }}>
                    {a.score}%
                  </span>
                )}
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{a.time}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Tab: Team ─────────────────────────────────────────────────────────────────

function TeamTab() {
  const cols = "2fr 1fr 1fr 1fr 1fr 80px";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Team Members</h2>
        <VoiceButton variant="primary" onClick={() => {}}>+ Add Member</VoiceButton>
      </div>

      <Card padding={0} style={{ overflow: "hidden" }}>
        {/* Table header */}
        <div style={{
          display: "grid", gridTemplateColumns: cols,
          padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          fontSize: 11, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)",
        }}>
          <span>MEMBER</span><span>LEVEL</span><span>PROGRESS</span>
          <span>AVG SCORE</span><span>PROFESSOR</span><span>ACTIONS</span>
        </div>

        {TEAM_MEMBERS.map((m, i) => {
          const scoreColor = m.avgScore >= 80 ? "rgba(74,222,128,0.9)" : m.avgScore >= 60 ? GOLD : "rgba(255,255,255,0.6)";
          return (
            <div key={m.id} style={{
              display: "grid", gridTemplateColumns: cols,
              padding: "16px 20px", alignItems: "center",
              borderBottom: i < TEAM_MEMBERS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              transition: "background 0.2s",
            }}
              onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)")}
              onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}
            >
              {/* Member */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={m.name} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{m.email}</p>
                </div>
              </div>
              {/* Level */}
              <Badge variant="gold">{m.level}</Badge>
              {/* Progress */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: GOLD, marginBottom: 4 }}>
                  {m.sessions} sessions
                </div>
                <div style={{ width: 80 }}>
                  <ProgressBar value={Math.min(100, (m.sessions / MAX_SESSIONS_FOR_PROGRESS) * 100)} height={3} />
                </div>
              </div>
              {/* Avg score */}
              <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor }}>
                {m.avgScore > 0 ? `${m.avgScore}%` : "—"}
              </span>
              {/* Professor */}
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{m.professor}</span>
              {/* Actions */}
              <div>
                <VoiceButton variant="ghost" size="sm">···</VoiceButton>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ── Tab: Progress ─────────────────────────────────────────────────────────────

function ProgressTab() {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Team Progress</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Skills Radar */}
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Skills Radar — Team</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
              <Radar name="Team Avg" dataKey="avg" stroke={GOLD} fill={GOLD} fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Top Performer" dataKey="top" stroke="rgba(74,222,128,0.7)" fill="rgba(74,222,128,0.05)" strokeWidth={1.5} strokeDasharray="4 2" />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, color: "white" }} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 8, justifyContent: "center" }}>
            <span style={{ fontSize: 11, color: GOLD }}>● Team Avg</span>
            <span style={{ fontSize: 11, color: "rgba(74,222,128,0.7)" }}>● Top Performer</span>
          </div>
        </Card>

        {/* Score Trend */}
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Score Trend — Last 8 Weeks</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={SCORE_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 85]} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, color: "white" }} />
              <Line type="monotone" dataKey="score" stroke={GOLD} strokeWidth={2.5} dot={{ fill: GOLD, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Chapter heatmap */}
      <Card style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Chapter Completion Heatmap</h3>
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "100px repeat(10,1fr)", gap: 4, minWidth: 600 }}>
            {/* Chapter headers */}
            <div />
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textAlign: "center", paddingBottom: 4 }}>
                Ch {i + 1}
              </div>
            ))}
            {CHAPTER_DATA.map(member => (
              <>
                <div key={member.name + "-label"} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center" }}>
                  {member.name}
                </div>
                {member.chapters.map(ch => {
                  const alpha = ch.pct / 100;
                  const bg = ch.pct === 0
                    ? "rgba(255,255,255,0.04)"
                    : `rgba(201,168,76,${0.15 + alpha * 0.75})`;
                  return (
                    <div key={ch.ch} title={`${member.name} — Ch${ch.ch}: ${ch.pct}%`} style={{
                      height: 28, borderRadius: 4, background: bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, color: ch.pct > HEATMAP_TEXT_CONTRAST_THRESHOLD ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.3)",
                    }}>
                      {ch.pct > 0 ? `${ch.pct}%` : ""}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── Tab: Analytics ────────────────────────────────────────────────────────────

function AnalyticsTab() {
  const roiCards = [
    { label: "Total Training Hours", value: "111h",  sub: "148 sessions × 45min" },
    { label: "Cost per Session",     value: "~€116", sub: "Business Master / team" },
    { label: "Score Improvement",    value: "+8%",   sub: "68% → 76% avg" },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Analytics & ROI</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
        {roiCards.map((m, i) => (
          <Card key={i}>
            <div style={{ fontSize: 28, fontWeight: 800, color: GOLD, marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{m.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {/* Bar chart */}
        <Card style={{ flex: 1 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Session Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY_SESSIONS}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, color: "white" }} />
              <Bar dataKey="sessions" fill={GOLD} fillOpacity={0.8} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie chart */}
        <Card style={{ width: 220 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Tools Usage</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={TOOLS_USAGE} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                {TOOLS_USAGE.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8, color: "white" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
            {TOOLS_USAGE.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: t.color }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{t.name}</span>
                <span style={{ fontSize: 11, color: GOLD, marginLeft: "auto" }}>{t.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Export buttons */}
      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <VoiceButton variant="ghost">📊 Export Progress Report</VoiceButton>
        <VoiceButton variant="ghost">📋 Export Team Data CSV</VoiceButton>
      </div>
    </div>
  );
}

// ── Tab: Settings ─────────────────────────────────────────────────────────────

function SettingsTab({ companyName }: { companyName: string }) {
  const seatsUsed = 8;
  const seatsTotal = 15;

  const notifications = [
    { label: "Weekly progress digest",    defaultChecked: true },
    { label: "Session completed alerts",  defaultChecked: true },
    { label: "New member joins",          defaultChecked: false },
    { label: "Score milestones",          defaultChecked: true },
  ];

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Account Settings</h2>

      {/* Company profile */}
      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Company Profile</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label style={{ display: "block" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>
              COMPANY NAME
            </span>
            <input defaultValue={companyName} style={{
              width: "100%", height: 42, background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
              color: "white", padding: "0 14px", fontSize: 14, boxSizing: "border-box",
            }} />
          </label>
          <label style={{ display: "block" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>
              CONTACT EMAIL
            </span>
            <input defaultValue="empresa@voice3.pt" style={{
              width: "100%", height: 42, background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
              color: "white", padding: "0 14px", fontSize: 14, boxSizing: "border-box",
            }} />
          </label>
        </div>
        <VoiceButton variant="primary" style={{ marginTop: 16 }}>Save Changes</VoiceButton>
      </Card>

      {/* Seat management */}
      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Seat Management</h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
          {seatsUsed} of {seatsTotal} seats active. {seatsTotal - seatsUsed} available to assign.
        </p>
        <div style={{ marginBottom: 16 }}>
          <ProgressBar value={(seatsUsed / seatsTotal) * 100} height={8} />
        </div>
        <VoiceButton variant="gold-outline" size="sm">+ Invite Team Member</VoiceButton>
      </Card>

      {/* Notifications */}
      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Notifications</h3>
        {notifications.map((n, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0",
            borderBottom: i < notifications.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{n.label}</span>
            <input type="checkbox" defaultChecked={n.defaultChecked}
              style={{ accentColor: GOLD, width: 16, height: 16 }} />
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const CompanyDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [tourStep, setTourStep] = useState(0);
  const [tourActive, setTourActive] = useState(false);

  const companyName = currentUser?.company || "Atlantic Ventures";
  const userName = currentUser?.name || "Ana Ferreira";
  const firstName = userName.trim().split(/\s+/)[0] ?? userName;
  const tourSteps = makeCompanyTourSteps(firstName, companyName);

  // Activate tour on first visit
  useEffect(() => {
    const key = `voice3_company_tour_${currentUser?.id ?? "guest"}`;
    const done = localStorage.getItem(key);
    if (!done) {
      const t = setTimeout(() => setTourActive(true), 1200);
      return () => clearTimeout(t);
    }
  }, [currentUser?.id]);

  const tourNext = useCallback(() => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(s => s + 1);
    } else {
      setTourActive(false);
      localStorage.setItem(`voice3_company_tour_${currentUser?.id ?? "guest"}`, "1");
    }
  }, [tourStep, tourSteps.length, currentUser?.id]);

  const tourSkip = useCallback(() => {
    setTourActive(false);
    localStorage.setItem(`voice3_company_tour_${currentUser?.id ?? "guest"}`, "1");
  }, [currentUser?.id]);

  const handleSignOut = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "white", fontFamily: "system-ui, sans-serif" }}>
      {/* ── HEADER ── */}
      <header data-tour="company-header" style={{
        height: 60, background: DARK_BG,
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 40px",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <span style={{
            fontFamily: "serif", fontWeight: 800, fontSize: 22,
            color: GOLD, letterSpacing: "0.12em",
          }}>VOICE³</span>
        </Link>

        {/* Tabs */}
        <nav style={{ display: "flex", gap: 2 }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              data-tour={tab === "Team" ? "team-tab" : tab === "Progress" ? "progress-tab" : undefined}
              style={{
                padding: "7px 18px", borderRadius: 8, fontSize: 14, border: "none",
                background: activeTab === tab ? "rgba(201,168,76,0.12)" : "transparent",
                color: activeTab === tab ? GOLD : "rgba(255,255,255,0.55)",
                cursor: "pointer", transition: "all 0.2s",
                fontWeight: activeTab === tab ? 600 : 400,
              }}
            >{tab}</button>
          ))}
        </nav>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{userName}</span>
          <Avatar name={userName} size={32} />
          <button onClick={handleSignOut} style={{
            fontSize: 12, color: "rgba(255,255,255,0.3)",
            background: "transparent", border: "none", cursor: "pointer",
          }}>Sign out</button>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
        {activeTab === "Overview"  && <OverviewTab companyName={companyName} />}
        {activeTab === "Team"      && <TeamTab />}
        {activeTab === "Progress"  && <ProgressTab />}
        {activeTab === "Analytics" && <AnalyticsTab />}
        {activeTab === "Settings"  && <SettingsTab companyName={companyName} />}
      </main>

      {/* ── TOUR ── */}
      <TourOverlay
        active={tourActive}
        step={tourStep}
        steps={tourSteps}
        next={tourNext}
        skip={tourSkip}
      />
    </div>
  );
};

export default CompanyDashboard;
