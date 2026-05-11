'use client';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 35, cx = 45, cy = 45;
  const circ = 2 * Math.PI * r;
  let offsetAcc = 0;
  const slices = data.map((d) => {
    const dash = (d.value / total) * circ;
    const slice = { ...d, dash, offset: offsetAcc };
    offsetAcc += dash;
    return slice;
  });
  return (
    <svg viewBox="0 0 90 90" width="100%" height="100%">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f0f0" strokeWidth="14" />
      {slices.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth="14"
          strokeDasharray={`${s.dash} ${circ - s.dash}`}
          strokeDashoffset={-s.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      ))}
    </svg>
  );
}

const SPENDING = [
  { label: 'Food',      value: 280, color: '#FF6B6B' },
  { label: 'Transport', value: 160, color: '#4ECDC4' },
  { label: 'Groceries', value: 120, color: '#FFE66D' },
  { label: 'Bills',     value: 100, color: '#A8E6CF' },
  { label: 'Squad',     value: 55,  color: '#6a3de8' },
];

// Mini sparkline — just 4 points, compact
function MiniSparkline({ data, color }) {
  const W = 80, H = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const toX = (i) => (i / (data.length - 1)) * W;
  const toY = (v) => H - ((v - min) / (max - min || 1)) * (H - 4) - 2;
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <path d={path} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={toX(data.length - 1)} cy={toY(data[data.length - 1])}
        r="3" fill={color} />
    </svg>
  );
}

const STATIC_TX = [
  { emoji: '💸', desc: 'To Sha',           date: 'Today',  amount: -10   },
  { emoji: '🍔', desc: "McDonald's Subang", date: 'May 7',  amount: -12.5 },
  { emoji: '🚗', desc: 'Grab to campus',   date: 'May 7',  amount: -8    },
  { emoji: '💸', desc: 'From Ahmad',        date: 'May 6',  amount: 50    },
];

