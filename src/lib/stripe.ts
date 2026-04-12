import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/integrations/supabase/client";

let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
  const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  if (!key) {
    console.warn("VITE_STRIPE_PUBLIC_KEY não definida");
    return null;
  }
  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export async function createCheckoutSession(pack: string): Promise<{ url: string | null; error: string | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return { url: null, error: "Tens de estar autenticado para efectuar o pagamento." };
    }

    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        pack,
        successUrl: `${window.location.origin}/app?payment=success`,
        cancelUrl: `${window.location.origin}/auth?mode=register&payment=cancelled`,
      },
    });

    if (error) {
      return { url: null, error: error.message || "Erro ao criar sessão de pagamento." };
    }

    if (data?.url) {
      return { url: data.url, error: null };
    }

    if (data?.error) {
      return { url: null, error: data.error };
    }

    return { url: null, error: "Resposta inesperada do servidor." };
  } catch (err: any) {
    return { url: null, error: err.message || "Erro de ligação ao servidor." };
  }
}
