// ============================================================
// src/components/BottomNav.jsx
// Bottom navigation bar with centered voice button
// ============================================================

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useGroq } from "@/hooks/useGroq";
import { Home, ArrowLeftRight, Eye, Users, Mic } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home",     icon: Home,           path: "/dashboard" },
  { label: "Transfer", icon: ArrowLeftRight,  path: "/transfer"  },
  { label: "Mirror",   icon: Eye,             path: "/mirror"    },
  { label: "Squad",    icon: Users,           path: "/squad"     },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // ── Global voice handler ─────────────────────────────────
  const { status, listening, startListening } = useGroq((action) => {
    switch (action.action) {
      case "navigate":
        const pageRoutes = {
          dashboard: "/dashboard",
          savings:   "/dashboard",
          transfer:  "/transfer",
          mirror:    "/mirror",
          squad:     "/squad",
          profile:   "/dashboard",
        };
        if (pageRoutes[action.page]) {
          router.push(pageRoutes[action.page]);
        }
        break;

      case "transfer":
        // Navigate to transfer page with pre-filled params
        router.push(
          `/transfer?recipient=${encodeURIComponent(action.recipient || "")}&amount=${action.amount || ""}`
        );
        break;

      case "check_balance":
        router.push("/dashboard");
        break;

      case "add_expense":
      case "squad_contribute":
      case "set_savings_goal":
        // Navigate to relevant page — components handle the rest
        router.push(
          action.action === "squad_contribute" ? "/squad" : "/dashboard"
        );
        break;

      default:
        break;
    }
  });

  return (
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

        {/* ── Centre voice button ── */}
        <button
          onClick={startListening}
          className={`
            flex flex-col items-center justify-center
            w-14 h-14 rounded-full shadow-lg -mt-6
            transition-all duration-200
            ${listening
              ? "bg-red-500 scale-110 shadow-red-200"
              : status === "thinking"
              ? "bg-yellow-400 scale-105"
              : status === "done"
              ? "bg-green-500"
              : "bg-[#6C63FF]"
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

      {/* ── Voice status bar ── */}
      {status !== "idle" && (
        <div className={`
          mt-2 mx-4 py-1 px-3 rounded-full text-center text-xs font-medium
          transition-all duration-300
          ${listening  ? "bg-red-50 text-red-600" : ""}
          ${status === "thinking" ? "bg-yellow-50 text-yellow-700" : ""}
          ${status === "done"     ? "bg-green-50 text-green-700"   : ""}
          ${status === "error"    ? "bg-red-50 text-red-600"       : ""}
        `}>
          {listening ? "🎤 Listening..." : ""}
          {status === "thinking" ? "⚡ Processing..." : ""}
          {status === "done"     ? "✓ Got it!"        : ""}
          {status === "error"    ? "✗ Try again"      : ""}
        </div>
      )}
    </nav>
  );
}

// ── Reusable nav tab button ──────────────────────────────────
function NavButton({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 px-3 py-1"
    >
      <span className={active ? "text-[#6C63FF]" : "text-gray-400"}>
        {icon}
      </span>
      <span className={`text-[10px] font-medium ${active ? "text-[#6C63FF]" : "text-gray-400"}`}>
        {label}
      </span>
    </button>
  );
}