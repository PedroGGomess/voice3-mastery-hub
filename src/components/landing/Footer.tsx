import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#12121A",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-6xl mx-auto px-8 md:px-16 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-sans font-bold tracking-[0.25em] text-[#F5F5F5] text-lg">
                V O I C E<sup className="text-[#D4A853] text-xs ml-0.5">3</sup>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "#9A9AB0" }}>
              A premium branch of Stuttaford Academy.
            </p>
            <p
              className="mt-2 text-sm italic font-serif"
              style={{ color: "#D4A853" }}
            >
              Clarity. Control. Command.
            </p>
          </div>

          {/* Programa */}
          <div>
            <h4
              className="text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ color: "#D4A853" }}
            >
              Programa
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "#9A9AB0" }}>
              <li>
                <Link to="/#como-funciona" className="hover:text-[#F5F5F5] transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link to="/#metodo" className="hover:text-[#F5F5F5] transition-colors">
                  O Método
                </Link>
              </li>
              <li>
                <Link to="/packs" className="hover:text-[#F5F5F5] transition-colors">
                  Packs e Preços
                </Link>
              </li>
              <li>
                <Link to="/#sessoes" className="hover:text-[#F5F5F5] transition-colors">
                  A Experiência
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4
              className="text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ color: "#D4A853" }}
            >
              Empresa
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "#9A9AB0" }}>
              <li>
                <Link to="/for-companies" className="hover:text-[#F5F5F5] transition-colors">
                  Para Empresas
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F5F5F5] transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-[#F5F5F5] transition-colors">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ color: "#D4A853" }}
            >
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "#9A9AB0" }}>
              <li>
                <a href="#" className="hover:text-[#F5F5F5] transition-colors">
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F5F5F5] transition-colors">
                  Política de Privacidade
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
            color: "#9A9AB0",
          }}
        >
          <span>
            © 2026{" "}
            <span style={{ color: "#D4A853" }}>VOICE³</span>. Todos os
            direitos reservados.
          </span>
          <span className="italic font-serif" style={{ color: "rgba(212,168,83,0.5)" }}>
            A premium branch of Stuttaford Academy
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
