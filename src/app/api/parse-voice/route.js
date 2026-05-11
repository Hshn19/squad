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

Category detection rules (Malaysian context):
- Food: makan, lunch, dinner, breakfast, mamak, nasi, McD, KFC, pizza, boba, kopi, teh tarik, restaurant, cafe
- Transport: Grab, bus, MRT, LRT, parking, Petronas, petrol, Shell, toll, taxi
- Groceries: 99 Speedmart, Giant, Jaya Grocer, Tesco, supermarket, pasar, market
- Bills: internet, Celcom, Maxis, Digi, electricity, TNB, water, Unifi, Netflix, Spotify
- Entertainment: movie, GSC, TGV, concert, game, bowling, karaoke
- Shopping: Shopee, Lazada, clothes, shoes, H&M, Uniqlo

Examples:
"Transfer RM 20 to Ahmad" → { "type": "transfer", "recipient": "Ahmad", "amount": 20, "note": null }
"Send 15 to Sha for food" → { "type": "transfer", "recipient": "Sha", "amount": 15, "note": "food" }
"Go to mirror" → { "type": "navigate", "page": "mirror" }
"I spent RM 12 on food" → { "type": "add_expense", "amount": 12, "category": "Food", "description": "Food expense" }
"Grab to campus RM 8" → { "type": "add_expense", "amount": 8, "category": "Transport", "description": "Grab to campus" }
"Add RM 100 to Tokyo trip" → { "type": "squad_contribute", "amount": 100, "goal": "Tokyo Trip", "goalId": "tokyo" }
"Contribute RM 50 to Penang" → { "type": "squad_contribute", "amount": 50, "goal": "Penang Trip", "goalId": "penang" }
"Put RM 200 into laptop fund" → { "type": "squad_contribute", "amount": 200, "goal": "New Laptop", "goalId": "laptop" }
"Add 75 to squad savings" → { "type": "squad_contribute", "amount": 75, "goal": "squad", "goalId": "tokyo" }
"What's my balance" → { "type": "check_balance" }`;

function getFallback(transcript) {
  const lower = transcript.toLowerCase().replace(/rm\s*/gi, '');

  if (/balance|savings|how much/.test(lower)) {
    return { type: 'check_balance' };
  }

  const navMap = {
    'mirror': 'mirror', 'home': 'home', 'dashboard': 'dashboard',
    'transfer': 'transfer', 'squad': 'squad', 'smartfind': 'smartfind',
    'find': 'smartfind', 'transactions': 'transactions', 'history': 'transactions',
  };
  for (const [kw, page] of Object.entries(navMap)) {
    if (lower.includes(kw)) return { type: 'navigate', page };
  }

  const tm = lower.match(/(?:transfer|send|pay|hantar)\s+(\d+(?:\.\d+)?)\s+(?:to\s+)?(\w+)/i);
  if (tm && !isNaN(parseFloat(tm[1])) && isNaN(parseFloat(tm[2]))) {
    return { type: 'transfer', recipient: tm[2], amount: parseFloat(tm[1]), note: null };
  }

  const sm = lower.match(/(?:add|contribute|put|masuk)\s+(\d+(?:\.\d+)?)/i);
  if (sm) {
    let goalId = 'tokyo';
    let goal   = 'Tokyo Trip';
    if (/penang/.test(lower))         { goalId = 'penang'; goal = 'Penang Trip'; }
    else if (/laptop|computer/.test(lower)) { goalId = 'laptop'; goal = 'New Laptop'; }
    return { type: 'squad_contribute', amount: parseFloat(sm[1]), goal, goalId };
  }

  const em = lower.match(/(?:spent|spend|bought|paid|beli)\s+(\d+(?:\.\d+)?)/i);
  if (em) {
    let category = 'Other';
    if (/food|makan|lunch|dinner|breakfast|mamak|nasi|kfc|mcd|mcdonald|pizza|boba|kopi|cafe|restaurant/.test(lower)) category = 'Food';
    else if (/grab|bus|mrt|lrt|petrol|toll|taxi|parking/.test(lower)) category = 'Transport';
    else if (/speedmart|grocer|tesco|supermarket|market|groceries/.test(lower)) category = 'Groceries';
    else if (/movie|cinema|gsc|tgv|concert|game|bowling|karaoke/.test(lower)) category = 'Entertainment';
    else if (/shopee|lazada|clothes|shoe|shopping/.test(lower)) category = 'Shopping';
    return { type: 'add_expense', amount: parseFloat(em[1]), category, description: transcript };
  }

  return { type: 'unknown' };
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    hasKey: !!process.env.GROQ_API_KEY,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req) {
  try {
    let body = {};
    try { body = await req.json(); } catch { /* empty body */ }

    const { transcript } = body;
    if (!transcript) {
      return NextResponse.json({ action: { type: 'unknown' } });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error('[parse-voice] GROQ_API_KEY not set — using local fallback');
      return NextResponse.json({ action: getFallback(transcript) });
    }

    let groqRes;
    try {
      groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user',   content: transcript },
          ],
          temperature: 0,
          max_tokens: 200,
        }),
      });
    } catch (fetchErr) {
      console.error('[parse-voice] Groq fetch failed:', fetchErr.message);
      return NextResponse.json({ action: getFallback(transcript) });
    }

    if (!groqRes.ok) {
      console.error('[parse-voice] Groq returned:', groqRes.status);
      return NextResponse.json({ action: getFallback(transcript) });
    }

    const data = await groqRes.json();
    const raw  = data.choices?.[0]?.message?.content?.trim() || '';

    if (!raw) {
      return NextResponse.json({ action: getFallback(transcript) });
    }

    let action;
    try {
      const cleaned   = raw.replace(/```json|```/g, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      action = jsonMatch ? JSON.parse(jsonMatch[0]) : getFallback(transcript);
    } catch {
      console.error('[parse-voice] JSON parse failed, using fallback');
      action = getFallback(transcript);
    }

    if (!action?.type) action = getFallback(transcript);

    return NextResponse.json({ action });

  } catch (err) {
    console.error('[parse-voice] Unhandled error:', err.message);
    return NextResponse.json({ action: { type: 'unknown' } });
  }
}