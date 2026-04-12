import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
      <PaymentTestModeBanner />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          {sessionId ? (
            <>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "var(--success-bg)" }}
              >
                <CheckCircle2 className="h-10 w-10" style={{ color: "var(--success)" }} />
              </div>
              <h1 className="font-serif text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                Payment Complete!
              </h1>
              <p className="mb-8" style={{ color: "var(--text-muted)" }}>
                Your pack has been activated successfully. You can now begin your VOICE³ journey.
              </p>
              <Button
                asChild
                className="rounded-xl h-12 px-8"
                style={{ background: "var(--gold)", color: "var(--bg-base)" }}
              >
                <Link to="/app">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "var(--error-bg)" }}
              >
                <XCircle className="h-10 w-10" style={{ color: "var(--error)" }} />
              </div>
              <h1 className="font-serif text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                Session Not Found
              </h1>
              <p className="mb-8" style={{ color: "var(--text-muted)" }}>
                We could not find information about this payment. Please contact support if you believe this is an error.
              </p>
              <Button
                asChild
                variant="outline"
                className="rounded-xl"
                style={{ borderColor: "var(--border-gold)", color: "var(--gold)" }}
              >
                <Link to="/packs">View Packs</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
