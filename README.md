# Squad 💸
### AI-powered budgeting & group savings for Malaysian youth

> **UTMx Hackathon 2026**  
> Built by **Team Binary Rookies**

<div align="center">

🔗 **[Try the live app → squad-app-three.vercel.app](https://squad-app-three.vercel.app/)**

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

Squad solves all three in one app, designed specifically for the Malaysian context — with AI voice control, squad budgeting, group deal finding, and predictive spending insights.

---

## ✨ Features

### 🎙️ AI Voice Control
Control the entire app hands-free using natural Malay-English commands. Navigation and transfers run locally with zero API latency — Groq handles complex intent parsing.

| Say | Action |
|---|---|
| *"Transfer RM20 to Ahmad"* | Navigates to Transfer, pre-fills recipient + amount |
| *"Send RM50 to Sha for squad"* | Pre-fills Transfer + auto-toggles Squad split |
| *"Go to mirror"* | Instant navigation |
| *"Go to squad"* | Navigates to Squad Savings |
| *"I spent RM15 on food"* | Logs expense with smart category detection |
| *"Grab to campus RM8"* | Auto-categorises as Transport |
| *"What's my balance?"* | Shows live balance toast |
| *"Add RM100 to Tokyo trip"* | Contributes to matching squad goal |
| *"Contribute RM50 to Penang"* | Fuzzy-matches Penang Trip goal |

Powered by **Groq (llama-3.3-70b-versatile)** + **Web Speech API** (en-MY locale) + local regex fallback for 100% reliability.

---

### 🤖 AI Chat Coach
Floating AI coach powered by Groq — ask anything about your finances.

- Knows your live balance, spending, and squad pool
- Quick question chips for one-tap queries
- Malaysian context: RM, mamak, Grab, Shopee, etc.
- Casual, friendly tone with occasional Malay words
- Works on every page via floating robot button

---

### 🪞 Spending Mirror
See exactly where your money goes — and where it *could* go.

- **Donut chart** — May category breakdown (Food, Transport, Groceries, Bills, Squad)
- **Personal vs Squad** line chart — 5-month timeline comparison
- **Savings trend** line chart with monthly average
- **Better Path tab** — per-category savings targets with dual progress bars
- **Insights tab** — AI-generated spending observations
- **AI Forecast tab** — Groq-powered 3-month prediction
  - Spending + Squad forecast line chart (actual → predicted, dashed)
  - Savings forecast line chart
  - 3-month outlook with per-month reasoning
  - Risk & Opportunity cards
  - Projected annual savings figure

---

### 👥 Squad Savings
Group budgeting built for Malaysian friend groups, family, and colleagues.

- Create shared saving goals with custom emoji, colour, and target amount
- Track each member's individual contribution with progress bars
- Goals auto-created when you book a deal from Smart Find
- Contribute manually or via voice command
- Squad ledger toggle on every transfer — logs to group history
- Settle up reminders for outstanding debts
- Completion celebration when goal is reached 🎉

---

### 🔍 Squad Smart Find
AI-powered group deal finder — finds activities your whole squad can afford.

- Adjustable contribution slider (pool = contribution × members)
- **Travel, Food, Shopping** tabs with category filters
- Partner badges: Agoda, Trivago, Grab, Shopee
- Squad vote dots showing who wants each deal
- **"Book for squad"** automatically creates a Squad goal and navigates to it
- "Can't afford" state for over-budget items

---

### 💸 Transfer
- Voice pre-fills recipient and amount automatically — works even if page is already open
- Add new contacts with custom colour avatar
- Live remaining balance preview as you type
- Red warning if amount exceeds balance
- Squad split toggle — logs transfer to group ledger + contributes to squad goal
- Settle up reminders for outstanding squad debts

---

### 📊 Transactions
- Full spending history with live search
- Filter by: Food, Transport, Groceries, Transfer, Bills, Squad, Entertainment
- Colour-coded category badges
- Merges voice-logged and manual expenses in real time

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Fast, free on Vercel |
| AI / NLP | Groq API — llama-3.3-70b | Fastest free LLM, no card needed |
| Voice | Web Speech API (en-MY) + local regex fallback | Native, zero cost, always works |
| Charts | Pure SVG | No library dependency, full control |
| State | React Context API | Simple, no Redux overhead |
| Styling | Inline styles + DM Sans + Tabler Icons | No CSS conflicts, mobile-first |
| Deployment | Vercel | Free, auto-deploy on push |
| **Total cost** | **RM 0** | 100% free tools, no credit card |

---

## 🏗️ Project Structure
```
src/
├── app/
│   ├── dashboard/        # Home — balance, AI coach, live tip, spending mirror card
│   ├── transfer/         # Send money — voice pre-fill, add contacts, squad ledger
│   ├── mirror/           # Spending Mirror — 4 tabs: breakdown, better path, insights, AI forecast
│   ├── smartfind/        # Squad Smart Find — deal finder, book-to-goal
│   ├── squad/            # Squad Savings — goals, contributions, create new goal
│   ├── transactions/     # Transaction history — search + category filters
│   └── api/
│       ├── parse-voice/  # Groq voice intent parser + local regex fallback
│       ├── forecast/     # Groq AI spending + savings forecast
│       └── coach/        # Groq AI chat coach
├── components/
│   ├── ClientShell.jsx   # App wrapper — splash screen (once), BottomNav, AICoach
│   ├── BottomNav.jsx     # Global nav + mic button (GX Bank dark theme)
│   ├── VoiceModal.jsx    # Voice capture → local fast-path → Groq → confirm/execute
│   └── AICoach.jsx       # Floating AI chat coach
└── lib/
    └── AppContext.jsx    # Global state — balances, transactions, squad goals, contacts
```

Navigation
```
Navigation
──────────────────────────────────────────────
"Go to mirror"              → Spending Mirror
"Go to squad"               → Squad Savings
"Go to transactions"        → Transaction History
"Go to Smart Find"          → Squad Smart Find
"Go home"                   → Dashboard

Transfers
──────────────────────────────────────────────
"Transfer RM20 to Ahmad"    → Pre-fills Transfer page
"Send RM50 to Sha"          → Pre-fills Transfer page
"Pay Wei RM10"              → Pre-fills Transfer page
"Send RM30 to Ahmad squad"  → Pre-fills + auto-toggles squad split

Expenses (auto-categorised)
──────────────────────────────────────────────
"I spent RM12 on food"      → Food expense
"Grab to campus RM8"        → Transport expense
"Bought boba RM7"           → Food expense
"Paid Celcom RM50"          → Bills expense
"Bought at Shopee RM35"     → Shopping expense

Balance & Goals
──────────────────────────────────────────────
"What's my balance?"        → Shows live balance toast
"Check my savings"          → Shows balance toast
"Add RM100 to Tokyo trip"   → Contributes to Tokyo goal
"Contribute RM50 to Penang" → Fuzzy-matches Penang Trip
"Put RM200 into laptop"     → Contributes to Laptop goal
```
## 🚀 Run Locally

```bash
git clone https://github.com/Hshn19/squad.git
cd squad
npm install --legacy-peer-deps
```

Create `.env.local`:
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_APP_NAME=Squad

> Get a free Groq API key at [console.groq.com](https://console.groq.com) — no credit card needed.

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000) in **Chrome** (required for voice input).

> Note: The app works without a Groq API key — voice commands fall back to local regex parsing, so navigation, transfers, and expense logging all work offline.

---

## 👥 Team Binary Rookies

| Name | Role |
|---|---|
| Harshini | Lead Developer & AI Integration |
| Lievaashini | Research & Strategy |
| Shahitya | Product Strategist & Business Analyst |

Built for the **UTMx Hackathon 2026**

---

## 📄 License

MIT — free to use, modify, and build on.

---

<div align="center">
  <strong>Built with 🧠 Groq AI · 🎙️ Web Speech · ⚡ Next.js · 🇲🇾 for Malaysia</strong>
</div>
