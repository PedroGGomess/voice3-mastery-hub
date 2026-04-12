€€€—import { useState, useEffect } from "react";
import { useSearchParams, Navigate, Link } from "react-router-dom";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";

const PACK_DETAILS: Record<string, { name: string; price: string }> = {
  starter_once: { name: "Starter", price: "€149" },
  pro_once: { name: "Pro", price: "€349" },
  advanced_once: { name: "Advanced", price: "€499" },
};

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const priceId = searchParams.get("price") || "starter_once";
  const pendingEmail = searchParams.get("email") || undefined;
  const pendingUserId = searchParams.get("userId") || "";
  const { currentUser, isAuthenticated, isLoading } = useAuth();

  const checkoutEmail = currentUser?.email || pendingEmail;
  const checkoutUserId = currentUser?.id || pendingUserId;
  const canCheckout = Boolean(checkoutEmail && checkoutUserId);

  const [stripeReady, setStripeReady] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(true);

  const packInfo = PACK_DETAILS[priceId] || { name: "Pack", price: "" };

  useEffect(() => {
    const loadStripeCheckout = async () => {
      try {
        const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;
        if (!clientToken) {
          setStripeError("Payment system is not configured. Please contact support.");
          setLoadingCheckout(false);
          return;
        }

        // Dynamically import the Stripe component only when needed
        const { StripeEmbeddedCheckout: StripeComponent } = await import("@/components/StripeEmbeddedCheckout");
        setStripeReady(true);
        setLoadingCheckout(false);
      } catch (err) {
        console.error("Failed to load checkout:", err);
        setStripeError("Failed to load the payment system. Please try again or contact support.");
        setLoadingCheckout(false);
      }
    };

    if (canCheckout || isAuthenticated) {
      loadStripeCheckout();
    }
  }, [canCheckout, isAuthenticated]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-base)" }}>
      <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--gold)" }} />
    </div>
  );

  if (!isAuthenticated && !canCheckout) {
    const packSlug = priceId.replace("_once", "");
    return <Navigate to={`/auth?mode=register&pack=${packSlug}`} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
      <PaymentTestModeBanner />
      <div className="container max-w-2xl py-10 px-6">
        <Link
          to="/packs"
          className="inline-flex items-center gap-2 text-sm transition-colors mb-8"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Packs
        </Link>

        <h1 className="font-serif text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Complete Your Payment
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          {packInfo.name} Pack {packInfo.price ? `— ${packInfo.price}` : ""}
        </p>

        {/* Loading state */}
        {loadingCheckout && (
          <div
            className="rounded-2xl p-12 flex flex-col items-center justify-center gap-4"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--gold)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading payment system...</p>
          </div>
        )}

        {/* Error state */}
        {stripeError && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "var(--error-bg)", border: "1px solid var(--error-border)" }}
          >
            <AlertTriangle className="h-10 w-10 mx-auto mb-4" style={{ color: "var(--error)" }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Payment System Unavailable
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>{stripeError}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/contact"
                className="h-10 px-6 rounded-lg font-semibold text-sm inline-flex items-center"
                style={{ background: "var(--gold)", color: "var(--bg-base)" }}
              >
                Contact Support
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="h-10 px-6 rounded-lg font-semibold text-sm"
                style={{ border: "1px solid var(--border-gold)", color: "var(--gold)", background: "transparent" }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Stripe checkout */}
        {stripeReady && !stripeError && (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <StripeCheckoutWrapper
              priceId={priceId}
              customerEmail={checkoutEmail}
              userId={checkoutUserId}
              returnUrl={`${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapper to lazy-load Stripe component
function StripeCheckoutWrapper(props: {
  priceId: string;
  customerEmail?: string;
  userId?: string;
  returnUrl: string;
}) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    import("@/components/StripeEmbeddedCheckout")
      .then(mod => setComponent(() => mod.StripeEmbeddedCheckout))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>
        Failed to load payment form. Please refresh the page.
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="p-12 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--gold)" }} />
      </div>
    );
  }

  return <Component {...props} />;
}
