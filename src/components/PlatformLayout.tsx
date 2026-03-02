import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, Brain, MessageCircle, GraduationCap, User, HelpCircle, LogOut } from "lucide-react";
import Voice3Logo from "@/components/Voice3Logo";

const navItems = [
  { to: "/app", icon: BookOpen, label: "Meu Curso", end: true },
  { to: "/app/sessoes", icon: Brain, label: "Sessões" },
  { to: "/app/chat", icon: MessageCircle, label: "Chat AI" },
  { to: "/app/aulas", icon: GraduationCap, label: "Aulas com Professora" },
  { to: "/app/perfil", icon: User, label: "Perfil" },
  { to: "/app/suporte", icon: HelpCircle, label: "Suporte" },
];

const PlatformLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-card hidden lg:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Voice3Logo height={30} variant="full" />
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
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
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PlatformLayout;
