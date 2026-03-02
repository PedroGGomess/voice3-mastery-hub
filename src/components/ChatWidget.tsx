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
            className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[480px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Voice3 Bot</p>
                  <p className="text-xs text-muted-foreground">Online agora</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)}>
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 space-y-4 overflow-y-auto min-h-[240px]">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                  <p>Olá! 👋 Sou o Voice3 Bot. Posso ajudar-te com dúvidas sobre packs, sessões ou funcionamento da plataforma.</p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreve a tua pergunta..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-sm outline-none placeholder:text-muted-foreground"
                />
                <Button size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-10 w-10 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <button className="mt-2 text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                <Headphones className="h-3 w-3" /> Falar com suporte
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors glow"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </motion.button>
    </>
  );
};

export default ChatWidget;
