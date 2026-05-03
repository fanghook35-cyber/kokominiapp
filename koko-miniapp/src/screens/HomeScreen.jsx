import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '../hooks/useUser'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { TG, REFERRAL_CAP, fmtCompact, TWITTER_URL, RETWEET_URL, TG_GROUP } from '../lib/tg'

const KOKO_IMG   = 'https://i.postimg.cc/tgTkS4ML/8e5af09c-41df-471c-9e17-d6ae16b23ae9.png'
const KP_PER_MIN = 2780

// ── Design tokens ────────────────────────────────────────────────────────────
const C = {
  ink:       '#0a0a0c',
  shadow:    '#111118',
  panel:     '#1a1a28',
  border:    '#2a2a3e',
  gold:      '#c8a96e',
  goldSoft:  '#b89a5c',
  goldGlow:  'rgba(200,169,110,0.15)',
  textMain:  '#eeeef5',
  textDim:   '#6b6b88',
}

const styles = {
  // Buttons
  btnPrimary: {
    flex: 1, padding: '14px 16px',
    background: 'linear-gradient(135deg, #b89a5c 0%, #c8a96e 50%, #d4b87a 100%)',
    border: 'none', borderRadius: 10,
    boxShadow: '0 4px 20px rgba(200,169,110,0.2)',
    cursor: 'pointer', touchAction: 'manipulation',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    transition: 'opacity 0.2s',
  },
  btnSecondary: {
    flex: 1, padding: '14px 16px',
    background: C.panel,
    border: `1px solid ${C.border}`,
    borderRadius: 10, cursor: 'pointer', touchAction: 'manipulation',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    transition: 'border-color 0.2s',
  },
  card: {
    background: C.panel,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
  },
  labelSmall: {
    fontSize: 9, letterSpacing: 2,
    color: C.textDim, textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
  },
  numLarge: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 700, color: C.textMain, lineHeight: 1,
  },
  gold: { color: C.gold },
  dimText: { color: C.textDim },
}

// ── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ pct }) {
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${Math.min(100, pct)}%`,
        background: `linear-gradient(90deg, ${C.goldSoft}, ${C.gold})`,
        borderRadius: 2, transition: 'width 0.6s ease',
      }} />
    </div>
  )
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, barPct }) {
  return (
    <div style={{ ...styles.card, padding: 16, flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: C.gold }}>{icon}</span>
        <span style={{ ...styles.labelSmall }}>{label}</span>
      </div>
      <div style={{ ...styles.numLarge, fontSize: 22, marginBottom: 4 }}>{value}</div>
      <div style={{ ...styles.labelSmall, color: C.textDim, marginBottom: barPct !== undefined ? 8 : 0 }}>{sub}</div>
      {barPct !== undefined && <ProgressBar pct={barPct} />}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { user, refCount, loading } = useUser()
  const { board } = useLeaderboard()
  const [kpCount, setKpCount] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!user) return
    setKpCount(user.points)
    timerRef.current = setInterval(() => {
      setKpCount(p => p + Math.floor(KP_PER_MIN / 60))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [user?.points])

  if (loading) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 32, color: C.gold, opacity: 0.4 }}>影</div>
    </div>
  )

  if (!user) return (
    <div style={{ padding: 40, textAlign: 'center', color: C.textDim, fontSize: 13 }}>
      Open via the bot.
    </div>
  )

  const tasksCount  = ['joined_telegram','followed_x','retweeted','lore_answered','wallet_address'].filter(t => user[t]).length
  const totalTasks  = 5
  const shadowOn    = user.shadow_mode_active && user.shadow_mode_expires && new Date(user.shadow_mode_expires) > new Date()
  const myEntry     = board.find(e => e.telegram_id === user.telegram_id)
  const myRank      = myEntry?.rank ?? '—'
  const multiplier  = shadowOn ? 2.0 : refCount >= 10 ? 1.6 : refCount >= 5 ? 1.4 : 1.0

  function openTask(param) {
    try { TG.haptic('impact', 'light') } catch (e) {}
    TG.openBot(param)
  }

  return (
    <div style={{
      height: '100%', overflowY: 'auto', overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
      background: C.ink, paddingBottom: 80,
    }}>

      {/* ── HERO ── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: `radial-gradient(ellipse at 70% 30%, #1e1a10 0%, #14121a 40%, ${C.ink} 75%)`,
        borderBottom: `1px solid ${C.border}`,
        minHeight: 220,
      }}>
        {/* Kanji watermark */}
        <div style={{
          position: 'absolute', right: 12, top: 8,
          fontFamily: "'Cinzel', serif", fontSize: 88,
          color: 'rgba(200,169,110,0.07)', lineHeight: 1,
          pointerEvents: 'none', userSelect: 'none',
        }}>影</div>

        {/* Moon glow */}
        <div style={{
          position: 'absolute', right: 40, top: 20,
          width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,110,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Koko */}
        <img src={KOKO_IMG} alt="Koko" style={{
          position: 'absolute', right: -6, bottom: 0,
          height: 210, width: 'auto', objectFit: 'contain',
          pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          filter: 'brightness(0.88)',
        }} />

        <div style={{ padding: '16px 16px 20px', position: 'relative', zIndex: 2 }}>

          {/* Rank badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(26,26,40,0.9)', border: `1px solid ${C.border}`,
            borderRadius: 10, padding: '8px 12px', marginBottom: 20,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7, overflow: 'hidden',
              border: `1px solid rgba(200,169,110,0.25)`, flexShrink: 0,
            }}>
              <img src={KOKO_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.textMain, fontFamily: "'Cinzel', serif", letterSpacing: 0.5 }}>
                {user.username ? `@${user.username}` : user.first_name}
              </div>
              <div style={{ ...styles.labelSmall, color: C.gold, marginTop: 2 }}>RANK #{myRank}</div>
            </div>
          </div>

          {/* KP */}
          <div style={{ ...styles.labelSmall, marginBottom: 6 }}>TOTAL KP</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span style={{ ...styles.numLarge, fontSize: 36 }}>
              {kpCount.toLocaleString()}
            </span>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: C.gold, fontWeight: 600 }}>KP</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
            <span style={{ color: C.gold, fontSize: 11 }}>⚡</span>
            <span style={{ ...styles.labelSmall, color: C.textDim }}>+{KP_PER_MIN.toLocaleString()} KP/min</span>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 10, paddingRight: 130 }}>
            <button
              onClick={() => openTask('tasks')}
              style={styles.btnPrimary}
              onTouchStart={e => e.currentTarget.style.opacity = '0.85'}
              onTouchEnd={e => e.currentTarget.style.opacity = '1'}
            >
              <span style={{ fontSize: 14 }}>⚡</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, fontWeight: 700, color: '#0a0a0c', letterSpacing: 1 }}>START FARMING</div>
                <div style={{ fontSize: 9, color: 'rgba(10,10,12,0.6)', marginTop: 1, letterSpacing: 0.5 }}>Earn KP</div>
              </div>
            </button>
            <button
              onClick={() => openTask('shadow_mode')}
              style={styles.btnSecondary}
              onTouchStart={e => e.currentTarget.style.borderColor = C.gold}
              onTouchEnd={e => e.currentTarget.style.borderColor = C.border}
            >
              <span style={{ fontSize: 14, color: C.gold }}>◎</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: C.textMain, letterSpacing: 0.5 }}>SHADOW MODE</div>
                <div style={{ ...styles.labelSmall, color: C.textDim, marginTop: 2 }}>Unleash Koko's true power</div>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: '16px 14px 0' }}>

        {/* ── STAT CARDS ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <StatCard
            icon="⚡"
            label="ENERGY"
            value="5,700"
            sub="+50 / min"
            barPct={100}
          />
          <StatCard
            icon="👥"
            label="REFERRALS"
            value={refCount}
            sub={refCount < REFERRAL_CAP ? `Next at ${Math.ceil((refCount + 1) / 5) * 5}` : 'Cap reached'}
            barPct={(refCount / REFERRAL_CAP) * 100}
          />
          <StatCard
            icon="✦"
            label="MULTIPLIER"
            value={`${multiplier}x`}
            sub="KP Boost"
          />
        </div>

        {/* ── SHADOW MODE ── */}
        <div style={{
          ...styles.card,
          marginBottom: 16, overflow: 'hidden', position: 'relative',
        }}>
          {/* Koko image on the right */}
          <img src={KOKO_IMG} alt="" style={{
            position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)',
            height: 130, width: 'auto', objectFit: 'contain',
            opacity: 0.25, pointerEvents: 'none', filter: 'brightness(0.5)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
          }} />

          <div style={{ padding: '18px 20px 16px', position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{
                fontFamily: "'Cinzel', serif", fontSize: 28,
                color: 'rgba(200,169,110,0.3)', lineHeight: 1,
              }}>影</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.gold, letterSpacing: 1 }}>SHADOW MODE</span>
                  <span style={{ fontSize: 12, color: C.textDim }}>🔒</span>
                </div>
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 2, lineHeight: 1.5 }}>
                  Unleash Koko's full potential.<br/>2X KP. 2X Profit. 24 Hours.
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: C.border, margin: '14px 0' }} />

            {/* Requirements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              {/* Referrals */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: C.textDim }}>👥</span>
                  <span style={{ fontSize: 12, color: C.textDim, flex: 1 }}>Referrals</span>
                  <span style={{ ...styles.labelSmall, color: refCount >= 5 ? C.gold : C.textDim }}>
                    {Math.min(refCount, 5)} / 5
                  </span>
                </div>
                <ProgressBar pct={(Math.min(refCount, 5) / 5) * 100} />
              </div>
              {/* Tasks */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: C.textDim }}>◎</span>
                  <span style={{ fontSize: 12, color: C.textDim, flex: 1 }}>Tasks</span>
                  <span style={{ ...styles.labelSmall, color: tasksCount >= 5 ? C.gold : C.textDim }}>
                    {tasksCount} / 5
                  </span>
                </div>
                <ProgressBar pct={(tasksCount / 5) * 100} />
              </div>
            </div>

            {/* Lock button */}
            <button
              onClick={() => openTask('shadow_mode')}
              style={{
                width: '100%', padding: '11px',
                background: shadowOn
                  ? `linear-gradient(135deg, ${C.goldSoft}, ${C.gold})`
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${shadowOn ? C.gold : C.border}`,
                borderRadius: 8, cursor: 'pointer', touchAction: 'manipulation',
                fontFamily: "'Cinzel', serif", fontSize: 11,
                color: shadowOn ? '#0a0a0c' : C.textDim,
                letterSpacing: 1, marginBottom: 8,
              }}
            >
              🔒 {shadowOn ? 'ACTIVE' : 'LOCKED — COMPLETE REQUIREMENTS'}
            </button>
            <div style={{ textAlign: 'center', ...styles.labelSmall, color: C.textDim }}>
              Reward: 2× KP for 24 hours
            </div>
          </div>
        </div>

        {/* ── LORE QUOTE ── */}
        <div style={{
          padding: '14px 0',
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          textAlign: 'center', marginBottom: 4,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: '0.5px', background: `linear-gradient(to right, transparent, ${C.border})` }} />
            <span style={{ fontSize: 11, color: C.textDim, fontStyle: 'italic', letterSpacing: 0.5 }}>
              "Koko doesn't chase power. Power follows Koko."
            </span>
            <div style={{ flex: 1, height: '0.5px', background: `linear-gradient(to left, transparent, ${C.border})` }} />
          </div>
        </div>

      </div>
    </div>
  )
}
