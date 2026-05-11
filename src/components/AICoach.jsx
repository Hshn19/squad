'use client';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';

const QUICK_QUESTIONS = [
  'How am I doing this month?',
  'Where am I overspending?',
  'How can I save more?',
  'Is my food budget okay?',
  'Tips for saving as a student?',
];

export default function AICoach() {
  const { balances, transactions } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hey Harshini! 👋 I'm your Squad AI coach. Ask me anything about your spending or savings — I've got your data right here." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const totalSpent = 800;
  const topCategory = 'Food (RM 280)';
  const recentTx = transactions.slice(0, 3).map(t => t.description).join(', ') || 'Food, Transport, Grab';

  async function sendMessage(text) {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context: { balances, totalSpent, topCategory, recentTx },
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "Connection issue lah — try again!" }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: 96, right: 16, zIndex: 200,
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6a3de8, #3d1f8a)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(106,61,232,0.5)',
            animation: 'coachPulse 2s ease infinite',
          }}
        >
          <i className="ti ti-robot" style={{ fontSize: 22, color: '#fff' }} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 88, left: 0, right: 0,
          maxWidth: 430, margin: '0 auto',
          zIndex: 300,
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -8px 40px rgba(26,10,61,0.2)',
          display: 'flex', flexDirection: 'column',
          height: '65vh',
          animation: 'slideUp .25s ease',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1a0a3d, #3d1f8a)',
            borderRadius: '20px 20px 0 0',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="ti ti-robot" style={{ fontSize: 18, color: '#fff' }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>AI Coach</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Powered by Groq · Always here</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 20, cursor: 'pointer' }}
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px 14px',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 8, alignItems: 'flex-end',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #6a3de8, #3d1f8a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className="ti ti-robot" style={{ fontSize: 13, color: '#fff' }} />
                  </div>
                )}
                <div style={{
                  maxWidth: '78%',
                  padding: '10px 13px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #6a3de8, #3d1f8a)'
                    : '#f4f2ff',
                  color: msg.role === 'user' ? '#fff' : '#1a1a2e',
                  fontSize: 13, lineHeight: 1.5,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6a3de8, #3d1f8a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <i className="ti ti-robot" style={{ fontSize: 13, color: '#fff' }} />
                </div>
                <div style={{
                  padding: '12px 16px', borderRadius: '16px 16px 16px 4px',
                  background: '#f4f2ff', display: 'flex', gap: 4, alignItems: 'center',
                }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#6a3de8',
                      animation: `splashDot 1s ${i * 0.2}s ease infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div style={{
              padding: '0 14px 8px',
              display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0,
            }}>
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    whiteSpace: 'nowrap', padding: '6px 12px',
                    borderRadius: 20, border: '1px solid #e0d8ff',
                    background: '#f4f2ff', color: '#6a3de8',
                    fontSize: 11, fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'inherit', flexShrink: 0,
                  }}
                >{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '10px 14px 16px',
            borderTop: '0.5px solid #f0f0f0',
            display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0,
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask your AI coach..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 12,
                border: '0.5px solid #e0d8ff', fontSize: 13,
                color: '#1a1a2e', background: '#f9f8ff',
                outline: 'none', fontFamily: 'inherit',
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              style={{
                width: 40, height: 40, borderRadius: 12, border: 'none',
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #6a3de8, #3d1f8a)'
                  : '#e0e0e0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                flexShrink: 0,
              }}
            >
              <i className="ti ti-send" style={{ fontSize: 16, color: '#fff' }} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes coachPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(106,61,232,0.5); }
          50%       { box-shadow: 0 4px 32px rgba(106,61,232,0.8); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes splashDot {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(-3px); }
        }
      `}</style>
    </>
  );
}