import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

const videos = [
  {
    src: "/videos/demo-1.mp4",
    title: "Platform Walkthrough",
    desc: "See the VOICE³ AI engine in action — real-time correction, pressure simulations and Voice DNA tracking.",
  },
  {
    src: "/videos/demo-2.mp4",
    title: "Executive Simulation",
    desc: "Watch how our AI challenges executives with hostile Q&A, boardroom pressure and tone calibration.",
  },
];

export default function VideoDemos() {
  return (
    <section className="py-20 px-6" style={{ background: "var(--bg-surface)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span
            className="text-[11px] font-semibold uppercase tracking-[3px]"
            style={{ color: "var(--gold)" }}
          >
            See It In Action
          </span>
          <h2
            className="font-serif text-3xl font-bold mt-3"
            style={{ color: "var(--text-primary)" }}
          >
            The Platform in Motion
          </h2>
          <p className="text-base mt-3 max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
            Watch how VOICE³ transforms executive communication through AI-powered simulations and real-time coaching.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video, i) => (
            <VideoCard key={i} {...video} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoCard({
  src,
  title,
  desc,
  index,
}: {
  src: string;
  title: string;
  desc: string;
  index: number;
}) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!ref.current) return;
    if (playing) {
      ref.current.pause();
    } else {
      ref.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      <div className="relative aspect-video cursor-pointer group" onClick={togglePlay}>
        <video
          ref={ref}
          src={src}
          className="w-full h-full object-cover"
          playsInline
          onEnded={() => setPlaying(false)}
        />
        {/* Play/Pause overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          style={{ opacity: playing ? 0 : 1, background: "rgba(0,0,0,0.3)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "var(--gold)", color: "var(--bg-base)" }}
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h4 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          {title}
        </h4>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
}
