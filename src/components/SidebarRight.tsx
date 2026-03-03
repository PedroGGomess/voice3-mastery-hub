import { Button } from "@/components/ui/button";
import CalendarWidget from "./CalendarWidget";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const SidebarRight = () => {
  const { currentUser } = useAuth();

  const initials = (currentUser?.name || "U")
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto">
      {/* User profile */}
      <div className="flex items-center gap-3 px-2 py-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-full border-2 border-[#B89A5A]/50 bg-[#B89A5A]/10 flex items-center justify-center text-sm font-bold text-[#B89A5A] shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#F4F2ED] truncate">{currentUser?.name || "Utilizador"}</p>
          <p className="text-xs text-[#8E96A3] truncate">{currentUser?.pack || "Pack Pro"}</p>
        </div>
      </div>

      {/* Quick Tools */}
      <div>
        <p className="text-[10px] text-[#8E96A3]/50 uppercase tracking-[0.15em] font-medium mb-2 px-1">
          Quick Tools
        </p>
        <div className="flex flex-col gap-1.5">
          <Link
            to="/app/toolkit/rescue-mode"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1C1F26] border border-white/5 hover:border-[#B89A5A]/20 text-xs text-[#F4F2ED] hover:text-[#B89A5A] transition-all font-medium"
          >
            <span>🚨</span>
            Rescue Mode
          </Link>
          <Link
            to="/app/toolkit/grammar"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1C1F26] border border-white/5 hover:border-[#B89A5A]/20 text-xs text-[#F4F2ED] hover:text-[#B89A5A] transition-all font-medium"
          >
            <span>📚</span>
            Grammar
          </Link>
          <Link
            to="/app/practice/hostile-qa"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1C1F26] border border-white/5 hover:border-[#B89A5A]/20 text-xs text-[#F4F2ED] hover:text-[#B89A5A] transition-all font-medium"
          >
            <span>🔥</span>
            Q&amp;A Gauntlet
          </Link>
        </div>
      </div>

      {/* Calendar card */}
      <div className="rounded-xl bg-white/5 border border-white/5 flex-1">
        <div className="px-4 pt-4 pb-2 border-b border-white/5">
          <h3 className="text-sm font-semibold text-[#F4F2ED]">Próximas Sessões</h3>
          <p className="text-xs text-[#8E96A3] mt-0.5">Agenda e calendário</p>
        </div>

        <CalendarWidget />

        <div className="p-3 flex gap-2 border-t border-white/5">
          <Button
            size="sm"
            className="flex-1 h-8 text-xs bg-[#B89A5A]/10 text-[#B89A5A] hover:bg-[#B89A5A]/20 border-0"
            asChild
          >
            <Link to="/app/aulas">Ver Agenda</Link>
          </Button>
          <Button
            size="sm"
            className="flex-1 h-8 text-xs bg-white/5 text-white/50 hover:bg-white/10 border-0"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
