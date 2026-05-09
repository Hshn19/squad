// ============================================================
// src/lib/AppContext.jsx
// Global state — balances, transactions, squad goals all update
// in real time when user interacts with the app
// ============================================================

"use client";

import { createContext, useContext, useState, useCallback } from "react";
import {
  balances as initialBalances,
  transactions as initialTransactions,
  squadGoals as initialSquadGoals,
  savingsStreak as initialStreak,
  aiTips,
} from "./mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [balances, setBalances]         = useState(initialBalances);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [squadGoals, setSquadGoals]     = useState(initialSquadGoals);
  const [streak, setStreak]             = useState(initialStreak);
  const [toast, setToast]               = useState(null); // { message, type }

  // ── Show a toast notification ────────────────────────────
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Transfer money ───────────────────────────────────────
  const doTransfer = useCallback((recipient, amount, note = "") => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0 || amt > balances.main) return false;

    // Deduct from main balance
    setBalances((prev) => ({ ...prev, main: parseFloat((prev.main - amt).toFixed(2)) }));

    // Add to transaction history
    const newTx = {
      id: `t${Date.now()}`,
      type: "transfer_out",
      category: "transfer",
      description: `To ${recipient}`,
      amount: -amt,
      date: new Date().toISOString().split("T")[0],
      icon: "💸",
      note,
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Sent ${formatMYR(amt)} to ${recipient} ✓`);
    return true;
  }, [balances.main, showToast]);

  // ── Add expense ──────────────────────────────────────────
  const addExpense = useCallback((amount, category, description) => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return false;

    setBalances((prev) => ({ ...prev, main: parseFloat((prev.main - amt).toFixed(2)) }));

    const categoryIcons = {
      food: "🍔", transport: "🚗", entertainment: "🎬",
      groceries: "🛒", bills: "📱", others: "💳",
    };

    const newTx = {
      id: `t${Date.now()}`,
      type: "expense",
      category,
      description: description || category,
      amount: -amt,
      date: new Date().toISOString().split("T")[0],
      icon: categoryIcons[category] || "💳",
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Expense of ${formatMYR(amt)} added ✓`);
    return true;
  }, [showToast]);

  // ── Contribute to squad goal ─────────────────────────────
  const contributeToGoal = useCallback((goalId, memberName, amount) => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return false;

    setBalances((prev) => ({
      ...prev,
      main:  parseFloat((prev.main - amt).toFixed(2)),
      squad: parseFloat((prev.squad + amt).toFixed(2)),
    }));

    setSquadGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;
        return {
          ...goal,
          totalContributed: parseFloat((goal.totalContributed + amt).toFixed(2)),
          members: goal.members.map((m) =>
            m.name === memberName
              ? { ...m, contributed: parseFloat((m.contributed + amt).toFixed(2)) }
              : m
          ),
        };
      })
    );

    showToast(`${formatMYR(amt)} added to goal ✓`);
    return true;
  }, [showToast]);

  // ── Add to savings ───────────────────────────────────────
  const addToSavings = useCallback((amount) => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0 || amt > balances.main) return false;

    setBalances((prev) => ({
      ...prev,
      main:    parseFloat((prev.main - amt).toFixed(2)),
      savings: parseFloat((prev.savings + amt).toFixed(2)),
    }));

    setStreak((prev) => ({
      ...prev,
      thisWeekSaved:  parseFloat((prev.thisWeekSaved + amt).toFixed(2)),
      thisMonthSaved: parseFloat((prev.thisMonthSaved + amt).toFixed(2)),
    }));

    showToast(`${formatMYR(amt)} moved to savings ✓`);
    return true;
  }, [balances.main, showToast]);

  const value = {
    balances,
    transactions,
    squadGoals,
    streak,
    aiTips,
    toast,
    doTransfer,
    addExpense,
    contributeToGoal,
    addToSavings,
    showToast,
  };

  return (
    <AppContext.Provider value={value}>
      {children}

      {/* ── Global toast notification ── */}
      {toast && (
        <div className={`
          fixed top-6 left-1/2 -translate-x-1/2 z-[100]
          px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold
          flex items-center gap-2 animate-fade-in
          ${toast.type === "success" ? "bg-[#1A1D23] text-white" : "bg-red-500 text-white"}
        `}>
          {toast.message}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

// Helper — keep it here so AppContext is self-contained
function formatMYR(amount) {
  return `RM ${Math.abs(amount).toFixed(2)}`;
}