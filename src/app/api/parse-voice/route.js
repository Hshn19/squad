import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a voice command parser for FinWise, a Malaysian youth budgeting app.
Parse the user's voice command and return ONLY a JSON object. No explanation, no markdown.

Possible action types:
- transfer: { type: "transfer", recipient: string, amount: number, note: string|null }
- add_expense: { type: "add_expense", amount: number, category: "Food"|"Transport"|"Groceries"|"Bills"|"Entertainment"|"Other", description: string }
- squad_contribute: { type: "squad_contribute", amount: number, goal: string, goalId: string }
- navigate: { type: "navigate", page: "home"|"dashboard"|"transfer"|"mirror"|"squad"|"smartfind"|"find"|"transactions" }
- check_balance: { type: "check_balance" }
- unknown: { type: "unknown" }

Examples:
"Transfer RM 20 to Ahmad" → { "type": "transfer", "recipient": "Ahmad", "amount": 20, "note": null }
"Send 15 to Sha for food" → { "type": "transfer", "recipient": "Sha", "amount": 15, "note": "food" }
"Go to mirror" → { "type": "navigate", "page": "mirror" }
"I spent RM 12 on food" → { "type": "add_expense", "amount": 12, "category": "Food", "description": "Food expense" }
"Grab to campus RM 8" → { "type": "add_expense", "amount": 8, "category": "Transport", "description": "Grab to campus" }
"Add RM 100 to Tokyo trip" → { "type": "squad_contribute", "amount": 100, "goal": "Tokyo Trip", "goalId": "tokyo" }
"What's my balance" → { "type": "check_balance" }
"Check my savings" → { "type": "check_balance" }`;

export async function POST(req) {
  try {
    const { transcript } = await req.json();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: transcript },
        ],
        temperature: 0,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || '{}';

    let action;
    try {
      action = JSON.parse(raw);
    } catch {
      const clean = raw.replace(/```json|```/g, '').trim();
      action = JSON.parse(clean);
    }

    return NextResponse.json({ action });
  } catch (err) {
    console.error('Voice parse error:', err);
    return NextResponse.json({ action: { type: 'unknown' } }, { status: 200 });
  }
}