import { useEffect, useState } from "react";

interface TourOverlayProps {
  active: boolean;
  step: number;
  steps: { target: string; title: string; description: string; position: string }[];
  next: () => void;
  skip: () => void;
}

const TourOverlay = ({ active, step, steps, next, skip }: TourOverlayProps) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!active) return;
    const current = steps[step];
    const el = document.querySelector(current.target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setRect(el.getBoundingClientRect()), 300);
    } else {
      setRect(null);
    }
  }, [active, step, steps]);

  if (!active) return null;

  const current = steps[step];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998]"
        style={{ background: "rgba(0,0,0,0.6)", pointerEvents: "auto" }}
        onClick={skip}
      />

      {/* Highlight */}
      {rect && (
        <div
          className="fixed z-[9999] rounded-lg pointer-events-none"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            border: "2px solid hsl(var(--primary))",
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.5), 0 0 20px hsla(var(--primary) / 0.3)",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed z-[10000] w-80 p-5 rounded-xl border border-primary/30 shadow-2xl"
        style={{
          background: "hsl(var(--card))",
          top: rect ? rect.bottom + 12 : "50%",
          left: rect ? Math.min(rect.left, window.innerWidth - 340) : "50%",
          transform: rect ? undefined : "translate(-50%, -50%)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {step + 1} / {steps.length}
          </span>
        </div>
        <h3 className="text-base font-bold text-foreground mb-1.5">{current.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{current.description}</p>
        <div className="flex items-center justify-between">
          <button
            onClick={skip}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
          <button
            onClick={next}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {step === steps.length - 1 ? "Let's go! 🚀" : "Next →"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TourOverlay;
