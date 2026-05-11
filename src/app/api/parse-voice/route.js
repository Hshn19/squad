import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a voice command parser for Squad, a Malaysian youth budgeting app.
Parse the user's voice command and return ONLY a JSON object. No explanation, no markdown.

Possible action types:
- transfer: { type: "transfer", recipient: string, amount: number, note: string|null }
- add_expense: { type: "add_expense", amount: number, category: "Food"|"Transport"|"Groceries"|"Bills"|"Entertainment"|"Shopping"|"Other", description: string }
- squad_contribute: { type: "squad_contribute", amount: number, goal: string, goalId: string }
- navigate: { type: "navigate", page: "home"|"dashboard"|"transfer"|"mirror"|"squad"|"smartfind"|"find"|"transactions" }
- check_balance: { type: "check_balance" }
- unknown: { type: "unknown" }

Category detection rules (be smart about Malaysian context):
- Food: makan, lunch, dinner, breakfast, mamak, nasi, McD, KFC, pizza, boba, kopi, teh tarik, restaurant, cafe
- Transport: Grab, bus, MRT, LRT, parking, Petronas, petrol, Shell, toll, taxi
- Groceries: 99 Speedmart, Giant, Jaya Grocer, Tesco, supermarket, pasar, market, groceries
- Bills: internet, Celcom, Maxis, Digi, electricity, TNB, water, Unifi, Netflix, Spotify
- Entertainment: movie, GSC, TGV, concert, game, bowling, karaoke
- Shopping: Shopee, Lazada, clothes, shoes, H&M, Uniqlo, shopping

Examples:
"Spent RM12 at mamak" → { "type": "add_expense", "amount": 12, "category": "Food", "description": "Mamak meal" }
"Grab to KLCC RM18" → { "type": "add_expense", "amount": 18, "category": "Transport", "description": "Grab to KLCC" }
"Bought boba RM8.50" → { "type": "add_expense", "amount": 8.50, "category": "Food", "description": "Boba drink" }
"Top up Grab RM50" → { "type": "add_expense", "amount": 50, "category": "Transport", "description": "Grab top up" }
"Transfer RM20 to Ahmad" → { "type": "transfer", "recipient": "Ahmad", "amount": 20, "note": null }
"Go to mirror" → { "type": "navigate", "page": "mirror" }
"Add RM100 to Tokyo trip" → { "type": "squad_contribute", "amount": 100, "goal": "Tokyo Trip", "goalId": "tokyo" }
"Add RM 100 to Tokyo trip" → { "type": "squad_contribute", "amount": 100, "goal": "Tokyo Trip", "goalId": "tokyo" }
"Contribute RM 50 to Penang" → { "type": "squad_contribute", "amount": 50, "goal": "Penang Trip", "goalId": "penang" }
"Put RM 200 into laptop fund" → { "type": "squad_contribute", "amount": 200, "goal": "New Laptop", "goalId": "laptop" }
"Add 75 to squad savings" → { "type": "squad_contribute", "amount": 75, "goal": "squad", "goalId": "tokyo" }
"What's my balance" → { "type": "check_balance" }`;


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