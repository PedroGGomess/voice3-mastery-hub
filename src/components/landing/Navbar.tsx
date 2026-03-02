import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import Voice3Logo from "@/components/Voice3Logo";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, currentUser } = useAuth();

  const dashboardLink = currentUser?.role === "company_admin" ? "/empresa" : "/app";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center">
          <Voice3Logo height={28} variant="full" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Como funciona</a>
          <a href="#packs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Packs</a>
          <a href="#o-que-aprendes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Conteúdo</a>
          <a href="#empresas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Empresas</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">{currentUser?.name?.split(" ")[0]}</span>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg" asChild>
                <Link to={dashboardLink}><LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Minha Plataforma</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg" asChild>
                <Link to="/login">Começar</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="container py-4 space-y-3">
            <a href="#como-funciona" className="block text-sm py-2" onClick={() => setOpen(false)}>Como funciona</a>
            <a href="#packs" className="block text-sm py-2" onClick={() => setOpen(false)}>Packs</a>
            <a href="#empresas" className="block text-sm py-2" onClick={() => setOpen(false)}>Empresas</a>
            <a href="#faq" className="block text-sm py-2" onClick={() => setOpen(false)}>FAQ</a>
            <div className="pt-2 flex gap-3">
              {isAuthenticated ? (
                <Button size="sm" className="flex-1 bg-primary text-primary-foreground" asChild>
                  <Link to={dashboardLink} onClick={() => setOpen(false)}><LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Plataforma</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to="/login" onClick={() => setOpen(false)}>Entrar</Link>
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary text-primary-foreground" asChild>
                    <Link to="/login" onClick={() => setOpen(false)}>Começar</Link>
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
