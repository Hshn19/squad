'use client';
import { useState } from 'react';
import { useApp } from '@/lib/AppContext';

const ALL_TX = [
  { emoji: '💸', desc: 'To Sha', date: 'Today, 11:32 AM', amount: -10, category: 'Transfer' },
  { emoji: '🍔', desc: "McDonald's Subang", date: 'May 7, 1:14 PM', amount: -12.5, category: 'Food' },
  { emoji: '🚗', desc: 'Grab to campus', date: 'May 7, 9:01 AM', amount: -8, category: 'Transport' },
  { emoji: '💸', desc: 'From Ahmad', date: 'May 6, 8:45 PM', amount: 50, category: 'Transfer' },
  { emoji: '🛒', desc: '99 Speedmart groceries', date: 'May 6, 6:20 PM', amount: -34.9, category: 'Groceries' },
  { emoji: '☕', desc: 'ZUS Coffee TTDI', date: 'May 5, 10:00 AM', amount: -13, category: 'Food' },
  { emoji: '🚗', desc: 'Grab home from KLCC', date: 'May 4, 9:40 PM', amount: -18, category: 'Transport' },
  { emoji: '📱', desc: 'Celcom bill', date: 'May 3, 12:00 PM', amount: -50, category: 'Bills' },
  { emoji: '🎓', desc: 'Ahmad squad contribution', date: 'May 2, 3:00 PM', amount: 75, category: 'Squad' },
  { emoji: '🍱', desc: 'Nasi Kandar Pelita', date: 'May 2, 1:10 PM', amount: -17, category: 'Food' },
  { emoji: '🛒', desc: 'Jaya Grocer, BJ', date: 'May 1, 5:10 PM', amount: -62, category: 'Groceries' },
  { emoji: '🎬', desc: 'GSC Cinema tickets', date: 'Apr 30, 7:00 PM', amount: -32, category: 'Entertainment' },
];

const CATS = ['All', 'Food', 'Transport', 'Groceries', 'Transfer', 'Bills', 'Squad', 'Entertainment'];

const CAT_COLORS = {
  Food: '#FF6B6B', Transport: '#4ECDC4', Groceries: '#FFE66D',
  Transfer: '#6C63FF', Bills: '#A8E6CF', Squad: '#9C8FFF', Entertainment: '#F8B500',
};

export default function TransactionsPage() {
  const { transactions } = useApp();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Merge context transactions (newest first) with static fallback
  const allTx = transactions.length > 0
    ? [...transactions.map((t) => ({
        emoji: t.emoji || '💸',
        desc: t.description,
        date: t.date,
        amount: t.amount,
        category: t.category || 'Transfer',
      })), ...ALL_TX]
    : ALL_TX;

  const filtered = allTx.filter((tx) => {
    const matchCat = filter === 'All' || tx.category === filter;
    const matchSearch = !search || tx.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalIn = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

      {/* Purple header */}
      <div style={{ background: '#6C63FF', padding: '48px 20px 52px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Transactions</h2>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>Your full spending history</p>
        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: 14,
          padding: '12px 14px', border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Money in</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#A8F0D8' }}>+RM {totalIn.toFixed(2)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Money out</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>-RM {totalOut.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ marginTop: -20 }}>

        {/* Search */}
        <div style={{ margin: '0 14px 10px', position: 'relative' }}>
          <i className="ti ti-search" style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: 16, color: '#bbb',
          }} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px 12px 36px',
              borderRadius: 12, border: '0.5px solid #e0e0e8',
              fontSize: 13, color: '#1a1a2e', background: '#fff',
              outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 14px 10px' }}>
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                whiteSpace: 'nowrap', padding: '5px 11px', borderRadius: 20,
                border: `0.5px solid ${filter === c ? '#6C63FF' : '#ddd'}`,
                background: filter === c ? '#6C63FF' : '#fff',
                color: filter === c ? '#fff' : '#666',
                fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >{c}</button>
          ))}
        </div>

        {/* Transaction list */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '0.5px solid #eef0f4', margin: '0 14px 10px', padding: '4px 14px',
        }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#aaa', fontSize: 13 }}>
              No transactions found
            </div>
          )}
          {filtered.map((tx, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 0',
              borderBottom: i < filtered.length - 1 ? '0.5px solid #f7f7f7' : 'none',
            }}>
              <div style={{
                width: 38, height: 38, background: '#f7f7f9', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}>{tx.emoji}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>{tx.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: 10, color: '#aaa' }}>{tx.date}</span>
                  {tx.category && (
                    <span style={{
                      fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 10,
                      background: CAT_COLORS[tx.category] ? CAT_COLORS[tx.category] + '22' : '#f0f0f0',
                      color: CAT_COLORS[tx.category] || '#888',
                    }}>{tx.category}</span>
                  )}
                </div>
              </div>
              <span style={{
                fontSize: 13, fontWeight: 600,
                color: tx.amount > 0 ? '#00C896' : '#1a1a2e',
              }}>
                {tx.amount > 0 ? '+' : ''}RM {Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
