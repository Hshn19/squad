// ============================================================
// src/app/mirror/page.jsx
// Spending Mirror — shows future self based on current habits
// ============================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from "recharts";
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, Sparkles } from "lucide-react";
import {
  spendingMirrorData,
  savingsProjection,
  budgetAllocation,
  currentUser,
  formatMYR,
} from "@/lib/mockData";

const TABS = ["Spending", "Savings", "Budget"];

export default function MirrorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Spending");

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F7]">
      {/* ── Header ── */}
      <div className="bg-[#6C63FF] px-5 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-lg font-semibold">Spending Mirror</h1>
            <p className="text-purple-200 text-xs">See your future financial self</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex bg-white/15 rounded-xl p-1 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                ${activeTab === tab
                  ? "bg-white text-[#6C63FF]"
                  : "text-white/70"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 py-4 space-y-4">

        {/* ── SPENDING TAB ── */}
        {activeTab === "Spending" && (
          <>
            {/* Future self cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-red-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp size={14} className="text-red-400" />
                  <p className="text-xs font-semibold text-red-400">Current path</p>
                </div>
                <p className="text-2xl font-bold text-gray-800">RM 1,190</p>
                <p className="text-xs text-gray-400 mt-1">Monthly spend in Oct</p>
                <div className="mt-2 w-full bg-red-50 rounded-full h-1.5">
                  <div className="bg-red-400 h-1.5 rounded-full" style={{ width: "99%" }} />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-green-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingDown size={14} className="text-green-500" />
                  <p className="text-xs font-semibold text-green-500">Better path</p>
                </div>
                <p className="text-2xl font-bold text-gray-800">RM 480</p>
                <p className="text-xs text-gray-400 mt-1">Monthly spend in Oct</p>
                <div className="mt-2 w-full bg-green-50 rounded-full h-1.5">
                  <div className="bg-green-400 h-1.5 rounded-full" style={{ width: "40%" }} />
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 text-sm mb-1">6-Month Projection</h3>
              <p className="text-xs text-gray-400 mb-4">Based on your current spending habits</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={spendingMirrorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}`} />
                  <Tooltip formatter={(value) => [`RM ${value}`, ""]} />
                  <ReferenceLine x="May" stroke="#6C63FF" strokeDasharray="4 4" label={{ value: "Today", fontSize: 10, fill: "#6C63FF" }} />
                  <Line
                    type="monotone"
                    dataKey="projected_bad"
                    stroke="#FF6B6B"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#FF6B6B" }}
                    name="Current habits"
                  />
                  <Line
                    type="monotone"
                    dataKey="projected_good"
                    stroke="#4ECDC4"
                    strokeWidth={2.5}
                    strokeDasharray="5 3"
                    dot={{ r: 3, fill: "#4ECDC4" }}
                    name="Save 20% more"
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Warning insight */}
            <div className="bg-red-50 rounded-2xl p-4 flex gap-3 border border-red-100">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-600 mb-0.5">At this rate...</p>
                <p className="text-xs text-red-400 leading-relaxed">
                  Your spending will increase by 49% by October. You'll have almost nothing left to save each month.
                </p>
              </div>
            </div>

            {/* Positive insight */}
            <div className="bg-green-50 rounded-2xl p-4 flex gap-3 border border-green-100">
              <Sparkles size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-600 mb-0.5">Small change, big impact</p>
                <p className="text-xs text-green-500 leading-relaxed">
                  Cutting RM60/month on food brings your October spend down to RM480 — a 60% difference!
                </p>
              </div>
            </div>
          </>
        )}

        {/* ── SAVINGS TAB ── */}
        {activeTab === "Savings" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 mb-1">Current path</p>
                <p className="text-2xl font-bold text-gray-800">RM 450</p>
                <p className="text-xs text-gray-400 mt-1">Savings by October</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-green-100">
                <p className="text-xs font-semibold text-green-500 mb-1">Better path</p>
                <p className="text-2xl font-bold text-gray-800">RM 1,220</p>
                <p className="text-xs text-gray-400 mt-1">Savings by October</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 text-sm mb-1">Savings Projection</h3>
              <p className="text-xs text-gray-400 mb-4">How much you could have saved</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={savingsProjection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => [`RM ${value}`, ""]} />
                  <ReferenceLine x="May" stroke="#6C63FF" strokeDasharray="4 4" />
                  <Line
                    type="monotone"
                    dataKey="current_path"
                    stroke="#FF6B6B"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    name="Current habits"
                  />
                  <Line
                    type="monotone"
                    dataKey="better_path"
                    stroke="#4ECDC4"
                    strokeWidth={2.5}
                    strokeDasharray="5 3"
                    dot={{ r: 3 }}
                    name="Save 20% more"
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-r from-[#6C63FF] to-[#9C8FFF] rounded-2xl p-4">
              <p className="text-white/70 text-xs mb-1">Difference by October</p>
              <p className="text-white text-2xl font-bold">+ RM 770</p>
              <p className="text-white/80 text-xs mt-1">
                Just by saving 20% more each month 💜
              </p>
            </div>
          </>
        )}

        {/* ── BUDGET TAB ── */}
        {activeTab === "Budget" && (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">AI Budget Plan</h3>
                  <p className="text-xs text-gray-400">Based on RM{budgetAllocation.income}/month income</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-600 font-medium px-2 py-1 rounded-full">
                  50/30/20 rule
                </span>
              </div>

              <div className="space-y-3">
                {budgetAllocation.breakdown.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{item.percentage}%</span>
                        <span className="text-xs font-semibold text-gray-800">
                          {formatMYR(item.amount)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Monthly Summary</h3>
              {[
                { label: "Total Income",    value: formatMYR(budgetAllocation.income), color: "text-green-500" },
                { label: "Fixed expenses",  value: formatMYR(400), color: "text-gray-800" },
                { label: "Daily spending",  value: formatMYR(360), color: "text-gray-800" },
                { label: "Goes to savings", value: formatMYR(440), color: "text-[#6C63FF]" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className={`text-sm font-semibold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}