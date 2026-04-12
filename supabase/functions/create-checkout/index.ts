import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { priceId, quantity, customerEmail, userId, returnUrl, environment } = await req.json();
    if (!priceId || typeof priceId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(priceId)) {
      return new Response(JSON.stringify({ error: "Invalid priceId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const env = (environment || 'sandbox') as StripeEnv;
    const stripe = createStripeClient(env);

    // Try lookup_keys first, then fall back to searching by product name
    let stripePrice: any = null;
    const prices = await stripe.prices.list({ lookup_keys: [priceId], active: true });
    if (prices?.data?.length) {
      stripePrice = prices.data[0];
    } else {
      // Fallback: list all active prices
      try {
        const allPrices = await stripe.prices.list({ active: true, limit: 100 });
        console.log("Prices response:", JSON.stringify(allPrices));
        console.log("Prices data type:", typeof allPrices?.data, "is array:", Array.isArray(allPrices?.data));
        if (Array.isArray(allPrices?.data) && allPrices.data.length > 0) {
          // Try to expand products separately
          for (const p of allPrices.data) {
            try {
              const prod = await stripe.products.retrieve(p.product as string);
              console.log("Price", p.id, "amount:", p.unit_amount, "product:", prod.name);
              if (prod.name === priceId || prod.name.toLowerCase() === priceId.toLowerCase()) {
                stripePrice = p;
                break;
              }
            } catch (e) {
              console.log("Error retrieving product for price", p.id, e);
            }
          }
        }
      } catch (listErr) {
        console.error("Error listing prices:", listErr);
      }
    }

    if (!stripePrice) {
      return new Response(JSON.stringify({ error: `Price not found for: ${priceId}` }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const isRecurring = stripePrice.type === "recurring";

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: quantity || 1 }],
      mode: isRecurring ? "subscription" : "payment",
      ui_mode: "embedded",
      return_url: returnUrl || `${req.headers.get("origin")}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      ...(customerEmail && { customer_email: customerEmail }),
      ...(userId && {
        metadata: { userId },
        ...(isRecurring && { subscription_data: { metadata: { userId } } }),
      }),
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
