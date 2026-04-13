import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PlatformLayout from "@/components/PlatformLayout";

const radarData = [
  { metric: "Clarity", value: 72 },
  { metric: "Pace (WPM)", value: 148 },
  { metric: "Active Tone", value: 65 },
  { metric: "Vocabulary", value: 80 },
];

const progressData = [
  { week: "Week 1", clarity: 58, wpm: 165, tone: 45, vocab: 890 },
  { week: "Week 2", clarity: 60, wpm: 162, tone: 48, vocab: 920 },
  { week: "Week 3", clarity: 62, wpm: 159, tone: 50, vocab: 950 },
  { week: "Week 4", clarity: 64, wpm: 156, tone: 52, vocab: 980 },
  { week: "Week 5", clarity: 66, wpm: 153, tone: 55, vocab: 1010 },
  { week: "Week 6", clarity: 68, wpm: 151, tone: 58, vocab: 1050 },
  { week: "Week 7", clarity: 69, wpm: 150, tone: 60, vocab: 1080 },
  { week: "Week 8", clarity: 70, wpm: 149, tone: 62, vocab: 1120 },
  { week: "Week 9", clarity: 71, wpm: 149, tone: 63, vocab: 1180 },
  { week: "Week 10", clarity: 71.5, wpm: 148, tone: 64, vocab: 1210 },
  { week: "Week 11", clarity: 72, wpm: 148, tone: 65, vocab: 1240 },
  { week: "Week 12", clarity: 72, wpm: 148, tone: 65, vocab: 1240 },
];

const insights = [
  { type: "improvement", text: "Your clarity has improved 15% this month" },
  { type: "improvement", text: "WPM reached target range (140-160)" },
];

const strengths = ["Confident vocabulary choices", "Clear sentence structure"];
const improvements = ["Reduce hedging language", "Vary sentence length"];

