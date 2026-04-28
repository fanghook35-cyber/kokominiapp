import React from 'react'

// ── KatakanaLoader ─────────────────────────────────────────────────────────
export function KatakanaLoader() {
  const chars = ['影', '猫', '氷', '村', '剣']
  const [i, setI] = React.useState(0)
  React.useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % chars.length), 300)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:16 }}>
      <div style={{ fontFamily:'var(--font-display)', fontSize:48, color:'var(--gold)', animation:'flicker 0.6s ease-in-out infinite' }}>
        {chars[i]}
      </div>
      <div style={{ fontSize:12, color:'var(--smoke)', letterSpacing:3, textTransform:'uppercase' }}>
        Loading
      </div>
    </div>
  )
}

// ── GoldButton ──────────────────────────────────────────────────────────────
export function GoldButton({ children, onClick, style, disabled, variant = 'primary' }) {
  const base = {
    width: '100%', padding: '12px 20px',
    border: 'none', borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, letterSpacing: 1,
    transition: 'all 0.2s', opacity: disabled ? 0.5 : 1,
  }
  const variants = {
    primary: { background: 'linear-gradient(135deg, #b8891e 0%, #c9a227 50%, #d4ad3a 100%)', color: '#0d0a05' },
    ghost:   { background: 'transparent', border: '0.5px solid var(--gold)', color: 'var(--gold)' },
    danger:  { background: 'transparent', border: '0.5px solid #8b1a1a', color: '#c05050' },
  }
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
      onTouchStart={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)' }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {children}
    </button>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────
export function Card({ children, style, glow }) {
  return (
    <div style={{
      background: 'rgba(26,18,9,0.9)',
      border: `0.5px solid ${glow ? 'rgba(201,162,39,0.4)' : 'rgba(58,46,20,0.8)'}`,
      borderRadius: 12,
      overflow: 'hidden',
      ...(glow && { boxShadow: '0 0 20px rgba(201,162,39,0.08)' }),
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── TaskRow ────────────────────────────────────────────────────────────────
export function TaskRow({ label, pts, done, onAction, actionLabel, delay = 0 }) {
  return (
    <div
      className="animate-in"
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 0',
        borderBottom: '0.5px solid rgba(58,46,20,0.6)',
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Status dot */}
      <div style={{
        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
        background: done ? 'var(--gold)' : 'transparent',
        border: done ? 'none' : '1px solid var(--smoke)',
        boxShadow: done ? '0 0 6px rgba(201,162,39,0.5)' : 'none',
      }} />
      {/* Label */}
      <span style={{ flex: 1, fontSize: 14, color: done ? 'var(--mist)' : 'var(--paper)', textDecoration: done ? 'none' : 'none' }}>
        {label}
      </span>
      {/* Points */}
      <span style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'monospace', letterSpacing: 0.5, opacity: done ? 0.5 : 1 }}>
        +{pts}
      </span>
      {/* Action */}
      {!done && (
        <button
          onClick={onAction}
          style={{
            fontSize: 11, padding: '4px 10px',
            background: 'transparent',
            border: '0.5px solid var(--smoke)',
            borderRadius: 20,
            color: 'var(--gold2)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--smoke)'; e.currentTarget.style.color = 'var(--gold2)' }}
        >
          {actionLabel ?? 'Go →'}
        </button>
      )}
      {done && (
        <span style={{ fontSize: 11, color: 'var(--gold)', opacity: 0.6 }}>✓</span>
      )}
    </div>
  )
}

// ── EnergyBar ──────────────────────────────────────────────────────────────
export function EnergyBar({ current, max = 10 }) {
  const pct = Math.min(100, Math.round((current / max) * 100))
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:11, color:'var(--smoke)' }}>
        <span>⚡ Daily Energy</span>
        <span style={{ color:'var(--mist)' }}>{current} / {max} actions</span>
      </div>
      <div style={{ height:3, background:'rgba(58,46,20,0.8)', borderRadius:2, overflow:'hidden' }}>
        <div style={{
          height:'100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, #7a5900, var(--gold))`,
          borderRadius:2,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}

// ── KanjiStamp ─────────────────────────────────────────────────────────────
export function KanjiStamp({ char, size = 48, style }) {
  return (
    <div style={{
      fontFamily: 'var(--font-display)',
      fontSize: size,
      color: 'var(--gold)',
      opacity: 0.08,
      position: 'absolute',
      pointerEvents: 'none',
      userSelect: 'none',
      lineHeight: 1,
      ...style,
    }}>
      {char}
    </div>
  )
}

// ── SuspiciousBanner ───────────────────────────────────────────────────────
export function SuspiciousBanner() {
  return (
    <div style={{
      background: 'rgba(139,26,26,0.15)', border: '0.5px solid rgba(139,26,26,0.5)',
      borderRadius: 8, padding: '10px 14px', marginBottom: 12,
      fontSize: 12, color: '#c05050', lineHeight: 1.5,
    }}>
      ⚠ Account flagged. Rewards suspended. Contact support via the bot.
    </div>
  )
}

// ── PointsCounter (animated) ───────────────────────────────────────────────
export function PointsCounter({ value }) {
  const [display, setDisplay] = React.useState(value)
  const prev = React.useRef(value)

  React.useEffect(() => {
    if (value === prev.current) return
    const diff = value - prev.current
    const steps = 30
    let step = 0
    const tick = setInterval(() => {
      step++
      setDisplay(Math.round(prev.current + (diff * step / steps)))
      if (step >= steps) {
        clearInterval(tick)
        prev.current = value
      }
    }, 16)
    return () => clearInterval(tick)
  }, [value])

  return <>{display.toLocaleString()}</>
}

// ── ScreenHeader ───────────────────────────────────────────────────────────
export function ScreenHeader({ title, subtitle, right }) {
  return (
    <div style={{
      padding: '16px 20px 12px',
      borderBottom: '0.5px solid rgba(58,46,20,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:16, color:'var(--gold2)', fontWeight:600, letterSpacing:0.5 }}>
          {title}
        </h2>
        {subtitle && <p style={{ fontSize:11, color:'var(--smoke)', marginTop:2, letterSpacing:0.5 }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
