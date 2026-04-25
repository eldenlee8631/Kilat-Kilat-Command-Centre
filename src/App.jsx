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

function Placeholder({ label }) {
  return (
    <div style={{ padding: 32, textAlign: 'center', color: T.muted, fontSize: 16, fontWeight: 700 }}>
      {label} — coming soon
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
  const [tab, setTab] = useState('today');

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
        {tab === 'today'  && <h1>Today's Sales</h1>}
        {tab === 'log'    && <Placeholder label="Car Log" />}
        {tab === 'staff'  && <Placeholder label="Staff Tracker" />}
        {tab === 'weekly' && <Placeholder label="Weekly Report" />}
        {tab === 'roi'    && <Placeholder label="ROI Tracker" />}
        {tab === 'stock'  && <Placeholder label="Stock Tracker" />}
        {tab === 'ai'     && <Placeholder label="AI Advisor" />}
      </div>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
