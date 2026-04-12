import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!stripeKey || !webhookSecret) {
    return new Response("Stripe not configured", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id || session.client_reference_id;
    const pack = session.metadata?.pack;
    const sessionsIncluded = parseInt(session.metadata?.sessions_included || "0");

    if (userId && pack) {
      // Record payment in profiles
      const { error: profileError } = await sb
        .from("profiles")
        .update({
          pack: pack,
          payment_status: "paid",
          stripe_session_id: session.id,
          stripe_customer_id: session.customer as string,
          paid_at: new Date().toISOString(),
          sessions_remaining: sessionsIncluded,
        })
        .eq("id", userId);

      if (profileError) {
        console.error("Error updating profile:", profileError);
      }

      // Insert payment record
      const { error: paymentError } = await sb
        .from("payments")
        .insert({
          user_id: userId,
          pack: pack,
          amount: session.amount_total,
          currency: session.currency,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string,
          status: "completed",
        });

      if (paymentError) {
        console.error("Error inserting payment:", paymentError);
      }

      console.log(`Payment recorded for user ${userId}, pack: ${pack}`);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
