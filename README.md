# FinWise 💸
### AI-powered budgeting & group savings for Malaysian youth

> **UTMx Hackathon 2026 · GX Bank Challenge**  
> Built by **Team Binary Rookies**

<div align="center">

🔗 **[Try the live app → finwise-app-three.vercel.app](https://finwise-app-three.vercel.app/)**

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-orange?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)
![PWA](https://img.shields.io/badge/PWA-Installable-purple?style=for-the-badge)
![Free](https://img.shields.io/badge/Cost-100%25_Free-green?style=for-the-badge)

</div>

---

## 📱 Install as a Mobile App

| Android | iPhone |
|---|---|
| Open link in **Chrome** → tap ⋮ → **Add to Home Screen** | Open link in **Safari** → tap Share → **Add to Home Screen** |

> Voice features require **Chrome** on Android or desktop.

---

## 🎯 The Problem

Malaysian youth face three financial blind spots:

- 💸 **Overspending** with no real-time awareness of where money goes
- 👥 **Group expenses** managed through messy WhatsApp threads and IOUs  
- 😴 **No motivation** to save — budgeting apps feel like homework

FinWise solves all three in one app, designed specifically for the Malaysian context — with AI voice control, squad budgeting, and predictive spending insights.

---

## ✨ Features

### 🎙️ AI Voice Control
Control the entire app hands-free using natural Malay-English commands.

| Say | Action |
|---|---|
| *"Transfer RM20 to Ahmad"* | Navigates to Transfer, pre-fills recipient + amount |
| *"Go to mirror"* | Instant navigation |
| *"I spent RM15 on food"* | Logs expense with confirmation |
| *"What's my balance?"* | Shows balance as toast notification |
| *"Add RM100 to Tokyo trip"* | Contributes to squad savings goal |
| *"Go to Smart Find"* | Navigates to squad deal finder |

Powered by **Groq (llama-3.3-70b-versatile)** + **Web Speech API** (en-MY locale). Navigation and transfers run locally with zero API latency.

---

### 🪞 Spending Mirror
See exactly where your money goes — and where it *could* go.

- **Donut chart** by category (Food, Transport, Groceries, Bills, Squad)
- **Personal vs Squad** line chart — 5-month timeline
- **Savings trend** line chart with monthly average
- **Better Path tab** — shows exactly how much you'd save with small habit changes
- **AI Forecast tab** — Groq-powered 3-month prediction of spending + savings
  - Spending forecast line chart (actual → predicted, dashed)
  - Savings forecast line chart
  - 3-month outlook with reasoning per month
  - Risk & Opportunity cards
  - Projected annual savings

---

### 👥 Squad Savings
Group budgeting built for Malaysian friend groups, family, and colleagues.

- Create shared saving goals with custom emoji, colour, and target
- Track each member's contribution with individual progress bars
- Settle debts directly from the Transfer page
- Squad ledger toggle on every transfer

---

### 🔍 Squad Smart Find
AI-powered group deal finder — finds activities your whole squad can afford.

- Adjustable contribution slider (pool = slider × members)
- **Travel, Food, Shopping** tabs
- Partner badges: Agoda, Trivago, Grab, Shopee
- Squad vote dots showing who wants what
- "Book for squad" deducts from pool instantly

---

### 💸 Transfer
- Voice pre-fills recipient and amount automatically
- Live remaining balance preview as you type
- Exceeds balance warning in real time
- Squad ledger toggle — logs to group expense history
- Settle up reminders for outstanding debts

---

### 📊 Transactions
- Full spending history with live search
- Filter by: Food, Transport, Groceries, Transfer, Bills, Squad, Entertainment
- Category colour badges
- Merges voice-logged and manual expenses in real time

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Fast, free on Vercel |
| AI / NLP | Groq API — llama-3.3-70b | Fastest free LLM, no card needed |
| Voice | Web Speech API (en-MY) | Native, no API cost |
| Charts | Pure SVG | No library dependency, full control |
| State | React Context API | Simple, no Redux overhead |
| Styling | Inline styles + DM Sans + Tabler Icons | No CSS conflicts, mobile-first |
| Deployment | Vercel | Free, auto-deploy on push |
| **Total cost** | **RM 0** | 100% free tools, no credit card |

---

## 🏗️ Project Structure
src/
├── app/
│   ├── dashboard/        # Home — balance, AI coach, spending mirror card
│   ├── transfer/         # Send money — voice pre-fill, squad ledger
│   ├── mirror/           # Spending Mirror — breakdown, better path, insights, AI forecast
│   ├── smartfind/        # Squad Smart Find — deal finder with pool slider
│   ├── squad/            # Squad Savings — goals, contributions, create new goal
│   ├── transactions/     # Transaction history — search + category filters
│   └── api/
│       ├── parse-voice/  # Groq voice intent parser
│       └── forecast/     # Groq AI spending forecast
├── components/
│   ├── BottomNav.jsx     # Global nav + mic button
│   └── VoiceModal.jsx    # Voice capture → intent routing → confirm/execute
└── lib/
└── AppContext.jsx    # Global state — balances, transactions, squad goals, toast

---
## 🎙️ Voice Commands — Full Reference
Navigation
──────────────────────────────────────
"Go to mirror"              → Spending Mirror
"Go to squad"               → Squad Savings
"Go to transactions"        → Transaction History
"Go to Smart Find"          → Squad Smart Find
"Go home"                   → Dashboard
Transfers
──────────────────────────────────────
"Transfer RM20 to Ahmad"    → Pre-fills Transfer page
"Send RM50 to Sha"          → Pre-fills Transfer page
"Pay Wei RM10"              → Pre-fills Transfer page
Expenses
──────────────────────────────────────
"I spent RM12 on food"      → Logs food expense
"Grab to campus RM8"        → Logs transport expense
"Bought groceries RM45"     → Logs groceries expense
Balance & Goals
──────────────────────────────────────
"What's my balance?"        → Shows balance toast
"Check my savings"          → Shows balance toast
"Add RM100 to Tokyo trip"   → Contributes to squad goal

---

## 👥 Team Binary Rookies

| Name | Role |
|---|---|
| Harshini Kumara Vell | Lead Developer & AI Integration |
| Lievaashini
| Shahitya

Built for the **UTMx Hackathon 2026**

---

## 📄 License

MIT — free to use, modify, and build on.

---

<div align="center">
  <strong>Built with 🧠 Groq AI · 🎙️ Web Speech · ⚡ Next.js · 🇲🇾 for Malaysia</strong>
</div>
