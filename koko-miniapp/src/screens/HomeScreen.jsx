import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '../hooks/useUser'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { SuspiciousBanner } from '../components/UI'
import { TG, REFERRAL_CAP, fmtCompact, TWITTER_URL, RETWEET_URL, TG_GROUP } from '../lib/tg'

const KOKO_IMG   = 'https://i.postimg.cc/tgTkS4ML/8e5af09c-41df-471c-9e17-d6ae16b23ae9.png'
const KP_PER_MIN = 2780
const ENERGY_MAX = 5700
const BOOSTER_PCT = 20

// ── Injected styles ───────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Noto+Serif+JP:wght@300;400;700&family=JetBrains+Mono:wght@300;400&display=swap');

  .hs-root {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 90px;
    background: #0a0805;
    font-family: 'Noto Serif JP', serif;
  }

  /* HERO */
  .hs-hero {
    position: relative;
    overflow: hidden;
    min-height: 220px;
    background: radial-gradient(ellipse at 60% 30%, #2a1a06 0%, #150e03 50%, #0a0805 100%);
    border-bottom: 1px solid rgba(201,162,39,0.12);
  }

  .hs-hero-ink {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(ellipse at 70% 20%, rgba(201,162,39,0.06) 0%, transparent 60%),
      radial-gradient(ellipse at 10% 80%, rgba(100,60,10,0.08) 0%, transparent 50%);
    pointer-events: none;
  }

  .hs-hero-lines {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      0deg, transparent, transparent 28px,
      rgba(201,162,39,0.015) 28px, rgba(201,162,39,0.015) 29px
    );
    pointer-events: none;
  }

  .hs-kanji-bg {
    position: absolute;
    right: 6px;
    top: 4px;
    font-family: 'Cinzel', serif;
    font-size: 64px;
    color: rgba(201,162,39,0.07);
    line-height: 1;
    pointer-events: none;
    letter-spacing: -4px;
  }

  .hs-koko-img {
    position: absolute;
    right: -6px;
    bottom: 0;
    height: 200px;
    width: auto;
    object-fit: contain;
    pointer-events: none;
    -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
    mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
    filter: drop-shadow(0 0 20px rgba(201,162,39,0.15));
  }

  .hs-hero-content {
    padding: 14px 14px 0;
    position: relative;
    z-index: 2;
  }

  /* RANK BADGE */
  .hs-rank-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(10,8,5,0.9);
    border: 1px solid rgba(201,162,39,0.2);
    border-radius: 8px;
    padding: 5px 10px 5px 5px;
    margin-bottom: 12px;
    backdrop-filter: blur(8px);
  }

  .hs-rank-avatar {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    overflow: hidden;
    background: rgba(42,26,6,0.9);
    border: 1px solid rgba(201,162,39,0.2);
    flex-shrink: 0;
  }

  .hs-rank-name {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    color: #e8d5a0;
    letter-spacing: 0.3px;
  }

  .hs-rank-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: #c9a227;
    margin-top: 1px;
  }

  /* KP COUNTER */
  .hs-kp-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7px;
    color: rgba(201,162,39,0.5);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .hs-kp-value {
    font-family: 'Cinzel', serif;
    font-size: 32px;
    color: #f0e0b0;
    font-weight: 600;
    line-height: 1;
    margin-bottom: 2px;
    text-shadow: 0 0 30px rgba(201,162,39,0.3);
  }

  .hs-kp-rate {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: rgba(201,162,39,0.6);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* CTA BUTTONS */
  .hs-btn-farm {
    flex: 1;
    padding: 10px 0;
    background: linear-gradient(135deg, #9a6e10, #c9a227, #e8c040);
    border: none;
    border-radius: 7px;
    font-family: 'Cinzel', serif;
    font-size: 10px;
    font-weight: 600;
    color: #0a0805;
    cursor: pointer;
    letter-spacing: 1px;
    touch-action: manipulation;
    box-shadow: 0 2px 12px rgba(201,162,39,0.25);
    transition: opacity 0.15s;
  }
  .hs-btn-farm:active { opacity: 0.85; }

  .hs-btn-shadow {
    flex: 1;
    padding: 10px 0;
    background: rgba(10,8,5,0.92);
    border: 1px solid rgba(201,162,39,0.35);
    border-radius: 7px;
    font-family: 'Cinzel', serif;
    font-size: 10px;
    color: #c9a227;
    cursor: pointer;
    letter-spacing: 0.5px;
    touch-action: manipulation;
    transition: background 0.15s;
  }
  .hs-btn-shadow:active { background: rgba(42,26,6,0.9); }

  /* BODY */
  .hs-body {
    padding: 10px 12px 0;
  }

  /* SECTION TITLE */
  .hs-section-title {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 8px;
  }
  .hs-section-title-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(201,162,39,0.3), transparent);
  }
  .hs-section-title-text {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    color: rgba(201,162,39,0.7);
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .hs-section-title-kanji {
    font-family: 'Noto Serif JP', serif;
    font-size: 14px;
    color: rgba(201,162,39,0.35);
  }

  /* STAT CARDS */
  .hs-stat-row {
    display: flex;
    gap: 7px;
    margin-bottom: 10px;
  }

  .hs-stat-card {
    flex: 1;
    background: linear-gradient(135deg, rgba(20,14,4,0.98) 0%, rgba(14,10,2,0.98) 100%);
    border: 1px solid rgba(58,38,8,0.8);
    border-radius: 10px;
    padding: 9px 9px 8px;
    position: relative;
    overflow: hidden;
  }

  .hs-stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,162,39,0.4), transparent);
  }

  .hs-stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7px;
    color: rgba(201,162,39,0.45);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .hs-stat-value {
    font-family: 'Cinzel', serif;
    font-size: 17px;
    color: #e8d5a0;
    font-weight: 600;
    line-height: 1;
    margin-bottom: 3px;
  }

  .hs-stat-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7px;
    color: rgba(180,140,60,0.5);
    line-height: 1.3;
  }

  .hs-energy-bar {
    height: 2px;
    background: rgba(42,26,6,0.8);
    border-radius: 1px;
    overflow: hidden;
    margin: 4px 0 3px;
  }
  .hs-energy-fill {
    height: 100%;
    background: linear-gradient(90deg, #8b6010, #c9a227);
    border-radius: 1px;
  }

  /* SCROLL / PARCHMENT PANEL */
  .hs-scroll {
    margin-bottom: 10px;
    position: relative;
  }

  .hs-scroll-inner {
    background:
      linear-gradient(180deg,
        rgba(28,18,5,0.0) 0%,
        rgba(22,14,3,0.97) 4%,
        rgba(18,11,2,0.98) 96%,
        rgba(28,18,5,0.0) 100%
      );
    border: 1px solid rgba(80,52,12,0.6);
    border-radius: 2px;
    padding: 14px 14px 12px;
    position: relative;
    box-shadow:
      inset 0 1px 0 rgba(201,162,39,0.08),
      inset 0 -1px 0 rgba(201,162,39,0.08),
      0 4px 20px rgba(0,0,0,0.5);
  }

  /* Scroll top/bottom rollers */
  .hs-scroll-inner::before,
  .hs-scroll-inner::after {
    content: '';
    position: absolute;
    left: -1px; right: -1px;
    height: 6px;
    background: linear-gradient(180deg, rgba(80,52,12,0.5), rgba(42,26,6,0.3));
    border: 1px solid rgba(80,52,12,0.4);
  }
  .hs-scroll-inner::before { top: -6px; border-radius: 3px 3px 0 0; }
  .hs-scroll-inner::after  { bottom: -6px; border-radius: 0 0 3px 3px; }

  .hs-scroll-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(80,52,12,0.4);
  }

  .hs-scroll-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .hs-scroll-kanji {
    font-family: 'Noto Serif JP', serif;
    font-size: 22px;
    color: rgba(201,162,39,0.5);
    line-height: 1;
  }

  .hs-scroll-name {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    color: rgba(201,162,39,0.8);
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .hs-scroll-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7px;
    color: rgba(180,140,60,0.4);
    letter-spacing: 1px;
    margin-top: 1px;
  }

  .hs-view-all {
    font-family: 'Cinzel', serif;
    font-size: 8px;
    color: rgba(201,162,39,0.6);
    background: none;
    border: none;
    cursor: pointer;
    letter-spacing: 1px;
    touch-action: manipulation;
    padding: 0;
  }
  .hs-view-all:active { color: #c9a227; }

  /* LEADERBOARD ROWS */
  .hs-lb-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 4px;
    border-bottom: 1px solid rgba(42,26,6,0.4);
    transition: background 0.15s;
  }
  .hs-lb-row:last-child { border-bottom: none; }
  .hs-lb-row.me {
    background: rgba(201,162,39,0.04);
    border-radius: 5px;
    border: none;
    margin-top: 4px;
    padding: 6px 8px;
    border-left: 2px solid rgba(201,162,39,0.4);
  }

  .hs-lb-medal {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cinzel', serif;
    font-size: 10px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .hs-lb-medal.gold   { background: rgba(201,162,39,0.15); color: #c9a227; border: 1px solid rgba(201,162,39,0.4); }
  .hs-lb-medal.silver { background: rgba(180,180,180,0.08); color: #b0b0b0; border: 1px solid rgba(180,180,180,0.2); }
  .hs-lb-medal.bronze { background: rgba(180,110,50,0.1); color: #cd8040; border: 1px solid rgba(180,110,50,0.2); }
  .hs-lb-medal.plain  { color: rgba(180,140,60,0.5); font-size: 9px; }

  .hs-lb-name {
    flex: 1;
    font-size: 11px;
    color: #c8b880;
    font-family: 'Noto Serif JP', serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hs-lb-pts {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #c9a227;
    flex-shrink: 0;
  }

  /* SHADOW MODE PANEL */
  .hs-shadow-panel {
    background: linear-gradient(135deg, rgba(10,8,5,0.98) 0%, rgba(16,10,2,0.98) 100%);
    border: 1px solid rgba(58,38,8,0.7);
    border-radius: 12px;
    padding: 12px 12px 10px;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
  }

  .hs-shadow-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,162,39,0.3), transparent);
  }

  .hs-shadow-orb {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(42,26,6,0.9) 0%, rgba(10,8,5,0.95) 100%);
    border: 1px solid rgba(201,162,39,0.15);
    box-shadow: 0 0 20px rgba(201,162,39,0.06), inset 0 0 12px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Noto Serif JP', serif;
    font-size: 24px;
    color: rgba(201,162,39,0.45);
    flex-shrink: 0;
  }

  .hs-shadow-orb.active {
    border-color: rgba(201,162,39,0.4);
    box-shadow: 0 0 20px rgba(201,162,39,0.2), inset 0 0 8px rgba(201,162,39,0.05);
    color: rgba(201,162,39,0.8);
  }

  .hs-req-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }

  .hs-req-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.5px;
  }

  .hs-req-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    color: rgba(180,140,60,0.5);
  }

  .hs-req-bar {
    height: 2px;
    background: rgba(42,26,6,0.8);
    border-radius: 1px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .hs-req-fill {
    height: 100%;
    border-radius: 1px;
    background: linear-gradient(90deg, #6a4a08, #c9a227);
    transition: width 0.5s ease;
  }

  .hs-shadow-btn {
    width: 100%;
    padding: 8px;
    border-radius: 7px;
    font-family: 'Cinzel', serif;
    font-size: 10px;
    cursor: pointer;
    letter-spacing: 1px;
    touch-action: manipulation;
    border: none;
    transition: all 0.15s;
  }

  .hs-shadow-btn.locked {
    background: rgba(20,14,4,0.9);
    border: 1px solid rgba(58,38,8,0.8);
    color: rgba(180,140,60,0.35);
  }

  .hs-shadow-btn.active {
    background: linear-gradient(135deg, #9a6e10, #c9a227);
    color: #0a0805;
    font-weight: 700;
    box-shadow: 0 2px 12px rgba(201,162,39,0.3);
  }

  /* LORE FOOTER */
  .hs-lore {
    text-align: center;
    padding: 10px 20px 4px;
    font-family: 'Noto Serif JP', serif;
    font-size: 9px;
    color: rgba(100,70,20,0.6);
    font-style: italic;
    letter-spacing: 0.5px;
    line-height: 1.6;
  }

  /* ANIM */
  @keyframes hsSlideUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hs-animate { animation: hsSlideUp 0.35s ease both; }
  .hs-d1 { animation-delay: 0.05s; }
  .hs-d2 { animation-delay: 0.12s; }
  .hs-d3 { animation-delay: 0.19s; }
  .hs-d4 { animation-delay: 0.26s; }
`

function injectStyles() {
  if (!document.getElementById('hs-styles')) {
    const el = document.createElement('style')
    el.id = 'hs-styles'
    el.textContent = STYLES
    document.head.appendChild(el)
  }
}

// ── Leaderboard Row ───────────────────────────────────────────────────────────
function LbRow({ rank, name, pts, isMe }) {
  const medal = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'plain'
  const symbol = rank === 1 ? '一' : rank === 2 ? '二' : rank === 3 ? '三' : `#${rank}`
  return (
    <div className={`hs-lb-row${isMe ? ' me' : ''}`}>
      <div className={`hs-lb-medal ${medal}`}>{symbol}</div>
      <div className="hs-lb-name">{name}{isMe && <span style={{ fontSize: 8, color: 'rgba(201,162,39,0.4)', marginLeft: 6 }}>YOU</span>}</div>
      <div className="hs-lb-pts">{pts}</div>
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, bar, barVal }) {
  return (
    <div className="hs-stat-card">
      <div className="hs-stat-label">{icon}&nbsp;{label}</div>
      <div className="hs-stat-value">{value}</div>
      {bar && (
        <div className="hs-energy-bar">
          <div className="hs-energy-fill" style={{ width: `${barVal ?? 100}%` }} />
        </div>
      )}
      <div className="hs-stat-sub">{sub}</div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { user, refCount, loading } = useUser()
  const { board } = useLeaderboard()
  const [kpCount, setKpCount] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => { injectStyles() }, [])

  useEffect(() => {
    if (!user) return
    setKpCount(user.points)
    timerRef.current = setInterval(() => {
      setKpCount(prev => prev + Math.floor(KP_PER_MIN / 60))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [user?.points])

  if (loading) return null
  if (!user) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'rgba(180,140,60,0.5)', fontSize: 12, fontFamily: "'Cinzel', serif" }}>
        Open via the bot.
      </div>
    )
  }

  const shadowOn   = user.shadow_mode_active && user.shadow_mode_expires && new Date(user.shadow_mode_expires) > new Date()
  const tasksCount = ['joined_telegram', 'followed_x', 'retweeted', 'lore_answered', 'wallet_address'].filter(t => user[t]).length
  const totalTasks = 5
  const refLink    = `https://t.me/${import.meta.env.VITE_BOT_USERNAME ?? 'KokoKairokuBot'}?start=${user.referral_code}`

  const topRows = board.slice(0, 3).map(u => ({
    rank: u.rank,
    name: u.username ? `@${u.username}` : (u.first_name ?? 'Villager'),
    pts:  fmtCompact(u.points) + ' KP',
  }))

  const myEntry = board.find(e => e.telegram_id === user.telegram_id)
  const myRank  = myEntry?.rank ?? '—'

  const refPct   = Math.min((refCount / 5) * 100, 100)
  const taskPct  = Math.min((tasksCount / 5) * 100, 100)

  function openTask(param) {
    try { TG.haptic('impact', 'light') } catch (e) {}
    TG.openBot(param)
  }

  return (
    <div className="hs-root">

      {/* ── HERO ── */}
      <div className="hs-hero">
        <div className="hs-hero-ink" />
        <div className="hs-hero-lines" />
        <div className="hs-kanji-bg">影</div>

        <img src={KOKO_IMG} alt="Koko" className="hs-koko-img" />

        <div className="hs-hero-content">
          {user.is_suspicious && <SuspiciousBanner />}

          {/* Rank badge */}
          <div className="hs-rank-badge">
            <div className="hs-rank-avatar">
              <img src={KOKO_IMG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
            </div>
            <div>
              <div className="hs-rank-name">
                {user.username ? `@${user.username}` : user.first_name}
              </div>
              <div className="hs-rank-num">RANK #{myRank}</div>
            </div>
          </div>

          {/* KP */}
          <div className="hs-kp-label">TOTAL KP</div>
          <div className="hs-kp-value">{kpCount.toLocaleString()}<span style={{ fontSize: 14, color: '#c9a227', marginLeft: 6 }}>KP</span></div>
          <div className="hs-kp-rate">
            <span style={{ color: '#c9a227' }}>⚡</span>
            <span>+{KP_PER_MIN.toLocaleString()} KP/min</span>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, paddingRight: 115 }}>
            <button className="hs-btn-farm" onClick={() => openTask('tasks')}>⚡ START FARMING</button>
            <button className="hs-btn-shadow" onClick={() => openTask('shadow_mode')}>◎ SHADOW MODE</button>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="hs-body">

        {/* STAT ROW */}
        <div className="hs-animate hs-d1">
          <div className="hs-section-title">
            <div className="hs-section-title-line" />
            <span className="hs-section-title-text">Status</span>
            <span className="hs-section-title-kanji">状</span>
          </div>
          <div className="hs-stat-row">
            <StatCard
              icon="⚡" label="ENERGY"
              value={`${ENERGY_MAX.toLocaleString()}`}
              sub="+50 / min"
              bar barVal={100}
            />
            <StatCard
              icon="◈" label="BOOSTER"
              value={`+${BOOSTER_PCT}%`}
              sub="02:14:38 left"
            />
            <div
              className="hs-stat-card"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                try { TG.haptic('impact', 'light') } catch (e) {}
                navigator.clipboard?.writeText(refLink).catch(() => {})
              }}
            >
              <div className="hs-stat-label">⊕&nbsp;REFS</div>
              <div className="hs-stat-value">{refCount}</div>
              <div className="hs-stat-sub">
                {refCount < REFERRAL_CAP
                  ? `Next at ${Math.ceil((refCount + 1) / 5) * 5}`
                  : 'Cap reached'}
              </div>
            </div>
          </div>
        </div>

        {/* TOP SHADOWS — SCROLL DESIGN */}
        <div className="hs-animate hs-d2">
          <div className="hs-section-title">
            <div className="hs-section-title-line" />
            <span className="hs-section-title-text">Village Record</span>
            <span className="hs-section-title-kanji">榜</span>
          </div>
          <div className="hs-scroll">
            <div className="hs-scroll-inner">
              <div className="hs-scroll-header">
                <div className="hs-scroll-title">
                  <span className="hs-scroll-kanji">榜</span>
                  <div>
                    <div className="hs-scroll-name">Top Shadows</div>
                    <div className="hs-scroll-sub">KAIROKU WORLD · KP RANKING</div>
                  </div>
                </div>
                <button
                  className="hs-view-all"
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'leaderboard' }))}
                >
                  VIEW ALL ›
                </button>
              </div>

              {topRows.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '12px 0', fontFamily: "'Cinzel', serif", fontSize: 10, color: 'rgba(180,140,60,0.3)' }}>
                  No records yet.
                </div>
              ) : (
                topRows.map((r, i) => (
                  <LbRow key={i} rank={r.rank} name={r.name} pts={r.pts} />
                ))
              )}

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(80,52,12,0.3)', margin: '6px 0 4px' }} />

              {/* You */}
              <LbRow
                rank={myRank}
                name={user.username ? `@${user.username}` : user.first_name}
                pts={fmtCompact(user.points) + ' KP'}
                isMe
              />
            </div>
          </div>
        </div>

        {/* SHADOW MODE */}
        <div className="hs-animate hs-d3">
          <div className="hs-section-title">
            <div className="hs-section-title-line" />
            <span className="hs-section-title-text">Shadow Mode</span>
            <span className="hs-section-title-kanji">影</span>
          </div>
          <div className="hs-shadow-panel">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
              <div className={`hs-shadow-orb${shadowOn ? ' active' : ''}`}>影</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: shadowOn ? '#c9a227' : 'rgba(180,140,60,0.5)', marginBottom: 3, letterSpacing: 0.5 }}>
                  {shadowOn ? 'ACTIVE · 2× KP' : 'LOCKED'}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: 'rgba(160,120,40,0.5)', lineHeight: 1.6 }}>
                  Unleash Koko's full potential.<br />2X KP. 2X Profit. 24 Hours.
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div style={{ marginBottom: 10 }}>
              <div className="hs-req-row">
                <span className="hs-req-label" style={{ color: refCount >= 5 ? '#c9a227' : 'rgba(160,120,40,0.45)' }}>
                  {refCount >= 5 ? '◆' : '◇'} 5 Referrals
                </span>
                <span className="hs-req-val">{Math.min(refCount, 5)} / 5</span>
              </div>
              <div className="hs-req-bar">
                <div className="hs-req-fill" style={{ width: `${refPct}%` }} />
              </div>

              <div className="hs-req-row">
                <span className="hs-req-label" style={{ color: tasksCount >= 5 ? '#c9a227' : 'rgba(160,120,40,0.45)' }}>
                  {tasksCount >= 5 ? '◆' : '◇'} 5 Tasks
                </span>
                <span className="hs-req-val">{tasksCount} / 5</span>
              </div>
              <div className="hs-req-bar">
                <div className="hs-req-fill" style={{ width: `${taskPct}%` }} />
              </div>
            </div>

            <button
              className={`hs-shadow-btn ${shadowOn ? 'active' : 'locked'}`}
              onClick={() => openTask('shadow_mode')}
            >
              {shadowOn ? '◆ SHADOW MODE ACTIVE' : '◇ LOCKED — COMPLETE REQUIREMENTS'}
            </button>

            {!shadowOn && (
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: 'rgba(120,90,30,0.4)', textAlign: 'center', marginTop: 5 }}>
                Reward: 2× KP for 24 hours
              </div>
            )}
          </div>
        </div>

        {/* LORE FOOTER */}
        <div className="hs-animate hs-d4">
          <div className="hs-lore">
            "Koko doesn't chase power. Power follows Koko."
          </div>
        </div>

      </div>
    </div>
  )
}
