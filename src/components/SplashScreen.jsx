'use client';
import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('squad_splash');
    if (seen) { setVisible(false); return; }
    const fadeTimer = setTimeout(() => setFading(true), 1900);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('squad_splash', '1');
    }, 2400);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(160deg, #1a0a3d 0%, #3d1f8a 50%, #1a0a3d 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.5s ease',
      pointerEvents: fading ? 'none' : 'all',
    }}>

      {/* Glow orb behind logo */}
      <div style={{
        position: 'absolute',
        width: 200, height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(106,61,232,0.4) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -60%)',
      }} />

      {/* Logo mark */}
      <div style={{
        width: 88, height: 88, borderRadius: 26,
        background: 'rgba(255,255,255,0.12)',
        border: '1.5px solid rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
        animation: 'splashPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        boxShadow: '0 0 40px rgba(106,61,232,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)',
      }}>
        <svg viewBox="0 0 52 52" width="52" height="52" fill="none">
          {/* S for Squad */}
          <text x="6" y="40" fontSize="38" fontWeight="700"
            fill="#fff" fontFamily="DM Sans, sans-serif"
            style={{ letterSpacing: '-2px' }}>S</text>
          {/* Dot accent */}
          <circle cx="44" cy="12" r="5" fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{ animation: 'splashFadeUp 0.5s 0.2s ease both' }}>
        <p style={{
          fontSize: 38, fontWeight: 700, color: '#fff',
          letterSpacing: '-1px', marginBottom: 8,
          fontFamily: "'DM Sans', sans-serif",
        }}>Squad</p>
      </div>

      {/* Tagline */}
      <p style={{
        fontSize: 13, color: 'rgba(255,255,255,0.5)',
        fontFamily: "'DM Sans', sans-serif",
        animation: 'splashFadeUp 0.5s 0.35s ease both',
        letterSpacing: '.3px',
      }}>Smart budgeting · Group savings</p>

      {/* Loading dots */}
      <div style={{
        display: 'flex', gap: 7, marginTop: 52,
        animation: 'splashFadeUp 0.5s 0.5s ease both',
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
            animation: `splashDot 1.2s ${i * 0.18}s ease infinite`,
          }} />
        ))}
      </div>

      {/* GX Bank badge */}
      <div style={{
        position: 'absolute', bottom: 48,
        animation: 'splashFadeUp 0.5s 0.65s ease both',
      }}>
        <div style={{
          padding: '8px 16px', borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(8px)',
        }}>
          <p style={{
            fontSize: 11, color: 'rgba(255,255,255,0.45)',
            fontFamily: "'DM Sans', sans-serif", letterSpacing: '.3px',
            textAlign: 'center',
          }}>
            UTMx Hackathon 2026 ·{' '}
            <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>GX Bank</span>{' '}
            Challenge
          </p>
        </div>
      </div>

      <style>{`
        @keyframes splashPop {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes splashFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashDot {
          0%, 100% { opacity: 0.25; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}