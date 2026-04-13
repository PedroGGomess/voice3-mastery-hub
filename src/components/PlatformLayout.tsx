import { ReactNode, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useScrollReset } from "@/hooks/useScrollReset";
import {
  LayoutDashboard, BookOpen, FileText, BarChart2, Phone, MessageCircle,
  GraduationCap, User, HelpCircle, LogOut, Bell, Menu, Trophy,
  Library, Wrench, Swords, Sun, Moon,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import SidebarRight from "./SidebarRight";
import { useAuth } from "@/contexts/AuthContext";
import NotificationPanel from "./NotificationPanel";
import { useNotifications } from "@/hooks/use-notifications";
import { useTheme } from "@/contexts/ThemeContext";

type NavItem =
  | { type: "separator"; label: string }
  | { type: "link"; to: string; icon: LucideIcon; label: string; tourKey?: string; end?: boolean };

const navItems: NavItem[] = [
  { type: "link", to: "/app", icon: LayoutDashboard, label: "Dashboard", tourKey: "dashboard", end: true },
  { type: "separator", label: "LEARN" },
  { type: "link", to: "/capitulos", icon: BookOpen, label: "My Programme", tourKey: "programme" },
  { type: "link", to: "/app/programmes", icon: Library, label: "All Programmes" },
  { type: "separator", label: "PRACTICE" },
  { type: "link", to: "/app/toolkit", icon: Wrench, label: "Toolkit", tourKey: "toolkit" },
  { type: "link", to: "/app/practice", icon: Swords, label: "Practice Arena" },
  { type: "separator", label: "PROGRESS" },
  { type: "link", to: "/app/desempenho", icon: BarChart2, label: "Performance", tourKey: "progress" },
  { type: "link", to: "/app/voice-dna", icon: Trophy, label: "Voice DNA" },
  { type: "separator", label: "COACHING" },
  { type: "link", to: "/app/aulas", icon: GraduationCap, label: "Live Classes" },
  { type: "link", to: "/app/materiais", icon: FileText, label: "Materials" },
];

const professorNavItems: NavItem[] = [
  { type: "link", to: "/professor/dashboard", icon: LayoutDashboard, label: "dash.dashboard", end: true },
  { type: "separator", label: "MANAGEMENT" },
  { type: "link", to: "/professor/dashboard", icon: GraduationCap, label: "My Students" },
  { type: "separator", label: "ACCOUNT" },
  { type: "link", to: "/app/perfil", icon: User, label: "dash.profile" },
  { type: "link", to: "/app/suporte", icon: HelpCircle, label: "dash.support" },
];

const PlatformLayout = ({ children }: { children: ReactNode }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { unreadCount } = useNotifications(currentUser?.id || "");
  useScrollReset();

  const isCoach = currentUser?.role === "professor" || currentUser?.role === "admin";
  const activeNavItems = isCoach ? professorNavItems : navItems;

  const initials = (currentUser?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <>
      {/* Logo → landing */}
      <div className="px-6 py-6 border-b" style={{ borderColor: "var(--border)" }}>
        <Link to="/" className="inline-block">
          <span className="font-sans font-bold tracking-[0.2em] text-foreground uppercase text-lg cursor-pointer hover:opacity-80 transition-opacity" style={{ color: "var(--text-primary)" }}>
            VOICE<sup className="text-sm" style={{ color: "var(--gold)" }}>³</sup>
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
                className="text-[10px] tracking-[0.15em] uppercase px-3 pt-4 pb-1"
                style={{ color: "var(--text-muted)" }}
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
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? "rgba(201, 168, 76, 0.1)" : "transparent",
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style={{ background: "var(--gold)" }} />
                  )}
                  <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "" : "text-muted-foreground group-hover:text-foreground"}`} style={{ color: isActive ? "var(--gold)" : undefined }} />
                  <span className="font-medium flex-1">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t p-4 space-y-2" style={{ borderColor: "var(--border)" }}>
        {/* User info — clickable to profile */}
        <NavLink
          to="/app/perfil"
          onClick={() => setMobileSidebarOpen(false)}
          className="flex items-center gap-3 px-2 py-2 rounded-lg transition-all"
          style={{ backgroundColor: "transparent" }}
        >
          <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0" style={{ borderColor: "var(--gold)", backgroundColor: "rgba(201, 168, 76, 0.1)", color: "var(--gold)" }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{currentUser?.name || "User"}</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>View Profile</p>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: "var(--text-secondary)", backgroundColor: "transparent" }}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-base)" }}>
      {/* Desktop sidebar */}
      <aside className="w-60 shrink-0 hidden lg:flex flex-col border-r fixed h-full z-20" style={{ backgroundColor: "var(--bg-base)", borderColor: "var(--border)" }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 flex flex-col border-r" style={{ backgroundColor: "var(--bg-base)", borderColor: "var(--border)" }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:ml-60 min-w-0">
        {/* Top Header */}
        <header className="h-14 shrink-0 border-b backdrop-blur-sm flex items-center px-4 gap-3 z-10 sticky top-0" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{ color: "var(--text-secondary)" }}
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" style={{ color: "var(--gold)" }} />
              ) : (
                <Moon className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
              )}
            </button>
            <button
              onClick={() => setNotifOpen(true)}
              className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold" style={{ borderColor: "var(--gold)", backgroundColor: "rgba(201, 168, 76, 0.1)", color: "var(--gold)" }}>
                {initials}
              </div>
              <span className="text-sm hidden sm:block" style={{ color: "var(--text-secondary)" }}>{currentUser?.name?.split(" ")[0] || "User"}</span>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden" style={{ backgroundColor: "var(--bg-base)" }}>
          <main className="flex-1 overflow-auto">
            <div className="p-6 max-w-4xl mx-auto">{children}</div>
          </main>

          <aside className="w-72 shrink-0 border-l hidden xl:block overflow-auto" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <SidebarRight />
          </aside>
        </div>
      </div>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} userId={currentUser?.id || ""} />
    </div>
  );
};

export default PlatformLayout;
