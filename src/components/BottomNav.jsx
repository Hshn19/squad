'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import VoiceModal from './VoiceModal';

const NAV_ITEMS = [
  { label: 'Home',     icon: 'ti-home',             href: '/dashboard' },
  { label: 'Transfer', icon: 'ti-arrows-left-right', href: '/transfer'  },
  null,
  { label: 'Find',     icon: 'ti-search',            href: '/smartfind' },
  { label: 'Squad',    icon: 'ti-users',             href: '/squad'     },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router   = useRouter();
  const [voiceOpen, setVoiceOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: 'sticky', bottom: 0,
        background: '#1a0a3d',
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
        padding: '10px 0 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        zIndex: 100,
        boxShadow: '0 -8px 32px rgba(26,10,61,0.8)',
        flexShrink: 0,
      }}>
        {NAV_ITEMS.map((item, i) => {
          if (!item) {
            return (
              <button
                key="mic"
                onClick={() => setVoiceOpen(true)}
                style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6a3de8, #3d1f8a)',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: -28,
                  boxShadow: '0 4px 24px rgba(106,61,232,0.6)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <i className="ti ti-microphone" style={{ fontSize: 22, color: '#fff' }} />
              </button>
            );
          }

          const isActive = pathname === item.href ||
            (item.href === '/dashboard' && pathname === '/');

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 3, background: 'none', border: 'none',
                cursor: 'pointer', padding: '4px 14px',
                position: 'relative',
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute', top: -10, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 20, height: 3, borderRadius: 2,
                  background: 'linear-gradient(90deg, #6a3de8, #9c6fff)',
                }} />
              )}
              <i className={`ti ${item.icon}`} style={{
                fontSize: 22,
                color: isActive ? '#9c6fff' : 'rgba(255,255,255,0.3)',
                transition: 'color .2s',
              }} />
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#9c6fff' : 'rgba(255,255,255,0.3)',
                transition: 'color .2s',
              }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {voiceOpen && <VoiceModal onClose={() => setVoiceOpen(false)} />}
    </>
  );
}