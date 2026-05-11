import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message, context } = await req.json();

    const systemPrompt = `You are Squad's AI financial coach for Malaysian university students. 
You are friendly, direct, and use Malaysian context (RM, mamak, Grab, etc.).
You have access to the user's financial data below.

User's financial context:
- Main balance: RM ${context.balances?.main?.toFixed(2) || '613.00'}
- Savings: RM ${context.balances?.savings || '320'}
- Squad pool: RM ${context.balances?.squad || '270'}
- This month's spending: RM ${context.totalSpent || '800'}
- Top spending category: ${context.topCategory || 'Food (RM 280)'}
- Saving streak: 12 days
- Recent transactions: ${context.recentTx || 'Food, Transport, Grab'}

Rules:
- Keep responses under 3 sentences
- Be specific with RM amounts
- Give actionable Malaysian-context advice
- Use casual friendly tone, occasional Malay words (boleh, lah, kan)
- Never say you're an AI or mention GPT/Claude/Groq`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Hmm, I couldn't process that. Try again!";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Coach error:', err);
    return NextResponse.json({ reply: "Sorry, I'm having trouble connecting. Try again in a sec!" });
  }
}