const VoiceDNA = () => {
  const [activeMetric, setActiveMetric] = useState<string>("combined");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getLineConfig = () => {
    if (activeMetric === "combined") {
      return [
        { dataKey: "clarity", stroke: "#D4AF37", name: "Clarity" },
        { dataKey: "wpm", stroke: "#9333EA", name: "WPM" },
        { dataKey: "tone", stroke: "#3B82F6", name: "Active Tone" },
        { dataKey: "vocab", stroke: "#10B981", name: "Vocabulary" },
      ];
    }
    const configs: { [key: string]: { dataKey: string; stroke: string; name: string } } = {
      clarity: { dataKey: "clarity", stroke: "#D4AF37", name: "Clarity" },
      wpm: { dataKey: "wpm", stroke: "#9333EA", name: "WPM" },
      tone: { dataKey: "tone", stroke: "#3B82F6", name: "Active Tone" },
      vocab: { dataKey: "vocab", stroke: "#10B981", name: "Vocabulary" },
    };
    return [configs[activeMetric]];
  };

  return (
    <PlatformLayout>
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            My Voice DNA
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Detailed analytics of your speaking patterns and vocal development
          </p>
        </motion.div>

        {/* Top Section - Current Profile */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Radar Chart */}
          <div
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: "#16213e",
              borderColor: "rgba(212, 175, 55, 0.2)",
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Current Profile
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(212, 175, 55, 0.1)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--text-muted)" }} />
                  <PolarRadiusAxis tick={{ fill: "var(--text-muted)" }} />
                  <Radar name="Score" dataKey="value" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.6} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f1419",
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                      borderRadius: "8px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Cards & Voice DNA Score */}
          <div className="space-y-4 flex flex-col">
            {/* Voice DNA Score */}
            <div
              className="rounded-xl p-6 border flex flex-col items-center justify-center"
              style={{
                backgroundColor: "#16213e",
                borderColor: "rgba(212, 175, 55, 0.2)",
                minHeight: "200px",
              }}
            >
              <p style={{ color: "var(--text-muted)" }} className="text-sm uppercase tracking-wide mb-2">
                Voice DNA Score
              </p>
              <p
                className="text-6xl font-bold"
                style={{
                  color: "#D4AF37",
                  textShadow: "0 0 20px rgba(212, 175, 55, 0.3)",
                }}
              >
                68
              </p>
              <p style={{ color: "var(--text-secondary)" }} className="text-sm mt-2">
                Comprehensive vocal profile
              </p>
            </div>

            {/* Metric Cards */}
            <div className="space-y-3">
              {[
                { label: "Clarity", value: "72", unit: "%", color: "#D4AF37" },
                { label: "Pace", value: "148", unit: "WPM", color: "#9333EA" },
                { label: "Active Tone", value: "65", unit: "%", color: "#3B82F6" },
                { label: "Vocabulary Range", value: "1,240", unit: "words", color: "#10B981" },
              ].map((metric, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-4 border flex items-center justify-between"
                  style={{
                    backgroundColor: "rgba(212, 175, 55, 0.05)",
                    borderColor: "rgba(212, 175, 55, 0.2)",
                  }}
                >
                  <div>
                    <p style={{ color: "var(--text-muted)" }} className="text-xs uppercase tracking-wide">
                      {metric.label}
                    </p>
                    {metric.label === "Pace" && (
                      <p style={{ color: "var(--text-secondary)" }} className="text-xs mt-1">
                        Target: 140-160
                      </p>
                    )}
                  </div>
                  <p className="text-2xl font-bold" style={{ color: metric.color }}>
                    {metric.value}
                    <span className="text-sm ml-1" style={{ color: "var(--text-muted)" }}>
                      {metric.unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Middle Section - Progress Over Time */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: "#16213e",
            borderColor: "rgba(212, 175, 55, 0.2)",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Progress Over Time (12 Weeks)
            </h2>
            <div className="flex gap-2 mt-4 sm:mt-0 flex-wrap">
              {[
                { id: "combined", label: "All Metrics" },
                { id: "clarity", label: "Clarity" },
                { id: "wpm", label: "Pace" },
                { id: "tone", label: "Tone" },
                { id: "vocab", label: "Vocabulary" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveMetric(btn.id)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    backgroundColor:
                      activeMetric === btn.id
                        ? "#D4AF37"
                        : "rgba(212, 175, 55, 0.1)",
                    color:
                      activeMetric === btn.id
                        ? "#0f1419"
                        : "var(--text-secondary)",
                    border: `1px solid ${
                      activeMetric === btn.id
                        ? "#D4AF37"
                        : "rgba(212, 175, 55, 0.2)"
                    }`,
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid stroke="rgba(212, 175, 55, 0.1)" />
                <XAxis dataKey="week" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1419",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {getLineConfig().map((config, idx) => (
                  <Line
                    key={idx}
                    type="monotone"
                    dataKey={config.dataKey}
                    stroke={config.stroke}
                    name={config.name}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bottom Section - Insights */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Insight Cards */}
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="rounded-lg p-4 border flex items-start gap-3"
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.08)",
                borderColor: "rgba(16, 185, 129, 0.3)",
              }}
            >
              <TrendingUp className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#10B981" }} />
              <p style={{ color: "var(--text-primary)" }}>{insight.text}</p>
            </div>
          ))}

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "#16213e",
                borderColor: "rgba(212, 175, 55, 0.2)",
              }}
            >
              <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Your Strengths
              </h3>
              <div className="space-y-2">
                {strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: "#10B981" }}
                    />
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {strength}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "#16213e",
                borderColor: "rgba(212, 175, 55, 0.2)",
              }}
            >
              <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Areas for Improvement
              </h3>
              <div className="space-y-2">
                {improvements.map((improvement, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: "#F59E0B" }}
                    />
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {improvement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Next Step */}
          <div
            className="rounded-xl p-6 border flex items-start justify-between flex-col sm:flex-row sm:items-center gap-4"
            style={{
              backgroundColor: "rgba(212, 175, 55, 0.08)",
              borderColor: "rgba(212, 175, 55, 0.3)",
            }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#D4AF37" }} />
              <div>
                <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  Recommended Next
                </h4>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  COMMUNICATE Module 2 - Advanced Tone Modulation
                </p>
              </div>
            </div>
            <button
              className="px-6 py-2 rounded-lg font-medium text-sm transition-all shrink-0"
              style={{
                backgroundColor: "#D4AF37",
                color: "#0f1419",
                border: "2px solid #D4AF37",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#D4AF37";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#D4AF37";
                e.currentTarget.style.color = "#0f1419";
              }}
            >
              Start Module
            </button>
          </div>
        </motion.div>
      </motion.div>
    </PlatformLayout>
  );
};

export default VoiceDNA;
