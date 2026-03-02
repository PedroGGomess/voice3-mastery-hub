import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalendarWidget from "./CalendarWidget";

const SidebarRight = () => {
  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto">
      {/* Branding */}
      <div className="flex items-center gap-2.5 px-2 py-3">
        <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
          <Brain className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-bold text-white tracking-wide">brainhacking</span>
      </div>

      {/* Calendar card */}
      <div className="rounded-2xl bg-white/5 border border-white/10 flex-1">
        <div className="px-4 pt-4 pb-2 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">Próximas Sessões</h3>
          <p className="text-xs text-white/40 mt-0.5">Agenda e calendário</p>
        </div>

        <CalendarWidget />

        <div className="p-4 flex gap-2 border-t border-white/10">
          <Button
            size="sm"
            className="flex-1 h-8 text-xs bg-primary/20 text-primary hover:bg-primary/30 border-0"
          >
            Ver Agenda
          </Button>
          <Button
            size="sm"
            className="flex-1 h-8 text-xs bg-white/5 text-white/60 hover:bg-white/10 border-0"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
