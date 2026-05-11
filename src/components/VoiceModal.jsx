'use client';
import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';

const HINTS = [
  '"Transfer RM20 to Ahmad"',
  '"Go to mirror"',
  '"I spent RM15 on food"',
  '"What\'s my balance?"',
  '"Go to transactions"',
  '"Add RM50 to Tokyo trip"',
  '"Go to Smart Find"',
];

const NAV_KEYWORDS = {
  mirror: '/mirror',
  'spending mirror': '/mirror',
  home: '/dashboard',
  dashboard: '/dashboard',
  squad: '/squad',
  smartfind: '/smartfind',
  'smart find': '/smartfind',
  find: '/smartfind',
  transactions: '/transactions',
  history: '/transactions',
};

export default function VoiceModal({ onClose }) {
  const { doTransfer, addExpense, contributeToGoal, balances, showToast } = useApp();
  const router = useRouter();

  const [phase, setPhase] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [parsedAction, setParsedAction] = useState(null);
  const [hintIdx, setHintIdx] = useState(0);
  const recognitionRef = useRef(null);
  const gotResultRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setHintIdx((i) => (i + 1) % HINTS.length), 2500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    startListening();
    return () => recognitionRef.current?.abort();
  }, []);

  function startListening() {
    gotResultRef.current = false;
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setPhase('error');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-MY';
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;

    rec.onstart = () => setPhase('listening');

    rec.onresult = (e) => {
      gotResultRef.current = true;
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setPhase('processing');
      parseIntent(text);
    };

    rec.onerror = () => {
      gotResultRef.current = true;
      setPhase('error');
    };

    rec.onend = () => {
      if (!gotResultRef.current) setPhase('error');
    };

    rec.start();
  }

  async function parseIntent(text) {
    const lower = text.toLowerCase();

    // ── 1. Balance check (instant, no API) ──
    if (lower.includes('balance') || lower.includes('savings') || lower.includes('how much')) {
      showToast(`Main: RM ${balances.main.toFixed(2)} · Savings: RM ${balances.savings}`);
      onClose();
      return;
    }

    // ── 2. Transfer intent — improved accuracy ──
const tLower = lower
  .replace(/rm\s*/gi, '')      // strip "RM" prefix
  .replace(/ringgit/gi, '');   // strip "ringgit"

// Patterns: "transfer/send/pay/hantar [amount] to [name]"
const transferPatterns = [
  /(?:transfer|send|pay|hantar)\s+(\d+(?:\.\d+)?)\s+to\s+(\w+)/i,
  /(?:transfer|send|pay|hantar)\s+to\s+(\w+)\s+(\d+(?:\.\d+)?)/i,  // "send to Ahmad 50"
  /(?:transfer|send|pay|hantar)\s+(\w+)\s+(\d+(?:\.\d+)?)/i,        // "pay Ahmad 50"
];

let transferAmount = null;
let transferRecipient = null;

for (const pattern of transferPatterns) {
  const m = tLower.match(pattern);
  if (m) {
    // Pattern 2 has name first, then amount
    if (pattern.toString().includes('to\\s+(\\w+)\\s+')) {
      transferRecipient = m[1];
      transferAmount    = m[2];
    } else {
      transferAmount    = m[1];
      transferRecipient = m[2];
    }
    break;
  }
}

// Validate — recipient shouldn't be a number, amount should be numeric
if (
  transferAmount &&
  transferRecipient &&
  !isNaN(parseFloat(transferAmount)) &&
  isNaN(parseFloat(transferRecipient)) &&
  parseFloat(transferAmount) > 0
) {
  const recipientFormatted =
    transferRecipient.charAt(0).toUpperCase() +
    transferRecipient.slice(1).toLowerCase();
  const isSquadTransfer = /squad|group|split|shared/i.test(lower);
  const params = new URLSearchParams({
    recipient: recipientFormatted,
    amount: parseFloat(transferAmount).toString(),
    note: '',
    squad: isSquadTransfer ? 'true' : 'false',
    t: Date.now(), // cache buster — forces searchParams to change even for same recipient
  });
  router.push(`/transfer?${params.toString()}`);
  showToast(`Opening Transfer — RM ${transferAmount} to ${recipientFormatted}`);
  onClose();
  return;
}

    // ── 3. Navigation (instant, no API) ──
    for (const [keyword, path] of Object.entries(NAV_KEYWORDS)) {
      if (lower.includes(keyword)) {
        router.push(path);
        showToast(`Navigating to ${keyword}`);
        onClose();
        return;
      }
    }

    // ── 4. Groq API for expense / squad / ambiguous ──
    try {
      const res = await fetch('/api/parse-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text }),
      });
      const data = await res.json();
      const action = data.action;

      if (!action || action.type === 'unknown') {
        setPhase('error');
        return;
      }

      if (action.type === 'navigate') {
        const path = NAV_KEYWORDS[action.page?.toLowerCase()] || '/dashboard';
        router.push(path);
        showToast(`Navigating to ${action.page}`);
        onClose();
        return;
      }

      if (action.type === 'check_balance') {
        showToast(`Main: RM ${balances.main.toFixed(2)} · Savings: RM ${balances.savings}`);
        onClose();
        return;
      }

      // Groq caught a transfer the regex missed (e.g. unusual phrasing)
      if (action.type === 'transfer') {
        const recipientFormatted = action.recipient
          ? action.recipient.charAt(0).toUpperCase() + action.recipient.slice(1).toLowerCase()
          : '';
        const params = new URLSearchParams({
          recipient: recipientFormatted,
          amount: action.amount?.toString() || '',
          note: action.note || '',
        });
        router.push(`/transfer?${params.toString()}`);
        showToast(`Opening Transfer for ${recipientFormatted}`);
        onClose();
        return;
      }

      // Expense + squad → confirmation modal
      setParsedAction(action);
      setPhase('confirm');
    } catch {
      setPhase('error');
    }
  }

  function executeAction() {
    if (!parsedAction) return;
    const a = parsedAction;
    if (a.type === 'add_expense') {
      addExpense(a.amount, a.category || 'Other', a.description || 'Expense');
      showToast(`✓ Logged RM ${a.amount} · ${a.category}`);
    } else if (a.type === 'squad_contribute') {
      contributeToGoal(a.goalId || 'tokyo', 'Harshini', a.amount);
      showToast(`✓ Added RM ${a.amount} to ${a.goal}`);
    }
    onClose();
  }

  function confirmLabel(a) {
    if (a.type === 'add_expense') return `Log RM ${a.amount} expense · ${a.category || 'Other'}`;
    if (a.type === 'squad_contribute') return `Add RM ${a.amount} to ${a.goal || 'squad goal'}`;
    return 'Execute action';
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(26,26,46,0.72)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 500, backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: '24px 24px 0 0',
        padding: '28px 20px 44px', width: '100%', maxWidth: 480,
        animation: 'slideUp .25s ease',
      }}>

        {/* ── IDLE / LISTENING ── */}
        {(phase === 'idle' || phase === 'listening') && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>
                {phase === 'idle' ? 'Starting mic…' : 'Listening…'}
              </p>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#bbb', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{
                width: 76, height: 76, borderRadius: '50%',
                background: phase === 'listening' ? '#00C896' : '#e0e0e0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: phase === 'listening'
                  ? '0 0 0 18px rgba(0,200,150,0.12), 0 0 0 36px rgba(0,200,150,0.05)'
                  : 'none',
                animation: phase === 'listening' ? 'pulse 1.6s ease infinite' : 'none',
                transition: 'background .3s',
              }}>
                <i className="ti ti-microphone" style={{ fontSize: 30, color: '#fff' }} />
              </div>
            </div>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#bbb', marginBottom: 6 }}>Try saying</p>
            <p style={{ textAlign: 'center', fontSize: 14, fontWeight: 500, color: '#6C63FF', minHeight: 22 }}>
              {HINTS[hintIdx]}
            </p>
          </>
        )}

        {/* ── PROCESSING ── */}
        {phase === 'processing' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>Got it, thinking…</p>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#bbb', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{
              background: '#EEEDFE', borderRadius: 12,
              padding: '12px 14px', marginBottom: 20,
              fontSize: 14, color: '#534AB7', fontStyle: 'italic',
            }}>
              "{transcript}"
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#aaa', fontSize: 13 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                border: '2.5px solid #6C63FF', borderTopColor: 'transparent',
                animation: 'spin .7s linear infinite', flexShrink: 0,
              }} />
              Parsing with AI…
            </div>
          </>
        )}

        {/* ── CONFIRM ── */}
        {phase === 'confirm' && parsedAction && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>Confirm action</p>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#bbb', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{
              background: '#f7f7fb', borderRadius: 12,
              padding: '10px 14px', marginBottom: 8,
              fontSize: 12, color: '#888', fontStyle: 'italic',
            }}>
              You said: "{transcript}"
            </div>
            <div style={{
              background: '#F8F9FB', borderRadius: 14,
              padding: 18, border: '0.5px solid #eef0f4', marginBottom: 24,
            }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>{confirmLabel(parsedAction)}</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: 14, borderRadius: 14,
                  border: '0.5px solid #e0e0e8', background: '#fff',
                  fontSize: 14, fontWeight: 600, color: '#888',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Cancel</button>
              <button
                onClick={executeAction}
                style={{
                  flex: 2, padding: 14, borderRadius: 14,
                  border: 'none', background: 'linear-gradient(135deg, #6a3de8, #3d1f8a)',
                  fontSize: 14, fontWeight: 700, color: '#fff',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Confirm</button>
            </div>
          </>
        )}

        {/* ── ERROR ── */}
        {phase === 'error' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>Couldn't understand</p>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#bbb', cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: '#aaa', marginBottom: 24, lineHeight: 1.6 }}>
              Make sure your mic is allowed in Chrome, then try again. Say something like "Transfer RM20 to Ahmad" or "Go to mirror".
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: 14, borderRadius: 14,
                  border: '0.5px solid #e0e0e8', background: '#fff',
                  fontSize: 14, fontWeight: 600, color: '#888',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Dismiss</button>
              <button
                onClick={() => { setPhase('idle'); startListening(); }}
                style={{
                  flex: 2, padding: 14, borderRadius: 14,
                  border: 'none', background: 'linear-gradient(135deg, #6a3de8, #3d1f8a)',
                  fontSize: 14, fontWeight: 700, color: '#fff',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Try again</button>
            </div>
          </>
        )}

      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 18px rgba(0,200,150,0.12), 0 0 0 36px rgba(0,200,150,0.05); }
          50%      { box-shadow: 0 0 0 24px rgba(0,200,150,0.18), 0 0 0 48px rgba(0,200,150,0.07); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}