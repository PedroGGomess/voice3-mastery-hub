import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Navigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Voice3Logo from "@/components/Voice3Logo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading, currentUser } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to={currentUser?.role === "company_admin" ? "/empresa" : "/app"} replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      if (mode === "login") {
        const email = data.get("email") as string;
        const password = data.get("password") as string;
        await login(email, password);
        toast.success("Bem-vindo de volta!");
        // navigate happens via the isAuthenticated check re-render
      } else {
        const name = data.get("name") as string;
        const email = data.get("email") as string;
        const password = data.get("password") as string;
        const confirmPassword = data.get("confirmPassword") as string;
        const company = data.get("company") as string;
        const role = (data.get("role") as string || "student") as "student" | "company_admin";
        if (password !== confirmPassword) {
          setError("As passwords não coincidem.");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("A password deve ter pelo menos 6 caracteres.");
          setLoading(false);
          return;
        }
        await register({ name, email, password, company: company || undefined, role });
        toast.success("Conta criada com sucesso!");
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-1/2 section-dark relative items-center justify-center p-16">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            <Voice3Logo height={40} variant="full" />
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Designed for professionals who must perform.
          </p>
          <div className="space-y-4 text-white/40 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">AI</div>
              <span>Chatbot disponível 24/7 para dúvidas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">📅</div>
              <span>Aulas com professora após completar sessões</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">📊</div>
              <span>Acompanha o teu progresso em tempo real</span>
            </div>
          </div>
          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/40 mb-2">Demo rápido:</p>
            <p className="text-xs text-white/60">Aluno: demo@voice3.pt / demo123</p>
            <p className="text-xs text-white/60">Empresa: empresa@voice3.pt / empresa123</p>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Voice3Logo height={32} variant="full" />
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {mode === "login" ? "Bem-vindo de volta" : "Cria a tua conta"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {mode === "login"
              ? "Entra na tua conta para continuar o teu percurso."
              : "Regista-te para começar a treinar o teu Inglês empresarial."}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" name="name" placeholder="João Silva" required className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa (opcional)</Label>
                  <Input id="company" name="company" placeholder="Tech Corp Portugal" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Tipo de conta</Label>
                  <select
                    id="role"
                    name="role"
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="student">Aluno / Profissional</option>
                    <option value="company_admin">Administrador de Empresa</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="joao@empresa.pt" required className="h-11 rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="h-11 rounded-xl"
                />
              </div>
            )}

            {mode === "login" && (
              <div className="flex items-center gap-2">
                {/* "Remember me" — placeholder for future persistent session support */}
                <input type="checkbox" id="remember" name="remember" className="rounded" />
                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">Lembrar-me</Label>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 text-base font-medium"
            >
              {loading ? "A processar..." : mode === "login" ? "Entrar" : "Criar Conta"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Ainda não tens conta?" : "Já tens conta?"}{" "}
              <button
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                className="text-primary font-medium hover:underline"
              >
                {mode === "login" ? "Regista-te" : "Entra aqui"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
