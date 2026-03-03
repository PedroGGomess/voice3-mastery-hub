import { useState } from "react";
import { MessageCircle, X, Send, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[480px] rounded-2xl border border-[#B89A5A]/20 bg-[#1C1F26] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#B89A5A]/15 flex flex-col bg-[#0B1A2A]/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/40 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-[#B89A5A]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#F4F2ED]">VOICE³ Assistant</p>
                    <p className="text-xs text-[#8E96A3]">Online</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)}>
                  <X className="h-4 w-4 text-[#8E96A3] hover:text-[#F4F2ED] transition-colors" />
                </button>
              </div>
              <div className="mt-3 h-px bg-[#B89A5A]/20" />
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 space-y-4 overflow-y-auto min-h-[240px]">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#B89A5A]/10 border border-[#B89A5A]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="h-3.5 w-3.5 text-[#B89A5A]" strokeWidth={1.5} />
                </div>
                <div className="bg-[#0B1A2A] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#F4F2ED]/80 border border-[#B89A5A]/10">
                  <p>Welcome. I'm your VOICE³ assistant. How may I help you with your executive communication programme?</p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#B89A5A]/15 bg-[#0B1A2A]/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0B1A2A] border border-[#B89A5A]/20 text-sm text-[#F4F2ED] outline-none placeholder:text-[#8E96A3]/50 focus:border-[#B89A5A]/50 transition-colors"
                />
                <Button size="icon" className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] rounded-xl h-10 w-10 shrink-0 transition-all duration-300">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <button className="mt-2 text-xs text-[#8E96A3] hover:text-[#B89A5A] flex items-center gap-1 transition-colors">
                <Headphones className="h-3 w-3" strokeWidth={1.5} /> Contact support
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#B89A5A] text-[#0B1A2A] shadow-lg shadow-[#B89A5A]/30 flex items-center justify-center hover:bg-[#d4ba6a] transition-colors"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </motion.button>
    </>
  );
};

export default ChatWidget;
