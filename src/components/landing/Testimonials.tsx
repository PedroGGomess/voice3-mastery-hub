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
    <section style={{ backgroundColor: "#11263A" }} className="py-24 border-t border-[#B89A5A]/10">
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
              className="bg-[#0B1A2A] border border-[#B89A5A]/10 rounded-xl p-8 flex flex-col gap-4 hover:border-[#B89A5A]/30 transition-colors duration-300"
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

        {/* Video testimonial placeholder */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="relative rounded-xl overflow-hidden border border-[#B89A5A]/15 bg-[#0B1A2A] aspect-video flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.3] saturate-[0.5]"
            />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full border-2 border-[#B89A5A]/60 bg-[#B89A5A]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#B89A5A] ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-[#8E96A3] text-xs tracking-widest uppercase">Watch Executive Testimonial</p>
            </div>
          </div>
        </div>
      </div>
      {/* Section divider */}
      <div className="h-px w-full mt-8" style={{ background: 'linear-gradient(90deg, transparent, #B89A5A33, transparent)' }} />
    </section>
  );
};

export default Testimonials;
