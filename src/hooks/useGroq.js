// ============================================================
// src/hooks/useGroq.js
// Connects voice transcript → parse-voice API → returns action
// Use this hook in any component that needs voice + AI intent
// ============================================================

"use client";

import { useState, useCallback } from "react";
import { useVoice } from "./useVoice";
import { contacts } from "@/lib/mockData";

// Extract just the names for the API
const CONTACT_NAMES = contacts.map((c) => c.name);

export function useGroq(onAction) {
  const [status, setStatus] = useState("idle");
  // idle | listening | thinking | done | error
  const [lastAction, setLastAction] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // ── Handle transcript from useVoice ─────────────────────
  const handleTranscript = useCallback(
    async (transcript) => {
      try {
        setStatus("thinking");
        setErrorMsg(null);

        // ── Call the parse-voice API route ───────────────
        const res = await fetch("/api/parse-voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: transcript,
            contacts: CONTACT_NAMES,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to parse voice command");
        }

        const action = data.action;
        setLastAction(action);
        setStatus("done");

        // ── Pass action to the component ─────────────────
        if (onAction) {
          onAction(action);
        }

        // Reset to idle after 3 seconds
        setTimeout(() => setStatus("idle"), 3000);

      } catch (err) {
        console.error("useGroq error:", err);
        setErrorMsg("Couldn't understand that. Try again.");
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    },
    [onAction]
  );

  // ── Wire up voice hook ───────────────────────────────────
  const { listening, error: voiceError, startListening, stopListening } =
    useVoice(handleTranscript);

  // Keep status in sync with listening state
  const handleStart = useCallback(() => {
    setStatus("listening");
    setErrorMsg(null);
    startListening();
  }, [startListening]);

  // ── Status label for UI display ──────────────────────────
  const statusLabel = {
    idle:      "Tap to speak",
    listening: "Listening...",
    thinking:  "Processing...",
    done:      "Got it! ✓",
    error:     "Try again",
  }[status];

  return {
    status,          // current state string
    statusLabel,     // human-readable label for buttons
    listening,       // boolean — mic is active
    lastAction,      // last parsed action object from Groq
    errorMsg: errorMsg || voiceError,  // any error message
    startListening: handleStart,
    stopListening,
  };
}