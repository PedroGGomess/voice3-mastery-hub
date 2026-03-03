import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks: [string, string][] = [
  ["How It Works", "/how-it-works"],
  ["Packs", "/packs"],
  ["For Companies", "/for-companies"],
  ["Contact", "/contact"],
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, currentUser } = useAuth();

  const dashboardLink = currentUser?.role === "company_admin" ? "/empresa" : "/app";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#0B1A2A]/95 backdrop-blur-sm border-b border-[#B89A5A]/10 shadow-lg" : "bg-transparent"
    }`}>
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center">
          <span className="font-sans font-bold tracking-[0.2em] text-[#F4F2ED] uppercase text-lg">
            VOICE<sup className="text-[#B89A5A] text-sm">³</sup>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(([label, href]) => (
            <Link key={href} to={href} className="text-sm text-[#8E96A3] hover:text-[#F4F2ED] transition-colors tracking-wider">
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-[#8E96A3]">{currentUser?.name?.split(" ")[0]}</span>
              <Button size="sm" className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg" asChild>
                <Link to={dashboardLink}><LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Minha Plataforma</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-[#8E96A3] hover:text-[#F4F2ED] hover:bg-white/5" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button size="sm" className="bg-[#B89A5A] text-[#0B1A2A] hover:bg-[#d4ba6a] font-semibold rounded-lg px-5" asChild>
                <Link to="/login">Apply for VOICE³</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden text-[#F4F2ED]" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#B89A5A]/10 bg-[#0B1A2A]/98 backdrop-blur-xl">
          <div className="container py-4 space-y-3">
            {navLinks.map(([label, href]) => (
              <Link key={href} to={href} className="block text-sm py-2 text-[#8E96A3] hover:text-[#F4F2ED]" onClick={() => setOpen(false)}>{label}</Link>
            ))}
            <div className="pt-2 flex gap-3">
              {isAuthenticated ? (
                <Button size="sm" className="flex-1 bg-[#B89A5A] text-[#0B1A2A]" asChild>
                  <Link to={dashboardLink} onClick={() => setOpen(false)}><LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Plataforma</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="flex-1 border-[#B89A5A]/30 text-[#F4F2ED] hover:bg-white/5" asChild>
                    <Link to="/login" onClick={() => setOpen(false)}>Entrar</Link>
                  </Button>
                  <Button size="sm" className="flex-1 bg-[#B89A5A] text-[#0B1A2A] font-semibold" asChild>
                    <Link to="/login" onClick={() => setOpen(false)}>Apply</Link>
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
