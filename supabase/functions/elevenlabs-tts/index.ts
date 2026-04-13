import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceId, modelId } = await req.json();
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");

    if (!apiKey) {
      throw new Error("ELEVENLABS_API_KEY not configured");
    }

    if (!text || text.trim().length === 0) {
      throw new Error("Text is required");
    }

    const selectedVoice = voiceId || "21m00Tcm4TlvDq8ikWAM"; // Rachel default
    const selectedModel = modelId || "eleven_multilingual_v2";

    console.log(
      `Generating TTS: voice=${selectedVoice}, model=${selectedModel}, text length=${text.length}`
    );

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text.substring(0, 5000), // limit to 5000 chars
          model_id: selectedModel,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      throw new Error(
        `ElevenLabs API error (${response.status}): ${errorText}`
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("TTS Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
