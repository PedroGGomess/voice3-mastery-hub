import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  BookOpen, Brain, MessageCircle, GraduationCap, User, HelpCircle, LogOut, Search, Bell,
} from "lucide-react";
import SidebarRight from "./SidebarRight";

const navItems = [
  { to: "/app", icon: BookOpen, label: "Meu Curso", end: true },
  { to: "/app/sessoes", icon: Brain, label: "Sessões" },
  { to: "/app/chat", icon: MessageCircle, label: "Chat AI" },
  { to: "/app/aulas", icon: GraduationCap, label: "Aulas" },
  { to: "/app/perfil", icon: User, label: "Perfil" },
  { to: "/app/suporte", icon: HelpCircle, label: "Suporte" },
];

const PlatformLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="h-16 shrink-0 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center px-4 gap-4 z-20">
        {/* Logo */}
        <div className="w-16 shrink-0 flex items-center justify-center">
          <span className="text-base font-bold tracking-tight text-white">
            V<span className="text-primary">3</span>
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-white/40 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
          />
        </div>

        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Bell className="h-4 w-4 text-white/70" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xs font-bold text-white">
              U
            </div>
            <span className="text-sm text-white/80 hidden sm:block">Utilizador</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left icon sidebar */}
        <aside className="w-16 shrink-0 border-r border-border/50 bg-card/30 hidden lg:flex flex-col items-center py-4 gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={item.label}
              className={({ isActive }) =>
                `w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? "bg-primary/20 text-primary shadow-sm shadow-primary/20"
                    : "text-white/40 hover:text-white/80 hover:bg-white/10"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
            </NavLink>
          ))}
          <div className="flex-1" />
          <button
            title="Sair"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-all"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-4xl mx-auto">
            {children}
          </div>
        </main>

        {/* Right sidebar */}
        <aside className="w-72 shrink-0 border-l border-border/50 bg-card/30 hidden xl:block overflow-auto">
          <SidebarRight />
        </aside>
      </div>
    </div>
  );
};

export default PlatformLayout;
