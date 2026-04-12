import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#081520" }} className="relative border-t border-[#B89A5A]/10 overflow-hidden">
      {/* Subtle background video loop placeholder */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-[0.1] saturate-[0.3] pointer-events-none"
        aria-hidden="true"
        poster="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
      >
        <source src="" type="video/mp4" />
      </video>
      <div className="relative z-10 container py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-sans font-bold tracking-[0.2em] text-[#F4F2ED] uppercase text-xl">
                VOICE<sup className="text-[#B89A5A] text-sm">³</sup>
              </span>
            </Link>
            <p className="text-sm text-[#8E96A3] leading-relaxed mb-3">
              A premium branch of Stuttaford Academy.
            </p>
            <p className="text-xs text-[#B89A5A]/60 italic font-serif">Clarity. Control. Command.</p>
          </div>

          {/* Programme */}
          <div>
            <h4 className="text-[#B89A5A] font-semibold text-sm mb-4 tracking-wide uppercase">Programme</h4>
            <ul className="space-y-2.5 text-sm text-[#8E96A3]">
              <li><a href="#como-funciona" className="hover:text-[#F4F2ED] transition-colors">How It Works</a></li>
              <li><a href="#metodo" className="hover:text-[#F4F2ED] transition-colors">The Method</a></li>
              <li><a href="#packs" className="hover:text-[#F4F2ED] transition-colors">Packs & Pricing</a></li>
              <li><a href="#sessoes" className="hover:text-[#F4F2ED] transition-colors">The Experience</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[#B89A5A] font-semibold text-sm mb-4 tracking-wide uppercase">Company</h4>
            <ul className="space-y-2.5 text-sm text-[#8E96A3]">
              <li><a href="#empresas" className="hover:text-[#F4F2ED] transition-colors">For Companies</a></li>
              <li><a href="#faq" className="hover:text-[#F4F2ED] transition-colors">FAQ</a></li>
              <li><Link to="/auth" className="hover:text-[#F4F2ED] transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[#B89A5A] font-semibold text-sm mb-4 tracking-wide uppercase">Legal</h4>
            <ul className="space-y-2.5 text-sm text-[#8E96A3]">
              <li><a href="#" className="hover:text-[#F4F2ED] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#F4F2ED] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#B89A5A]/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8E96A3]">
          <span className="text-[#8E96A3]/70">© 2026 <span className="text-[#B89A5A]">VOICE³</span>. All rights reserved.</span>
          <span className="text-[#B89A5A]/50 italic font-serif">A premium branch of Stuttaford Academy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
