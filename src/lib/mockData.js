// ============================================================
// lib/mockData.js
// Central mock data for FinWise — all components import from here
// Replace with real API calls post-hackathon
// ============================================================

// ─── Current User ───────────────────────────────────────────
export const currentUser = {
  id: "u001",
  name: "Harshini",
  avatar: "H",
  monthlyIncome: 1200, // MYR — PTPTN student allowance
  gxAccountNumber: "****4291",
};

// ─── Account Balances ────────────────────────────────────────
export const balances = {
  main: 643.50,
  savings: 320.00,
  squad: 250.00, // combined squad contributions
};

// ─── Contacts ────────────────────────────────────────────────
export const contacts = [
  { id: "c001", name: "Lena",     avatar: "L", accountNumber: "****8821" },
  { id: "c002", name: "Sha",      avatar: "S", accountNumber: "****3349" },
  { id: "c003", name: "Ahmad",    avatar: "A", accountNumber: "****6612" },
  { id: "c004", name: "Wei",      avatar: "W", accountNumber: "****1195" },
  { id: "c005", name: "Priya",    avatar: "P", accountNumber: "****5530" },
];

// ─── Recent Transactions ─────────────────────────────────────
export const transactions = [
  { id: "t001", type: "expense", category: "food",          description: "McDonald's Subang",     amount: -12.50, date: "2025-05-07", icon: "🍔" },
  { id: "t002", type: "expense", category: "transport",     description: "Grab to campus",         amount: -8.00,  date: "2025-05-07", icon: "🚗" },
  { id: "t003", type: "transfer_in", category: "transfer",  description: "From Ahmad",             amount: +50.00, date: "2025-05-06", icon: "💸" },
  { id: "t004", type: "expense", category: "groceries",     description: "99 Speedmart",           amount: -23.40, date: "2025-05-06", icon: "🛒" },
  { id: "t005", type: "expense", category: "entertainment", description: "Netflix split",          amount: -5.00,  date: "2025-05-05", icon: "🎬" },
  { id: "t006", type: "expense", category: "food",          description: "Teh tarik + roti canai", amount: -4.50,  date: "2025-05-05", icon: "☕" },
  { id: "t007", type: "transfer_out", category: "transfer", description: "To Lena",               amount: -20.00, date: "2025-05-04", icon: "💸" },
  { id: "t008", type: "expense", category: "transport",     description: "RapidKL monthly",        amount: -50.00, date: "2025-05-03", icon: "🚌" },
  { id: "t009", type: "expense", category: "food",          description: "Watsons skincare",       amount: -35.90, date: "2025-05-02", icon: "🧴" },
  { id: "t010", type: "income",  category: "income",        description: "PTPTN disbursement",     amount: +600.00,date: "2025-05-01", icon: "🏦" },
];

// ─── Monthly Spending Breakdown (pie / donut chart) ──────────
export const spendingBreakdown = [
  { category: "Food",          amount: 280, color: "#FF6B6B", percentage: 35 },
  { category: "Transport",     amount: 160, color: "#4ECDC4", percentage: 20 },
  { category: "Groceries",     amount: 120, color: "#FFE66D", percentage: 15 },
  { category: "Entertainment", amount: 80,  color: "#A8E6CF", percentage: 10 },
  { category: "Bills",         amount: 100, color: "#C779D0", percentage: 12.5 },
  { category: "Others",        amount: 60,  color: "#F8B500", percentage: 7.5 },
];

// ─── Spending Mirror — 6-month projection data ───────────────
// Shows "if you keep spending like this" vs "if you save 20% more"
export const spendingMirrorData = [
  { month: "May",  actual: 800, projected_bad: 800,  projected_good: 800  },
  { month: "Jun",  actual: null, projected_bad: 860,  projected_good: 720  },
  { month: "Jul",  actual: null, projected_bad: 930,  projected_good: 650  },
  { month: "Aug",  actual: null, projected_bad: 1010, projected_good: 590  },
  { month: "Sep",  actual: null, projected_bad: 1100, projected_good: 530  },
  { month: "Oct",  actual: null, projected_bad: 1190, projected_good: 480  },
];

// Future self savings projection
export const savingsProjection = [
  { month: "May",  current_path: 320,  better_path: 320  },
  { month: "Jun",  current_path: 360,  better_path: 480  },
  { month: "Jul",  current_path: 395,  better_path: 650  },
  { month: "Aug",  current_path: 420,  better_path: 830  },
  { month: "Sep",  current_path: 438,  better_path: 1020 },
  { month: "Oct",  current_path: 450,  better_path: 1220 },
];

// ─── AI Budget Allocation ─────────────────────────────────────
// Based on income 1200 MYR, what the AI recommends
export const budgetAllocation = {
  income: 1200,
  breakdown: [
    { label: "Fixed (rent/PTPTN)",  amount: 400, percentage: 33, color: "#FF6B6B" },
    { label: "Daily spending",       amount: 360, percentage: 30, color: "#4ECDC4" },
    { label: "Savings",             amount: 240, percentage: 20, color: "#A8E6CF" },
    { label: "Emergency fund",      amount: 120, percentage: 10, color: "#FFE66D" },
    { label: "Investments",         amount: 80,  percentage: 7,  color: "#C779D0" },
  ],
};

// ─── Squad Savings Goals ──────────────────────────────────────
export const squadGoals = [
  {
    id: "sg001",
    name: "Tokyo Trip 🇯🇵",
    targetAmount: 2000,
    deadline: "2025-12-01",
    members: [
      { name: "Harshini", avatar: "H", contributed: 200, target: 667 },
      { name: "Lena",     avatar: "L", contributed: 350, target: 667 },
      { name: "Sha",      avatar: "S", contributed: 100, target: 666 },
    ],
    totalContributed: 650,
    color: "#FF6B6B",
  },
  {
    id: "sg002",
    name: "New Laptop Fund 💻",
    targetAmount: 3000,
    deadline: "2025-09-01",
    members: [
      { name: "Harshini", avatar: "H", contributed: 500, target: 1000 },
      { name: "Ahmad",    avatar: "A", contributed: 300, target: 1000 },
      { name: "Wei",      avatar: "W", contributed: 200, target: 1000 },
    ],
    totalContributed: 1000,
    color: "#4ECDC4",
  },
];

// ─── Savings Streaks ─────────────────────────────────────────
export const savingsStreak = {
  currentStreak: 12, // days
  longestStreak: 21,
  thisWeekSaved: 45.00,
  thisMonthSaved: 180.00,
  savingsGoalMet: false, // monthly goal of 240 not yet met
};

// ─── AI Coach Tips ────────────────────────────────────────────
export const aiTips = [
  {
    id: "tip001",
    type: "warning",
    message: "You've spent RM280 on food this month — that's 35% of your budget. Try cooking 2x a week to save ~RM60.",
    icon: "⚠️",
  },
  {
    id: "tip002",
    type: "positive",
    message: "Great job! You saved RM45 this week — that's your best week this month. Keep it up! 🎉",
    icon: "✅",
  },
  {
    id: "tip003",
    type: "info",
    message: "Tokyo Trip goal is 32.5% funded. At your current pace, you'll reach it by March 2026. Save RM50 more/month to hit December 2025.",
    icon: "💡",
  },
];

// ─── Helpers ─────────────────────────────────────────────────
export const formatMYR = (amount) =>
  `RM ${Math.abs(amount).toFixed(2)}`;

export const getContactByName = (name) =>
  contacts.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;

export const getTotalSpentThisMonth = () =>
  transactions
    .filter(t => t.amount < 0 && t.date.startsWith("2025-05"))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
