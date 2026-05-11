'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const INITIAL_BALANCES = { main: 613, savings: 320, squad: 270 };

const INITIAL_CONTACTS = [
  { id: 'ahmad', name: 'Ahmad', initial: 'A', color: '#9C8FFF' },
  { id: 'sha',   name: 'Sha',   initial: 'S', color: '#5DCAA5' },
  { id: 'wei',   name: 'Wei',   initial: 'W', color: '#F0997B' },
];

const INITIAL_SQUADS = [
  {
    id: 'uni',
    name: 'Uni Besties 🎓',
    members: [
      { id: 'ahmad', name: 'Ahmad', initial: 'A', color: '#9C8FFF' },
      { id: 'sha',   name: 'Sha',   initial: 'S', color: '#5DCAA5' },
      { id: 'wei',   name: 'Wei',   initial: 'W', color: '#F0997B' },
    ],
    pool: 270,
  },
];

const INITIAL_SQUAD_GOALS = [
  {
    id: 'tokyo',
    name: 'Tokyo Trip ✈️',
    target: 1500, current: 900,
    emoji: '✈️', color: '#6C63FF',
    members: [
      { name: 'Harshini', initial: 'H', color: '#9C8FFF', contributed: 300, target: 375 },
      { name: 'Ahmad',    initial: 'A', color: '#5DCAA5', contributed: 300, target: 375 },
      { name: 'Sha',      initial: 'S', color: '#F0997B', contributed: 300, target: 375 },
      { name: 'Wei',      initial: 'W', color: '#FAC775', contributed: 0,   target: 375 },
    ],
  },
  {
    id: 'laptop',
    name: 'New Laptop 💻',
    target: 3000, current: 1200,
    emoji: '💻', color: '#00C896',
    members: [
      { name: 'Harshini', initial: 'H', color: '#9C8FFF', contributed: 600, target: 1500 },
      { name: 'Sha',      initial: 'S', color: '#F0997B', contributed: 600, target: 1500 },
    ],
  },
  {
    id: 'penang',
    name: 'Penang Trip 🌴',
    target: 300, current: 225,
    emoji: '🌴', color: '#F8B500',
    members: [
      { name: 'Harshini', initial: 'H', color: '#9C8FFF', contributed: 75, target: 75 },
      { name: 'Ahmad',    initial: 'A', color: '#5DCAA5', contributed: 75, target: 75 },
      { name: 'Sha',      initial: 'S', color: '#F0997B', contributed: 75, target: 75 },
      { name: 'Wei',      initial: 'W', color: '#FAC775', contributed: 0,  target: 75 },
    ],
  },
];

