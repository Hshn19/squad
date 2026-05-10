'use client';
import { useState } from 'react';

const CATEGORIES = [
  { label: 'Food', current: 280, better: 200, color: '#FF6B6B' },
  { label: 'Transport', current: 160, better: 120, color: '#4ECDC4' },
  { label: 'Groceries', current: 120, better: 90, color: '#FFE66D' },
  { label: 'Bills', current: 100, better: 100, color: '#A8E6CF' },
  { label: 'Shopping', current: 85, better: 50, color: '#F8B500' },
  { label: 'Squad', current: 55, better: 55, color: '#6C63FF' },
];

const INSIGHTS = [
  { icon: '🍔', title: 'Food spending is high', desc: 'RM 280 vs. RM 200 target. Cook 2× per week to save ~RM 60.', color: '#FFF0E8', border: '#FFD4B0' },
  { icon: '🚗', title: 'Transport can be trimmed', desc: 'Use Grab pooling or MRT more to cut RM 40/month.', color: '#E8F5FF', border: '#B0D4FF' },
  { icon: '🛍️', title: 'Shopping impulse buys', desc: 'RM 35 above your target. Try a 24-hour wait rule.', color: '#FFF8E8', border: '#FFE0B0' },
  { icon: '✅', title: 'Bills on track', desc: 'Great job — you hit your bills budget exactly this month.', color: '#E8FFF5', border: '#B0FFD4' },
];

const MONTHLY = [
  { month: 'Feb', total: 720 },
  { month: 'Mar', total: 850 },
  { month: 'Apr', total: 780 },
  { month: 'May', total: 800 },
];

function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '10px 0', fontSize: 12, fontWeight: 500,
        color: active ? '#6C63FF' : '#bbb',
        borderBottom: active ? '2px solid #6C63FF' : '2px solid transparent',
        background: 'none', border: 'none',
        borderBottom: active ? '2px solid #6C63FF' : '2px solid transparent',
        cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit',
      }}
    >{label}</button>
  );
}

function DonutChart() {
  const data = CATEGORIES.map((c) => ({ ...c, value: c.current }));
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 35, cx = 45, cy = 45, circ = 2 * Math.PI * r;
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

export default function MirrorPage() {
  const [tab, setTab] = useState('breakdown');
  const maxBar = Math.max(...MONTHLY.map((m) => m.total));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

      {/* Purple header */}
      <div style={{ background: '#6C63FF', padding: '48px 20px 28px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Spending Mirror</h2>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>See where your money really goes</p>

        {/* Summary strip */}
        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: 14,
          padding: '12px 14px', border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>May spending</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>RM 800</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Better path</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#A8F0D8' }}>RM 615</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Potential save</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#FFE66D' }}>RM 185</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', background: '#fff',
        borderBottom: '0.5px solid #eee', padding: '0 16px',
      }}>
        <TabBtn label="Breakdown" active={tab === 'breakdown'} onClick={() => setTab('breakdown')} />
        <TabBtn label="Better Path" active={tab === 'better'} onClick={() => setTab('better')} />
        <TabBtn label="Insights" active={tab === 'insights'} onClick={() => setTab('insights')} />
      </div>

      {/* Tab content */}
      <div style={{ padding: 14 }}>

        {/* BREAKDOWN TAB */}
        {tab === 'breakdown' && (
          <>
            {/* Donut + Legend */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: 14,
              border: '0.5px solid #eef0f4', marginBottom: 10,
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>Category breakdown</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 90, height: 90, flexShrink: 0 }}>
                  <DonutChart />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {CATEGORIES.map((c) => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, marginRight: 5 }} />
                        {c.label}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#1a1a2e' }}>RM {c.current}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '0.5px solid #f2f2f2', paddingTop: 10, marginTop: 10, display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#aaa' }}>Total spent</p>
                  <strong style={{ fontSize: 13, color: '#1a1a2e', display: 'block' }}>RM 800</strong>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#aaa' }}>Solo spending</p>
                  <strong style={{ fontSize: 13, color: '#1a1a2e', display: 'block' }}>RM 745</strong>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#aaa' }}>Squad spending</p>
                  <strong style={{ fontSize: 13, color: '#6C63FF', display: 'block' }}>RM 55</strong>
                </div>
              </div>
            </div>

            {/* Monthly trend bars */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: 14,
              border: '0.5px solid #eef0f4', marginBottom: 10,
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 12 }}>Monthly trend</p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 80 }}>
                {MONTHLY.map((m) => {
                  const h = (m.total / maxBar) * 64;
                  return (
                    <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 9, color: '#aaa' }}>RM {m.total}</span>
                      <div style={{
                        width: '100%', height: h,
                        background: m.month === 'May' ? '#6C63FF' : '#EEEDFE',
                        borderRadius: 4,
                      }} />
                      <span style={{ fontSize: 10, color: m.month === 'May' ? '#6C63FF' : '#bbb', fontWeight: m.month === 'May' ? 600 : 400 }}>{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* BETTER PATH TAB */}
        {tab === 'better' && (
          <div style={{
            background: '#fff', borderRadius: 16, padding: 14,
            border: '0.5px solid #eef0f4',
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>Current vs. Better path</p>
            <p style={{ fontSize: 11, color: '#aaa', marginBottom: 14 }}>Bars show potential savings per category</p>
            {CATEGORIES.map((c) => {
              const saving = c.current - c.better;
              return (
                <div key={c.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#1a1a2e' }}>{c.label}</span>
                    </div>
                    {saving > 0
                      ? <span style={{ fontSize: 11, color: '#00C896', fontWeight: 600 }}>Save RM {saving}</span>
                      : <span style={{ fontSize: 11, color: '#aaa' }}>On track ✓</span>
                    }
                  </div>
                  <div style={{ background: '#f0f0f0', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 4, background: c.color,
                      width: `${(c.current / 300) * 100}%`, transition: 'width .4s',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                    <span style={{ fontSize: 9, color: '#aaa' }}>RM {c.better} target</span>
                    <span style={{ fontSize: 9, color: '#aaa' }}>RM {c.current} current</span>
                  </div>
                </div>
              );
            })}
            <div style={{
              background: '#E8FFF5', borderRadius: 12, padding: '12px 14px',
              border: '0.5px solid #B0FFD4', marginTop: 8,
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#0F6E56', marginBottom: 2 }}>
                💡 Follow the better path and save RM 185/month
              </p>
              <p style={{ fontSize: 11, color: '#0F6E56' }}>That's RM 2,220 a year — enough for a trip!</p>
            </div>
          </div>
        )}

        {/* INSIGHTS TAB */}
        {tab === 'insights' && (
          <>
            <div style={{
              background: 'linear-gradient(135deg,#6C63FF,#9C8FFF)',
              borderRadius: 12, padding: '10px 12px', marginBottom: 10,
            }}>
              <p style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '.8px',
                color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 3,
              }}>AI Coach</p>
              <p style={{ fontSize: 11, color: '#fff', lineHeight: 1.5 }}>
                Your biggest leakage is food. Cutting to your target saves RM 80 alone — that covers your Netflix + Spotify for 3 months.
              </p>
            </div>
            {INSIGHTS.map((ins, i) => (
              <div key={i} style={{
                background: ins.color, borderRadius: 14,
                border: `0.5px solid ${ins.border}`,
                padding: '12px 14px', marginBottom: 10,
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{ins.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 3 }}>{ins.title}</p>
                  <p style={{ fontSize: 11, color: '#666', lineHeight: 1.5 }}>{ins.desc}</p>
                </div>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
