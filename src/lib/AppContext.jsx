'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const INITIAL_BALANCES = {
  main: 613,
  savings: 320,
  squad: 270,
};

const INITIAL_SQUAD_GOALS = [
  {
    id: 'tokyo',
    name: 'Tokyo Trip ✈️',
    target: 1500,
    current: 900,
    emoji: '✈️',
    color: '#6C63FF',
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
    target: 3000,
    current: 1200,
    emoji: '💻',
    color: '#00C896',
    members: [
      { name: 'Harshini', initial: 'H', color: '#9C8FFF', contributed: 600, target: 1500 },
      { name: 'Sha',      initial: 'S', color: '#F0997B', contributed: 600, target: 1500 },
    ],
  },
  {
    id: 'penang',
    name: 'Penang Trip 🌴',
    target: 300,
    current: 225,
    emoji: '🌴',
    color: '#F8B500',
    members: [
      { name: 'Harshini', initial: 'H', color: '#9C8FFF', contributed: 75, target: 75 },
      { name: 'Ahmad',    initial: 'A', color: '#5DCAA5', contributed: 75, target: 75 },
      { name: 'Sha',      initial: 'S', color: '#F0997B', contributed: 75, target: 75 },
      { name: 'Wei',      initial: 'W', color: '#FAC775', contributed: 0,  target: 75 },
    ],
  },
];

export function AppProvider({ children }) {
  const [balances, setBalances] = useState(INITIAL_BALANCES);
  const [transactions, setTransactions] = useState([]);
  const [squadGoals, setSquadGoals] = useState(INITIAL_SQUAD_GOALS);
  const [toast, setToast] = useState(null);
  const [pendingTransfer, setPendingTransfer] = useState(null); // { recipient, amount, note }

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const doTransfer = useCallback((recipient, amount, note = '') => {
    const amt = parseFloat(amount);
    setBalances((prev) => ({
      ...prev,
      main: Math.max(0, parseFloat((prev.main - amt).toFixed(2))),
    }));
    setTransactions((prev) => [{
      id: Date.now(),
      emoji: '💸',
      description: `To ${recipient}`,
      date: 'Just now',
      amount: -amt,
      category: 'Transfer',
      note,
    }, ...prev]);
  }, []);

  const addExpense = useCallback(async (amount, category = 'Other', description = 'Expense') => {
  const EMOJI_MAP = {
    Food: '🍔', Transport: '🚗', Groceries: '🛒',
    Bills: '📱', Entertainment: '🎬', Shopping: '🛍️', Other: '💳',
  };
  const amt = parseFloat(amount);
  setBalances((prev) => ({
    ...prev,
    main: Math.max(0, parseFloat((prev.main - amt).toFixed(2))),
  }));
  const newTx = {
    id: Date.now(),
    emoji: EMOJI_MAP[category] || '💳',
    description,
    date: 'Just now',
    amount: -amt,
    category,
  };
  setTransactions((prev) => [newTx, ...prev]);

  // AI tip based on category spending
  const tips = {
    Food: `Food expense logged ✓ You've spent RM ${280 + amt} on food this month — watch that budget!`,
    Transport: `Transport logged ✓ RM ${amt} added. Try carpooling to save ~RM 40/month.`,
    Shopping: `Shopping logged ✓ Remember the 24-hour rule before your next purchase!`,
    Entertainment: `Entertainment logged ✓ Balance is key — you deserve it lah!`,
    Groceries: `Groceries logged ✓ Cooking more = saving more. Keep it up!`,
  };
  showToast(tips[category] || `✓ RM ${amt} logged under ${category}`);
}, [showToast]);

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

  const contributeToGoal = useCallback((goalId, memberName, amount) => {
    const amt = parseFloat(amount);
    setBalances((prev) => ({
      ...prev,
      main: Math.max(0, parseFloat((prev.main - amt).toFixed(2))),
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
        return {
          ...g,
          current: Math.min(g.target, g.current + amt),
          members: updatedMembers,
        };
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

  return (
    <AppContext.Provider value={{
      balances,
      transactions,
      squadGoals,
      toast,
      pendingTransfer,
      setPendingTransfer,
      showToast,
      doTransfer,
      addExpense,
      contributeToGoal,
    }}>
      {children}

      {toast && (
        <div style={{
          position: 'fixed', bottom: 96, left: '50%', transform: 'translateX(-50%)',
          background: '#00C896', color: '#fff',
          borderRadius: 10, padding: '10px 16px',
          fontSize: 12, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 16px rgba(0,200,150,0.3)',
          zIndex: 999, whiteSpace: 'nowrap',
          animation: 'toastIn .2s ease',
        }}>
          <i className="ti ti-check" style={{ fontSize: 16 }} />
          {toast}
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