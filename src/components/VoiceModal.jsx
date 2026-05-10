// ============================================================
// src/components/VoiceModal.jsx
// Shows parsed voice action for user confirmation before executing
// ============================================================

"use client";

import { formatMYR, currentUser } from "@/lib/mockData";
import { Mic, X, Check } from "lucide-react";

export default function VoiceModal({ action, onConfirm, onDismiss, status }) {

  if (status === "listening") {
    return (
      <div className="fixed inset-0 bg-black/50 z-[90] flex items-end justify-center">
        <div className="bg-white w-full max-w-md rounded-t-3xl p-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#00C896]/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Mic size={28} className="text-[#00C896]" />
          </div>
          <p className="text-lg font-bold text-gray-800">Listening...</p>
          <p className="text-sm text-gray-400 mt-1">Speak your command</p>
          <div className="flex gap-1 mt-4">
            {[0,1,2,3,4].map(i => (
              <div
                key={i}
                className="w-1.5 bg-[#00C896] rounded-full animate-bounce"
                style={{ height: `${12 + Math.random() * 20}px`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <button onClick={onDismiss} className="mt-6 text-sm text-gray-400">Cancel</button>
        </div>
      </div>
    );
  }

  if (status === "thinking") {
    return (
      <div className="fixed inset-0 bg-black/50 z-[90] flex items-end justify-center">
        <div className="bg-white w-full max-w-md rounded-t-3xl p-8 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#00C896] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-base font-semibold text-gray-700">Processing...</p>
        </div>
      </div>
    );
  }

  if (status === "done" && action) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[90] flex items-end justify-center">
        <div className="bg-white w-full max-w-md rounded-t-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Voice Command Detected</p>
            <button onClick={onDismiss}>
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          {/* ── Transfer ── */}
          {action.action === "transfer" && (
            <ActionCard
              icon="💸"
              label="Transfer Money"
              color="#00C896"
              rows={[
                { label: "To",     value: action.recipient },
                { label: "Amount", value: formatMYR(action.amount) },
                { label: "Note",   value: action.note || "—" },
              ]}
            />
          )}

          {/* ── Add expense ── */}
          {action.action === "add_expense" && (
            <ActionCard
              icon="🧾"
              label="Log Expense"
              color="#FF6B35"
              rows={[
                { label: "Amount",      value: formatMYR(action.amount) },
                { label: "Category",    value: action.category },
                { label: "Description", value: action.description || "—" },
              ]}
            />
          )}

          {/* ── Squad contribute ── */}
          {action.action === "squad_contribute" && (
            <ActionCard
              icon="🎯"
              label="Squad Contribution"
              color="#6C63FF"
              rows={[
                { label: "Goal",   value: action.goal_name },
                { label: "Amount", value: formatMYR(action.amount) },
              ]}
            />
          )}

          {/* ── Check balance ── */}
          {action.action === "check_balance" && (
            <ActionCard
              icon="💰"
              label="Check Balance"
              color="#00C896"
              rows={[
                { label: "Account", value: action.account },
              ]}
            />
          )}

          {/* ── Navigate ── */}
          {action.action === "navigate" && (
            <ActionCard
              icon="🗺️"
              label="Navigate To"
              color="#00C896"
              rows={[
                { label: "Page", value: action.page },
              ]}
            />
          )}

          {/* ── Unknown ── */}
          {action.action === "unknown" && (
            <div className="bg-red-50 rounded-2xl p-4 text-center">
              <p className="text-2xl mb-2">🤔</p>
              <p className="text-sm font-semibold text-red-600">Couldn't understand that</p>
              <p className="text-xs text-red-400 mt-1">Try again with a clearer command</p>
            </div>
          )}

          {/* ── Buttons ── */}
          {action.action !== "unknown" && (
            <div className="flex gap-3 mt-5">
              <button
                onClick={onDismiss}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(action)}
                className="flex-1 py-3 rounded-2xl bg-[#00C896] text-white text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Check size={16} /> Confirm
              </button>
            </div>
          )}

          {action.action === "unknown" && (
            <button
              onClick={onDismiss}
              className="w-full mt-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-500"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}

function ActionCard({ icon, label, color, rows }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 mb-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-bold" style={{ color }}>{label}</span>
      </div>
      {rows.map(({ label, value }) => (
        <div key={label} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
          <span className="text-xs text-gray-400">{label}</span>
          <span className="text-xs font-semibold text-gray-800 capitalize">{value}</span>
        </div>
      ))}
    </div>
  );
}