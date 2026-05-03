import React from 'react'

const TABS = [
  { id: 'home',        label: 'HOME',    icon: HomeIcon    },
  { id: 'tasks',       label: 'QUESTS',  icon: MissionIcon },
  { id: 'leaderboard', label: 'RANK',    icon: RankIcon    },
  { id: 'token',       label: 'TOKEN',   icon: TokenIcon   },
  { id: 'profile',     label: 'PROFILE', icon: ProfileIcon },
]

const C = {
  ink:    '#0a0a0c',
  panel:  '#111118',
  border: '#2a2a3e',
  gold:   '#c8a96e',
  dim:    '#6b6b88',
}

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: C.panel,
      borderTop: `1px solid ${C.border}`,
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 6px)',
      zIndex: 100,
    }}>
      {TABS.map(tab => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              padding: '10px 0 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: isActive ? 1 : 0.38,
              transition: 'opacity 0.15s',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              position: 'relative',
              minWidth: 0,
            }}
          >
            {/* Gold top bar indicator */}
            {isActive && (
              <div style={{
                position: 'absolute', top: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: 20, height: 1.5, borderRadius: 1,
                background: C.gold,
              }} />
            )}

            <tab.icon active={isActive} />

            <span style={{
              fontSize: 7,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              color: isActive ? C.gold : C.dim,
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: 'nowrap',
              lineHeight: 1,
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

function HomeIcon({ active }) {
  const c = active ? '#c8a96e' : '#6b6b88'
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M3 9L10 3L17 9V17H13V13H7V17H3V9Z"
        stroke={c} strokeWidth="1.3"
        fill={active ? 'rgba(200,169,110,0.1)' : 'none'}
        strokeLinejoin="round"/>
    </svg>
  )
}

function MissionIcon({ active }) {
  const c = active ? '#c8a96e' : '#6b6b88'
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke={c} strokeWidth="1.3"
        fill={active ? 'rgba(200,169,110,0.08)' : 'none'}/>
      <path d="M7 10L9 12L13 8" stroke={c} strokeWidth="1.3"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function RankIcon({ active }) {
  const c = active ? '#c8a96e' : '#6b6b88'
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="3"  y="13" width="4" height="4" rx="1" stroke={c} strokeWidth="1.3" fill={active ? 'rgba(200,169,110,0.08)' : 'none'}/>
      <rect x="8"  y="9"  width="4" height="8" rx="1" stroke={c} strokeWidth="1.3" fill={active ? 'rgba(200,169,110,0.08)' : 'none'}/>
      <rect x="13" y="5"  width="4" height="12" rx="1" stroke={c} strokeWidth="1.3" fill={active ? 'rgba(200,169,110,0.08)' : 'none'}/>
    </svg>
  )
}

function TokenIcon({ active }) {
  const c = active ? '#c8a96e' : '#6b6b88'
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke={c} strokeWidth="1.3"
        fill={active ? 'rgba(200,169,110,0.08)' : 'none'}/>
      <path d="M7.5 10C7.5 8.62 8.62 7.5 10 7.5C11.38 7.5 12.5 8.62 12.5 10"
        stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M8 13L12 7" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function ProfileIcon({ active }) {
  const c = active ? '#c8a96e' : '#6b6b88'
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3" stroke={c} strokeWidth="1.3"
        fill={active ? 'rgba(200,169,110,0.08)' : 'none'}/>
      <path d="M4 17C4 14.24 6.69 12 10 12C13.31 12 16 14.24 16 17"
        stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}
