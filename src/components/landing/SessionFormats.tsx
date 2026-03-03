import { motion } from "framer-motion";
import { Video, Headphones, PenLine } from "lucide-react";

const features = [
  {
    emoji: "📹",
    icon: Video,
    title: "Video Masterclasses",
    desc: "Professional video content for each module, produced for executive learners.",
  },
  {
    emoji: "🎧",
    icon: Headphones,
    title: "Audio Training",
    desc: "Listen, repeat, master pronunciation. Designed for busy schedules.",
  },
  {
    emoji: "✍️",
    icon: PenLine,
    title: "Interactive Exercises",
    desc: "Quizzes, writing tasks, and real-time AI feedback on your performance.",
  },
];

const SessionFormats = () => {
  return (
    <section className="py-28" style={{ backgroundColor: "#0B1A2A" }} id="sessoes">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-[#B89A5A] tracking-[0.2em] uppercase text-sm mb-4 font-medium">The Experience</p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#F4F2ED]">A Premium Learning Experience</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#11263A] rounded-xl p-8 border border-[#B89A5A]/10 hover:border-[#B89A5A]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(184,154,90,0.15)] group"
            >
              <div className="text-4xl mb-6">{f.emoji}</div>
              <h3 className="font-serif text-xl font-semibold text-[#F4F2ED] mb-3">{f.title}</h3>
              <p className="text-[#8E96A3] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Section divider */}
      <div className="h-px w-full mt-8" style={{ background: 'linear-gradient(90deg, transparent, #B89A5A33, transparent)' }} />
    </section>
  );
};

export default SessionFormats;
