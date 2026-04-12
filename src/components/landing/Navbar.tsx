import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks: [string, string][] = [
  ["Como Funciona", "/how-it-works"],
  ["Packs", "/packs"],
  ["Para Empresas", "/for-companies"],
  ["Contacto", "/contact"],
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, currentUser } = useAuth();

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
        borderBottom: `1px solid ${scrolled ? "rgba(212,168,83,0.1)" : "transparent"}`,
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
            style={{ letterSpacing: "6px", color: "#F5F5F5" }}
          >
            VOICE<sup style={{ color: "#D4A853", fontSize: "12px" }}>3</sup>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(([label, href]) => (
            <Link
              key={href}
              to={href}
              className="text-sm transition-colors duration-300"
              style={{ color: "#9A9AB0" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F5")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9A9AB0")}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3 justify-end">
          {isAuthenticated ? (
            <>
              <span className="text-sm" style={{ color: "#9A9AB0" }}>
                {currentUser?.name?.split(" ")[0]}
              </span>
              <Button
                size="sm"
                className="font-semibold rounded-md transition-all duration-300"
                style={{ background: "#D4A853", color: "#000", border: "none" }}
                asChild
              >
                <Link to={dashboardLink}>
                  <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Plataforma
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm transition-colors duration-300"
                style={{ color: "#9A9AB0" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F5")}
                onMouseLeave={e => (e.currentTarget.style.color = "#9A9AB0")}
              >
                Entrar
              </Link>
              <Button
                size="sm"
                className="font-semibold rounded-md px-5 transition-all duration-300 hover:brightness-110"
                style={{ background: "#D4A853", color: "#000", border: "none" }}
                asChild
              >
                <Link to="/auth?mode=register">
                  Candidatar-me <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden justify-self-end"
          style={{ color: "#F5F5F5" }}
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
            borderTop: "1px solid rgba(212,168,83,0.1)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-3">
            {navLinks.map(([label, href]) => (
              <Link
                key={href}
                to={href}
                className="block text-sm py-2 transition-colors"
                style={{ color: "#9A9AB0" }}
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
                  style={{ background: "#D4A853", color: "#000" }}
                  asChild
                >
                  <Link to={dashboardLink} onClick={() => setOpen(false)}>
                    <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Plataforma
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-md"
                    style={{ borderColor: "rgba(212,168,83,0.3)", color: "#F5F5F5" }}
                    asChild
                  >
                    <Link to="/auth" onClick={() => setOpen(false)}>Entrar</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 font-semibold rounded-md"
                    style={{ background: "#D4A853", color: "#000" }}
                    asChild
                  >
                    <Link to="/auth?mode=register" onClick={() => setOpen(false)}>
                      Candidatar-me
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
