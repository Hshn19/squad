// ============================================================
// src/app/squad/page.jsx
// Squad Savings — shared goals with friends, track contributions
// ============================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Users, Target, ChevronRight, Trophy } from "lucide-react";
import { squadGoals, formatMYR } from "@/lib/mockData";

export default function SquadPage() {
  const router = useRouter();
  const [activeGoal, setActiveGoal] = useState(null);
  const [contributeAmount, setContributeAmount] = useState("");
  const [contributed, setContributed] = useState(false);

  const handleContribute = () => {
    if (!contributeAmount || parseFloat(contributeAmount) <= 0) return;
    setContributed(true);
    setTimeout(() => {
      setContributed(false);
      setActiveGoal(null);
      setContributeAmount("");
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F7]">
      {/* ── Header ── */}
      <div className="bg-[#6C63FF] px-5 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
            >
              <ArrowLeft size={16} className="text-white" />
            </button>
            <div>
              <h1 className="text-white text-lg font-semibold">Squad Savings</h1>
              <p className="text-purple-200 text-xs">Save together, achieve more</p>
            </div>
          </div>
          <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Plus size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 py-4 space-y-4">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Active Goals", value: squadGoals.length, icon: "🎯" },
            { label: "Total Saved",  value: "RM 1,650",        icon: "💰" },
            { label: "Members",      value: "5 friends",       icon: "👥" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
              <div className="text-xl mb-1">{icon}</div>
              <p className="text-sm font-bold text-gray-800">{value}</p>
              <p className="text-[10px] text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Goals list ── */}
        <h3 className="font-semibold text-gray-800 text-sm px-1">Your Goals</h3>

        {squadGoals.map((goal) => {
          const progress = (goal.totalContributed / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.totalContributed;
          const daysLeft = Math.ceil(
            (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div key={goal.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Goal header */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{goal.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{daysLeft} days left</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#6C63FF]">
                      {formatMYR(goal.totalContributed)}
                    </p>
                    <p className="text-xs text-gray-400">of {formatMYR(goal.targetAmount)}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
                  <div
                    className="h-2.5 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: goal.color,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">
                    {progress.toFixed(0)}% funded · {formatMYR(remaining)} to go
                  </span>
                  {progress >= 50 && (
                    <span className="text-xs bg-yellow-50 text-yellow-600 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Trophy size={10} /> Halfway!
                    </span>
                  )}
                </div>

                {/* Member contributions */}
                <div className="space-y-2">
                  {goal.members.map((member) => {
                    const memberProgress = (member.contributed / member.target) * 100;
                    return (
                      <div key={member.name} className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: goal.color }}
                        >
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-0.5">
                            <span className="text-xs font-medium text-gray-700">{member.name}</span>
                            <span className="text-xs text-gray-400">
                              {formatMYR(member.contributed)} / {formatMYR(member.target)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(memberProgress, 100)}%`,
                                backgroundColor: goal.color,
                                opacity: 0.7,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contribute button */}
              <button
                onClick={() => setActiveGoal(goal)}
                className="w-full py-3 border-t border-gray-50 text-sm font-semibold text-[#6C63FF] flex items-center justify-center gap-1.5 active:bg-purple-50 transition-colors"
              >
                <Plus size={15} /> Contribute
              </button>
            </div>
          );
        })}

        {/* ── Create new goal prompt ── */}
        <button className="w-full bg-white rounded-2xl p-4 shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
            <Plus size={20} className="text-[#6C63FF]" />
          </div>
          <p className="text-sm font-semibold text-gray-600">Start a new goal</p>
          <p className="text-xs text-gray-400">Invite friends and save together</p>
        </button>

      </div>

      {/* ── Contribute modal ── */}
      {activeGoal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6">
            {contributed ? (
              <div className="flex flex-col items-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Contributed!</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {formatMYR(parseFloat(contributeAmount))} added to {activeGoal.name}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800">{activeGoal.name}</h3>
                    <p className="text-xs text-gray-400">
                      {formatMYR(activeGoal.totalContributed)} of {formatMYR(activeGoal.targetAmount)} saved
                    </p>
                  </div>
                  <button
                    onClick={() => { setActiveGoal(null); setContributeAmount(""); }}
                    className="text-gray-400 text-lg font-light"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  How much?
                </p>

                <div className="relative mb-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">RM</span>
                  <input
                    type="number"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#6C63FF]"
                    autoFocus
                  />
                </div>

                {/* Quick amounts */}
                <div className="flex gap-2 mb-5">
                  {[20, 50, 100, 200].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setContributeAmount(amt.toString())}
                      className={`
                        flex-1 py-2 rounded-lg text-xs font-medium border transition-all
                        ${contributeAmount === amt.toString()
                          ? "bg-[#6C63FF] text-white border-[#6C63FF]"
                          : "bg-gray-50 text-gray-500 border-gray-100"
                        }
                      `}
                    >
                      RM{amt}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleContribute}
                  disabled={!contributeAmount || parseFloat(contributeAmount) <= 0}
                  className={`
                    w-full py-4 rounded-2xl text-white font-semibold text-base transition-all
                    ${contributeAmount && parseFloat(contributeAmount) > 0
                      ? "bg-[#6C63FF] shadow-lg shadow-purple-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  Contribute {contributeAmount ? formatMYR(parseFloat(contributeAmount)) : ""}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}