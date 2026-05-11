'use client';
import { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';

const MEMBERS = [
  { name: 'Harshini', i: 'H', c: '#9C8FFF' },
  { name: 'Ahmad', i: 'A', c: '#5DCAA5' },
  { name: 'Sha', i: 'S', c: '#F0997B' },
  { name: 'Wei', i: 'W', c: '#FAC775' },
];

const SF_DATA = {
  travel: {
    ai: 'Squad has RM {pool} pooled. Penang weekend fits — only RM {per} each.',
    items: [
      { title: 'Penang Heritage Stay', sub: 'George Town · 2 nights · 4 pax', price: 280, partner: 'agoda', tags: ['Free breakfast', '4.6 stars'], votes: 3 },
      { title: 'Langkawi Bayview Hotel', sub: 'Pantai Cenang · 2 nights · 4 pax', price: 420, partner: 'agoda', tags: ['Pool access', '4.4 stars'], votes: 2 },
      { title: 'KL → Langkawi flights', sub: 'AirAsia · 15 Jun · 4 seats', price: 356, partner: 'agoda', tags: ['Direct', 'Hand luggage'], votes: 2 },
      { title: 'Batu Caves group tour', sub: 'Half day · guide included', price: 160, partner: 'trivago', tags: ['Budget pick', '4.8 rated'], votes: 4 },
      { title: 'Genting Highlands pkg', sub: 'Cable car + hotel · 2D1N', price: 680, partner: 'trivago', tags: ['Premium', 'Weekend deal'], votes: 1 },
    ],
  },
  food: {
    ai: 'Splitting a group meal saves ~RM 12 each vs ordering solo. RM {per} per person covers these.',
    items: [
      { title: 'Nasi Kandar Pelita', sub: 'Chow Kit · dine-in · 4 pax', price: 68, partner: 'grab', tags: ['Halal', 'Open now'], votes: 3 },
      { title: 'Pizza Hut group set', sub: 'Delivery · large + sides', price: 95, partner: 'grab', tags: ['Group meal', 'Free delivery'], votes: 2 },
      { title: 'Sushi King feast', sub: 'Sunway · dine-in · 4 pax', price: 180, partner: 'grab', tags: ['Weekend deal', 'Halal'], votes: 1 },
      { title: 'KLCC Hotel brunch', sub: 'Weekend buffet · 4 pax', price: 480, partner: 'grab', tags: ['Luxury', 'All-inclusive'], votes: 0 },
    ],
  },
  shop: {
    ai: 'Group buying unlocks bulk discounts. These split to RM {per} each — less than your usual spend.',
    items: [
      { title: 'Weekly groceries bundle', sub: '99 Speedmart · Grab Mart', price: 120, partner: 'grab', tags: ['Essentials', 'Free delivery'], votes: 4 },
      { title: 'Board game: Catan', sub: 'Shopee · group activity', price: 89, partner: 'shopee', tags: ['Group fun', '5-star'], votes: 3 },
      { title: 'JBL Bluetooth speaker', sub: 'Shopee Mall · shared use', price: 199, partner: 'shopee', tags: ['Official store', 'Shared use'], votes: 2 },
      { title: 'Nintendo Switch bundle', sub: 'Shopee Mall · 2 controllers', price: 1399, partner: 'shopee', tags: ['Premium', 'Pre-order'], votes: 0 },
    ],
  },
};

const PARTNER_COLORS = { agoda: '#003580', trivago: '#e8001c', shopee: '#EE4D2D', grab: '#00B14F' };
const PARTNER_LABEL = { agoda: 'Agoda', trivago: 'Trivago', shopee: 'Shopee', grab: 'Grab' };

const TAB_ICONS = { travel: 'ti-plane', food: 'ti-tools-kitchen-2', shop: 'ti-shopping-bag' };
const TAB_CARD_BG = { travel: '#EEEDFE', food: '#fff0e8', shop: '#e8f5e9' };
const TAB_ICON_COLOR = { travel: '#6C63FF', food: '#FF6B35', shop: '#2E7D32' };

const TAB_FILTERS = {
  travel: ['All', 'Hotels', 'Flights', 'Activities'],
  food: ['All', 'Dine-in', 'Delivery', 'Halal'],
  shop: ['All', 'Gifts', 'Gadgets', 'Groceries'],
};

function tagClass(t) {
  if (/off|promo|deal|free|discount|budget/i.test(t)) return { bg: '#FAEEDA', color: '#854F0B' };
  if (/premium|luxury|5-star/i.test(t)) return { bg: '#EEEDFE', color: '#9c6fff' };
  return { bg: '#E1F5EE', color: '#0F6E56' };
}

export default function SmartFindPage() {
  const { showToast } = useApp();
  const [tab, setTab] = useState('travel');
  const [contrib, setContrib] = useState(75);
  const [activeFilter, setActiveFilter] = useState('All');
  const [boostedItem, setBoostedItem] = useState(null);

  useEffect(() => { setActiveFilter('All'); }, [tab]);

  const pool = contrib * MEMBERS.length;
  const data = SF_DATA[tab];
  const aiText = data.ai.replace('{pool}', pool).replace('{per}', contrib);
  const withinBudget = data.items.filter((i) => i.price <= pool).length;

  function bookDeal(title, per) {
    setBoostedItem(title);
    showToast(`✓ Booked "${title}" · RM ${per} deducted from each member's Squad wallet`);
    setTimeout(() => setBoostedItem(null), 4000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

      {/* Purple header */}
      <div style={{ background: 'linear-gradient(160deg, #1a0a3d, #3d1f8a)', padding: '48px 20px 24px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Squad Smart Find</h2>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>Deals your whole group can afford</p>

        {/* Pool bar */}
        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: 14,
          padding: '12px 14px', border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Squad pool total</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>RM {pool}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Per person</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>RM {contrib}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>Each contributes</span>
            <input
              type="range" min="25" max="300" step="25" value={contrib}
              onChange={(e) => setContrib(parseInt(e.target.value))}
              style={{
                flex: 1, WebkitAppearance: 'none', height: 4,
                borderRadius: 2, background: 'rgba(255,255,255,0.3)',
                outline: 'none', cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', minWidth: 48, textAlign: 'right' }}>RM {contrib}</span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {MEMBERS.map((m) => (
              <div key={m.name} style={{
                width: 26, height: 26, borderRadius: '50%', background: m.c,
                border: '2px solid rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: '#fff',
              }}>{m.i}</div>
            ))}
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginLeft: 4 }}>{MEMBERS.length} members</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', background: '#fff',
        borderBottom: '0.5px solid #eee', padding: '0 16px',
      }}>
        {Object.keys(SF_DATA).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '11px 0', fontSize: 12, fontWeight: 500,
              color: tab === t ? '#6C63FF' : '#bbb',
              borderBottom: tab === t ? '2px solid #6C63FF' : '2px solid transparent',
              background: 'none', border: 'none',
              borderBottom: tab === t ? '2px solid #6C63FF' : '2px solid transparent',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <i className={`ti ${TAB_ICONS[t]}`} style={{ fontSize: 12, verticalAlign: -2, marginRight: 3 }} />
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '12px 12px 0' }}>

        {/* AI tip */}
        <div style={{
          background: 'linear-gradient(135deg, #2a1260, #4a2aa0)',
          borderRadius: 12, padding: '10px 12px', marginBottom: 10,
        }}>
          <p style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '.8px',
            color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 3,
          }}>AI Coach</p>
          <p style={{ fontSize: 11, color: '#fff', lineHeight: 1.5 }}>{aiText}</p>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, overflowX: 'auto', paddingBottom: 2 }}>
          {TAB_FILTERS[tab].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                whiteSpace: 'nowrap', padding: '5px 11px', borderRadius: 20,
                border: `0.5px solid ${activeFilter === f ? '#6C63FF' : '#ddd'}`,
                background: activeFilter === f ? '#6C63FF' : '#fff',
                color: activeFilter === f ? '#fff' : '#666',
                fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >{f}</button>
          ))}
        </div>

        {/* Within budget label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#bbb', letterSpacing: '.4px', textTransform: 'uppercase' }}>
            {withinBudget} within budget
          </span>
          <span style={{ fontSize: 11, color: '#aaa' }}>Pool: RM {pool}</span>
        </div>

        {/* Deal cards */}
        {data.items.map((item, idx) => {
          const over = item.price > pool;
          const perHead = Math.ceil(item.price / MEMBERS.length);
          return (
            <div key={idx} style={{
              background: '#fff', borderRadius: 14, border: '0.5px solid #eee',
              marginBottom: 10, overflow: 'hidden',
              opacity: over ? 0.5 : 1,
            }}>
              {/* Image block */}
              <div style={{
                height: 90, background: TAB_CARD_BG[tab],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={`ti ${TAB_ICONS[tab]}`} style={{ fontSize: 32, color: TAB_ICON_COLOR[tab] }} />
              </div>

              {/* Body */}
              <div style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 1 }}>{item.sub}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#6a3de8' }}>RM {item.price}</div>
                    <div style={{ fontSize: 10, color: '#00B894', marginTop: 1 }}>RM {perHead} p/person</div>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
                  {item.tags.map((t) => {
                    const s = tagClass(t);
                    return (
                      <span key={t} style={{
                        display: 'inline-flex', padding: '3px 9px', borderRadius: 20,
                        fontSize: 10, fontWeight: 600, background: s.bg, color: s.color,
                      }}>{t}</span>
                    );
                  })}
                  {over && (
                    <span style={{
                      display: 'inline-flex', padding: '3px 9px', borderRadius: 20,
                      fontSize: 10, fontWeight: 600, background: '#FCEBEB', color: '#A32D2D',
                    }}>Over by RM {item.price - pool}</span>
                  )}
                </div>

                {/* Vote strip */}
                <div style={{
                  background: 'rgba(106,61,232,0.1)', borderRadius: 8, padding: '6px 10px',
                  marginTop: 7, display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 11, color: '#9c6fff',
                }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {MEMBERS.map((m, i) => (
                      <div key={i} style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: i < item.votes ? m.c : '#ddd',
                      }} />
                    ))}
                  </div>
                  <span>{item.votes}/{MEMBERS.length} want this</span>
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginTop: 8, paddingTop: 8, borderTop: '0.5px solid #f2f2f2',
                }}>
                  {/* Partner badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#aaa' }}>
                    <div style={{
                      width: 15, height: 15, borderRadius: 3,
                      background: PARTNER_COLORS[item.partner] || '#888',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 8, fontWeight: 700, color: '#fff',
                    }}>{PARTNER_LABEL[item.partner]?.[0]}</div>
                    {PARTNER_LABEL[item.partner] || item.partner}
                  </div>

                  {over ? (
                    <button disabled style={{
                      border: 'none', borderRadius: 8, padding: '6px 12px',
                      fontSize: 11, fontWeight: 600, background: '#f0f0f0', color: '#bbb',
                      cursor: 'not-allowed', fontFamily: 'inherit',
                    }}>Can't afford</button>
                  ) : (
                    <button
                      onClick={() => bookDeal(item.title, perHead)}
                      style={{
                        border: 'none', borderRadius: 8, padding: '6px 12px',
                        fontSize: 11, fontWeight: 600, background: 'linear-gradient(160deg, #1a0a3d, #3d1f8a)', color: '#fff',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >Book for squad</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
