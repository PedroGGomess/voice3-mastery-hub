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
STUDENT: ${profile_data.full_name || profile_data.name || "Student"} | Pack: ${
          profile_data.pack || "Pro"
        } | Level: ${eval_data?.level || "B2"} | Style: ${
          eval_data?.teaching_style || "Balanced"
        }
WEAK AREAS: ${JSON.stringify(eval_data?.weak_points || {})}
AI CONCLUSIONS: ${eval_data?.ai_conclusions || "Diagnostic not completed"}`
      : "";

    const prompts: Record<string, string> = {
      chat: `You are VOICE³ AI Coach — elite executive English trainer.\n${studentCtx}\nBe direct, personalised, results-oriented. Focus on weak areas. Keep responses concise and actionable.`,
      "rescue-mode": `You are VOICE³ Emergency Meeting Coach.\n${studentCtx}\nMeeting: ${
        context?.meetingType || "General"
      }. Topic: ${
        context?.topic
      }.\nRespond in EXACT structure:\n## 🎯 3 Key Messages\n## 🗣️ Opening Line\n## ⚡ Power Phrases (5)\n## ⚠️ Watch Out For (2)\n## 🔚 Closing Statement\nMilitary precision. No generic advice.`,
      grammar: `You are VOICE³ Grammar Expert.\n${studentCtx}\nRespond: 1.Issue 2.Rule 3.Fix 4.Executive Example 5.Quick Test`,
      "qa-gauntlet": `You are VOICE³ Q&A Gauntlet. Fire hard executive questions (board/investor/media). After each answer: brutal-but-fair feedback + next question. Focus on weak areas: ${JSON.stringify(
        eval_data?.weak_points || {}
      )}`,
      simulation: `You are VOICE³ Simulation Coach. Session: "${
        context?.sessionTitle
      }".\nAfter each response: exactly 2 lines (1 strength + 1 improvement), then next scenario.`,
      "session-feedback": `You are VOICE³ Session Evaluator. Session: "${
        context?.sessionTitle
      }". Score: ${context?.score}%.\n${studentCtx}\nStructure:\n## ✅ What You Did Well\n## 🔧 Areas to Sharpen\n## 💡 Key Insight\n## 🎯 Next Session Focus\nPersonalised only — no generic feedback.`,
      diagnostic: `Evaluate diagnostic submission. Return ONLY valid JSON:\n{"level":"B2","teaching_style":"balanced","weak_points":{"pronunciation":6,"structure":4,"vocabulary":7,"confidence":5,"filler":8,"clarity":6},"recommended_path":["structure"],"ai_conclusions":"2-3 sentences","professor_focus_points":["area1"],"suggested_drills":["drill1"]}`,
    };

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20251001",
        max_tokens: 1024,
        system: prompts[feature] || prompts["chat"],
        messages,
      }),
    });

    const aiData = await res.json();
    const msg =
      aiData.content?.[0]?.text ?? "Could not generate response.";

    if (feature === "chat" && student_id) {
      await sb.from("ai_chat_history").insert([
        {
          student_id,
          role: "user",
          content: messages[messages.length - 1].content,
          feature: "chat",
        },
        {
          student_id,
          role: "assistant",
          content: msg,
          feature: "chat",
        },
      ]);
    }

    return new Response(JSON.stringify({ message: msg }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: cors,
    });
  }
});
