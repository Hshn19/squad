// ============================================================
// src/app/dashboard/page.jsx
// Main dashboard — balance, spending breakdown, recent transactions, AI tips
// ============================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Bell, ChevronRight, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  currentUser,
  balances,
  transactions,
  spendingBreakdown,
  aiTips,
  savingsStreak,
  formatMYR,
} from "@/lib/mockData";

export default function Dashboard() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F7]">
      {/* ── Header ── */}
      <div className="bg-[#6C63FF] px-5 pt-12 pb-20 rounded-b-[2.5rem]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-purple-200 text-sm">Good morning,</p>
            <h1 className="text-white text-2xl font-bold">{currentUser.name} 👋</h1>
          </div>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bell size={18} className="text-white" />
          </button>
        </div>

        {/* ── Balance card ── */}
        <div className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20">
          <p className="text-purple-200 text-xs mb-1">Total Balance</p>
          <h2 className="text-white text-3xl font-bold mb-3">
            {formatMYR(balances.main + balances.savings)}
          </h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 bg-green-400/30 rounded-full flex items-center justify-center">
                <TrendingUp size={14} className="text-green-300" />
              </div>
              <div>
                <p className="text-purple-200 text-[10px]">Savings</p>
                <p className="text-white text-sm font-semibold">{formatMYR(balances.savings)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 bg-red-400/30 rounded-full flex items-center justify-center">
                <TrendingDown size={14} className="text-red-300" />
              </div>
              <div>
                <p className="text-purple-200 text-[10px]">Squad</p>
                <p className="text-white text-sm font-semibold">{formatMYR(balances.squad)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 bg-blue-400/30 rounded-full flex items-center justify-center">
                <Wallet size={14} className="text-blue-300" />
              </div>
              <div>
                <p className="text-purple-200 text-[10px]">Main</p>
                <p className="text-white text-sm font-semibold">{formatMYR(balances.main)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 -mt-6 space-y-4 pb-4">

        {/* ── Savings streak ── */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🔥</div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{savingsStreak.currentStreak}-day saving streak!</p>
              <p className="text-gray-400 text-xs">Saved {formatMYR(savingsStreak.thisWeekSaved)} this week</p>
            </div>
          </div>
          <span className="text-xs bg-purple-100 text-purple-600 font-medium px-2 py-1 rounded-full">
            Best: {savingsStreak.longestStreak} days
          </span>
        </div>

        {/* ── AI tip ── */}
        <div className="bg-gradient-to-r from-[#6C63FF] to-[#9C8FFF] rounded-2xl p-4 shadow-sm">
          <p className="text-white/70 text-[10px] font-medium uppercase tracking-wide mb-1">AI Coach</p>
          <p className="text-white text-sm leading-relaxed">{aiTips[0].message}</p>
        </div>

        {/* ── Spending breakdown ── */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">This Month</h3>
            <button
              onClick={() => router.push("/mirror")}
              className="text-xs text-[#6C63FF] font-medium flex items-center gap-0.5"
            >
              View mirror <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Pie chart */}
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="amount"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {spendingBreakdown.map((entry, index) => (
                      <Cell
                        key={entry.category}
                        fill={entry.color}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`RM ${value}`, ""]}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-1.5">
              {spendingBreakdown.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-600">{item.category}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-800">RM {item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent transactions ── */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Recent</h3>
            <button className="text-xs text-[#6C63FF] font-medium">See all</button>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-base flex-shrink-0">
                  {tx.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{tx.description}</p>
                  <p className="text-xs text-gray-400">{tx.date}</p>
                </div>
                <span className={`text-sm font-semibold flex-shrink-0 ${
                  tx.amount > 0 ? "text-green-500" : "text-gray-800"
                }`}>
                  {tx.amount > 0 ? "+" : ""}{formatMYR(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}