export default function DashboardPage() {
  const { balances, transactions } = useApp();
  const router = useRouter();
  const totalBalance = (balances.main + balances.savings + balances.squad).toFixed(2);
  const recentTx = transactions.length > 0 ? transactions.slice(0, 4) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

      {/* ── Purple header ── */}
      <div style={{ background: 'linear-gradient(160deg, #1a0a3d, #3d1f8a)', padding: '48px 20px 52px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>Good morning,</p>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>Harshini 👋</h1>
          </div>
          <button style={{
            width: 38, height: 38, background: 'rgba(255,255,255,0.2)',
            border: 'none', borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <i className="ti ti-bell" style={{ fontSize: 18, color: '#fff' }} />
          </button>
        </div>

        {/* Balance card */}
        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: 20,
          padding: 14, border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 2 }}>Total Balance</p>
          <p style={{ fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 10 }}>RM {totalBalance}</p>
          <div style={{ display: 'flex', gap: 14 }}>
            {[
              { label: 'Savings', val: `RM ${balances.savings}`, icon: 'ti-trending-up', bg: 'rgba(0,200,150,0.25)',   color: '#00C896' },
              { label: 'Squad',   val: `RM ${balances.squad}`,   icon: 'ti-users',        bg: 'rgba(156,143,255,0.25)', color: '#9C8FFF' },
              { label: 'Main',    val: `RM ${balances.main.toFixed(2)}`, icon: 'ti-wallet', bg: 'rgba(255,255,255,0.2)', color: '#fff' },
            ].map(({ label, val, icon, bg, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`ti ${icon}`} style={{ fontSize: 13, color }} />
                </div>
                <div>
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>{label}</p>
                  <strong style={{ fontSize: 12, color: '#fff', display: 'block' }}>{val}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ marginTop: -20 }}>

        {/* Streak */}
        <div style={{
          background: '#fff', borderRadius: 16, margin: '0 14px 10px',
          padding: '12px 14px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', border: '0.5px solid #eef0f4',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🔥</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>12-day saving streak!</p>
              <span style={{ fontSize: 11, color: '#aaa' }}>Saved RM 45.00 this week</span>
            </div>
          </div>
          <span style={{
            display: 'inline-flex', padding: '3px 9px', borderRadius: 20,
            fontSize: 10, fontWeight: 600, background: 'rgba(106,61,232,0.1)', color: '#9c6fff',
          }}>Best: 21 days</span>
        </div>

        {/* AI Coach */}
        <div style={{
          background: 'linear-gradient(135deg, #2a1260, #4a2aa0)',
          borderRadius: 16, margin: '0 14px 10px', padding: 14,
        }}>
          <p style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '.8px',
            color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 4,
          }}>AI Coach</p>
          <p style={{ fontSize: 12, color: '#fff', lineHeight: 1.6 }}>
            You've spent RM 280 on food this month — 35% of your budget. Your Squad pooled RM 300 for Smart Find. Try cooking 2× a week to save ~RM 60.
          </p>
        </div>

        {/* ── Spending Mirror card — tappable ── */}
        <div
          onClick={() => router.push('/mirror')}
          style={{
            background: '#fff', borderRadius: 16, margin: '0 14px 10px',
            border: '0.5px solid #eef0f4', overflow: 'hidden', cursor: 'pointer',
          }}
        >
          {/* Card header */}
          <div style={{
            padding: '12px 14px 10px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: 'rgba(106,61,232,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="ti ti-chart-donut" style={{ fontSize: 14, color: '#6a3de8' }} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>Spending Mirror</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                padding: '3px 9px', borderRadius: 20,
                fontSize: 10, fontWeight: 600, background: 'rgba(106,61,232,0.1)', color: '#9c6fff',
              }}>May 2026</span>
              <i className="ti ti-chevron-right" style={{ fontSize: 14, color: '#bbb' }} />
            </div>
          </div>

          {/* Compact donut + legend */}
          <div style={{ padding: '0 14px 10px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 72, height: 72, flexShrink: 0 }}>
              <DonutChart data={SPENDING} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {SPENDING.map((d) => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, color: '#888', display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: d.color, marginRight: 5, flexShrink: 0 }} />
                    {d.label}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#1a1a2e' }}>RM {d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sparklines row — spending vs savings at a glance */}
          <div style={{
            borderTop: '0.5px solid #f2f2f2',
            padding: '10px 14px',
            display: 'flex', gap: 0,
          }}>
            {[
              { label: 'Spending trend',  data: [720, 850, 780, 800], color: '#6a3de8', suffix: '↑ vs Mar' },
              { label: 'Savings trend',   data: [180, 120, 160, 145], color: '#00C896', suffix: '↓ vs Feb' },
              { label: 'Squad spending',  data: [40,  50,  50,  55],  color: '#9C8FFF', suffix: '↑ steady' },
            ].map((s, i) => (
              <div key={s.label} style={{
                flex: 1, textAlign: 'center',
                borderRight: i < 2 ? '0.5px solid #f2f2f2' : 'none',
                padding: '0 8px',
              }}>
                <p style={{ fontSize: 9, color: '#bbb', marginBottom: 4 }}>{s.label}</p>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                  <MiniSparkline data={s.data} color={s.color} />
                </div>
                <p style={{ fontSize: 9, color: s.color, fontWeight: 600 }}>{s.suffix}</p>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <div style={{
            background: 'linear-gradient(160deg, #1a0a3d, #3d1f8a)',
            padding: '11px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <i className="ti ti-chart-line" style={{ fontSize: 13, color: '#fff' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>View full mirror & AI forecast</span>
            <i className="ti ti-arrow-right" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '0.5px solid #eef0f4', margin: '0 14px 10px', padding: 14,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: '#1a1a2e',
            marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>Recent</span>
            <span
              onClick={() => router.push('/transactions')}
              style={{ fontSize: 11, color: '#6a3de8', fontWeight: 500, cursor: 'pointer' }}
            >See all</span>
          </div>
          {(recentTx || STATIC_TX).map((tx, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 0', borderBottom: i < arr.length - 1 ? '0.5px solid #f7f7f7' : 'none',
            }}>
              <div style={{
                width: 36, height: 36, background: '#f7f7f9', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}>{tx.emoji || '💸'}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>{tx.description || tx.desc}</p>
                <span style={{ fontSize: 11, color: '#aaa' }}>{tx.date}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: tx.amount > 0 ? '#00C896' : '#1a1a2e' }}>
                {tx.amount > 0 ? '+' : ''}RM {Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}