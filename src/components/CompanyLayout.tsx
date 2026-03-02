import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, BarChart3, HelpCircle, Settings, LogOut } from "lucide-react";
import Voice3Logo from "@/components/Voice3Logo";
import { useAuth } from "@/contexts/AuthContext";

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 shrink-0 border-r border-border bg-card hidden lg:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border gap-3">
          <Voice3Logo height={30} variant="full" />
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Empresa</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium">{currentUser?.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser?.company}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary w-full transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default CompanyLayout;
