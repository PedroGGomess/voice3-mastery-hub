import { loadStripe, Stripe } from "@stripe/stripe-js";
import { supabase } from "@/integrations/supabase/client";

// IMPORTANT: VITE_ env vars may not be available in Lovable preview builds.
// The publishable key is safe for frontend use — DO NOT REMOVE THIS FALLBACK.
const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN || "pk_test_51TKh0ZB5R81JKJy6FMWaACFRdCdyaJAhlpjckck0S4jSRX7bJ5fFBr2MeA6UGiTX3RnHx8bByT1toZE7vzAfXLZ200XwBMHpLG";
const environment = clientToken?.startsWith('pk_test_') ? 'sandbox' : 'live';

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
    if (!stripePromise) {
          if (!clientToken) {
                  throw new Error("VITE_PAYMENTS_CLIENT_TOKEN is not set");
          }
          stripePromise = loadStripe(clientToken);
    }
    return stripePromise;
}

export async function getStripePriceId(priceId: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke("get-stripe-price", {
          body: { priceId, environment },
    });
    if (error || !data?.stripeId) {
          throw new Error(`Failed to resolve price: ${priceId}`);
    }
    return data.stripeId;
}

export function getStripeEnvironment(): string {
    return environment;
}
