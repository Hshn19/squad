'use client';
import { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';

const CATEGORIES = [
  { label: 'Food',      current: 280, better: 200, color: '#FF6B6B' },
  { label: 'Transport', current: 160, better: 120, color: '#4ECDC4' },
  { label: 'Groceries', current: 120, better: 90,  color: '#FFE66D' },
  { label: 'Bills',     current: 100, better: 100, color: '#A8E6CF' },
  { label: 'Shopping',  current: 85,  better: 50,  color: '#F8B500' },
  { label: 'Squad',     current: 55,  better: 55,  color: '#6C63FF' },
];

const INSIGHTS = [
  { icon: '🍔', title: 'Food spending is high',    desc: 'RM 280 vs. RM 200 target. Cook 2× per week to save ~RM 60.',  color: '#FFF0E8', border: '#FFD4B0' },
  { icon: '🚗', title: 'Transport can be trimmed', desc: 'Use Grab pooling or MRT more to cut RM 40/month.',             color: '#E8F5FF', border: '#B0D4FF' },
  { icon: '🛍️', title: 'Shopping impulse buys',    desc: 'RM 35 above your target. Try a 24-hour wait rule.',            color: '#FFF8E8', border: '#FFE0B0' },
  { icon: '✅', title: 'Bills on track',            desc: 'Great job — you hit your bills budget exactly this month.',    color: '#E8FFF5', border: '#B0FFD4' },
];

const SPENDING_HISTORY = [
  { month: 'Jan', personal: 640, squad: 40 },
  { month: 'Feb', personal: 680, squad: 40 },
  { month: 'Mar', personal: 800, squad: 50 },
  { month: 'Apr', personal: 730, squad: 50 },
  { month: 'May', personal: 745, squad: 55 },
];

const SAVINGS_HISTORY = [
  { month: 'Jan', savings: 160 },
  { month: 'Feb', savings: 180 },
  { month: 'Mar', savings: 120 },
  { month: 'Apr', savings: 160 },
  { month: 'May', savings: 145 },
];

// ── Compact SVG Line Chart ──
function LineChart({ lines, height = 100, xLabels, predicted = [] }) {
  const W = 300, H = height;
  const PAD = { top: 16, right: 40, bottom: 20, left: 32 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const allValues = lines.flatMap((l) => l.data);
  const minVal = Math.min(...allValues) * 0.88;
  const maxVal = Math.max(...allValues) * 1.08;

  const toX = (i) => PAD.left + (i / (xLabels.length - 1)) * chartW;
  const toY = (v) => PAD.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

  const makePath = (data, from = 0) =>
    data.slice(from).map((v, i) =>
      `${i === 0 ? 'M' : 'L'} ${toX(i + from)} ${toY(v)}`
    ).join(' ');

  // Y axis labels — 3 ticks only
  const ticks = [minVal, (minVal + maxVal) / 2, maxVal].map((v) => ({
    y: toY(v), label: Math.round(v),
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>

      {/* Grid — 3 lines only */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y}
            stroke="#f2f2f2" strokeWidth="1" />
          <text x={PAD.left - 4} y={t.y + 3} fontSize="7" fill="#ccc" textAnchor="end">
            {t.label}
          </text>
        </g>
      ))}

      {/* Predicted region */}
      {predicted.length > 0 && (
        <rect
          x={toX(predicted[0])} y={PAD.top}
          width={toX(xLabels.length - 1) - toX(predicted[0])}
          height={chartH}
          fill="rgba(0,200,150,0.05)"
        />
      )}

      {lines.map((line, li) => {
        const solidEnd = predicted.length > 0 ? predicted[0] + 1 : line.data.length;
        return (
          <g key={li}>
            {/* Area */}
            <path
              d={`${makePath(line.data)} L ${toX(line.data.length - 1)} ${PAD.top + chartH} L ${PAD.left} ${PAD.top + chartH} Z`}
              fill={line.color} fillOpacity="0.07" stroke="none"
            />
            {/* Solid segment */}
            <path d={makePath(line.data, 0).split(' ').slice(0, solidEnd * 3).join(' ')}
              fill="none" stroke={line.color} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Dashed predicted segment */}
            {predicted.length > 0 && (
              <path d={makePath(line.data, predicted[0])}
                fill="none" stroke={line.color} strokeWidth="1.8"
                strokeDasharray="5 3" strokeLinecap="round" opacity="0.75"
              />
            )}
            {/* Dots — only at key points (first, last, predicted boundary) */}
            {[0, line.data.length - 1, ...(predicted.length > 0 ? [predicted[0]] : [])].map((idx) => (
              idx < line.data.length && (
                <circle key={idx}
                  cx={toX(idx)} cy={toY(line.data[idx])} r="3"
                  fill={predicted.includes(idx) ? '#fff' : line.color}
                  stroke={line.color} strokeWidth="2"
                />
              )
            ))}
            {/* Last value label */}
            <text
              x={toX(line.data.length - 1) + 4}
              y={toY(line.data[line.data.length - 1]) - 4}
              fontSize="8" fill={line.color} fontWeight="700"
            >
              {line.data[line.data.length - 1]}
            </text>
          </g>
        );
      })}

      {/* X labels */}
      {xLabels.map((lbl, i) => (
        <text key={i} x={toX(i)} y={H - 3}
          fontSize="8" fill={predicted.includes(i) ? '#00C896' : '#ccc'}
          textAnchor="middle" fontWeight={predicted.includes(i) ? '600' : '400'}
        >
          {lbl}{predicted.includes(i) ? '*' : ''}
        </text>
      ))}
    </svg>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 35, cx = 45, cy = 45, circ = 2 * Math.PI * r;
  let off = 0;
  const slices = data.map((d) => {
    const dash = (d.value / total) * circ;
    const s = { ...d, dash, offset: off };
    off += dash;
    return s;
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

function TabBtn({ label, active, onClick, highlight }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '10px 0', fontSize: 11, fontWeight: 500,
      color: active ? '#6C63FF' : '#bbb',
      borderBottom: active ? '2px solid #6C63FF' : '2px solid transparent',
      background: 'none', border: 'none',
      borderBottom: active ? '2px solid #6C63FF' : '2px solid transparent',
      cursor: 'pointer', fontFamily: 'inherit', position: 'relative',
    }}>
      {label}
      {highlight && (
        <span style={{
          position: 'absolute', top: 6, right: 6,
          width: 6, height: 6, borderRadius: '50%', background: '#00C896',
        }} />
      )}
    </button>
  );
}

function Legend({ items }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 16, height: 2.5, borderRadius: 2, background: item.color,
            opacity: item.dashed ? 0.6 : 1,
            backgroundImage: item.dashed ? `repeating-linear-gradient(90deg,${item.color} 0,${item.color} 4px,transparent 4px,transparent 7px)` : 'none',
          }} />
          <span style={{ fontSize: 9, color: '#aaa' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function MirrorPage() {
  const { transactions, balances } = useApp();
  const [tab, setTab] = useState('breakdown');
  const [forecast, setForecast] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState(false);
  const [forecastFetched, setForecastFetched] = useState(false);

  const liveTotals = {};
  transactions.forEach((tx) => {
    if (tx.amount < 0 && tx.category)
      liveTotals[tx.category] = (liveTotals[tx.category] || 0) + Math.abs(tx.amount);
  });

  const mergedCategories = CATEGORIES.map((c) => ({
    ...c, current: c.current + (liveTotals[c.label] || 0),
  }));

  const totalSpent    = mergedCategories.reduce((s, c) => s + c.current, 0);
  const squadSpent    = mergedCategories.find((c) => c.label === 'Squad')?.current || 55;
  const soloSpent     = totalSpent - squadSpent;
  const potentialSave = mergedCategories.reduce((s, c) => s + Math.max(0, c.current - c.better), 0);
  const betterPath    = totalSpent - potentialSave;

  const liveHistory = SPENDING_HISTORY.map((h) =>
    h.month === 'May' ? { ...h, personal: soloSpent, squad: squadSpent } : h
  );
  const xMonths = liveHistory.map((h) => h.month);

  async function fetchForecast() {
    if (forecastFetched) return;
    setForecastLoading(true);
    setForecastError(false);
    try {
      const res = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spending: mergedCategories, totalSpent, balances,
          history: liveHistory.map((h, i) => ({
            month: h.month, total: h.personal + h.squad,
            savings: SAVINGS_HISTORY[i]?.savings || 150,
          })),
        }),
      });
      const data = await res.json();
      setForecast(data);
      setForecastFetched(true);
    } catch {
      setForecastError(true);
    }
    setForecastLoading(false);
  }

  useEffect(() => {
    if (tab === 'forecast' && !forecastFetched && !forecastLoading) fetchForecast();
  }, [tab]);

  const forecastMonths   = forecast ? [...xMonths, ...forecast.spendingForecast.map((f) => f.month)] : xMonths;
  const forecastPersonal = forecast ? [...liveHistory.map((h) => h.personal), ...forecast.spendingForecast.map((f) => Math.round(f.amount * 0.93))] : liveHistory.map((h) => h.personal);
  const forecastSquad    = forecast ? [...liveHistory.map((h) => h.squad),    ...forecast.spendingForecast.map((f) => Math.round(f.amount * 0.07))] : liveHistory.map((h) => h.squad);
  const forecastSavings  = forecast ? [...SAVINGS_HISTORY.map((h) => h.savings), ...forecast.savingsForecast.map((f) => f.amount)] : SAVINGS_HISTORY.map((h) => h.savings);
  const predIdxs         = forecast ? forecast.spendingForecast.map((_, i) => xMonths.length + i) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

      {/* Header */}
      <div style={{ background: '#6C63FF', padding: '48px 20px 28px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Spending Mirror</h2>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>See where your money really goes</p>
        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: 14,
          padding: '12px 14px', border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>May spending</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>RM {totalSpent}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Better path</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#A8F0D8' }}>RM {betterPath}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Potential save</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#FFE66D' }}>RM {potentialSave}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '0.5px solid #eee', padding: '0 16px' }}>
        <TabBtn label="Breakdown"   active={tab === 'breakdown'} onClick={() => setTab('breakdown')} />
        <TabBtn label="Better Path" active={tab === 'better'}    onClick={() => setTab('better')} />
        <TabBtn label="Insights"    active={tab === 'insights'}  onClick={() => setTab('insights')} />
        <TabBtn label="AI Forecast" active={tab === 'forecast'}  onClick={() => setTab('forecast')} highlight />
      </div>

      <div style={{ padding: 14 }}>

        {/* ── BREAKDOWN ── */}
        {tab === 'breakdown' && (
          <>
            {/* Donut */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 14, border: '0.5px solid #eef0f4', marginBottom: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>May breakdown</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, flexShrink: 0 }}>
                  <DonutChart data={mergedCategories.map((c) => ({ ...c, value: c.current }))} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {mergedCategories.map((c) => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.color, marginRight: 5, flexShrink: 0 }} />
                        {c.label}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#1a1a2e' }}>RM {c.current}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '0.5px solid #f2f2f2', paddingTop: 8, marginTop: 10, display: 'flex', gap: 8 }}>
                {[
                  { label: 'Total spent',    val: `RM ${totalSpent}`,  color: '#1a1a2e' },
                  { label: 'Solo spending',  val: `RM ${soloSpent}`,   color: '#1a1a2e' },
                  { label: 'Squad spending', val: `RM ${squadSpent}`,  color: '#6C63FF' },
                ].map((s) => (
                  <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
                    <p style={{ fontSize: 9, color: '#aaa' }}>{s.label}</p>
                    <strong style={{ fontSize: 12, color: s.color, display: 'block' }}>{s.val}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal vs Squad line chart */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 14, border: '0.5px solid #eef0f4', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>Personal vs Squad</p>
                <span style={{ fontSize: 10, color: '#aaa' }}>Jan – May</span>
              </div>
              <LineChart
                lines={[
                  { data: liveHistory.map((h) => h.personal), color: '#6C63FF' },
                  { data: liveHistory.map((h) => h.squad),    color: '#00C896' },
                ]}
                xLabels={xMonths}
                height={100}
              />
              <Legend items={[
                { label: 'Personal', color: '#6C63FF' },
                { label: 'Squad',    color: '#00C896' },
              ]} />
              <div style={{
                marginTop: 8, background: '#EEEDFE', borderRadius: 8,
                padding: '7px 10px', display: 'flex', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 10, color: '#534AB7' }}>Squad saves you on average</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#6C63FF' }}>
                  RM {Math.round(liveHistory.reduce((s, h) => s + h.squad, 0) / liveHistory.length)}/mo
                </span>
              </div>
            </div>

            {/* Savings trend line chart */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 14, border: '0.5px solid #eef0f4', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>Savings trend</p>
                <span
                  onClick={() => setTab('forecast')}
                  style={{ fontSize: 10, color: '#00C896', fontWeight: 600, cursor: 'pointer' }}
                >AI forecast →</span>
              </div>
              <LineChart
                lines={[{ data: SAVINGS_HISTORY.map((h) => h.savings), color: '#00C896' }]}
                xLabels={SAVINGS_HISTORY.map((h) => h.month)}
                height={90}
              />
              <div style={{
                marginTop: 8, background: '#E8FFF5', borderRadius: 8,
                padding: '7px 10px', display: 'flex', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 10, color: '#0F6E56' }}>Monthly average</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#00C896' }}>
                  RM {Math.round(SAVINGS_HISTORY.reduce((s, h) => s + h.savings, 0) / SAVINGS_HISTORY.length)}/mo
                </span>
              </div>
            </div>
          </>
        )}

        {/* ── BETTER PATH ── */}
        {tab === 'better' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 14, border: '0.5px solid #eef0f4' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 2 }}>Current vs. Better path</p>
            <p style={{ fontSize: 11, color: '#aaa', marginBottom: 14 }}>Dashed line = target · filled = current</p>
            {mergedCategories.map((c) => {
              const saving = c.current - c.better;
              return (
                <div key={c.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#1a1a2e' }}>{c.label}</span>
                    </div>
                    {saving > 0
                      ? <span style={{ fontSize: 11, color: '#00C896', fontWeight: 600 }}>Save RM {saving}</span>
                      : <span style={{ fontSize: 11, color: '#aaa' }}>On track ✓</span>}
                  </div>
                  <div style={{ background: c.color + '22', borderRadius: 6, height: 8, position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', height: '100%', borderRadius: 6,
                      background: c.color, width: `${Math.min((c.current / 350) * 100, 100)}%`,
                    }} />
                    <div style={{
                      position: 'absolute', height: '100%',
                      borderRight: `2px dashed ${c.color}88`,
                      left: `${Math.min((c.better / 350) * 100, 100)}%`,
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                    <span style={{ fontSize: 9, color: '#aaa' }}>Target RM {c.better}</span>
                    <span style={{ fontSize: 9, color: '#aaa' }}>Current RM {c.current}</span>
                  </div>
                </div>
              );
            })}
            <div style={{ background: '#E8FFF5', borderRadius: 12, padding: '12px 14px', border: '0.5px solid #B0FFD4' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#0F6E56', marginBottom: 2 }}>
                💡 Save RM {potentialSave}/month on the better path
              </p>
              <p style={{ fontSize: 11, color: '#0F6E56' }}>That's RM {potentialSave * 12} a year — enough for a trip!</p>
            </div>
          </div>
        )}

        {/* ── INSIGHTS ── */}
        {tab === 'insights' && (
          <>
            <div style={{ background: 'linear-gradient(135deg,#6C63FF,#9C8FFF)', borderRadius: 12, padding: '10px 12px', marginBottom: 10 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.8px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 3 }}>AI Coach</p>
              <p style={{ fontSize: 11, color: '#fff', lineHeight: 1.5 }}>
                Biggest leakage: food at RM {mergedCategories.find(c => c.label === 'Food')?.current}. Cutting to RM 200 saves RM {(mergedCategories.find(c => c.label === 'Food')?.current || 280) - 200} — covers Netflix + Spotify for 3 months.
              </p>
            </div>
            {INSIGHTS.map((ins, i) => (
              <div key={i} style={{
                background: ins.color, borderRadius: 14, border: `0.5px solid ${ins.border}`,
                padding: '12px 14px', marginBottom: 10, display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{ins.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 2 }}>{ins.title}</p>
                  <p style={{ fontSize: 11, color: '#666', lineHeight: 1.5 }}>{ins.desc}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── AI FORECAST ── */}
        {tab === 'forecast' && (
          <>
            {forecastLoading && (
              <div style={{
                background: 'linear-gradient(135deg,#6C63FF,#9C8FFF)',
                borderRadius: 16, padding: '32px 20px', marginBottom: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
                  animation: 'spin .8s linear infinite',
                }} />
                <p style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>AI is analysing your spending…</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>Building your personalised 3-month forecast</p>
              </div>
            )}

            {forecastError && !forecastLoading && (
              <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '0.5px solid #eef0f4', textAlign: 'center', marginBottom: 10 }}>
                <p style={{ fontSize: 22, marginBottom: 8 }}>⚠️</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>Couldn't load forecast</p>
                <p style={{ fontSize: 11, color: '#aaa', marginBottom: 16 }}>Check your connection and try again</p>
                <button onClick={() => { setForecastFetched(false); fetchForecast(); }} style={{
                  padding: '10px 20px', borderRadius: 12, border: 'none',
                  background: '#6C63FF', color: '#fff', fontSize: 13,
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}>Retry</button>
              </div>
            )}

            {!forecast && !forecastLoading && !forecastError && (
              <div style={{
                background: 'linear-gradient(135deg,#6C63FF,#9C8FFF)',
                borderRadius: 16, padding: '28px 20px', textAlign: 'center', marginBottom: 10,
              }}>
                <p style={{ fontSize: 30, marginBottom: 8 }}>🔮</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>AI Spending Forecast</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 20, lineHeight: 1.6 }}>
                  Personalised 3-month prediction based on your actual spending habits.
                </p>
                <button onClick={fetchForecast} style={{
                  padding: '12px 28px', borderRadius: 12, border: 'none',
                  background: '#fff', color: '#6C63FF',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>Generate forecast</button>
              </div>
            )}

            {forecast && !forecastLoading && (
              <>
                {/* Coach */}
                <div style={{ background: 'linear-gradient(135deg,#6C63FF,#9C8FFF)', borderRadius: 14, padding: '12px 14px', marginBottom: 10 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.8px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 4 }}>AI Coach</p>
                  <p style={{ fontSize: 12, color: '#fff', lineHeight: 1.6 }}>{forecast.coachMessage}</p>
                </div>

                {/* Spending + Squad forecast */}
                <div style={{ background: '#fff', borderRadius: 16, padding: 14, border: '0.5px solid #eef0f4', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>Spending forecast</p>
                    <span style={{ fontSize: 9, color: '#00C896' }}>* = predicted</span>
                  </div>
                  <p style={{ fontSize: 10, color: '#aaa', marginBottom: 10 }}>Personal vs Squad · Jan–{forecastMonths[forecastMonths.length - 1]}</p>
                  <LineChart
                    lines={[
                      { data: forecastPersonal, color: '#6C63FF' },
                      { data: forecastSquad,    color: '#00C896' },
                    ]}
                    xLabels={forecastMonths}
                    height={110}
                    predicted={predIdxs}
                  />
                  <Legend items={[
                    { label: 'Personal',  color: '#6C63FF' },
                    { label: 'Squad',     color: '#00C896' },
                    { label: 'Predicted', color: '#6C63FF', dashed: true },
                  ]} />
                </div>

                {/* Savings forecast */}
                <div style={{ background: '#fff', borderRadius: 16, padding: 14, border: '0.5px solid #eef0f4', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>Savings forecast</p>
                    <span style={{ fontSize: 9, color: '#00C896' }}>* = predicted</span>
                  </div>
                  <p style={{ fontSize: 10, color: '#aaa', marginBottom: 10 }}>Based on current spending patterns</p>
                  <LineChart
                    lines={[{ data: forecastSavings, color: '#00C896' }]}
                    xLabels={forecastMonths}
                    height={90}
                    predicted={predIdxs}
                  />
                  <Legend items={[
                    { label: 'Savings',   color: '#00C896' },
                    { label: 'Predicted', color: '#00C896', dashed: true },
                  ]} />
                  {forecast.projectedAnnualSavings && (
                    <div style={{ marginTop: 8, background: '#E8FFF5', borderRadius: 8, padding: '7px 10px', border: '0.5px solid #B0FFD4' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#0F6E56' }}>
                        📈 Projected annual savings: RM {forecast.projectedAnnualSavings.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3-month outlook */}
                <div style={{ background: '#fff', borderRadius: 16, padding: 14, border: '0.5px solid #eef0f4', marginBottom: 10 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 12 }}>3-month outlook</p>
                  {forecast.spendingForecast.map((m, i) => (
                    <div key={m.month} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      paddingBottom: i < 2 ? 10 : 0, marginBottom: i < 2 ? 10 : 0,
                      borderBottom: i < 2 ? '0.5px solid #f2f2f2' : 'none',
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, background: '#EEEDFE',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#6C63FF', flexShrink: 0,
                      }}>{m.month}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>Spend RM {m.amount}</span>
                          <span style={{ fontSize: 11, color: '#00C896', fontWeight: 600 }}>
                            Save RM {forecast.savingsForecast[i]?.amount || '—'}
                          </span>
                        </div>
                        <p style={{ fontSize: 10, color: '#888' }}>{m.reasoning}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Risk + Opportunity */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1, background: '#FFF0E8', borderRadius: 14, border: '0.5px solid #FFD4B0', padding: 12 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#854F0B', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px' }}>⚠️ Risk</p>
                    <p style={{ fontSize: 11, color: '#854F0B', lineHeight: 1.5 }}>{forecast.topRisk}</p>
                  </div>
                  <div style={{ flex: 1, background: '#E8FFF5', borderRadius: 14, border: '0.5px solid #B0FFD4', padding: 12 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#0F6E56', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px' }}>💡 Opportunity</p>
                    <p style={{ fontSize: 11, color: '#0F6E56', lineHeight: 1.5 }}>{forecast.topOpportunity}</p>
                  </div>
                </div>

                <button
                  onClick={() => { setForecastFetched(false); setForecast(null); fetchForecast(); }}
                  style={{
                    width: '100%', padding: 12, borderRadius: 14,
                    border: '0.5px solid #e0e0e8', background: '#fff',
                    fontSize: 13, fontWeight: 600, color: '#6C63FF',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >↻ Refresh forecast</button>
              </>
            )}
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}