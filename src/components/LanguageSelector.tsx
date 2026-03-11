import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const langs = [
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "pt", flag: "🇵🇹", label: "PT" },
  { code: "es", flag: "🇪🇸", label: "ES" },
  { code: "fr", flag: "🇫🇷", label: "FR" },
];

const LanguageSelector = ({ compact = false }: { compact?: boolean }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = langs.find((l) => i18n.language?.startsWith(l.code)) || langs[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-all hover:bg-white/5 border border-transparent hover:border-white/10"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        <span className="text-base">{current.flag}</span>
        {!compact && <span className="text-xs tracking-wider font-medium">{current.label}</span>}
        <span className="text-[10px] opacity-50">▾</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 min-w-[120px] rounded-lg overflow-hidden z-50 border border-white/10 shadow-xl"
          style={{ background: "rgba(10,22,40,0.98)", backdropFilter: "blur(20px)" }}
        >
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                i18n.changeLanguage(l.code);
                setOpen(false);
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm transition-all hover:bg-white/5"
              style={{
                color: i18n.language?.startsWith(l.code) ? "hsl(var(--primary))" : "rgba(255,255,255,0.7)",
                background: i18n.language?.startsWith(l.code) ? "hsla(var(--primary) / 0.08)" : "transparent",
              }}
            >
              <span className="text-base">{l.flag}</span>
              <span className="font-medium">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
