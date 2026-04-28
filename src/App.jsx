import React, { useState } from 'react';

const T = {
  bg:     '#080d1a',
  card:   '#0f1628',
  card2:  '#141d35',
  border: '#1e2a45',
  text:   '#e8eaf0',
  muted:  '#6b7a99',
  blue:   '#0ea5e9',
  purple: '#a78bfa',
  green:  '#4ade80',
  red:    '#f87171',
  yellow: '#fbbf24',
  orange: '#fb923c',
};

const PRICES = {
  sedan_out:  13,
  suv_out:    15,
  '4x4_out':  18,
  sedan_full: 17,
  suv_full:   20,
  '4x4_full': 23,
};

const SERVICE_NAMES = {
  sedan_out:  'Sedan Outside Only',
  sedan_full: 'Sedan In & Out',
  suv_out:    'SUV Outside Only',
  suv_full:   'SUV In & Out',
  '4x4_out':  '4x4 Outside Only',
  '4x4_full': '4x4 In & Out',
};

const EXP_CATEGORIES = [
  { value: 'soap',      label: 'Soap / Chemicals' },
  { value: 'water',     label: 'Water Bill'        },
  { value: 'salary',    label: 'Staff Salary'      },
  { value: 'equipment', label: 'Equipment'         },
  { value: 'others',    label: 'Others'            },
];
const EXP_CAT_LABEL = Object.fromEntries(EXP_CATEGORIES.map(c => [c.value, c.label]));

const NAV = [
  { id: 'today',  icon: '📊', label: 'Today'  },
  { id: 'log',    icon: '📋', label: 'Log'    },
  { id: 'staff',  icon: '👷', label: 'Staff'  },
  { id: 'weekly', icon: '📈', label: 'Weekly' },
  { id: 'roi',    icon: '💰', label: 'ROI'    },
  { id: 'stock',  icon: '📦', label: 'Stock'  },
  { id: 'ai',     icon: '🤖', label: 'AI'     },
];

const TAB_LABEL = {
  today: 'Today', log: 'Car Log', staff: 'Staff Tracker',
  weekly: 'Weekly Report', roi: 'ROI Tracker', stock: 'Stock Tracker', ai: 'AI Advisor',
};

function localDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fmtTime(ts) {
  if (!ts) return '–';
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getTodayStats() {
  try {
    const today = localDateStr();
    const recs = JSON.parse(localStorage.getItem('kk_rec') || '[]').filter(r => r.date === today);
    const exps = JSON.parse(localStorage.getItem('kk_exp') || '[]').filter(e => e.date === today);
    const totalRevenue  = recs.reduce((sum, r) => sum + (PRICES[r.service] || 0), 0);
    const totalExpenses = exps.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const netProfit = Math.round((totalRevenue - totalExpenses) * 100) / 100;
    return { carsWashed: recs.length, totalRevenue, totalExpenses, netProfit };
  } catch {
    return { carsWashed: 0, totalRevenue: 0, totalExpenses: 0, netProfit: 0 };
  }
}

function getTodayExpenses() {
  try {
    const today = localDateStr();
    return JSON.parse(localStorage.getItem('kk_exp') || '[]')
      .map((e, i) => ({ ...e, _idx: i }))
      .filter(e => e.date === today)
      .sort((a, b) => (b.ts || 0) - (a.ts || 0));
  } catch {
    return [];
  }
}

function Placeholder({ label }) {
  return (
    <div style={{ padding: 32, textAlign: 'center', color: T.muted, fontSize: 16, fontWeight: 700 }}>
      {label} — coming soon
    </div>
  );
}

function LogTab() {
  const today = localDateStr();

  function getRecords() {
    try {
      const all = JSON.parse(localStorage.getItem('kk_rec') || '[]');
      return all
        .map((r, i) => ({ ...r, _idx: i }))
        .filter(r => r.date === today)
        .sort((a, b) => (b.ts || 0) - (a.ts || 0));
    } catch {
      return [];
    }
  }

  const [records, setRecords] = useState(getRecords);

  function handleDelete(rec) {
    try {
      const all = JSON.parse(localStorage.getItem('kk_rec') || '[]');
      all.splice(rec._idx, 1);
      localStorage.setItem('kk_rec', JSON.stringify(all));
    } catch {}
    setRecords(getRecords());
  }

  if (records.length === 0) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 200, padding: 32, textAlign: 'center',
        color: T.muted, fontSize: 14, fontWeight: 700,
      }}>
        No cars washed yet today
      </div>
    );
  }

  return (
    <div style={{ padding: '0 16px' }}>
      <h1 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 900 }}>Car Log</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {records.map(rec => (
          <div
            key={rec._idx}
            style={{
              background: T.card, border: `1px solid ${T.border}`, borderRadius: 10,
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <span style={{ color: T.muted, fontSize: 13, fontWeight: 700, minWidth: 38 }}>
              {fmtTime(rec.ts)}
            </span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: T.text }}>
              {SERVICE_NAMES[rec.service] || rec.service}
            </span>
            <span style={{ color: T.green, fontSize: 14, fontWeight: 800, minWidth: 50, textAlign: 'right' }}>
              RM {PRICES[rec.service] ?? '?'}
            </span>
            <button
              onClick={() => handleDelete(rec)}
              style={{
                background: T.red, border: 'none', borderRadius: 6,
                color: '#fff', fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                fontSize: 12, padding: '4px 9px', cursor: 'pointer', lineHeight: 1.4,
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffTab() {
  const [staff, setStaff] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kk_staff') || '[]'); } catch { return []; }
  });
  const [shifts, setShifts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kk_shifts') || '[]'); } catch { return []; }
  });
  const [editingId, setEditingId]   = useState(null);
  const [editName,  setEditName]    = useState('');
  const [showAdd,   setShowAdd]     = useState(false);
  const [newName,   setNewName]     = useState('');

  function saveStaff(arr)  { localStorage.setItem('kk_staff',  JSON.stringify(arr)); setStaff(arr);  }
  function saveShifts(arr) { localStorage.setItem('kk_shifts', JSON.stringify(arr)); setShifts(arr); }

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    saveStaff([...staff, { id: String(Date.now()), name }]);
    setNewName(''); setShowAdd(false);
  }

  function handleDelete(id) {
    saveStaff(staff.filter(s => s.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function handleEditSave(id) {
    const name = editName.trim();
    if (name) saveStaff(staff.map(s => s.id === id ? { ...s, name } : s));
    setEditingId(null);
  }

  function handleClockToggle(id) {
    const updated = [...shifts];
    const activeIdx = updated.findIndex(s => s.staffId === id && s.clockOut == null);
    if (activeIdx >= 0) {
      updated[activeIdx] = { ...updated[activeIdx], clockOut: Date.now() };
    } else {
      updated.push({ staffId: id, clockIn: Date.now(), clockOut: null });
    }
    saveShifts(updated);
  }

  function calcHoursToday(id) {
    const now = Date.now();
    const d = new Date(); d.setHours(0, 0, 0, 0);
    const dayStart = d.getTime();
    let ms = 0;
    for (const s of shifts) {
      if (s.staffId !== id || s.clockIn < dayStart) continue;
      ms += (s.clockOut || now) - s.clockIn;
    }
    if (ms < 60000) return null;
    const h = ms / 3600000;
    return `${Math.round(h * 10) / 10} hrs today`;
  }

  const inputStyle = {
    background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8,
    color: T.text, padding: '7px 10px', fontSize: 14,
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, outline: 'none', flex: 1,
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Staff Tracker</h1>
        <button
          onClick={() => { setShowAdd(true); setNewName(''); }}
          style={{
            background: T.blue, border: 'none', borderRadius: 8,
            color: '#fff', fontFamily: "'Nunito', sans-serif", fontWeight: 800,
            fontSize: 13, padding: '7px 14px', cursor: 'pointer',
          }}
        >
          + Add Staff
        </button>
      </div>

      {showAdd && (
        <div style={{
          background: T.card, border: `1px solid ${T.border}`, borderRadius: 10,
          padding: '12px 14px', marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center',
        }}>
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setShowAdd(false); }}
            placeholder="Staff name..."
            style={inputStyle}
          />
          <button onClick={handleAdd} style={{
            background: T.blue, border: 'none', borderRadius: 6, color: '#fff',
            fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
            padding: '7px 14px', cursor: 'pointer',
          }}>Save</button>
          <button onClick={() => setShowAdd(false)} style={{
            background: 'none', border: `1px solid ${T.border}`, borderRadius: 6,
            color: T.muted, fontFamily: "'Nunito', sans-serif", fontWeight: 700,
            fontSize: 13, padding: '7px 10px', cursor: 'pointer',
          }}>✕</button>
        </div>
      )}

      {staff.length === 0 && !showAdd && (
        <div style={{ textAlign: 'center', color: T.muted, fontSize: 14, fontWeight: 700, padding: '48px 0' }}>
          No staff added yet
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {staff.map(s => {
          const active   = shifts.find(sh => sh.staffId === s.id && sh.clockOut == null);
          const hours    = calcHoursToday(s.id);
          const isEditing = editingId === s.id;

          return (
            <div
              key={s.id}
              style={{
                background: T.card,
                border: `1px solid ${active ? T.blue : T.border}`,
                borderRadius: 12, padding: '14px 14px 12px',
              }}
            >
              {/* Name row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                {isEditing ? (
                  <>
                    <input
                      autoFocus
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleEditSave(s.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      style={inputStyle}
                    />
                    <button onClick={() => handleEditSave(s.id)} style={{
                      background: T.blue, border: 'none', borderRadius: 6, color: '#fff',
                      fontFamily: "'Nunito', sans-serif", fontWeight: 800,
                      fontSize: 12, padding: '5px 12px', cursor: 'pointer',
                    }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{
                      background: 'none', border: 'none', color: T.muted,
                      fontSize: 16, cursor: 'pointer', padding: '4px 4px', lineHeight: 1,
                    }}>✕</button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, fontSize: 15, fontWeight: 800 }}>{s.name}</span>
                    <button
                      onClick={() => { setEditingId(s.id); setEditName(s.name); }}
                      title="Edit name"
                      style={{ background: 'none', border: 'none', fontSize: 15, cursor: 'pointer', padding: '2px 4px', lineHeight: 1 }}
                    >✏️</button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      title="Remove staff"
                      style={{ background: 'none', border: 'none', fontSize: 15, cursor: 'pointer', padding: '2px 4px', lineHeight: 1 }}
                    >🗑️</button>
                  </>
                )}
              </div>

              {/* Status + hours + clock button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: active ? T.green : T.muted,
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: active ? T.green : T.muted }}>
                      {active ? `Clocked in since ${fmtTime(active.clockIn)}` : 'Off duty'}
                    </span>
                  </div>
                  {hours && (
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.yellow, paddingLeft: 14 }}>
                      {hours}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleClockToggle(s.id)}
                  style={{
                    background: active ? T.card2 : T.blue,
                    border: active ? `1px solid ${T.border}` : 'none',
                    borderRadius: 8, color: active ? T.text : '#fff',
                    fontFamily: "'Nunito', sans-serif", fontWeight: 800,
                    fontSize: 12, padding: '7px 16px', cursor: 'pointer',
                  }}
                >
                  {active ? 'Clock Out' : 'Clock In'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KpiCard({ label, value, valueColor }) {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
      padding: '16px 20px', flex: 1,
    }}>
      <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div style={{ color: valueColor || T.text, fontSize: 22, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

function AddCarModal({ onClose, onSave }) {
  const [serviceType, setServiceType] = useState('out');
  const [vehicleType, setVehicleType] = useState('sedan');

  const selectStyle = {
    width: '100%', background: T.card2, border: `1px solid ${T.border}`,
    borderRadius: 8, color: T.text, padding: '10px 12px',
    fontSize: 14, fontFamily: "'Nunito', sans-serif", fontWeight: 700,
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: T.card, borderRadius: '16px 16px 0 0',
          border: `1px solid ${T.border}`, borderBottom: 'none',
          padding: '24px 20px 40px', width: '100%', maxWidth: 430,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontWeight: 900, fontSize: 17, marginBottom: 20 }}>Add Car</div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: T.muted, fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6 }}>
            SERVICE TYPE
          </label>
          <select value={serviceType} onChange={e => setServiceType(e.target.value)} style={selectStyle}>
            <option value="out">Outside Only</option>
            <option value="full">In &amp; Out</option>
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ color: T.muted, fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6 }}>
            VEHICLE TYPE
          </label>
          <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} style={selectStyle}>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="4x4">4x4 &amp; MPV</option>
          </select>
        </div>

        <button
          onClick={() => onSave(`${vehicleType}_${serviceType}`)}
          style={{
            width: '100%', background: T.blue, border: 'none', borderRadius: 10,
            color: '#fff', fontFamily: "'Nunito', sans-serif", fontWeight: 900,
            fontSize: 15, padding: '13px', cursor: 'pointer',
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function AddExpenseModal({ onClose, onSave }) {
  const [category, setCategory] = useState('soap');
  const [amount,   setAmount]   = useState('');

  const fieldStyle = {
    width: '100%', background: T.card2, border: `1px solid ${T.border}`,
    borderRadius: 8, color: T.text, padding: '10px 12px', fontSize: 14,
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, boxSizing: 'border-box',
    outline: 'none',
  };

  function handleSave() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    onSave(category, amt);
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: T.card, borderRadius: '16px 16px 0 0',
          border: `1px solid ${T.border}`, borderBottom: 'none',
          padding: '24px 20px 40px', width: '100%', maxWidth: 430,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontWeight: 900, fontSize: 17, marginBottom: 20 }}>Add Expense</div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: T.muted, fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6 }}>
            CATEGORY
          </label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={fieldStyle}>
            {EXP_CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ color: T.muted, fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6 }}>
            AMOUNT (RM)
          </label>
          <input
            autoFocus
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
            placeholder="0"
            style={fieldStyle}
          />
        </div>

        <button
          onClick={handleSave}
          style={{
            width: '100%', background: T.blue, border: 'none', borderRadius: 10,
            color: '#fff', fontFamily: "'Nunito', sans-serif", fontWeight: 900,
            fontSize: 15, padding: '13px', cursor: 'pointer',
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function BottomNav({ active, onChange }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: T.card, borderTop: `1px solid ${T.border}`,
      display: 'flex', zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
    }}>
      {NAV.map(item => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '8px 2px 6px',
            opacity: active === item.id ? 1 : 0.4,
            transition: 'opacity 0.15s',
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
          <span style={{
            fontSize: 9, fontFamily: "'Nunito', sans-serif", fontWeight: 700,
            color: active === item.id ? T.blue : T.muted,
          }}>
            {item.label}
          </span>
          {active === item.id && (
            <div style={{ width: 18, height: 2, background: T.blue, borderRadius: 99 }} />
          )}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [tab,          setTab]          = useState('today');
  const [showModal,    setShowModal]    = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [stats,        setStats]        = useState(getTodayStats);
  const [expenses,     setExpenses]     = useState(getTodayExpenses);

  function refreshToday() {
    setStats(getTodayStats());
    setExpenses(getTodayExpenses());
  }

  function handleSave(service) {
    try {
      const all = JSON.parse(localStorage.getItem('kk_rec') || '[]');
      all.push({ date: localDateStr(), service, ts: Date.now() });
      localStorage.setItem('kk_rec', JSON.stringify(all));
    } catch {}
    refreshToday();
    setShowModal(false);
  }

  function handleSaveExpense(category, amount) {
    try {
      const all = JSON.parse(localStorage.getItem('kk_exp') || '[]');
      all.push({ date: localDateStr(), category, amount, ts: Date.now() });
      localStorage.setItem('kk_exp', JSON.stringify(all));
    } catch {}
    refreshToday();
    setShowExpModal(false);
  }

  function handleDeleteExpense(exp) {
    try {
      const all = JSON.parse(localStorage.getItem('kk_exp') || '[]');
      all.splice(exp._idx, 1);
      localStorage.setItem('kk_exp', JSON.stringify(all));
    } catch {}
    refreshToday();
  }

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      background: T.bg, color: T.text,
      minHeight: '100vh', maxWidth: 430,
      margin: '0 auto', paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px 12px',
        borderBottom: `1px solid ${T.border}`,
        background: T.bg,
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>⚡</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5, lineHeight: 1.1 }}>
              Kilat² Carwash
            </div>
            <div style={{ color: T.muted, fontSize: 11 }}>Tawau, Sabah</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: T.blue }}>{TAB_LABEL[tab]}</div>
          <div style={{ color: T.muted, fontSize: 11 }}>
            {new Date().toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div style={{ paddingTop: 16 }}>
        {tab === 'today' && (
          <div style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Today's Sales</h1>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  background: T.blue, border: 'none', borderRadius: 8,
                  color: '#fff', fontFamily: "'Nunito', sans-serif", fontWeight: 800,
                  fontSize: 13, padding: '7px 14px', cursor: 'pointer',
                }}
              >
                + Add Car
              </button>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <KpiCard label="Cars Washed" value={String(stats.carsWashed)} />
              <KpiCard label="Total Revenue" value={`RM ${stats.totalRevenue}`} />
              <KpiCard
                label="Net Profit"
                value={`${stats.netProfit < 0 ? '−' : ''}RM ${Math.abs(stats.netProfit)}`}
                valueColor={stats.netProfit < 0 ? T.red : T.text}
              />
            </div>

            {/* Expenses */}
            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>Today's Expenses</h2>
                <button
                  onClick={() => setShowExpModal(true)}
                  style={{
                    background: T.blue, border: 'none', borderRadius: 8,
                    color: '#fff', fontFamily: "'Nunito', sans-serif", fontWeight: 800,
                    fontSize: 13, padding: '7px 14px', cursor: 'pointer',
                  }}
                >
                  + Add Expense
                </button>
              </div>

              {expenses.length === 0 ? (
                <div style={{ textAlign: 'center', color: T.muted, fontSize: 14, fontWeight: 700, padding: '24px 0' }}>
                  No expenses today
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {expenses.map(exp => (
                    <div
                      key={exp._idx}
                      style={{
                        background: T.card, border: `1px solid ${T.border}`, borderRadius: 10,
                        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
                      }}
                    >
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: T.text }}>
                        {EXP_CAT_LABEL[exp.category] || exp.category}
                      </span>
                      <span style={{ color: T.red, fontSize: 14, fontWeight: 800, whiteSpace: 'nowrap' }}>
                        RM {exp.amount}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(exp)}
                        style={{
                          background: T.red, border: 'none', borderRadius: 6,
                          color: '#fff', fontFamily: "'Nunito', sans-serif", fontWeight: 900,
                          fontSize: 12, padding: '4px 9px', cursor: 'pointer', lineHeight: 1.4,
                        }}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {tab === 'log'    && <LogTab />}
        {tab === 'staff'  && <StaffTab />}
        {tab === 'weekly' && <Placeholder label="Weekly Report" />}
        {tab === 'roi'    && <Placeholder label="ROI Tracker" />}
        {tab === 'stock'  && <Placeholder label="Stock Tracker" />}
        {tab === 'ai'     && <Placeholder label="AI Advisor" />}
      </div>

      <BottomNav active={tab} onChange={setTab} />

      {showModal    && <AddCarModal     onClose={() => setShowModal(false)}    onSave={handleSave}        />}
      {showExpModal && <AddExpenseModal onClose={() => setShowExpModal(false)} onSave={handleSaveExpense} />}
    </div>
  );
}
