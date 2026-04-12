import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, BarChart3, HelpCircle, Settings, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const navItems = [
  { to: "/empresa", icon: LayoutDashboard, label: "Visão Geral", end: true },
  { to: "/empresa/alunos", icon: Users, label: "Alunos" },
  { to: "/empresa/packs", icon: CreditCard, label: "Packs & Pagamentos" },
  { to: "/empresa/progresso", icon: BarChart3, label: "Progresso" },
  { to: "/empresa/suporte", icon: HelpCircle, label: "Suporte" },
  { to: "/empresa/definicoes", icon: Settings, label: "Definições" },
];

const CompanyLayout = ({ children }: { children: ReactNode }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = (currentUser?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-base)" }}>
      <aside className="w-60 shrink-0 border-r hidden lg:flex flex-col" style={{ backgroundColor: "var(--bg-base)", borderColor: "var(--border)" }}>
        {/* Logo */}
        <div className="px-6 py-6 border-b" style={{ borderColor: "var(--border)" }}>
          <span className="font-sans font-bold tracking-[0.2em] uppercase text-lg" style={{ color: "var(--text-primary)" }}>
            VOICE<sup className="text-sm" style={{ color: "var(--gold)" }}>³</sup>
          </span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full border font-medium" style={{ borderColor: "var(--border-gold)", color: "var(--gold)" }}>
            Company
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? "var(--bg-elevated)" : "transparent",
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style={{ background: "var(--gold)" }} />
                  )}
                  <item.icon
                    className="h-4 w-4 shrink-0"
                    style={{ color: isActive ? "var(--gold)" : "var(--text-secondary)" }}
                  />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t p-4 space-y-3" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors justify-center"
            style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-elevated)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--bg-surface)"}
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4" style={{ color: "var(--gold)" }} />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0" style={{ borderColor: "var(--gold)", backgroundColor: "rgba(201, 168, 76, 0.1)", color: "var(--gold)" }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--gold)" }}>Company</p>
              <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{currentUser?.company || currentUser?.name || "Company"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
            style={{ color: "var(--text-secondary)", backgroundColor: "transparent" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-surface)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default CompanyLayout;
