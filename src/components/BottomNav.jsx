'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import VoiceModal from './VoiceModal';

const NAV_ITEMS = [
  { label: 'Home', icon: 'ti-home', href: '/dashboard' },
  { label: 'Transfer', icon: 'ti-arrows-left-right', href: '/transfer' },
  null, // mic placeholder
  { label: 'Find', icon: 'ti-search', href: '/smartfind' },
  { label: 'Squad', icon: 'ti-users', href: '/squad' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [voiceOpen, setVoiceOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff',
        borderTop: '0.5px solid #e8e8f0',
        padding: '8px 0 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        zIndex: 100,
      }}>
        {NAV_ITEMS.map((item, i) => {
          if (!item) {
            // Centre mic button
            return (
              <button
                key="mic"
                onClick={() => setVoiceOpen(true)}
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: '#00C896', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: -20,
                  boxShadow: '0 4px 16px rgba(0,200,150,0.35)',
                }}
              >
                <i className="ti ti-microphone" style={{ fontSize: 22, color: '#fff' }} />
              </button>
            );
          }

          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 3, background: 'none', border: 'none',
                cursor: 'pointer', padding: '4px 12px',
              }}
            >
              <i className={`ti ${item.icon}`} style={{
                fontSize: 22,
                color: isActive ? '#6C63FF' : '#bbb',
                transition: 'color .2s',
              }} />
              <span style={{
                fontSize: 10, fontWeight: 500,
                color: isActive ? '#6C63FF' : '#bbb',
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
