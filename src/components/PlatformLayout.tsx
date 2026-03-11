import { ReactNode, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useScrollReset } from "@/hooks/useScrollReset";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard, BookOpen, FileText, BarChart2, Phone, MessageCircle,
  GraduationCap, User, HelpCircle, LogOut, Bell, Menu, Trophy,
  Library, Wrench, Swords,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import SidebarRight from "./SidebarRight";
import { useAuth } from "@/contexts/AuthContext";
import NotificationPanel from "./NotificationPanel";
import { useNotifications } from "@/hooks/use-notifications";
import LanguageSelector from "./LanguageSelector";

type NavItem =
  | { type: "separator"; label: string }
  | { type: "link"; to: string; icon: LucideIcon; label: string; tourKey?: string; end?: boolean };

const navItems: NavItem[] = [
  { type: "link", to: "/app", icon: LayoutDashboard, label: "dash.dashboard", tourKey: "dashboard", end: true },
  { type: "separator", label: "LEARN" },
  { type: "link", to: "/capitulos", icon: BookOpen, label: "dash.programme", tourKey: "programme" },
  { type: "link", to: "/app/catalogue", icon: Library, label: "dash.catalogue" },
  { type: "separator", label: "TOOLS & PRACTICE" },
  { type: "link", to: "/app/toolkit", icon: Wrench, label: "dash.toolkit", tourKey: "toolkit" },
  { type: "link", to: "/app/practice", icon: Swords, label: "dash.practice" },
  { type: "link", to: "/app/chat", icon: MessageCircle, label: "dash.coach", tourKey: "ai-coach" },
  { type: "separator", label: "PROGRESS" },
  { type: "link", to: "/app/desempenho", icon: BarChart2, label: "dash.progress", tourKey: "progress" },
  { type: "link", to: "/app/leaderboard", icon: Trophy, label: "dash.leaderboard" },
  { type: "separator", label: "SUPPORT" },
  { type: "link", to: "/app/call-professor", icon: Phone, label: "dash.live", tourKey: "live" },
  { type: "link", to: "/app/aulas", icon: GraduationCap, label: "dash.classes" },
  { type: "link", to: "/app/materiais", icon: FileText, label: "dash.materials" },
  { type: "link", to: "/app/perfil", icon: User, label: "dash.profile" },
  { type: "link", to: "/app/suporte", icon: HelpCircle, label: "dash.support" },
];

const professorNavItems: NavItem[] = [
  { type: "link", to: "/professor/dashboard", icon: LayoutDashboard, label: "dash.dashboard", end: true },
  { type: "separator", label: "GESTÃO" },
  { type: "link", to: "/professor/dashboard", icon: GraduationCap, label: "Os Meus Alunos" },
  { type: "separator", label: "CONTA" },
  { type: "link", to: "/app/perfil", icon: User, label: "dash.profile" },
  { type: "link", to: "/app/suporte", icon: HelpCircle, label: "dash.support" },
];

const PlatformLayout = ({ children }: { children: ReactNode }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { unreadCount } = useNotifications(currentUser?.id || "");
  useScrollReset();

  const isProfessor = currentUser?.role === "professor" || currentUser?.role === "admin";
  const activeNavItems = isProfessor ? professorNavItems : navItems;

  const initials = (currentUser?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <>
      {/* Logo → landing */}
      <div className="px-6 py-6 border-b border-white/5">
        <Link to="/" className="inline-block">
          <span className="font-sans font-bold tracking-[0.2em] text-foreground uppercase text-lg cursor-pointer hover:opacity-80 transition-opacity">
            VOICE<sup className="text-primary text-sm">³</sup>
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {activeNavItems.map((item, idx) => {
          if (item.type === "separator") {
            return (
              <div
                key={`sep-${idx}`}
                className="text-muted-foreground/50 text-[10px] tracking-[0.15em] uppercase px-3 pt-4 pb-1"
              >
                {item.label}
              </div>
            );
          }
          return (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              end={item.end}
              onClick={() => setMobileSidebarOpen(false)}
              data-tour={item.tourKey}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative ${
                  isActive
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r" />
                  )}
                  <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                  <span className="font-medium flex-1">{t(item.label)}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/5 p-4 space-y-3">
        {/* Language selector */}
        <div className="px-2">
          <LanguageSelector compact />
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full border-2 border-primary/50 bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary font-medium tracking-wide uppercase">Welcome</p>
            <p className="text-sm text-foreground font-semibold truncate">{currentUser?.name?.split(" ")[0] || "Utilizador"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-white/5 hover:text-white transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>{t("dash.signout")}</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="w-60 shrink-0 hidden lg:flex flex-col bg-background border-r border-white/5 fixed h-full z-20">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 flex flex-col bg-background border-r border-white/5">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:ml-60 min-w-0">
        {/* Top Header */}
        <header className="h-14 shrink-0 border-b border-border/30 bg-card/40 backdrop-blur-sm flex items-center px-4 gap-3 z-10 sticky top-0">
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center text-white/60 hover:text-white"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotifOpen(true)}
              className="relative w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Bell className="h-4 w-4 text-white/70" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <div className="w-6 h-6 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {initials}
              </div>
              <span className="text-sm text-white/70 hidden sm:block">{currentUser?.name?.split(" ")[0] || "Utilizador"}</span>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-auto">
            <div className="p-6 max-w-4xl mx-auto">{children}</div>
          </main>

          <aside className="w-72 shrink-0 border-l border-border/30 bg-card/20 hidden xl:block overflow-auto">
            <SidebarRight />
          </aside>
        </div>
      </div>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} userId={currentUser?.id || ""} />
    </div>
  );
};

export default PlatformLayout;
