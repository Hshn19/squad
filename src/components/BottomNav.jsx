// ============================================================
// src/components/BottomNav.jsx
// Bottom nav + global voice handler with confirmation modal
// Safe actions (navigate, balance) execute instantly
// Destructive actions (transfer, expense, squad) need confirmation
// ============================================================

"use client";

import { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useVoice } from "@/hooks/useVoice";
import { useApp } from "@/lib/AppContext";
import { contacts } from "@/lib/mockData";
import VoiceModal from "./VoiceModal";
import { Home, ArrowLeftRight, Eye, Users, Mic } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home",     icon: Home,           path: "/dashboard" },
  { label: "Transfer", icon: ArrowLeftRight,  path: "/transfer"  },
  { label: "Mirror",   icon: Eye,             path: "/mirror"    },
  { label: "Squad",    icon: Users,           path: "/squad"     },
];

const CONTACT_NAMES = contacts.map((c) => c.name);

const PAGE_ROUTES = {
  dashboard: "/dashboard",
  savings:   "/dashboard",
  transfer:  "/transfer",
  mirror:    "/mirror",
  squad:     "/squad",
  profile:   "/dashboard",
};

// Actions that execute instantly without confirmation
const AUTO_EXECUTE = ["navigate", "check_balance"];

export default function BottomNav() {
  const pathname = usePathname();
  const router   = useRouter();
  const { balances, doTransfer, addExpense, contributeToGoal, squadGoals, showToast } = useApp();

  const [voiceStatus, setVoiceStatus] = useState("idle");
  const [pendingAction, setPendingAction] = useState(null);

  // ── 1. Dismiss modal ─────────────────────────────────────
  const handleDismiss = useCallback(() => {
    setPendingAction(null);
    setVoiceStatus("idle");
  }, []);

  // ── 2. Execute confirmed action ──────────────────────────
  // Defined before handleTranscript so it can be referenced
  const handleConfirm = useCallback((action) => {
    setPendingAction(null);
    setVoiceStatus("idle");

    switch (action.action) {

      case "navigate":
        if (PAGE_ROUTES[action.page]) router.push(PAGE_ROUTES[action.page]);
        break;

      case "transfer":
        doTransfer(action.recipient, action.amount, action.note || "");
        router.push("/dashboard");
        break;

      case "add_expense":
        addExpense(action.amount, action.category, action.description);
        router.push("/dashboard");
        break;

      case "squad_contribute": {
        const goal = squadGoals.find((g) =>
          g.name.toLowerCase().includes(action.goal_name?.toLowerCase() || "")
        );
        if (goal) {
          contributeToGoal(goal.id, "Harshini", action.amount);
          router.push("/squad");
        } else {
          showToast("Goal not found — try again", "error");
        }
        break;
      }

      case "check_balance": {
        const accountMap = {
          main:    balances.main,
          savings: balances.savings,
          squad:   balances.squad,
        };
        const bal = accountMap[action.account] ?? balances.main;
        showToast(`${action.account} balance: RM ${bal.toFixed(2)}`);
        break;
      }

      case "set_savings_goal":
        showToast(`Goal "${action.goal_name}" noted! Coming soon.`);
        break;

      default:
        break;
    }
  }, [router, doTransfer, addExpense, contributeToGoal, squadGoals, balances, showToast]);

  // ── 3. Handle transcript → call Groq API ─────────────────
  // Defined after handleConfirm so it can call it directly
  const handleTranscript = useCallback(async (transcript) => {
    setVoiceStatus("thinking");

    try {
      const res = await fetch("/api/parse-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript, contacts: CONTACT_NAMES }),
      });
      const data = await res.json();
      const action = data.success
        ? data.action
        : { action: "unknown", raw_text: transcript };

      // Auto-execute safe actions instantly — no modal needed
      if (AUTO_EXECUTE.includes(action.action)) {
        setVoiceStatus("idle");
        handleConfirm(action);
        return;
      }

      // Destructive actions show confirmation modal
      setPendingAction(action);
      setVoiceStatus("done");

    } catch {
      setPendingAction({ action: "unknown", raw_text: transcript });
      setVoiceStatus("done");
    }
  }, [handleConfirm]);

  // ── 4. Voice hook ────────────────────────────────────────
  const { listening, startListening } = useVoice(handleTranscript);

  // ── 5. Mic button press ──────────────────────────────────
  const handleMicPress = useCallback(() => {
    setPendingAction(null);
    setVoiceStatus("listening");
    startListening();
  }, [startListening]);

  return (
    <>
      {/* ── Voice Modal ── */}
      {voiceStatus !== "idle" && (
        <VoiceModal
          action={pendingAction}
          status={voiceStatus}
          onConfirm={handleConfirm}
          onDismiss={handleDismiss}
        />
      )}

      {/* ── Nav bar ── */}
      <nav className="bg-white border-t border-gray-100 px-2 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.slice(0, 2).map(({ label, icon: Icon, path }) => (
            <NavButton
              key={path}
              label={label}
              icon={<Icon size={22} />}
              active={pathname === path}
              onClick={() => router.push(path)}
            />
          ))}

          {/* ── Centre mic button ── */}
          <button
            onClick={handleMicPress}
            className={`
              flex flex-col items-center justify-center relative
              w-14 h-14 rounded-full shadow-lg -mt-6
              transition-all duration-200
              ${listening
                ? "bg-red-500 scale-110 shadow-red-200"
                : voiceStatus === "thinking"
                ? "bg-yellow-400 scale-105"
                : "bg-[#00C896]"
              }
            `}
          >
            <Mic size={24} className="text-white" />
            {listening && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
            )}
          </button>

          {NAV_ITEMS.slice(2).map(({ label, icon: Icon, path }) => (
            <NavButton
              key={path}
              label={label}
              icon={<Icon size={22} />}
              active={pathname === path}
              onClick={() => router.push(path)}
            />
          ))}
        </div>
      </nav>
    </>
  );
}

function NavButton({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 px-3 py-1"
    >
      <span className={active ? "text-[#00C896]" : "text-gray-400"}>{icon}</span>
      <span className={`text-[10px] font-medium ${active ? "text-[#00C896]" : "text-gray-400"}`}>
        {label}
      </span>
    </button>
  );
}