export function AppProvider({ children }) {
  const [balances, setBalances]       = useState(INITIAL_BALANCES);
  const [transactions, setTransactions] = useState([]);
  const [squadGoals, setSquadGoals]   = useState(INITIAL_SQUAD_GOALS);
  const [contacts, setContacts]       = useState(INITIAL_CONTACTS);
  const [squads, setSquads]           = useState(INITIAL_SQUADS);
  const [toast, setToast]             = useState(null);
  const [pendingTransfer, setPendingTransfer] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const doTransfer = useCallback((recipient, amount, note = '', toSquad = false, squadId = null) => {
    const amt = parseFloat(amount);
    setBalances((prev) => ({
      ...prev,
      main: Math.max(0, parseFloat((prev.main - amt).toFixed(2))),
      ...(toSquad ? { squad: parseFloat((prev.squad + amt).toFixed(2)) } : {}),
    }));
    setTransactions((prev) => [{
      id: Date.now(),
      emoji: toSquad ? '👥' : '💸',
      description: toSquad ? `Squad transfer · ${recipient}` : `To ${recipient}`,
      date: 'Just now',
      amount: -amt,
      category: toSquad ? 'Squad' : 'Transfer',
      note,
    }, ...prev]);

    // If squad transfer, contribute to matching goal
    if (toSquad && squadId) {
      setSquadGoals((prev) =>
        prev.map((g) => {
          if (g.id !== squadId) return g;
          const updatedMembers = g.members.map((m) =>
            m.name === 'Harshini'
              ? { ...m, contributed: Math.min(m.target, m.contributed + amt) }
              : m
          );
          return { ...g, current: Math.min(g.target, g.current + amt), members: updatedMembers };
        })
      );
    }
  }, []);

  const addExpense = useCallback((amount, category = 'Other', description = 'Expense') => {
    const EMOJI_MAP = {
      Food: '🍔', Transport: '🚗', Groceries: '🛒',
      Bills: '📱', Entertainment: '🎬', Shopping: '🛍️', Other: '💳',
    };
    const amt = parseFloat(amount);
    setBalances((prev) => ({
      ...prev,
      main: Math.max(0, parseFloat((prev.main - amt).toFixed(2))),
    }));
    setTransactions((prev) => [{
      id: Date.now(),
      emoji: EMOJI_MAP[category] || '💳',
      description,
      date: 'Just now',
      amount: -amt,
      category,
    }, ...prev]);
    const tips = {
      Food:          `Food logged ✓ You've spent RM ${280 + amt} on food — watch that budget!`,
      Transport:     `Transport logged ✓ Try carpooling to save ~RM 40/month.`,
      Shopping:      `Shopping logged ✓ Remember the 24-hour rule before your next purchase!`,
      Entertainment: `Entertainment logged ✓ Balance is key — you deserve it lah!`,
      Groceries:     `Groceries logged ✓ Cooking more = saving more. Keep it up!`,
    };
    showToast(tips[category] || `✓ RM ${amt} logged under ${category}`);
  }, [showToast]);

  const contributeToGoal = useCallback((goalId, memberName, amount) => {
    const amt = parseFloat(amount);
    setBalances((prev) => ({
      ...prev,
      main:  Math.max(0, parseFloat((prev.main - amt).toFixed(2))),
      squad: parseFloat((prev.squad + amt).toFixed(2)),
    }));
    setSquadGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMembers = g.members.map((m) =>
          m.name === memberName
            ? { ...m, contributed: Math.min(m.target, m.contributed + amt) }
            : m
        );
        return { ...g, current: Math.min(g.target, g.current + amt), members: updatedMembers };
      })
    );
    setTransactions((prev) => [{
      id: Date.now(),
      emoji: '🎯',
      description: `Squad goal contribution`,
      date: 'Just now',
      amount: -amt,
      category: 'Squad',
    }, ...prev]);
  }, []);

  const addSquadGoal = useCallback((goal) => {
    setSquadGoals((prev) => [...prev, {
      id: goal.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: goal.name,
      emoji: goal.emoji || '🎯',
      target: parseFloat(goal.target),
      current: 0,
      color: goal.color || '#6C63FF',
      members: [
        { name: 'Harshini', initial: 'H', color: '#9C8FFF', contributed: 0, target: parseFloat(goal.target) },
      ],
    }]);
  }, []);

  // Called from SmartFind "Book for squad" — creates a goal automatically
  const bookDeal = useCallback((title, totalPrice, perHead, members, emoji = '✈️', color = '#6a3de8') => {
    const goalId = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newGoal = {
      id: goalId,
      name: title,
      emoji,
      target: totalPrice,
      current: 0,
      color,
      members: members.map((m) => ({
        name: m.name,
        initial: m.i,
        color: m.c,
        contributed: 0,
        target: perHead,
      })),
    };
    setSquadGoals((prev) => [...prev, newGoal]);
    showToast(`✓ "${title}" added to Squad goals — start contributing!`);
    return goalId;
  }, [showToast]);

  const addContact = useCallback((name, color) => {
    const initial = name.trim().charAt(0).toUpperCase();
    const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    setContacts((prev) => [...prev, { id, name: name.trim(), initial, color }]);
  }, []);

  const addSquad = useCallback((name, memberIds, allContacts) => {
    const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const members = allContacts.filter((c) => memberIds.includes(c.id));
    setSquads((prev) => [...prev, { id, name, members, pool: 0 }]);
  }, []);

  return (
    <AppContext.Provider value={{
      balances, transactions, squadGoals, contacts, squads,
      toast, pendingTransfer,
      setPendingTransfer, showToast,
      doTransfer, addExpense, contributeToGoal,
      addSquadGoal, bookDeal, addContact, addSquad,
    }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 96, left: '50%', transform: 'translateX(-50%)',
          background: '#00C896', color: '#fff', borderRadius: 10,
          padding: '10px 16px', fontSize: 12, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 16px rgba(0,200,150,0.3)',
          zIndex: 999, whiteSpace: 'nowrap', animation: 'toastIn .2s ease',
          maxWidth: '90%',
        }}>
          <i className="ti ti-check" style={{ fontSize: 16 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{toast}</span>
        </div>
      )}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}