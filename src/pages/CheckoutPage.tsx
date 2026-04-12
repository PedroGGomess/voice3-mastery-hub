import { useSearchParams, Navigate } from "react-router-dom";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const priceId = searchParams.get("price") || "starter_once";
  const pendingEmail = searchParams.get("email") || undefined;
  const pendingUserId = searchParams.get("userId") || "";
  const { currentUser, isAuthenticated, isLoading } = useAuth();

  const checkoutEmail = currentUser?.email || pendingEmail;
  const checkoutUserId = currentUser?.id || pendingUserId;
  const canCheckout = Boolean(checkoutEmail && checkoutUserId);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a1628" }}>
      <span className="inline-block w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated && !canCheckout) {
    const packSlug = priceId.replace("_once", "");
    return <Navigate to={`/auth?mode=register&pack=${packSlug}`} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0a1628" }}>
      <PaymentTestModeBanner />
      <div className="container max-w-2xl py-10">
        <Link to="/packs" className="inline-flex items-center gap-2 text-[#8E96A3] hover:text-[#C9A84C] mb-8 text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar aos Packs
        </Link>
        <h1 className="font-serif text-2xl font-bold text-[#F4F2ED] mb-6">Finalizar Pagamento</h1>
        <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
          <StripeEmbeddedCheckout
            priceId={priceId}
            customerEmail={checkoutEmail}
            userId={checkoutUserId}
            returnUrl={`${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`}
          />
        </div>
      </div>
    </div>
  );
}
