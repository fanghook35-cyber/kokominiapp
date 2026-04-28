import React from 'react'

const TABS = [
  { id:'home',        label:'Home',   icon: HomeIcon   },
  { id:'tasks',       label:'Tasks',  icon: TaskIcon   },
  { id:'leaderboard', label:'Board',  icon: BoardIcon  },
  { id:'token',       label:'Token',  icon: TokenIcon  },
  { id:'profile',     label:'You',    icon: ProfileIcon},
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      position:'fixed', bottom:0, left:0, right:0,
      background:'rgba(10,8,2,0.96)',
      borderTop:'0.5px solid rgba(58,46,20,0.8)',
      display:'flex',
      paddingBottom:'env(safe-area-inset-bottom, 8px)',
      backdropFilter:'blur(12px)',
      WebkitBackdropFilter:'blur(12px)',
    }}>
      {TABS.map(tab => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => { onChange(tab.id) }}
            style={{
              flex:1, padding:'10px 4px 8px',
              display:'flex', flexDirection:'column', alignItems:'center', gap:3,
              background:'none', border:'none', cursor:'pointer',
              transition:'all 0.15s',
              opacity: isActive ? 1 : 0.45,
            }}
          >
            <tab.icon active={isActive} />
            <span style={{
              fontSize:9, letterSpacing:0.5, textTransform:'uppercase',
              color: isActive ? 'var(--gold)' : 'var(--smoke)',
              fontFamily:'var(--font-display)',
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

// ── Icons (SVG, 20×20) ──────────────────────────────────────────────────────

function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 9L10 3L17 9V17H13V13H7V17H3V9Z"
        stroke={active ? '#c9a227' : '#6b5a3e'} strokeWidth="1.2" fill={active ? 'rgba(201,162,39,0.15)' : 'none'} strokeLinejoin="round"/>
    </svg>
  )
}
function TaskIcon({ active }) {
  const c = active ? '#c9a227' : '#6b5a3e'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="3" stroke={c} strokeWidth="1.2" fill={active ? 'rgba(201,162,39,0.1)' : 'none'}/>
      <path d="M7 10L9 12L13 8" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function BoardIcon({ active }) {
  const c = active ? '#c9a227' : '#6b5a3e'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3"  y="12" width="4" height="5" rx="1" stroke={c} strokeWidth="1.2" fill={active ? 'rgba(201,162,39,0.1)' : 'none'}/>
      <rect x="8"  y="8"  width="4" height="9" rx="1" stroke={c} strokeWidth="1.2" fill={active ? 'rgba(201,162,39,0.1)' : 'none'}/>
      <rect x="13" y="4"  width="4" height="13" rx="1" stroke={c} strokeWidth="1.2" fill={active ? 'rgba(201,162,39,0.1)' : 'none'}/>
    </svg>
  )
}
function TokenIcon({ active }) {
  const c = active ? '#c9a227' : '#6b5a3e'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke={c} strokeWidth="1.2" fill={active ? 'rgba(201,162,39,0.1)' : 'none'}/>
      <path d="M7.5 10C7.5 8.62 8.62 7.5 10 7.5C11.38 7.5 12.5 8.62 12.5 10" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M8 13L12 7" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}
function ProfileIcon({ active }) {
  const c = active ? '#c9a227' : '#6b5a3e'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3" stroke={c} strokeWidth="1.2" fill={active ? 'rgba(201,162,39,0.1)' : 'none'}/>
      <path d="M4 17C4 14.24 6.69 12 10 12C13.31 12 16 14.24 16 17" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}
