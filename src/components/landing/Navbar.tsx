import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";

const navLinks: [string, string][] = [
  ["nav.how", "/how-it-works"],
  ["nav.packs", "/packs"],
  ["nav.companies", "/for-companies"],
  ["nav.contact", "/contact"],
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, currentUser } = useAuth();
  const { t } = useTranslation();

  const dashboardLink = currentUser?.role === "company_admin" ? "/empresa" : "/app";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        height: 64,
        background: scrolled ? "rgba(4,10,20,0.97)" : "rgba(6,15,29,0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid hsla(var(--primary) / 0.1)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
        transition: "background 0.3s, box-shadow 0.3s",
      }}
    >
      <div className="container h-16" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
        {/* Logo (left) */}
        <Link to="/" className="flex items-center">
          <span className="font-sans font-bold tracking-[0.2em] text-foreground uppercase text-lg">
            VOICE<sup className="text-primary text-sm">³</sup>
          </span>
        </Link>

        {/* Center: search bar (premium) */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(([key, href]) => (
            <Link
              key={href}
              to={href}
              className="text-sm tracking-wider py-1 transition-colors duration-200"
              style={{ color: "hsl(var(--muted-foreground))" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(var(--foreground))")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(var(--muted-foreground))")}
            >
              {t(key)}
            </Link>
          ))}
        </div>

        {/* Right: actions */}
        <div className="hidden md:flex items-center gap-3 justify-end">
          <LanguageSelector />
          {isAuthenticated ? (
            <>
              <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{currentUser?.name?.split(" ")[0]}</span>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg transition-all duration-300" asChild>
                <Link to={dashboardLink}>
                  <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Minha Plataforma
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-white/5" asChild>
                <Link to="/login">{t("nav.login")}</Link>
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg px-5 transition-all duration-300" asChild>
                <Link to="/login">{t("nav.apply")}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-foreground justify-self-end" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-primary/10 backdrop-blur-xl" style={{ background: "rgba(11,26,42,0.98)" }}>
          <div className="container py-4 space-y-3">
            {navLinks.map(([key, href]) => (
              <Link key={href} to={href} className="block text-sm py-2 text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
                {t(key)}
              </Link>
            ))}
            <div className="py-2">
              <LanguageSelector />
            </div>
            <div className="pt-2 flex gap-3">
              {isAuthenticated ? (
                <Button size="sm" className="flex-1 bg-primary text-primary-foreground" asChild>
                  <Link to={dashboardLink} onClick={() => setOpen(false)}>
                    <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Plataforma
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="flex-1 border-primary/30 text-foreground hover:bg-white/5" asChild>
                    <Link to="/login" onClick={() => setOpen(false)}>{t("nav.login")}</Link>
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary text-primary-foreground font-semibold" asChild>
                    <Link to="/login" onClick={() => setOpen(false)}>{t("nav.apply")}</Link>
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
