// ============================================================
// src/hooks/useVoice.js
// Web Speech API hook — captures voice and returns transcript
// Free, built into Chrome, zero dependencies
// ============================================================

"use client";

import { useState, useRef, useCallback } from "react";

export function useVoice(onResult) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    // ── 1. Check browser support ───────────────────────────
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice not supported. Please use Chrome.");
      return;
    }

    // ── 2. Reset any previous errors ──────────────────────
    setError(null);

    // ── 3. Configure recognition ───────────────────────────
    const recognition = new SpeechRecognition();
    recognition.lang = "en-MY";        // Malaysian English
    recognition.interimResults = false; // wait for final result only
    recognition.maxAlternatives = 1;
    recognition.continuous = false;     // stop after one command

    // ── 4. Event handlers ──────────────────────────────────
    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Voice transcript:", transcript); // helpful for debugging
      onResult(transcript); // pass to useGroq hook
    };

    recognition.onerror = (event) => {
    // "aborted" fires normally after a successful result — safe to ignore
    if (event.error === "aborted") return;
    
    console.error("Voice error:", event.error);
    setListening(false);

    // Human-readable error messages
    const messages = {
        "no-speech":         "No speech detected. Try again.",
        "audio-capture":     "Microphone not found.",
        "not-allowed":       "Microphone access denied. Allow it in Chrome settings.",
        "network":           "Network error. Check your connection.",
      };
      setError(messages[event.error] || `Voice error: ${event.error}`);
    };

    // ── 5. Start ───────────────────────────────────────────
    recognitionRef.current = recognition;
    recognition.start();
  }, [onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    listening,   // boolean — true when mic is active
    error,       // string | null — error message if something went wrong
    startListening,
    stopListening,
  };
}