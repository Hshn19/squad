// ============================================================
// src/app/api/parse-voice/route.js
// POST endpoint — takes voice text, returns parsed action JSON
// Using Groq (free, no credit card required)
// Test this with Postman before wiring to frontend
// ============================================================

import Groq from "groq-sdk";
import { VOICE_SYSTEM_PROMPT } from "@/lib/systemPrompt";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    // ── 1. Parse request body ──────────────────────────────
    const { text, contacts } = await request.json();

    if (!text || text.trim() === "") {
      return Response.json(
        { success: false, error: "No voice text provided" },
        { status: 400 }
      );
    }

    // ── 2. Call Groq ───────────────────────────────────────
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // free, fast, accurate
      messages: [
        {
          role: "system",
          content: VOICE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Contacts list: ${JSON.stringify(contacts || [])}
Voice command: "${text.trim()}"`,
        },
      ],
      temperature: 0.1, // low temp = consistent JSON output
      max_tokens: 200,  // intent JSON is always short
    });

    // ── 3. Extract and clean the response ─────────────────
    const raw = completion.choices[0]?.message?.content?.trim() || "";

    // Strip markdown fences just in case
    const clean = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const action = JSON.parse(clean);

    // ── 4. Return parsed action ────────────────────────────
    return Response.json({ success: true, action });

  } catch (error) {
    console.error("parse-voice error:", error);

    return Response.json({
      success: false,
      action: {
        action: "unknown",
        raw_text: "parse error",
        confidence: 0.0,
      },
      error: error.message,
    });
  }
}