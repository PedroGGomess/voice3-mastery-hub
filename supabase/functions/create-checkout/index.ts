import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PACK_PRICES: Record<string, { amount: number; name: string; sessions: number }> = {
  starter: { amount: 14900, name: "VOICE³ Starter", sessions: 1 },
  pro: { amount: 34900, name: "VOICE³ Pro", sessions: 3 },
  advanced: { amount: 49900, name: "VOICE³ Advanced", sessions: 5 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Stripe não configurado. Adicione STRIPE_SECRET_KEY nas variáveis de ambiente do Supabase." }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get the authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Autenticação necessária" }),
        { status: 401, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await sb.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Utilizador não autenticado" }),
        { status: 401, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const { pack, successUrl, cancelUrl } = await req.json();

    const packInfo = PACK_PRICES[pack];
    if (!packInfo) {
      return new Response(
        JSON.stringify({ error: "Pack inválido" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        pack: pack,
        sessions_included: String(packInfo.sessions),
      },
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: packInfo.name,
              description: `${packInfo.sessions} sessão(ões) ao vivo com professor incluída(s)`,
            },
            unit_amount: packInfo.amount,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.get("origin")}/app?payment=success`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/auth?mode=register&payment=cancelled`,
    });

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Erro ao criar sessão de pagamento" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
