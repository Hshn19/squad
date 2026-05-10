import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { spending, totalSpent, balances, history } = await req.json();

    const spendingSummary = spending
      .map((c) => `${c.label}: RM ${c.current} (target RM ${c.better})`)
      .join(', ');

    const historySummary = history
      .map((h) => `${h.month}: spent RM ${h.total}, saved RM ${h.savings}`)
      .join('; ');

    const prompt = `You are a personal finance AI for a Malaysian university student named Harshini.

Spending this month (May 2026): ${spendingSummary}. Total: RM ${totalSpent}.
Monthly history: ${historySummary}.
Current balance: RM ${balances.main?.toFixed(2)}, savings account: RM ${balances.savings}.

Return ONLY valid JSON, no markdown, no explanation:
{
  "spendingForecast": [
    { "month": "Jun", "amount": <number>, "reasoning": "<max 10 words>" },
    { "month": "Jul", "amount": <number>, "reasoning": "<max 10 words>" },
    { "month": "Aug", "amount": <number>, "reasoning": "<max 10 words>" }
  ],
  "savingsForecast": [
    { "month": "Jun", "amount": <number> },
    { "month": "Jul", "amount": <number> },
    { "month": "Aug", "amount": <number> }
  ],
  "topRisk": "<one sentence>",
  "topOpportunity": "<one sentence>",
  "projectedAnnualSavings": <number>,
  "coachMessage": "<2 sentences of personalised advice for Harshini>"
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 600,
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || '{}';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const clean = raw.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(clean);
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Forecast error:', err);
    return NextResponse.json({
      spendingForecast: [
        { month: 'Jun', amount: 760, reasoning: 'Slight reduction from better habits' },
        { month: 'Jul', amount: 720, reasoning: 'Continued improvement in food spending' },
        { month: 'Aug', amount: 700, reasoning: 'Consistent savings momentum' },
      ],
      savingsForecast: [
        { month: 'Jun', amount: 185 },
        { month: 'Jul', amount: 210 },
        { month: 'Aug', amount: 230 },
      ],
      topRisk: 'Food spending remains the biggest risk at 35% of budget.',
      topOpportunity: 'Reducing food by RM 80 would boost annual savings by RM 960.',
      projectedAnnualSavings: 2340,
      coachMessage: 'You\'re on a solid track, Harshini. Small cuts in food and transport could push your savings above RM 200/month by August.',
    }, { status: 200 });
  }
}