import { Star } from "lucide-react";

const testimonials = [
  {
    text: "VOICE³ transformed how I communicate in English with international clients. My confidence skyrocketed after just 3 sessions.",
    name: "Ana Rodrigues",
    role: "Head of Sales",
    company: "Lisbon Tech",
    initials: "AR",
  },
  {
    text: "The AI sessions give me exactly what I need, when I need it. The structured approach to executive communication is unlike anything else.",
    name: "Miguel Santos",
    role: "CFO",
    company: "Porto Ventures",
    initials: "MS",
  },
  {
    text: "Worth every cent. My team now leads meetings with international partners confidently. The ROI is clear.",
    name: "Carla Mendes",
    role: "CEO",
    company: "Braga Solutions",
    initials: "CM",
  },
];

const Testimonials = () => {
  return (
    <section style={{ backgroundColor: "#0B1A2A" }} className="py-24 border-t border-[#B89A5A]/10">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#F4F2ED] mb-4">
            What Professionals Say
          </h2>
          <p className="text-[#8E96A3] text-lg">
            Trusted by executives across Portugal and beyond.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[#1C1F26] border border-[#B89A5A]/10 rounded-xl p-8 flex flex-col gap-4 hover:border-[#B89A5A]/30 transition-colors duration-300"
            >
              <span className="font-serif text-6xl text-[#B89A5A] leading-none select-none">"</span>
              <p className="text-[#F4F2ED]/80 leading-relaxed text-sm flex-1">{t.text}</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#B89A5A] text-[#B89A5A]" />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-[#B89A5A]/10">
                <div className="w-10 h-10 rounded-full border border-[#B89A5A]/50 flex items-center justify-center text-[#B89A5A] font-semibold text-sm flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-[#F4F2ED] font-semibold text-sm">{t.name}</p>
                  <p className="text-[#8E96A3] text-xs">{t.role}, {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
