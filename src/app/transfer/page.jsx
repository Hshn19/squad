'use client';
import { useState, useEffect, Suspense } from 'react';
import { useApp } from '@/lib/AppContext';
import { useSearchParams } from 'next/navigation';

const CONTACTS = [
  { initial: 'A', name: 'Ahmad', color: '#9C8FFF' },
  { initial: 'S', name: 'Sha', color: '#5DCAA5' },
  { initial: 'W', name: 'Wei', color: '#F0997B' },
  { initial: '+', name: 'New', color: '#FAC775' },
];

const SQUADS = [
  {
    key: 'main', label: 'Uni Besties 🎓', sub: '4 members · RM 270 pool',
    hint: 'Uni Besties pool: <strong>RM 270</strong>. You\'re owed <strong>RM 90</strong> — settle up first?',
    members: [
      { i: 'H', c: '#9C8FFF' }, { i: 'A', c: '#5DCAA5' },
      { i: 'S', c: '#F0997B' }, { i: 'W', c: '#FAC775' },
    ],
  },
  {
    key: 'fam', label: 'Family 🏠', sub: '3 members · RM 150 pool',
    hint: 'Family pool: <strong>RM 150</strong>. All settled up ✓',
    members: [
      { i: 'M', c: '#FF8C69' }, { i: 'D', c: '#6C63FF' }, { i: 'K', c: '#FFD93D' },
    ],
  },
  {
    key: 'work', label: 'Work Gang 💼', sub: '5 members · RM 480 pool',
    hint: 'Work Gang pool: <strong>RM 480</strong>. You\'re owed <strong>RM 120</strong> — settle up first?',
    members: [
      { i: 'R', c: '#26C6DA' }, { i: 'J', c: '#AB47BC' },
      { i: 'N', c: '#66BB6A' }, { i: 'Z', c: '#FFA726' }, { i: 'L', c: '#EF5350' },
    ],
  },
];

const SETTLE = [
  { icon: 'ti-arrows-exchange', label: 'Ahmad owes you', amount: 'RM 25.00', positive: true },
  { icon: 'ti-arrow-up', label: 'You owe Sha', amount: 'RM 15.00', positive: false },
  { icon: 'ti-arrow-up', label: 'You owe Wei', amount: 'RM 10.00', positive: false },
];

