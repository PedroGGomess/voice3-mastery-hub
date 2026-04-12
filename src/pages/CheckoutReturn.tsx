import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0a1628" }}>
      <PaymentTestModeBanner />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          {sessionId ? (
            <>
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#F4F2ED] mb-3">Pagamento Concluído!</h1>
              <p className="text-[#8E96A3] mb-8">O teu pack foi ativado com sucesso. Já podes começar a tua jornada VOICE³.</p>
              <Button asChild className="bg-[#C9A84C] text-[#0B1A2A] hover:bg-[#d4b56a] rounded-xl h-12 px-8">
                <Link to="/app">
                  Ir para o Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <h1 className="font-serif text-3xl font-bold text-[#F4F2ED] mb-3">Sessão Não Encontrada</h1>
              <p className="text-[#8E96A3] mb-8">Não foi possível encontrar informação sobre este pagamento.</p>
              <Button asChild variant="outline" className="rounded-xl border-[#C9A84C]/30 text-[#C9A84C]">
                <Link to="/packs">Ver Packs</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
