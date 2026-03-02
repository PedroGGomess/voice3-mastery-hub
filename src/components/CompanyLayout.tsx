import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, BarChart3, HelpCircle, Settings, LogOut } from "lucide-react";

const navItems = [
  { to: "/empresa", icon: LayoutDashboard, label: "Visão Geral", end: true },
  { to: "/empresa/alunos", icon: Users, label: "Alunos" },
  { to: "/empresa/packs", icon: CreditCard, label: "Packs & Pagamentos" },
  { to: "/empresa/progresso", icon: BarChart3, label: "Progresso" },
  { to: "/empresa/suporte", icon: HelpCircle, label: "Suporte" },
  { to: "/empresa/definicoes", icon: Settings, label: "Definições" },
];

const CompanyLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 shrink-0 border-r border-border bg-card hidden lg:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="text-lg font-bold tracking-tight">
            Voice<span className="text-primary">3</span>
            <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Empresa</span>
          </span>
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
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary w-full transition-colors">
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