function TransferInner() {
  const { doTransfer, showToast, balances } = useApp();
  const searchParams = useSearchParams();

  const [selectedContact, setSelectedContact] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [squadToggle, setSquadToggle] = useState(false);
  const [selectedSquad, setSelectedSquad] = useState('main');
  const [justSent, setJustSent] = useState(false);

  // Pre-fill from URL params (set by voice command)
  useEffect(() => {
    const recipient = searchParams.get('recipient');
    const amt = searchParams.get('amount');
    const n = searchParams.get('note');

    if (recipient) {
      const match = CONTACTS.find(
        (c) => c.name.toLowerCase() === recipient.toLowerCase()
      );
      setSelectedContact(match ? match.name : recipient);
    }
    if (amt) setAmount(amt);
    if (n) setNote(n);
  }, []); // run once on mount — params are stable

  const handleSend = () => {
    if (!selectedContact || !amount || parseFloat(amount) <= 0) {
      showToast('Please select a contact and enter an amount');
      return;
    }
    if (parseFloat(amount) > balances.main) {
      showToast('Insufficient balance');
      return;
    }
    doTransfer(selectedContact, parseFloat(amount), note);
    setJustSent(true);
    setTimeout(() => {
      setJustSent(false);
      setSelectedContact(null);
      setAmount('');
      setNote('');
    }, 2000);
  };

  const activeSquad = SQUADS.find((s) => s.key === selectedSquad);
  const amtNum = parseFloat(amount);
  const isOverBalance = amtNum > balances.main;
  const canSend = selectedContact && amtNum > 0 && !isOverBalance && !justSent;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

      {/* Purple header */}
      <div style={{ background: 'linear-gradient(160deg, #1a0a3d, #3d1f8a)', padding: '48px 20px 60px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Transfer</h2>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Send money or settle with your Squad</p>
        <div style={{
          marginTop: 12, background: 'rgba(255,255,255,0.15)', borderRadius: 12,
          padding: '10px 14px', border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Available balance</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>RM {balances.main.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ marginTop: -28, padding: '0 14px' }}>

        {/* Squad settle up */}
        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #eef0f4', margin: '0 0 10px', padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>Squad settle up</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {SETTLE.map((s, i) => (
              <div key={i} style={{ flex: 1, background: '#fff', border: '0.5px solid #eee', borderRadius: 12, padding: 10, textAlign: 'center', cursor: 'pointer' }}>
                <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: '#6a3de8', display: 'block', marginBottom: 4 }} />
                <p style={{ fontSize: 11, fontWeight: 600, color: '#1a1a2e' }}>{s.label}</p>
                <span style={{ fontSize: 12, fontWeight: 600, color: s.positive ? '#00C896' : '#FF6B6B' }}>{s.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Send money */}
        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #eef0f4', margin: '0 0 10px', padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>Send money</div>

          {/* Success flash */}
          {justSent && (
            <div style={{
              background: '#E8FFF5', borderRadius: 12, padding: '14px',
              marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10,
              border: '0.5px solid #B0FFD4',
            }}>
              <span style={{ fontSize: 22 }}>✅</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0F6E56' }}>Sent!</p>
                <p style={{ fontSize: 12, color: '#0F6E56' }}>RM {amount} to {selectedContact}</p>
              </div>
            </div>
          )}

          {/* Contacts */}
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, marginBottom: 12 }}>
            {CONTACTS.map((c) => (
              <div
                key={c.name}
                onClick={() => c.name !== 'New' && setSelectedContact(c.name)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', flexShrink: 0 }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: c.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: '#fff',
                  outline: selectedContact === c.name ? '2.5px solid #6C63FF' : 'none',
                  outlineOffset: 2,
                }}>
                  {c.initial}
                </div>
                <span style={{
                  fontSize: 10,
                  color: selectedContact === c.name ? '#6C63FF' : '#888',
                  fontWeight: selectedContact === c.name ? 600 : 400,
                }}>{c.name}</span>
              </div>
            ))}
          </div>

          {selectedContact && (
            <div style={{ marginBottom: 10, padding: '6px 12px', background: 'rgba(106,61,232,0.1)', borderRadius: 8, fontSize: 12, color: '#9c6fff', fontWeight: 500 }}>
              Sending to: <strong>{selectedContact}</strong>
            </div>
          )}

          {/* Amount */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Amount</div>
            <input
              type="number"
              placeholder="RM 0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%', padding: '16px', borderRadius: 12,
                border: `0.5px solid ${isOverBalance ? '#FF6B6B' : '#e0e0e8'}`,
                fontSize: 24, fontWeight: 700, textAlign: 'center',
                color: '#1a1a2e', background: '#fff', outline: 'none', fontFamily: 'inherit',
              }}
            />
            {amount && amtNum > 0 && (
              <p style={{ fontSize: 11, color: isOverBalance ? '#FF6B6B' : '#aaa', marginTop: 6, textAlign: 'center' }}>
                {isOverBalance
                  ? `Exceeds balance by RM ${(amtNum - balances.main).toFixed(2)}`
                  : `Remaining after transfer: RM ${(balances.main - amtNum).toFixed(2)}`}
              </p>
            )}
          </div>

          {/* Note */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Note</div>
            <input
              type="text"
              placeholder="What's it for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 12,
                border: '0.5px solid #e0e0e8', fontSize: 14,
                color: '#1a1a2e', background: '#fff', outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Squad toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(106,61,232,0.1)', borderRadius: 12, padding: '12px 14px', marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="ti ti-users" style={{ fontSize: 18, color: '#6a3de8' }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#9c6fff' }}>Split with Squad?</p>
                <span style={{ fontSize: 11, color: '#9C8FFF', display: 'block' }}>Logs this in the group ledger</span>
              </div>
            </div>
            <div onClick={() => setSquadToggle(!squadToggle)} style={{ position: 'relative', width: 40, height: 22, cursor: 'pointer' }}>
              <div style={{ position: 'absolute', inset: 0, background: squadToggle ? '#6C63FF' : '#ccc', borderRadius: 11, transition: '.3s' }} />
              <div style={{ position: 'absolute', width: 16, height: 16, left: squadToggle ? 21 : 3, top: 3, background: '#fff', borderRadius: '50%', transition: '.3s' }} />
            </div>
          </div>

          {squadToggle && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>Choose Squad</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                {SQUADS.map((sq) => (
                  <div key={sq.key} onClick={() => setSelectedSquad(sq.key)} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: selectedSquad === sq.key ? '#EEEDFE' : '#f7f7fb',
                    border: `1.5px solid ${selectedSquad === sq.key ? '#6C63FF' : '#e8e8f2'}`,
                    borderRadius: 14, padding: '10px 12px', cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex' }}>
                      {sq.members.map((m, i) => (
                        <div key={i} style={{
                          width: 22, height: 22, borderRadius: '50%', background: m.c,
                          border: '2px solid #fff', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', marginRight: -5,
                        }}>{m.i}</div>
                      ))}
                    </div>
                    <div style={{ flex: 1, paddingLeft: 8 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{sq.label}</p>
                      <span style={{ fontSize: 11, color: '#888' }}>{sq.sub}</span>
                    </div>
                    <div style={{
                      width: 22, height: 22, background: 'linear-gradient(160deg, #1a0a3d, #3d1f8a)', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: selectedSquad === sq.key ? 1 : 0, transition: 'opacity .2s',
                    }}>
                      <i className="ti ti-check" style={{ fontSize: 12, color: '#fff' }} />
                    </div>
                  </div>
                ))}
              </div>
              {activeSquad && (
                <div style={{ background: '#f0f0fa', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: '#9c6fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="ti ti-info-circle" style={{ fontSize: 16, color: '#6a3de8', flexShrink: 0 }} />
                  <span dangerouslySetInnerHTML={{ __html: activeSquad.hint }} />
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={!canSend}
            style={{
              width: '100%', padding: 16, border: 'none', borderRadius: 16,
              fontSize: 15, fontWeight: 700, cursor: canSend ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              background: canSend ? '#6C63FF' : '#e0e0e8',
              color: canSend ? '#fff' : '#aaa',
              transition: 'background .2s',
            }}
          >
            {selectedContact && amtNum > 0
              ? `Send RM ${amtNum.toFixed(2)} to ${selectedContact}`
              : 'Send money'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense — required by Next.js for useSearchParams
export default function TransferPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>Loading…</div>}>
      <TransferInner />
    </Suspense>
  );
}