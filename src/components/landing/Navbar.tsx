import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard, ArrowRight } from "lucide-react";
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
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        height: 64,
        background: scrolled ? "rgba(4,10,20,0.98)" : "rgba(6,15,29,0.6)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.08)" : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
      }}>
      <div className="container h-16" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
        <Link to="/" className="flex items-center group">
          <span className="font-sans font-bold tracking-[0.2em] text-foreground uppercase text-lg transition-colors duration-200 group-hover:text-primary">
            VOICE<sup className="text-primary text-sm">3</sup>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(([key, href]) => (
            <Link key={href} to={href} className="voice-nav-link text-sm tracking-wider py-1">{t(key)}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 justify-end">
          <LanguageSelector />
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">{currentUser?.name?.split(" ")[0]}</span>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.2)]" asChild>
                <Link to={dashboardLink}><LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Plataforma</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg" asChild>
                <Link to="/auth">{t("nav.login")}</Link>
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg px-5 transition-all duration-300 hover:shadow-[0_0_24px_rgba(201,168,76,0.25)] hover:-translate-y-0.5" asChild>
                <Link to="/auth?mode=register">
                  Criar Conta <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden text-foreground justify-self-end" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-primary/10 backdrop-blur-xl" style={{ background: "rgba(6,15,29,0.98)" }}>
          <div className="container py-4 space-y-3">
            {navLinks.map(([key, href]) => (
              <Link key={href} to={href} className="block text-sm py-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setOpen(false)}>{t(key)}</Link>
            ))}
            <div className="py-2"><LanguageSelector /></div>
            <div className="pt-2 flex gap-3">
              {isAuthenticated ? (
                <Button size="sm" className="flex-1 bg-primary text-primary-foreground" asChild>
                  <Link to={dashboardLink} onClick={() => setOpen(false)}><LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Plataforma</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="flex-1 border-primary/30 text-foreground hover:bg-white/5 rounded-lg" asChild>
                    <Link to="/auth" onClick={() => setOpen(false)}>{t("nav.login")}</Link>
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary text-primary-foreground font-semibold rounded-lg" asChild>
                    <Link to="/auth?mode=register" onClick={() => setOpen(false)}>Criar Conta</Link>
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
