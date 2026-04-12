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
      // Fallback: list all active prices and match by product name or metadata
      const allPrices = await stripe.prices.list({ active: true, limit: 100, expand: ['data.product'] });
      console.log("All prices:", JSON.stringify(allPrices?.data?.map((p: any) => ({ 
        id: p.id, 
        amount: p.unit_amount,
        product_name: typeof p.product === 'object' ? p.product?.name : p.product,
        lookup_key: p.lookup_key,
        metadata: p.metadata
      }))));
      if (allPrices?.data) {
        stripePrice = allPrices.data.find((p: any) => {
          const prodName = typeof p.product === 'object' ? p.product?.name : '';
          return prodName === priceId || prodName.toLowerCase() === priceId.toLowerCase()
            || p.lookup_key === priceId
            || p.metadata?.lovable_external_id === priceId;
        });
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
