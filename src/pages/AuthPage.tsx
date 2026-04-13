import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { useNavigate, Navigate, Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Shield, Users, CheckCircle2, Sparkles, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable/index";

/* ── Pack options for registration ── */
interface PackOption {
  name: string;
  slug: string;
  price: number | null;
  sessions: number;
  teacherLessons: number;
  features: string[];
  popular?: boolean;
}

const PACK_OPTIONS: PackOption[] = [
  { name: "Starter", slug: "starter", price: 149, sessions: 4, teacherLessons: 1, features: ["4 AI Sessions", "1 Live Coach Session", "Progress Tracking"] },
  { name: "Pro", slug: "pro", price: 349, sessions: 8, teacherLessons: 3, features: ["8 AI Sessions", "3 Live Coach Sessions", "Full Analytics"], popular: true },
  { name: "Advanced", slug: "advanced", price: 499, sessions: 12, teacherLessons: 5, features: ["12 AI Sessions", "5 Live Coach Sessions", "Personalised Path"] },
  { name: "Business Master", slug: "business-master", price: null, sessions: 20, teacherLessons: 10, features: ["Unlimited AI", "10 Coach Sessions", "Team Dashboard"] },
];

/* ── Demo accounts ── */
const demoUsers = [
  { label: "Student", email: "demo@voice3.pt", pass: "demo123" },
  { label: "Coach", email: "professor@voice3.pt", pass: "prof123" },
  { label: "Company", email: "empresa@voice3.pt", pass: "empresa123" },
  { label: "Admin", email: "admin@voice3.pt", pass: "admin123" },
];

/* ── Shared styles ── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  padding: "0 16px",
  borderRadius: 10,
  fontSize: 14,
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  outline: "none",
};

const goldBtnStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  borderRadius: 10,
  fontWeight: 600,
  fontSize: 14,
  background: "linear-gradient(135deg, var(--gold), #8B6914)",
  color: "var(--bg-base)",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

interface RegFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  role: "student" | "company_admin";
}

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const navigate = useNavigate();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Register state
  const [regStep, setRegStep] = useState(1);
  const [regData, setRegData] = useState<RegFormData>({ name: "", email: "", password: "", confirmPassword: "", company: "", role: "student" });
  const [showRegPw, setShowRegPw] = useState(false);
  const preselectedSlug = searchParams.get("pack");
  const preselectedPack = PACK_OPTIONS.find(p => p.slug === preselectedSlug) || null;
  const [selectedPack, setSelectedPack] = useState<PackOption | null>(preselectedPack);
  const [success, setSuccess] = useState(false);

  const { login, isAuthenticated, isLoading, currentUser } = useAuth();

  /* ── Auth redirect ── */
  if (isLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
      <span style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.1em" }}>
        VOICE<sup style={{ fontSize: 14 }}>3</sup>
      </span>
    </div>
  );

  if (isAuthenticated) {
    const pendingPack = searchParams.get("pack");
    const priceMap: Record<string, string> = { starter: "starter", pro: "pro", advanced: "advanced" };
    if (pendingPack && priceMap[pendingPack]) return <Navigate to={`/checkout?price=${priceMap[pendingPack]}`} replace />;
    if (currentUser?.role === "company_admin") return <Navigate to="/empresa/dashboard" replace />;
    if (currentUser?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (currentUser?.role === "professor") return <Navigate to="/professor/dashboard" replace />;
    return <Navigate to="/app" replace />;
  }

  /* ── Handlers ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success("Welcome back!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) { setError("Error signing in with Google."); setLoading(false); return; }
      if (result.redirected) return;
    } catch { setError("Error signing in with Google."); setLoading(false); }
  };

  const handleAppleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("apple", { redirect_uri: window.location.origin });
      if (result.error) { setError("Error signing in with Apple."); setLoading(false); return; }
      if (result.redirected) return;
    } catch { setError("Error signing in with Apple."); setLoading(false); }
  };

  const handleRegStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (regData.password !== regData.confirmPassword) { setError("Passwords do not match."); return; }
    if (regData.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setRegStep(regData.role === "student" ? 2 : 3);
  };

  const handleRegStep2 = () => {
    if (!selectedPack) { toast.error("Please select a pack."); return; }
    setRegStep(3);
  };

  const handleRegConfirm = async () => {
    setError("");
    setLoading(true);
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        body: JSON.stringify({ email: regData.email, password: regData.password, data: { name: regData.name } }),
      });
      const data = await res.json();
      if (!res.ok || !(data.id || data.user?.id)) throw new Error(data.msg || data.error_description || data.message || "Error creating account");

      const userId = data.user?.id || data.id;
      const email = data.user?.email || data.email || regData.email;

      if (selectedPack?.price && selectedPack.slug !== "business-master") {
        toast.success("Account created! Redirecting to checkout...");
        navigate(`/checkout?price=${selectedPack.slug}&email=${email}&userId=${userId}`);
        return;
      }
      toast.success("Account created!");
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred.");
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setMode("login");
    setRegStep(1);
    setSelectedPack(preselectedPack);
    setError("");
    setSuccess(false);
    setRegData({ name: "", email: "", password: "", confirmPassword: "", company: "", role: "student" });
  };

  /* ── Success Screen ── */
  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
        <div style={{ textAlign: "center", maxWidth: 400, padding: "0 24px" }}>
          <CheckCircle2 style={{ width: 48, height: 48, color: "var(--gold)", margin: "0 auto 24px" }} />
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
            Welcome to VOICE<sup style={{ color: "var(--gold)" }}>3</sup>
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32 }}>Your account is ready.</p>
          <button onClick={() => navigate("/app")} style={goldBtnStyle}>
            Access Platform <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    );
  }

  /* ── REGISTER MODE ── */
  if (mode === "register") {
    const totalSteps = regData.role === "student" ? 3 : 2;
    const currentStep = regData.role === "student" ? regStep : regStep === 1 ? 1 : 2;

    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <Link to="/">
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.1em" }}>
              VOICE<sup style={{ fontSize: 12 }}>3</sup>
            </span>
          </Link>

          {/* Step indicator */}
          <div style={{ display: "flex", gap: 8, margin: "24px 0" }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < currentStep ? "var(--gold)" : "var(--border)" }} />
            ))}
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 10, fontSize: 13, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", display: "flex", alignItems: "center", gap: 8 }}>
              <Shield style={{ width: 14, height: 14, flexShrink: 0 }} /> {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {regStep === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Create account</h2>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>Start your executive English journey</p>
                <form onSubmit={handleRegStep1} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <Label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6, display: "block" }}>Full Name</Label>
                    <input type="text" required placeholder="John Smith" value={regData.name} onChange={e => setRegData(d => ({ ...d, name: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <Label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6, display: "block" }}>Email</Label>
                    <input type="email" required placeholder="john@company.com" value={regData.email} onChange={e => setRegData(d => ({ ...d, email: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <Label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6, display: "block" }}>Account Type</Label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {([
                        { id: "student" as const, icon: <Users style={{ width: 18, height: 18 }} />, title: "Individual" },
                        { id: "company_admin" as const, icon: <Shield style={{ width: 18, height: 18 }} />, title: "Company" },
                      ]).map(t => (
                        <button key={t.id} type="button" onClick={() => setRegData(d => ({ ...d, role: t.id }))}
                          style={{
                            padding: "14px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                            background: regData.role === t.id ? "var(--gold-10)" : "var(--bg-surface)",
                            border: `2px solid ${regData.role === t.id ? "var(--gold)" : "var(--border)"}`,
                            display: "flex", alignItems: "center", gap: 10,
                            color: regData.role === t.id ? "var(--gold)" : "var(--text-primary)",
                          }}>
                          {t.icon}
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6, display: "block" }}>Password</Label>
                    <div style={{ position: "relative" }}>
                      <input type={showRegPw ? "text" : "password"} required placeholder="Min. 6 characters" value={regData.password}
                        onChange={e => setRegData(d => ({ ...d, password: e.target.value }))} style={{ ...inputStyle, paddingRight: 44 }} />
                      <button type="button" onClick={() => setShowRegPw(!showRegPw)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>
                        {showRegPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6, display: "block" }}>Confirm Password</Label>
                    <input type="password" required placeholder="Confirm" value={regData.confirmPassword}
                      onChange={e => setRegData(d => ({ ...d, confirmPassword: e.target.value }))} style={inputStyle} />
                  </div>
                  <button type="submit" style={goldBtnStyle}>Continue <ArrowRight style={{ width: 16, height: 16 }} /></button>
                </form>
                <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-muted)" }}>
                  Already have an account? <button onClick={resetToLogin} style={{ color: "var(--gold)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Sign in</button>
                </p>
              </motion.div>
            )}

            {regStep === 2 && regData.role === "student" && (
              <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Choose Package</h2>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>Select the plan that fits you</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {PACK_OPTIONS.map(pack => (
                    <button key={pack.slug} onClick={() => setSelectedPack(pack)}
                      style={{
                        padding: "14px 16px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                        background: selectedPack?.slug === pack.slug ? "var(--gold-10)" : "var(--bg-surface)",
                        border: `2px solid ${selectedPack?.slug === pack.slug ? "var(--gold)" : "var(--border)"}`,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: selectedPack?.slug === pack.slug ? "var(--gold)" : "var(--text-primary)" }}>{pack.name}</span>
                          {pack.popular && <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", padding: "2px 6px", borderRadius: 4, background: "var(--gold-10)", color: "var(--gold)" }}>Popular</span>}
                        </div>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{pack.features.join(" · ")}</span>
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "var(--gold)", whiteSpace: "nowrap" }}>
                        {pack.price ? `€${pack.price}` : "Custom"}
                      </span>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setRegStep(1)} style={{ flex: 1, height: 48, borderRadius: 10, background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Back</button>
                  <button onClick={handleRegStep2} disabled={!selectedPack} style={{ ...goldBtnStyle, flex: 1, opacity: selectedPack ? 1 : 0.4 }}>Continue</button>
                </div>
              </motion.div>
            )}

            {regStep === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Confirm</h2>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>Review your details</p>
                <div style={{ borderRadius: 10, padding: 20, background: "var(--bg-surface)", border: "1px solid var(--border)", marginBottom: 20 }}>
                  {[
                    ["Name", regData.name],
                    ["Email", regData.email],
                    ["Type", regData.role === "student" ? "Individual" : "Company"],
                    ...(selectedPack ? [["Pack", `${selectedPack.name} — ${selectedPack.price ? `€${selectedPack.price}` : "Custom"}`]] : []),
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                      <span style={{ color: "var(--text-muted)" }}>{k}</span>
                      <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setRegStep(regData.role === "student" ? 2 : 1)} style={{ flex: 1, height: 48, borderRadius: 10, background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Back</button>
                  <button onClick={handleRegConfirm} disabled={loading} style={{ ...goldBtnStyle, flex: 1, opacity: loading ? 0.6 : 1 }}>
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  /* ── LOGIN MODE ── */
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg-base)" }}>
      {/* Left branding — desktop only */}
      <div className="hidden lg:flex" style={{
        width: "42%",
        background: "linear-gradient(160deg, var(--bg-base), var(--bg-elevated))",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 48,
        position: "relative",
      }}>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 360 }}>
          <Link to="/">
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.15em", margin: 0 }}>
              VOICE<sup style={{ fontSize: 20 }}>3</sup>
            </h1>
          </Link>
          <div style={{ width: 48, height: 2, background: "var(--gold)", margin: "28px auto", opacity: 0.4 }} />
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 12px" }}>
            Master the Language of Leadership
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Premium executive English communication training powered by AI
          </p>
        </div>
      </div>

      {/* Right login form */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px clamp(24px, 5vw, 56px)",
      }}>
        <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ marginBottom: 32 }}>
            <Link to="/">
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.1em" }}>
                VOICE<sup style={{ fontSize: 14 }}>3</sup>
              </span>
            </Link>
          </div>

          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 28 }}>Sign in to continue</p>

          {error && (
            <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 10, fontSize: 13, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", display: "flex", alignItems: "center", gap: 8 }}>
              <Shield style={{ width: 14, height: 14, flexShrink: 0 }} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6 }}>Email</label>
              <input type="email" required placeholder="your@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} required placeholder="Enter password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>
                  {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ ...goldBtnStyle, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Social login */}
          <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 10, color: "var(--text-muted)", padding: "0 12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleGoogleSignIn} disabled={loading} style={{
              flex: 1, height: 44, borderRadius: 10, background: "var(--bg-surface)", border: "1px solid var(--border)",
              color: "var(--text-primary)", fontSize: 13, fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Google
            </button>
            <button onClick={handleAppleSignIn} disabled={loading} style={{
              flex: 1, height: 44, borderRadius: 10, background: "var(--bg-surface)", border: "1px solid var(--border)",
              color: "var(--text-primary)", fontSize: 13, fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Apple
            </button>
          </div>

          {/* Demo accounts — compact row */}
          <div style={{ marginTop: 24, padding: "12px 16px", borderRadius: 10, background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 8 }}>Quick Demo Access</p>
            <div style={{ display: "flex", gap: 6 }}>
              {demoUsers.map(u => (
                <button key={u.label} onClick={() => handleDemoLogin(u.email, u.pass)}
                  style={{
                    flex: 1, padding: "8px 4px", borderRadius: 8, cursor: "pointer",
                    background: loginEmail === u.email ? "var(--gold-10)" : "transparent",
                    border: `1px solid ${loginEmail === u.email ? "var(--gold)" : "var(--border)"}`,
                    color: loginEmail === u.email ? "var(--gold)" : "var(--text-muted)",
                    fontSize: 11, fontWeight: 600, textAlign: "center",
                  }}>
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--text-muted)" }}>
            No account? <button onClick={() => { setMode("register"); setError(""); }} style={{ color: "var(--gold)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Register</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
