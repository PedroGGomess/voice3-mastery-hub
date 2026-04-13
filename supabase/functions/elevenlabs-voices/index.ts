import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Curated voices recommended for executive coaching
const RECOMMENDED_VOICE_IDS = [
  "21m00Tcm4TlvDq8ikWAM", // Rachel
  "29vD33N1CtxCmqQRPOHJ", // Drew
  "EXAVITQu4vr4xnSDxMaL", // Sarah
  "ErXwobaYiN019PkySvjV", // Antoni
  "MF3mGyEYCl7XYWbV9V6O", // Emily
  "TxGEqnHWrfWFTfGW9XjX", // Josh
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");

    if (!apiKey) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": apiKey },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.status}`);
    }

    const data = await response.json();

    const voices = data.voices.map((v: any) => ({
      voice_id: v.voice_id,
      name: v.name,
      preview_url: v.preview_url,
      labels: v.labels || {},
      category: v.category,
      is_recommended: RECOMMENDED_VOICE_IDS.includes(v.voice_id),
    }));

    // Sort: recommended first, then alphabetical
    voices.sort((a: any, b: any) => {
      if (a.is_recommended && !b.is_recommended) return -1;
      if (!a.is_recommended && b.is_recommended) return 1;
      return a.name.localeCompare(b.name);
    });

    return new Response(JSON.stringify({ voices }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Voices Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
