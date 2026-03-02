import { Link } from "react-router-dom";
import Voice3Logo from "@/components/Voice3Logo";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <Voice3Logo height={26} variant="full" />
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Academia de Inglês Empresarial com treino AI e aulas com professora.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Produto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</a></li>
              <li><a href="#packs" className="hover:text-foreground transition-colors">Packs</a></li>
              <li><a href="#sessoes" className="hover:text-foreground transition-colors">Sessões</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#empresas" className="hover:text-foreground transition-colors">Para Empresas</a></li>
              <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Termos de Serviço</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 Voice3. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
