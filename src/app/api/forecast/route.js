import { NextResponse } from 'next/server';

const FALLBACK = {
  spendingForecast: [
    { month: 'Jun', amount: 755, reasoning: 'Slight reduction from better food habits' },
    { month: 'Jul', amount: 720, reasoning: 'Continued improvement, lower transport' },
    { month: 'Aug', amount: 695, reasoning: 'Consistent savings momentum building' },
  ],
  savingsForecast: [
    { month: 'Jun', amount: 175 },
    { month: 'Jul', amount: 205 },
    { month: 'Aug', amount: 230 },
  ],
  topRisk: 'Food spending at 35% of budget remains the biggest monthly risk.',
  topOpportunity: 'Reducing food by RM 80 adds RM 960 to annual savings.',
  projectedAnnualSavings: 2340,
  coachMessage: "You're on a solid track, Harshini. Small cuts in food and transport could push your savings above RM 200/month by August.",
};

export async function POST(req) {
  // Always return JSON, never a 500
  try {
    const body = await req.json().catch(() => ({}));
    const { spending = [], totalSpent = 800, balances = {}, history = [] } = body;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY is not set');
      return NextResponse.json(FALLBACK);
    }

    const spendingSummary = spending.length > 0
      ? spending.map((c) => `${c.label}: RM ${c.current} (target RM ${c.better})`).join(', ')
      : 'Food: RM 280, Transport: RM 160, Groceries: RM 120, Bills: RM 100, Shopping: RM 85, Squad: RM 55';

    const historySummary = history.length > 0
      ? history.map((h) => `${h.month}: spent RM ${h.total}, saved RM ${h.savings}`).join('; ')
      : 'Feb: spent RM 720, saved RM 180; Mar: spent RM 850, saved RM 120; Apr: spent RM 780, saved RM 160; May: spent RM 800, saved RM 145';

    const prompt = `You are a personal finance AI for a Malaysian university student named Harshini.

Spending this month (May 2026): ${spendingSummary}. Total: RM ${totalSpent}.
Monthly history: ${historySummary}.
Current main balance: RM ${balances.main ?? 613}, savings: RM ${balances.savings ?? 320}.

Return ONLY a valid JSON object. No markdown, no code fences, no explanation whatsoever. Start your response with { and end with }.

{
  "spendingForecast": [
    { "month": "Jun", "amount": <integer>, "reasoning": "<10 words max>" },
    { "month": "Jul", "amount": <integer>, "reasoning": "<10 words max>" },
    { "month": "Aug", "amount": <integer>, "reasoning": "<10 words max>" }
  ],
  "savingsForecast": [
    { "month": "Jun", "amount": <integer> },
    { "month": "Jul", "amount": <integer> },
    { "month": "Aug", "amount": <integer> }
  ],
  "topRisk": "<one sentence>",
  "topOpportunity": "<one sentence>",
  "projectedAnnualSavings": <integer>,
  "coachMessage": "<2 sentences personalised for Harshini>"
}`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => 'unknown');
      console.error('Groq API error:', groqRes.status, errText);
      return NextResponse.json(FALLBACK);
    }

    const groqData = await groqRes.json();
    const raw = groqData.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      console.error('Empty Groq response');
      return NextResponse.json(FALLBACK);
    }

    // Strip markdown fences if model ignored instructions
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Extract JSON object even if model added text around it
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON object found in response:', cleaned);
      return NextResponse.json(FALLBACK);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate required fields — fall back to FALLBACK values for any missing
    const result = {
      spendingForecast: parsed.spendingForecast?.length === 3
        ? parsed.spendingForecast
        : FALLBACK.spendingForecast,
      savingsForecast: parsed.savingsForecast?.length === 3
        ? parsed.savingsForecast
        : FALLBACK.savingsForecast,
      topRisk: parsed.topRisk || FALLBACK.topRisk,
      topOpportunity: parsed.topOpportunity || FALLBACK.topOpportunity,
      projectedAnnualSavings: parsed.projectedAnnualSavings || FALLBACK.projectedAnnualSavings,
      coachMessage: parsed.coachMessage || FALLBACK.coachMessage,
    };

    return NextResponse.json(result);

  } catch (err) {
    console.error('Forecast route error:', err);
    return NextResponse.json(FALLBACK);
  }
}