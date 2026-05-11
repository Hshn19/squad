'use client';
import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only show on first load per session
    const seen = sessionStorage.getItem('fw_splash');
    if (seen) { setVisible(false); return; }

    const fadeTimer = setTimeout(() => setFading(true), 1800);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('fw_splash', '1');
    }, 2300);

    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#6C63FF',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.5s ease',
      pointerEvents: fading ? 'none' : 'all',
    }}>

      {/* Logo mark */}
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: 'rgba(255,255,255,0.15)',
        border: '1.5px solid rgba(255,255,255,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
        animation: 'splashPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
      }}>
        {/* FW monogram */}
        <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
          {/* F */}
          <text x="3" y="36" fontSize="28" fontWeight="700"
            fill="#fff" fontFamily="DM Sans, sans-serif">F</text>
          {/* W */}
          <text x="22" y="36" fontSize="28" fontWeight="700"
            fill="rgba(255,255,255,0.6)" fontFamily="DM Sans, sans-serif">W</text>
          {/* Green dot accent */}
          <circle cx="42" cy="10" r="5" fill="#00C896" />
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{
        animation: 'splashFadeUp 0.5s 0.2s ease both',
      }}>
        <p style={{
        fontSize: 32, fontWeight: 700, color: '#fff',
        letterSpacing: '-0.5px', marginBottom: 6,
        fontFamily: "'DM Sans', sans-serif",
      }}>Squad</p>
      </div>

      {/* Tagline */}
      <p style={{
      fontSize: 13, color: 'rgba(255,255,255,0.65)',
      fontFamily: "'DM Sans', sans-serif",
      animation: 'splashFadeUp 0.5s 0.35s ease both',
    }}>Smart budgeting and group savings</p>

      {/* Animated dots */}
      <div style={{
        display: 'flex', gap: 6, marginTop: 40,
        animation: 'splashFadeUp 0.5s 0.5s ease both',
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
            animation: `splashDot 1s ${i * 0.15}s ease infinite`,
          }} />
        ))}
      </div>

      {/* GX Bank badge */}
      <div style={{
        position: 'absolute', bottom: 40,
        display: 'flex', alignItems: 'center', gap: 8,
        animation: 'splashFadeUp 0.5s 0.6s ease both',
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 12 }}>🏦</span>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans', sans-serif" }}>
          Built for UTMx Hackathon 2026 · GX Bank Challenge
        </p>
      </div>

      <style>{`
        @keyframes splashPop {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes splashFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashDot {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}