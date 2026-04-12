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
    let learning_profile = null;

    if (student_id) {
      const [profileRes, evalRes, learningRes] = await Promise.all([
        sb.from("profiles").select("*").eq("id", student_id).single(),
        sb.from("ai_evaluations").select("*").eq("student_id", student_id).single(),
        sb.from("student_learning_profiles").select("*").eq("student_id", student_id).single(),
      ]);
      profile_data = profileRes.data;
      eval_data = evalRes.data;
      learning_profile = learningRes.data;
    }

    const studentCtx = profile_data
      ? `
STUDENT: ${profile_data.name || "Student"} | Pack: ${profile_data.pack || "Pro"} | Level: ${eval_data?.level || "B2"} | Style: ${eval_data?.teaching_style || "Balanced"}
WEAK AREAS: ${JSON.stringify(eval_data?.weak_points || {})}
AI CONCLUSIONS: ${eval_data?.ai_conclusions || "Diagnostic not completed"}
LEARNING PROFILE: ${learning_profile ? `Preferred style: ${learning_profile.preferred_learning_style}, Strong: ${JSON.stringify(learning_profile.strong_areas)}, Weak: ${JSON.stringify(learning_profile.weak_areas)}, Sessions: ${learning_profile.total_sessions}, Avg score: ${learning_profile.avg_score}` : "No learning profile yet — observe and adapt"}`
      : "";

    const prompts: Record<string, string> = {
      chat: `You are VOICE³ AI Coach — elite executive English trainer for Portuguese-speaking professionals.\n${studentCtx}\nBe direct, personalised, results-oriented. Focus on weak areas. Keep responses concise and actionable. You may respond in Portuguese when the student writes in Portuguese, but always teach English content. Use markdown formatting for clarity.`,
      
      "rescue-mode": `You are VOICE³ Emergency Meeting Coach.\n${studentCtx}\nMeeting: ${context?.meetingType || "General"}. Topic: ${context?.topic}.\nRespond in EXACT structure:\n## 🎯 3 Key Messages\n## 🗣️ Opening Line\n## ⚡ Power Phrases (5)\n## ⚠️ Watch Out For (2)\n## 🔚 Closing Statement\nMilitary precision. No generic advice.`,
      
      grammar: `You are VOICE³ Grammar Expert.\n${studentCtx}\nRespond: 1.Issue 2.Rule 3.Fix 4.Executive Example 5.Quick Test`,
      
      "qa-gauntlet": `You are VOICE³ Q&A Gauntlet. Fire hard executive questions (board/investor/media). After each answer: brutal-but-fair feedback + next question. Focus on weak areas: ${JSON.stringify(eval_data?.weak_points || {})}`,
      
      simulation: `You are VOICE³ AI Professor — an elite executive English communication coach.\n${studentCtx}\nSession: "${context?.sessionTitle}".\nScenario: "${context?.scenario || ""}"\n\nYou ARE the professor. Act as a demanding but supportive executive communication coach. After each student response:\n1. Give specific, actionable feedback (what was good, what to improve)\n2. Correct any grammar or vocabulary issues with the corrected version\n3. Suggest a more executive/professional way to phrase their response\n4. Present the next challenge or follow-up question\n\nADAPT to the student's learning profile:\n- If they struggle with grammar, focus corrections there\n- If vocabulary is weak, introduce power phrases\n- If confidence is low, be more encouraging\n- Track patterns across exchanges to give increasingly targeted feedback\n\nBe encouraging but honest. Use real-world executive scenarios. Push them to use transition phrases, hedging language, and professional register. Keep exchanges focused and practical.`,
      
      "session-feedback": `You are VOICE³ Session Evaluator. Session: "${context?.sessionTitle}". Score: ${context?.score}%.\n${studentCtx}\nStructure:\n## ✅ What You Did Well\n## 🔧 Areas to Sharpen\n## 💡 Key Insight\n## 🎯 Next Session Focus\nPersonalised only — no generic feedback.`,
      
      "generate-report": `You are VOICE³ AI Evaluator. Analyse this conversation from a practice session and generate a structured evaluation report.

Session: "${context?.sessionTitle}"
${studentCtx}

CONVERSATION TO EVALUATE:
${JSON.stringify(context?.conversation || [])}

You MUST respond with ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "grammar_score": <0-100>,
  "vocabulary_score": <0-100>,
  "fluency_score": <0-100>,
  "confidence_score": <0-100>,
  "overall_score": <0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "learning_style_detected": "<visual|auditory|kinesthetic|reading|balanced>",
  "recommendations": ["rec1", "rec2", "rec3"],
  "professor_prep_notes": "2-3 paragraph briefing for the human professor about this student's performance, patterns, and what to focus on in their next live lesson. Include specific examples from the conversation.",
  "next_session_suggestions": ["suggestion1", "suggestion2"]
}

Be precise and data-driven. Base scores on actual evidence from the conversation.`,

      "professor-prep": `You are VOICE³ AI teaching assistant preparing a lesson briefing for a human professor.\n${studentCtx}\n\nBased on the student's learning profile, recent session reports, and evaluation data, prepare a comprehensive lesson plan briefing:\n\n## 📋 Student Overview\nSummarise the student's current level, strengths, and challenges.\n\n## 🎯 Recommended Lesson Focus\nTop 3 areas to work on in the next live session with specific exercises.\n\n## 📝 Suggested Activities\n3-4 concrete activities the professor can use, tailored to this student.\n\n## ⚠️ Watch Points\nSpecific patterns or recurring mistakes the professor should address.\n\n## 💡 Teaching Approach\nHow this student learns best based on AI observations.\n\nBe specific and actionable. Reference actual data from the student's profile.`,

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
          status: 429, headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      if (res.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact support." }), {
          status: 402, headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      const errText = await res.text();
      console.error("AI gateway error:", res.status, errText);
      throw new Error(`AI gateway error: ${res.status}`);
    }

    const aiData = await res.json();
    const msg = aiData.choices?.[0]?.message?.content ?? "Could not generate response.";

    // For generate-report feature, save the report to database
    if (feature === "generate-report" && student_id) {
      try {
        const reportData = JSON.parse(msg);
        
        // Save session report
        await sb.from("ai_session_reports").insert({
          student_id,
          session_title: context?.sessionTitle || "Practice Session",
          session_type: context?.sessionType || "ai_practice",
          grammar_score: reportData.grammar_score,
          vocabulary_score: reportData.vocabulary_score,
          fluency_score: reportData.fluency_score,
          confidence_score: reportData.confidence_score,
          overall_score: reportData.overall_score,
          strengths: reportData.strengths,
          weaknesses: reportData.weaknesses,
          learning_style_detected: reportData.learning_style_detected,
          recommendations: reportData.recommendations,
          professor_prep_notes: reportData.professor_prep_notes,
          next_session_suggestions: reportData.next_session_suggestions,
          raw_conversation: context?.conversation || [],
        });

        // Update or create learning profile
        const { data: existing } = await sb
          .from("student_learning_profiles")
          .select("*")
          .eq("student_id", student_id)
          .single();

        if (existing) {
          const newTotal = (existing.total_sessions || 0) + 1;
          const newAvg = (((existing.avg_score || 0) * (existing.total_sessions || 0)) + reportData.overall_score) / newTotal;
          
          await sb.from("student_learning_profiles")
            .update({
              preferred_learning_style: reportData.learning_style_detected,
              strong_areas: reportData.strengths,
              weak_areas: reportData.weaknesses,
              total_sessions: newTotal,
              avg_score: Math.round(newAvg * 100) / 100,
              last_session_at: new Date().toISOString(),
              ai_teaching_notes: reportData.professor_prep_notes,
              updated_at: new Date().toISOString(),
            })
            .eq("student_id", student_id);
        } else {
          await sb.from("student_learning_profiles").insert({
            student_id,
            preferred_learning_style: reportData.learning_style_detected,
            strong_areas: reportData.strengths,
            weak_areas: reportData.weaknesses,
            total_sessions: 1,
            avg_score: reportData.overall_score,
            last_session_at: new Date().toISOString(),
            ai_teaching_notes: reportData.professor_prep_notes,
          });
        }
      } catch (parseErr) {
        console.error("Failed to parse/save report:", parseErr);
      }
    }

    return new Response(JSON.stringify({ message: msg }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("ai-coach error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
