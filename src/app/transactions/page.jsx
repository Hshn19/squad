// ============================================================
// src/app/transactions/page.jsx
// Full transaction history with filtering by category
// ============================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { formatMYR } from "@/lib/mockData";

const FILTERS = ["All", "Food", "Transport", "Groceries", "Entertainment", "Transfer", "Income"];

export default function TransactionsPage() {
  const router = useRouter();
  const { transactions } = useApp();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = transactions.filter((tx) => {
    const matchFilter =
      activeFilter === "All" ||
      tx.category.toLowerCase() === activeFilter.toLowerCase() ||
      tx.type.toLowerCase().includes(activeFilter.toLowerCase());
    const matchSearch =
      search === "" ||
      tx.description.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Group by date
  const grouped = filtered.reduce((acc, tx) => {
    const date = tx.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(tx);
    return acc;
  }, {});

  const totalSpent = filtered
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const totalIn = filtered
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB]">
      {/* ── Header ── */}
      <div className="bg-[#00C896] px-5 pt-12 pb-6 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-lg font-semibold">All Transactions</h1>
            <p className="text-green-100 text-xs">{filtered.length} transactions</p>
          </div>
        </div>

        {/* ── Summary row ── */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white/15 rounded-2xl p-3">
            <p className="text-green-100 text-xs mb-0.5">Money In</p>
            <p className="text-white font-bold text-base">+{formatMYR(totalIn)}</p>
          </div>
          <div className="flex-1 bg-white/15 rounded-2xl p-3">
            <p className="text-green-100 text-xs mb-0.5">Money Out</p>
            <p className="text-white font-bold text-base">-{formatMYR(totalSpent)}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* ── Search ── */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-white border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#00C896]"
          />
        </div>

        {/* ── Filter chips ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`
                flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold
                transition-all duration-150
                ${activeFilter === f
                  ? "bg-[#00C896] text-white"
                  : "bg-white text-gray-500 border border-gray-100"
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Grouped transactions ── */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-gray-400 text-sm">No transactions found</p>
          </div>
        ) : (
          Object.entries(grouped)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .map(([date, txs]) => (
              <div key={date}>
                <p className="text-xs font-semibold text-gray-400 mb-2 px-1">
                  {formatDate(date)}
                </p>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {txs.map((tx, i) => (
                    <div
                      key={tx.id}
                      className={`flex items-center gap-3 px-4 py-3 ${
                        i < txs.length - 1 ? "border-b border-gray-50" : ""
                      }`}
                    >
                      <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-base flex-shrink-0">
                        {tx.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {tx.description}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{tx.category}</p>
                      </div>
                      <span className={`text-sm font-semibold flex-shrink-0 ${
                        tx.amount > 0 ? "text-[#00C896]" : "text-gray-800"
                      }`}>
                        {tx.amount > 0 ? "+" : ""}{formatMYR(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-MY", { weekday: "short", day: "numeric", month: "short" });
}