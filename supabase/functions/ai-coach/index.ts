import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { messages, feature, student_id, context } = await req.json();

    let eval_data = null;
    let profile_data = null;

    if (student_id) {
      const { data: p } = await sb
        .from("profiles")
        .select("*")
        .eq("id", student_id)
        .single();
      const { data: e } = await sb
        .from("ai_evaluations")
        .select("*")
        .eq("student_id", student_id)
        .single();
      profile_data = p;
      eval_data = e;
    }

    const studentCtx = profile_data
      ? `
STUDENT: ${profile_data.name || "Student"} | Pack: ${profile_data.pack || "Pro"} | Level: ${eval_data?.level || "B2"} | Style: ${eval_data?.teaching_style || "Balanced"}
WEAK AREAS: ${JSON.stringify(eval_data?.weak_points || {})}
AI CONCLUSIONS: ${eval_data?.ai_conclusions || "Diagnostic not completed"}`
      : "";

    const prompts: Record<string, string> = {
      chat: `You are VOICE³ AI Coach — elite executive English trainer for Portuguese-speaking professionals.\n${studentCtx}\nBe direct, personalised, results-oriented. Focus on weak areas. Keep responses concise and actionable. You may respond in Portuguese when the student writes in Portuguese, but always teach English content. Use markdown formatting for clarity.`,
      "rescue-mode": `You are VOICE³ Emergency Meeting Coach.\n${studentCtx}\nMeeting: ${context?.meetingType || "General"}. Topic: ${context?.topic}.\nRespond in EXACT structure:\n## 🎯 3 Key Messages\n## 🗣️ Opening Line\n## ⚡ Power Phrases (5)\n## ⚠️ Watch Out For (2)\n## 🔚 Closing Statement\nMilitary precision. No generic advice.`,
      grammar: `You are VOICE³ Grammar Expert.\n${studentCtx}\nRespond: 1.Issue 2.Rule 3.Fix 4.Executive Example 5.Quick Test`,
      "qa-gauntlet": `You are VOICE³ Q&A Gauntlet. Fire hard executive questions (board/investor/media). After each answer: brutal-but-fair feedback + next question. Focus on weak areas: ${JSON.stringify(eval_data?.weak_points || {})}`,
      simulation: `You are VOICE³ AI Professor — an elite executive English communication coach.\n${studentCtx}\nSession: "${context?.sessionTitle}".\nScenario: "${context?.scenario || ""}"\n\nYou ARE the professor. Act as a demanding but supportive executive communication coach. After each student response:\n1. Give specific, actionable feedback (what was good, what to improve)\n2. Correct any grammar or vocabulary issues with the corrected version\n3. Suggest a more executive/professional way to phrase their response\n4. Present the next challenge or follow-up question\n\nBe encouraging but honest. Use real-world executive scenarios. Push them to use transition phrases, hedging language, and professional register. Keep exchanges focused and practical.`,
      "session-feedback": `You are VOICE³ Session Evaluator. Session: "${context?.sessionTitle}". Score: ${context?.score}%.\n${studentCtx}\nStructure:\n## ✅ What You Did Well\n## 🔧 Areas to Sharpen\n## 💡 Key Insight\n## 🎯 Next Session Focus\nPersonalised only — no generic feedback.`,
      diagnostic: `Evaluate diagnostic submission. Return ONLY valid JSON:\n{"level":"B2","teaching_style":"balanced","weak_points":{"pronunciation":6,"structure":4,"vocabulary":7,"confidence":5,"filler":8,"clarity":6},"recommended_path":["structure"],"ai_conclusions":"2-3 sentences","professor_focus_points":["area1"],"suggested_drills":["drill1"]}`,
    };

    const systemPrompt = prompts[feature] || prompts["chat"];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      if (res.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact support." }), {
          status: 402,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      const errText = await res.text();
      console.error("AI gateway error:", res.status, errText);
      throw new Error(`AI gateway error: ${res.status}`);
    }

    const aiData = await res.json();
    const msg = aiData.choices?.[0]?.message?.content ?? "Could not generate response.";

    return new Response(JSON.stringify({ message: msg }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("ai-coach error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
