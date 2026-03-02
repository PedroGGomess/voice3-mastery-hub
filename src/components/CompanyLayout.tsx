import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, BarChart3, HelpCircle, Settings, LogOut } from "lucide-react";
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

  const initials = (currentUser?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0B1A2A" }}>
      <aside className="w-60 shrink-0 border-r border-white/5 hidden lg:flex flex-col" style={{ backgroundColor: "#0B1A2A" }}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5">
          <span className="font-sans font-bold tracking-[0.2em] text-[#F4F2ED] uppercase text-lg">
            VOICE<sup className="text-[#B89A5A] text-sm">³</sup>
          </span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full border border-[#B89A5A]/30 text-[#B89A5A] font-medium">
            Empresa
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
                    ? "bg-[#243A5A] text-[#B89A5A]"
                    : "text-[#8E96A3] hover:bg-[#243A5A]/60 hover:text-[#F4F2ED]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#B89A5A] rounded-r" />
                  )}
                  <item.icon
                    className={`h-4 w-4 shrink-0 ${isActive ? "text-[#B89A5A]" : "text-[#8E96A3] group-hover:text-[#F4F2ED]"}`}
                  />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-white/5 p-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full border-2 border-[#B89A5A]/50 bg-[#B89A5A]/10 flex items-center justify-center text-sm font-bold text-[#B89A5A] shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#B89A5A] font-medium tracking-wide uppercase">Empresa</p>
              <p className="text-sm text-[#F4F2ED] font-semibold truncate">{currentUser?.company || currentUser?.name || "Company"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#8E96A3] hover:bg-white/5 hover:text-white transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
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
