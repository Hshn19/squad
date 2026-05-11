import { NextResponse } from 'next/server';

const FALLBACK_TIPS = [
  "Your food spending is your biggest leak this month — try cooking 2× a week to save ~RM 60 lah!",
  "You're on a 12-day saving streak — don't break it now! Small daily savings add up to big wins.",
  "Your Squad pool is RM 270 — use Smart Find to book group activities and split costs automatically.",
  "Transport costs can be cut by RM 40/month with MRT + Grab pooling instead of solo rides.",
  "You've saved RM 45 this week — keep that momentum going and you'll hit RM 180 by month end!",
];

function getRandomFallback() {
  return FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
}

export async function POST(req) {
  try {
    // Safe body parsing
    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ reply: getRandomFallback() });
    }

    const { message, context = {} } = body;

    if (!message) {
      return NextResponse.json({ reply: getRandomFallback() });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY not set');
      return NextResponse.json({ reply: getRandomFallback() });
    }

    const systemPrompt = `You are Squad's AI financial coach for Malaysian university students.
You are friendly, direct, have experience in proper budgeting skills and are knowledgeable about Malaysian financial habits.
You have access to the user's financial data below.

User's financial context:
- Main balance: RM ${context.balances?.main?.toFixed?.(2) ?? '613.00'}
- Savings: RM ${context.balances?.savings ?? '320'}
- Squad pool: RM ${context.balances?.squad ?? '270'}
- This month's spending: RM ${context.totalSpent ?? '800'}
- Top spending category: ${context.topCategory ?? 'Food (RM 280)'}
- Saving streak: 12 days
- Recent transactions: ${context.recentTx ?? 'Food, Transport, Grab'}

Rules:
- Keep responses under 3 sentences
- Be specific with RM amounts
- Give actionable Malaysian-context advice
- Use casual friendly tone, occasional Malay words (boleh, lah, kan)
- Never mention GPT, Claude, Groq, or that you are an AI`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: message },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => 'unknown');
      console.error('Groq coach error:', groqRes.status, errText);
      return NextResponse.json({ reply: getRandomFallback() });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json({ reply: getRandomFallback() });
    }

    return NextResponse.json({ reply });

  } catch (err) {
    console.error('Coach route error:', err);
    return NextResponse.json({ reply: getRandomFallback() });
  }
}