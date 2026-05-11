'use client';
import { useState } from 'react';
import { useApp } from '@/lib/AppContext';

const GOAL_COLORS = ['#6C63FF', '#00C896', '#F8B500', '#FF6B6B', '#4ECDC4', '#9C8FFF'];
const GOAL_EMOJIS = ['🎯', '✈️', '💻', '🏠', '🎓', '🎮', '🍕', '💍', '🚗', '🌴'];

export default function SquadPage() {
  const { squadGoals, contributeToGoal, addSquadGoal, showToast } = useApp();
  const [activeGoal, setActiveGoal] = useState(null);
  const [contributeAmount, setContributeAmount] = useState('');
  const [contributed, setContributed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New goal form state
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newEmoji, setNewEmoji] = useState('🎯');
  const [newColor, setNewColor] = useState('#6C63FF');

  const handleContribute = () => {
    const amt = parseFloat(contributeAmount);
    if (!amt || amt <= 0) return;
    contributeToGoal(activeGoal.id, 'Harshini', amt);
    setContributed(true);
    setTimeout(() => {
      setContributed(false);
      setActiveGoal(null);
      setContributeAmount('');
    }, 2000);
  };

  const handleCreateGoal = () => {
    if (!newName.trim() || !newTarget || parseFloat(newTarget) <= 0) {
      showToast('Enter a goal name and target amount');
      return;
    }
    addSquadGoal({ name: newName.trim(), target: newTarget, emoji: newEmoji, color: newColor });
    showToast(`✓ "${newName}" goal created!`);
    setShowCreateModal(false);
    setNewName('');
    setNewTarget('');
    setNewEmoji('🎯');
    setNewColor('#6C63FF');
  };

  const totalSaved = squadGoals.reduce((s, g) => s + g.current, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

      {/* Purple header */}
      <div style={{ background: 'linear-gradient(160deg, #1a0a3d, #3d1f8a)', padding: '48px 20px 56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Squad Savings</h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Save together, achieve more</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              width: 34, height: 34, background: 'rgba(255,255,255,0.2)',
              border: 'none', borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <i className="ti ti-plus" style={{ fontSize: 16, color: '#fff' }} />
          </button>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: 14,
          padding: '12px 14px', border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginBottom: 2 }}>Total across all goals</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>RM {totalSaved.toLocaleString()}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginBottom: 2 }}>Active goals</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#A8F0D8' }}>{squadGoals.length}</p>
          </div>
        </div>
      </div>

      {/* Goals list */}
      <div style={{ marginTop: -28 }}>
        {squadGoals.map((goal) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          const remaining = goal.target - goal.current;
          return (
            <div key={goal.id} style={{
              background: '#fff', borderRadius: 18,
              margin: '0 14px 10px', border: '0.5px solid #eef0f4', overflow: 'hidden',
            }}>
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: goal.color + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}>{goal.emoji}</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{goal.name}</p>
                      <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                        {progress.toFixed(0)}% funded · RM {remaining.toLocaleString()} to go
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: goal.color }}>RM {goal.current.toLocaleString()}</p>
                    <p style={{ fontSize: 11, color: '#aaa' }}>of RM {goal.target.toLocaleString()}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3, marginBottom: 12 }}>
                  <div style={{ height: '100%', borderRadius: 3, background: goal.color, width: `${progress}%`, transition: 'width .4s' }} />
                </div>

                {/* Members */}
                {(goal.members || []).map((member) => {
                  const mp = Math.min((member.contributed / member.target) * 100, 100);
                  return (
                    <div key={member.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', background: member.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                      }}>{member.initial}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: '#1a1a2e' }}>{member.name}</span>
                          <span style={{ fontSize: 11, color: '#aaa' }}>RM {member.contributed} / RM {member.target}</span>
                        </div>
                        <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2 }}>
                          <div style={{ height: '100%', borderRadius: 2, background: member.color, width: `${mp}%` }} />
                        </div>
                      </div>
                      {member.contributed >= member.target && <span style={{ fontSize: 12 }}>✓</span>}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setActiveGoal(goal)}
                style={{
                  width: '100%', padding: '12px 0',
                  borderTop: '0.5px solid #f2f2f2',
                  background: 'none', border: 'none',
                  borderTop: '0.5px solid #f2f2f2',
                  fontSize: 13, fontWeight: 600, color: '#6a3de8',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <i className="ti ti-plus" style={{ fontSize: 14 }} /> Contribute
              </button>
            </div>
          );
        })}

        {/* New goal button */}
        <div
          onClick={() => setShowCreateModal(true)}
          style={{
            margin: '0 14px 10px', background: '#fff', borderRadius: 18,
            border: '2px dashed #e0e0e8', padding: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer',
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: 'rgba(106,61,232,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="ti ti-plus" style={{ fontSize: 20, color: '#6a3de8' }} />
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>Start a new goal</p>
          <p style={{ fontSize: 11, color: '#aaa' }}>Tap to create and invite friends</p>
        </div>
      </div>

      {/* ── Contribute modal ── */}
      {activeGoal && (
        <div
          onClick={(e) => e.target === e.currentTarget && setActiveGoal(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.7)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 500, backdropFilter: 'blur(4px)',
          }}
        >
          <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: 480 }}>
            {contributed ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E8FFF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 12 }}>✅</div>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>Contributed!</p>
                <p style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>RM {parseFloat(contributeAmount).toFixed(2)} added to {activeGoal.name}</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{activeGoal.name}</p>
                    <p style={{ fontSize: 12, color: '#aaa' }}>RM {activeGoal.current.toLocaleString()} of RM {activeGoal.target.toLocaleString()} saved</p>
                  </div>
                  <button onClick={() => { setActiveGoal(null); setContributeAmount(''); }} style={{ background: 'none', border: 'none', fontSize: 20, color: '#bbb', cursor: 'pointer' }}>✕</button>
                </div>

                <p style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 8 }}>How much?</p>

                <div style={{ position: 'relative', marginBottom: 12 }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontWeight: 600, fontSize: 14 }}>RM</span>
                  <input
                    type="number"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                    style={{
                      width: '100%', padding: '14px 14px 14px 42px', borderRadius: 12,
                      border: '0.5px solid #e0e0e8', fontSize: 20, fontWeight: 700,
                      color: '#1a1a2e', outline: 'none', fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  {[20, 50, 100, 200].map((amt) => (
                    <button key={amt} onClick={() => setContributeAmount(amt.toString())} style={{
                      flex: 1, padding: '8px 0', borderRadius: 10,
                      border: `0.5px solid ${contributeAmount === amt.toString() ? '#6C63FF' : '#e0e0e8'}`,
                      background: contributeAmount === amt.toString() ? '#6C63FF' : '#fff',
                      color: contributeAmount === amt.toString() ? '#fff' : '#666',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    }}>RM {amt}</button>
                  ))}
                </div>

                <button
                  onClick={handleContribute}
                  disabled={!contributeAmount || parseFloat(contributeAmount) <= 0}
                  style={{
                    width: '100%', padding: 16, borderRadius: 16, border: 'none',
                    fontFamily: 'inherit', fontSize: 15, fontWeight: 700,
                    background: contributeAmount && parseFloat(contributeAmount) > 0 ? '#6C63FF' : '#e0e0e8',
                    color: contributeAmount && parseFloat(contributeAmount) > 0 ? '#fff' : '#aaa',
                    cursor: contributeAmount && parseFloat(contributeAmount) > 0 ? 'pointer' : 'not-allowed',
                  }}
                >
                  Contribute {contributeAmount ? `RM ${parseFloat(contributeAmount).toFixed(2)}` : ''}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Create goal modal ── */}
      {showCreateModal && (
        <div
          onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.7)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 500, backdropFilter: 'blur(4px)',
          }}
        >
          <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px 44px', width: '100%', maxWidth: 480 }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>New saving goal</p>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, color: '#bbb', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Emoji picker */}
            <p style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 8 }}>Pick an emoji</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {GOAL_EMOJIS.map((e) => (
                <button key={e} onClick={() => setNewEmoji(e)} style={{
                  width: 38, height: 38, borderRadius: 10, fontSize: 18,
                  border: `2px solid ${newEmoji === e ? '#6C63FF' : '#e0e0e8'}`,
                  background: newEmoji === e ? '#EEEDFE' : '#fff',
                  cursor: 'pointer',
                }}>{e}</button>
              ))}
            </div>

            {/* Goal name */}
            <p style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>Goal name</p>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Bali Trip, New Phone…"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 12,
                border: '0.5px solid #e0e0e8', fontSize: 14,
                color: '#1a1a2e', outline: 'none', fontFamily: 'inherit', marginBottom: 12,
              }}
            />

            {/* Target amount */}
            <p style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>Target amount (RM)</p>
            <input
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              placeholder="0.00"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 12,
                border: '0.5px solid #e0e0e8', fontSize: 14,
                color: '#1a1a2e', outline: 'none', fontFamily: 'inherit', marginBottom: 16,
              }}
            />

            {/* Color picker */}
            <p style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 8 }}>Colour</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              {GOAL_COLORS.map((c) => (
                <button key={c} onClick={() => setNewColor(c)} style={{
                  width: 30, height: 30, borderRadius: '50%', background: c, border: 'none',
                  cursor: 'pointer',
                  outline: newColor === c ? `3px solid ${c}` : 'none',
                  outlineOffset: 2,
                }} />
              ))}
            </div>

            {/* Preview */}
            {newName && (
              <div style={{
                background: newColor + '11', borderRadius: 14, padding: '12px 14px',
                border: `0.5px solid ${newColor}44`, marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 22 }}>{newEmoji}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{newName}</p>
                  {newTarget && <p style={{ fontSize: 12, color: '#aaa' }}>Target: RM {parseFloat(newTarget).toLocaleString()}</p>}
                </div>
              </div>
            )}

            <button
              onClick={handleCreateGoal}
              style={{
                width: '100%', padding: 16, borderRadius: 16, border: 'none',
                fontFamily: 'inherit', fontSize: 15, fontWeight: 700,
                background: newName && newTarget ? '#6C63FF' : '#e0e0e8',
                color: newName && newTarget ? '#fff' : '#aaa',
                cursor: newName && newTarget ? 'pointer' : 'not-allowed',
              }}
            >Create goal</button>
          </div>
        </div>
      )}
    </div>
  );
}