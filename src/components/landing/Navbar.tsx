import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard, ArrowRight, Sun, Moon, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "react-i18next";

const navLinks: [string, string][] = [
  ["How It Works", "/how-it-works"],
  ["Packs", "/packs"],
  ["For Companies", "/for-companies"],
  ["Contact", "/contact"],
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { isAuthenticated, currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("pt") ? "PT" : "EN";
  const switchLang = (lang: string) => {
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  const dashboardLink =
    currentUser?.role === "company_admin" ? "/empresa" :
    currentUser?.role === "admin" ? "/admin/dashboard" :
    currentUser?.role === "professor" ? "/professor/dashboard" :
    "/app";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        height: 64,
        background: scrolled ? "rgba(10,10,15,0.97)" : "rgba(10,10,15,0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${scrolled ? "var(--border-gold)" : "transparent"}`,
      }}
    >
      <div
        className="max-w-7xl mx-auto px-6 md:px-16 h-16"
        style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <span
            className="font-sans font-bold text-lg uppercase transition-colors duration-200"
            style={{ letterSpacing: "6px", color: "var(--text-primary)" }}
          >
            VOICE<sup style={{ color: "var(--gold)", fontSize: "12px" }}>3</sup>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(([label, href]) => (
            <Link
              key={href}
              to={href}
              className="text-sm transition-colors duration-300"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3 justify-end">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors"
              style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            >
              <Globe className="h-3.5 w-3.5" />
              {currentLang}
            </button>
            {langOpen && (
              <div
                className="absolute top-full right-0 mt-1 rounded-lg py-1 min-w-[80px] z-50"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
              >
                <button
                  onClick={() => switchLang("en")}
                  className="w-full text-left px-3 py-1.5 text-xs transition-colors"
                  style={{ color: currentLang === "EN" ? "var(--gold)" : "var(--text-secondary)" }}
                >
                  English
                </button>
                <button
                  onClick={() => switchLang("pt")}
                  className="w-full text-left px-3 py-1.5 text-xs transition-colors"
                  style={{ color: currentLang === "PT" ? "var(--gold)" : "var(--text-secondary)" }}
                >
                  Portugues
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
            style={{ border: "1px solid var(--border)" }}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5" style={{ color: "var(--gold)" }} />
            ) : (
              <Moon className="h-3.5 w-3.5" style={{ color: "var(--text-secondary)" }} />
            )}
          </button>

          {isAuthenticated ? (
            <>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {currentUser?.name?.split(" ")[0]}
              </span>
              <Button
                size="sm"
                className="font-semibold rounded-md transition-all duration-300"
                style={{ background: "var(--gold)", color: "#000", border: "none" }}
                asChild
              >
                <Link to={dashboardLink}>
                  <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Platform
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm transition-colors duration-300"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                Sign In
              </Link>
              <Button
                size="sm"
                className="font-semibold rounded-md px-5 transition-all duration-300 hover:brightness-110"
                style={{ background: "var(--gold)", color: "#000", border: "none" }}
                asChild
              >
                <Link to="/auth?mode=register">
                  Apply Now <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden justify-self-end"
          style={{ color: "var(--text-primary)" }}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="md:hidden"
          style={{
            background: "rgba(10,10,15,0.98)",
            borderTop: "1px solid var(--border-gold)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-3">
            {navLinks.map(([label, href]) => (
              <Link
                key={href}
                to={href}
                className="block text-sm py-2 transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 flex gap-3">
              {isAuthenticated ? (
                <Button
                  size="sm"
                  className="flex-1 font-semibold rounded-md"
                  style={{ background: "var(--gold)", color: "#000" }}
                  asChild
                >
                  <Link to={dashboardLink} onClick={() => setOpen(false)}>
                    <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Platform
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-md"
                    style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
                    asChild
                  >
                    <Link to="/auth" onClick={() => setOpen(false)}>Sign In</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 font-semibold rounded-md"
                    style={{ background: "var(--gold)", color: "#000" }}
                    asChild
                  >
                    <Link to="/auth?mode=register" onClick={() => setOpen(false)}>
                      Apply Now
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
