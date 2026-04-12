import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-6xl mx-auto px-8 md:px-16 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-sans font-bold tracking-[0.25em] text-lg" style={{ color: "var(--text-primary)" }}>
                V O I C E<sup className="text-xs ml-0.5" style={{ color: "var(--gold)" }}>3</sup>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              A premium branch of Stuttaford Academy.
            </p>
            <p
              className="mt-2 text-sm italic font-serif"
              style={{ color: "var(--gold)" }}
            >
              Clarity. Control. Command.
            </p>
          </div>

          {/* Programme */}
          <div>
            <h4
              className="text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ color: "var(--gold)" }}
            >
              Programme
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>
                <Link to="/#como-funciona" className="hover:text-[var(--text-primary)] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/#metodo" className="hover:text-[var(--text-primary)] transition-colors">
                  The Method
                </Link>
              </li>
              <li>
                <Link to="/packs" className="hover:text-[var(--text-primary)] transition-colors">
                  Packs & Pricing
                </Link>
              </li>
              <li>
                <Link to="/#sessoes" className="hover:text-[var(--text-primary)] transition-colors">
                  The Experience
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ color: "var(--gold)" }}
            >
              Company
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>
                <Link to="/for-companies" className="hover:text-[var(--text-primary)] transition-colors">
                  For Companies
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[var(--text-primary)] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-[var(--text-primary)] transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ color: "var(--gold)" }}
            >
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>
                <a href="#" className="hover:text-[var(--text-primary)] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--text-primary)] transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            color: "var(--text-secondary)",
          }}
        >
          <span>
            © 2026{" "}
            <span style={{ color: "var(--gold)" }}>VOICE³</span>. All rights reserved.
          </span>
          <span className="italic font-serif" style={{ color: "var(--text-muted)" }}>
            A premium branch of Stuttaford Academy
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
