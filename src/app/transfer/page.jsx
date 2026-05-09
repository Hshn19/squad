// ============================================================
// src/app/transfer/page.jsx
// Voice-powered transfer page — auto-fills form from voice command
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGroq } from "@/hooks/useGroq";
import { contacts, balances, formatMYR } from "@/lib/mockData";
import { ArrowLeft, Mic, CheckCircle, ChevronDown } from "lucide-react";
import { Suspense } from "react";

function TransferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Form state ───────────────────────────────────────────
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount]       = useState("");
  const [note, setNote]           = useState("");
  const [step, setStep]           = useState("form"); // form | confirm | success

  // ── Pre-fill from URL params (voice navigation from BottomNav) ──
  useEffect(() => {
    const r = searchParams.get("recipient");
    const a = searchParams.get("amount");
    if (r) setRecipient(r);
    if (a) setAmount(a);
  }, [searchParams]);

  // ── Voice handler ────────────────────────────────────────
  const { status, listening, startListening } = useGroq((action) => {
    if (action.action === "transfer") {
      if (action.recipient) setRecipient(action.recipient);
      if (action.amount)    setAmount(action.amount.toString());
      if (action.note)      setNote(action.note);
    }
  });

  // ── Find selected contact ────────────────────────────────
  const selectedContact = contacts.find(
    (c) => c.name.toLowerCase() === recipient.toLowerCase()
  );

  const isValid = recipient.trim() !== "" && parseFloat(amount) > 0;

  // ── Handle approve ───────────────────────────────────────
  const handleApprove = () => {
    setStep("success");
    setTimeout(() => {
      router.push("/dashboard");
    }, 2500);
  };

  // ── Success screen ───────────────────────────────────────
  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={44} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Transfer Sent!</h2>
        <p className="text-gray-400 text-sm mb-2">
          {formatMYR(parseFloat(amount))} to {recipient}
        </p>
        <p className="text-gray-300 text-xs">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ── Header ── */}
      <div className="bg-[#6C63FF] px-5 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Transfer Money</h1>
        </div>

        {/* ── Voice button ── */}
        <div className="flex flex-col items-center">
          <button
            onClick={startListening}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center shadow-lg
              transition-all duration-200
              ${listening
                ? "bg-red-400 scale-110"
                : status === "thinking"
                ? "bg-yellow-300 scale-105"
                : status === "done"
                ? "bg-green-400"
                : "bg-white"
              }
            `}
          >
            <Mic
              size={28}
              className={listening || status === "thinking" || status === "done"
                ? "text-white"
                : "text-[#6C63FF]"
              }
            />
          </button>
          <p className="text-white/80 text-xs mt-2">
            {status === "idle"     ? 'Say "Transfer RM10 to Lena"' : ""}
            {status === "listening"? "🎤 Listening..."             : ""}
            {status === "thinking" ? "⚡ Processing..."            : ""}
            {status === "done"     ? "✓ Form filled!"              : ""}
            {status === "error"    ? "✗ Try again"                 : ""}
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="flex-1 px-5 py-6 space-y-5">

        {/* Balance pill */}
        <div className="flex justify-end">
          <span className="text-xs bg-purple-50 text-purple-600 font-medium px-3 py-1 rounded-full">
            Available: {formatMYR(balances.main)}
          </span>
        </div>

        {/* Recipient */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Recipient
          </label>

          {/* Contact chips */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => setRecipient(c.name)}
                className={`
                  flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl border
                  transition-all duration-150
                  ${recipient === c.name
                    ? "border-[#6C63FF] bg-purple-50"
                    : "border-gray-100 bg-gray-50"
                  }
                `}
              >
                <div className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                  ${recipient === c.name ? "bg-[#6C63FF] text-white" : "bg-gray-200 text-gray-600"}
                `}>
                  {c.avatar}
                </div>
                <span className={`text-[10px] font-medium ${recipient === c.name ? "text-[#6C63FF]" : "text-gray-500"}`}>
                  {c.name}
                </span>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Or type a name..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF]"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Amount (MYR)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
              RM
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF]"
            />
          </div>

          {/* Quick amounts */}
          <div className="flex gap-2 mt-2">
            {[5, 10, 20, 50].map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className={`
                  flex-1 py-1.5 rounded-lg text-xs font-medium border
                  transition-all duration-150
                  ${amount === amt.toString()
                    ? "bg-[#6C63FF] text-white border-[#6C63FF]"
                    : "bg-gray-50 text-gray-500 border-gray-100"
                  }
                `}
              >
                RM{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Note (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's this for?"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF]"
          />
        </div>

        {/* Preview */}
        {isValid && (
          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
            <p className="text-xs text-purple-400 font-medium mb-2">Transfer Summary</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#6C63FF] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {selectedContact?.avatar || recipient[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-800">{recipient}</span>
              </div>
              <span className="text-lg font-bold text-[#6C63FF]">{formatMYR(parseFloat(amount))}</span>
            </div>
            {note && <p className="text-xs text-gray-400 mt-2">"{note}"</p>}
          </div>
        )}

        {/* Approve button */}
        <button
          onClick={handleApprove}
          disabled={!isValid}
          className={`
            w-full py-4 rounded-2xl text-white font-semibold text-base
            transition-all duration-200
            ${isValid
              ? "bg-[#6C63FF] shadow-lg shadow-purple-200 active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {isValid ? `Approve — Send ${formatMYR(parseFloat(amount))}` : "Fill in details to continue"}
        </button>
      </div>
    </div>
  );
}

export default function TransferPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p className="text-gray-400">Loading...</p></div>}>
      <TransferContent />
    </Suspense>
  );
}