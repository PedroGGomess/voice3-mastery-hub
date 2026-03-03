import { useState } from "react";
import { Bell, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { saveNotifyInterest } from "@/lib/persistence";

interface ComingSoonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string;
  moduleId: string;
  moduleType: string;
}

const ComingSoonModal = ({ open, onOpenChange, moduleName, moduleId, moduleType }: ComingSoonModalProps) => {
  const { currentUser } = useAuth();
  const [notified, setNotified] = useState(false);

  const handleNotifyMe = () => {
    if (currentUser) {
      saveNotifyInterest(currentUser.id, moduleId, moduleType);
    }
    setNotified(true);
    toast.success("You'll be notified when this unlocks!", {
      description: `We've registered your interest in "${moduleName}".`,
    });
    setTimeout(() => onOpenChange(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1F26] border border-[#B89A5A]/20 text-[#F4F2ED] max-w-md p-0 gap-0 [&>button]:hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B89A5A]/10 border border-[#B89A5A]/20 flex items-center justify-center">
              <Bell className="h-5 w-5 text-[#B89A5A]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-[#F4F2ED]">Coming Soon</h2>
              <p className="text-xs text-[#8E96A3] mt-0.5">VOICE³ Platform</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-[#8E96A3] hover:text-white shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="rounded-xl bg-[#B89A5A]/5 border border-[#B89A5A]/10 p-4">
            <p className="text-sm font-semibold text-[#F4F2ED] mb-1">{moduleName}</p>
            <p className="text-xs text-[#8E96A3] leading-relaxed">
              We're finalising this module. You'll be notified when it unlocks.
            </p>
          </div>

          <p className="text-sm text-[#8E96A3] leading-relaxed">
            Click below and we'll send you a notification the moment this becomes available.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <Button
            onClick={handleNotifyMe}
            disabled={notified}
            className="flex-1 bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold h-10"
          >
            {notified ? "✓ You're on the list!" : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Notify Me
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-[#8E96A3] hover:text-white hover:bg-white/5 h-10 px-4"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonModal;
