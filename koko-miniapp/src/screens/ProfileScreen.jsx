import React, { useState } from 'react'
import { useUser } from '../hooks/useUser'
import { calcTokens, fmt, TASK_POINTS, REFERRAL_CAP } from '../lib/tg'
import { TG } from '../lib/tg'

const KOKO_IMG = 'https://i.postimg.cc/tgTkS4ML/8e5af09c-41df-471c-9e17-d6ae16b23ae9.png'

const C = {
  ink:     '#0a0a0c',
  panel:   '#1a1a28',
  border:  'rgba(200,169,110,0.12)',
  borderSolid: '#2a2a3e',
  gold:    '#c8a96e',
  goldDim: 'rgba(200,169,110,0.5)',
  goldBg:  'rgba(200,169,110,0.08)',
  main:    '#eeeef5',
  dim:     '#6b6b88',
  dimmer:  '#3a3a55',
}

const ff  = "'Cinzel', serif"
const fm  = "'JetBrains Mono', 'Courier New', monospace"

function ProgressBar({ pct }) {
  return (
    <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
      <div style={{
        height: '100%', width: `${Math.min(100, pct || 0)}%`,
        background: `linear-gradient(90deg, #b89a5c, ${C.gold})`,
        borderRadius: 2, transition: 'width 0.6s ease',
      }} />
    </div>
  )
}

function TaskRow({ icon, label, pts, done, onGo }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 0',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <span style={{ fontSize: 15, width: 22, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 13, color: done ? C.dim : C.main }}>{label}</span>
      <span style={{ fontSize: 11, color: C.goldDim, fontFamily: fm, marginRight: 8 }}>+{pts} KP</span>
      {done ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px',
          background: 'rgba(200,169,110,0.06)',
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          fontSize: 10, color: C.gold, fontFamily: fm, letterSpacing: 0.5,
        }}>
          <span>✓</span> COMPLETED
        </div>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px',
          background: 'transparent',
          border: `1px solid ${C.borderSolid}`,
          borderRadius: 6,
          fontSize: 10, color: C.dim, fontFamily: fm, letterSpacing: 0.5,
          cursor: 'pointer',
        }} onClick={onGo}>
          <span>○</span> PENDING
        </div>
      )}
    </div>
  )
}

export default function ProfileScreen() {
  const { user, refCount, loading } = useUser()
  const [copied, setCopied] = useState(false)

  if (loading || !user) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: ff, fontSize: 28, color: C.gold, opacity: 0.3 }}>影</div>
    </div>
  )

  const tokens    = user.tokens_allocated > 0 ? user.tokens_allocated : calcTokens(user.points)
  const tasksArr  = ['joined_telegram','followed_x','retweeted','lore_answered']
  const tasksDone = tasksArr.filter(t => user[t]).length
  const totalTasks = tasksArr.length
  const refLink   = `kairoku.world/ref/${user.username ?? user.telegram_id}`
  const botUsername = import.meta.env.VITE_BOT_USERNAME ?? 'KokoKairokuBot'
  const fullRefLink = `https://t.me/${botUsername}?start=${user.referral_code}`

  function copyRef() {
    try { TG.haptic('notification', 'success') } catch (e) {}
    navigator.clipboard?.writeText(fullRefLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function openTask(param) {
    try { TG.haptic('impact', 'light') } catch (e) {}
    TG.openBot(param)
  }

  // level based on points
  const level = Math.min(99, Math.floor(user.points / 500) + 1)

  const walletShort = user.wallet_address
    ? `${user.wallet_address.slice(0, 8)}...${user.wallet_address.slice(-6)}`
    : null

  return (
    <div style={{
      height: '100%', overflowY: 'auto', overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
      background: C.ink, paddingBottom: 88,
    }}>

      {/* ── HEADER ── */}
      <div style={{
        padding: '18px 18px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ fontFamily: ff, fontSize: 22, color: C.gold, fontWeight: 600, letterSpacing: 1, marginBottom: 3 }}>
            Profile
          </div>
          <div style={{ fontSize: 12, color: C.dim, fontFamily: fm }}>Your village record</div>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '8px 14px',
          background: C.panel, border: `1px solid ${C.border}`,
          borderRadius: 8, cursor: 'pointer', touchAction: 'manipulation',
        }}>
          <span style={{ fontSize: 13, color: C.dim }}>⚙</span>
          <span style={{ fontSize: 10, color: C.dim, fontFamily: fm, letterSpacing: 1 }}>SETTINGS</span>
        </button>
      </div>

      <div style={{ padding: '0 14px' }}>

        {/* ── IDENTITY CARD ── */}
        <div style={{
          background: C.panel, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: '20px 18px', marginBottom: 12,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Kanji watermark */}
          <div style={{
            position: 'absolute', left: 10, top: 10,
            fontFamily: ff, fontSize: 54, color: 'rgba(200,169,110,0.06)',
            lineHeight: 1, pointerEvents: 'none',
          }}>影</div>

          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 90, height: 90, borderRadius: '50%',
                border: `2px solid ${C.gold}`,
                padding: 3,
                background: `radial-gradient(circle, #1e1a10, ${C.ink})`,
                boxShadow: '0 0 20px rgba(200,169,110,0.1)',
              }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  overflow: 'hidden', background: '#111118',
                }}>
                  <img src={KOKO_IMG} alt="avatar" style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    filter: 'brightness(0.85)',
                  }} />
                </div>
              </div>
              {/* Level badge */}
              <div style={{
                position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
                background: '#1a1a28', border: `1px solid ${C.gold}`,
                borderRadius: 6, padding: '3px 8px', textAlign: 'center', minWidth: 40,
              }}>
                <div style={{ fontFamily: ff, fontSize: 12, color: C.gold, fontWeight: 700, lineHeight: 1 }}>{level}</div>
                <div style={{ fontSize: 7, color: C.dim, fontFamily: fm, letterSpacing: 1, marginTop: 1 }}>LEVEL</div>
              </div>
            </div>

            {/* Identity info */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
              <div style={{ fontFamily: ff, fontSize: 20, color: C.main, fontWeight: 600, marginBottom: 3, letterSpacing: 0.5 }}>
                {user.first_name ?? 'Villager'}
              </div>
              {user.username && (
                <div style={{ fontSize: 12, color: C.dim, fontFamily: fm, marginBottom: 10 }}>
                  @{user.username}
                </div>
              )}
              {/* Rank badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: C.goldBg, border: `1px solid ${C.border}`,
                borderRadius: 8, padding: '5px 12px', marginBottom: 10,
              }}>
                <span style={{ fontSize: 12 }}>👑</span>
                <span style={{ fontFamily: ff, fontSize: 11, color: C.gold, letterSpacing: 0.5 }}>RANK #—</span>
              </div>
              {/* Status */}
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', background: C.panel,
                  border: `1px solid ${C.border}`, borderRadius: 20,
                  fontSize: 11, color: C.main,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4a9a4a' }} />
                  Active
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', background: C.panel,
                  border: `1px solid ${C.border}`, borderRadius: 20,
                  fontSize: 11, color: C.main,
                }}>
                  <span style={{ color: C.gold, fontSize: 10 }}>⚡</span>
                  Farming
                </div>
              </div>
            </div>

            {/* Kairoku Villager badge */}
            <div style={{
              width: 72, flexShrink: 0, textAlign: 'center',
              background: C.goldBg, border: `1px solid ${C.border}`,
              borderRadius: 10, padding: '10px 6px',
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>🐱</div>
              <div style={{ fontFamily: ff, fontSize: 8, color: C.gold, letterSpacing: 0.5, lineHeight: 1.4 }}>
                KAIROKU<br/>VILLAGER
              </div>
            </div>
          </div>
        </div>

        {/* ── POWER STATS ── */}
        <div style={{
          background: C.panel, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: '16px', marginBottom: 12,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0,
        }}>
          {/* Total KP */}
          <div style={{ paddingRight: 12, borderRight: `1px solid ${C.border}`, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: C.gold }}>⚡</span>
              <span style={{ fontSize: 9, color: C.dim, fontFamily: fm, letterSpacing: 1, textTransform: 'uppercase' }}>Total KP</span>
            </div>
            <div style={{ fontFamily: ff, fontSize: 22, color: C.main, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>
              {fmt(user.points)}
            </div>
            <div style={{ fontSize: 9, color: C.dim, fontFamily: fm, letterSpacing: 0.5 }}>KAIROKU POINTS</div>
          </div>

          {/* Referrals */}
          <div style={{ padding: '0 12px', borderRight: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: C.gold }}>👥</span>
              <span style={{ fontSize: 9, color: C.dim, fontFamily: fm, letterSpacing: 1, textTransform: 'uppercase' }}>Referrals</span>
            </div>
            <div style={{ fontFamily: ff, fontSize: 22, color: C.main, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>
              {refCount}
            </div>
            <div style={{ fontSize: 9, color: C.dim, fontFamily: fm }}>
              NEXT REWARD: {Math.ceil((refCount + 1) / 5) * 5}
            </div>
            <ProgressBar pct={(refCount / REFERRAL_CAP) * 100} />
          </div>

          {/* Tasks */}
          <div style={{ paddingLeft: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: C.gold }}>◎</span>
              <span style={{ fontSize: 9, color: C.dim, fontFamily: fm, letterSpacing: 1, textTransform: 'uppercase' }}>Tasks</span>
            </div>
            <div style={{ fontFamily: ff, fontSize: 22, color: C.main, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>
              {tasksDone}/{totalTasks}
            </div>
            <div style={{ fontSize: 9, color: C.dim, fontFamily: fm }}>IN PROGRESS</div>
            <ProgressBar pct={(tasksDone / totalTasks) * 100} />
          </div>
        </div>

        {/* ── WALLET ── */}
        <div style={{
          background: C.panel, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: '16px 18px', marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: C.gold }}>💳</span>
            <span style={{ fontFamily: ff, fontSize: 14, color: C.gold, letterSpacing: 0.5 }}>Wallet</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: C.dim, fontFamily: fm, marginBottom: 8 }}>Connected Wallet</div>
              {walletShort ? (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
                  borderRadius: 8, padding: '10px 14px',
                }}>
                  <span style={{ fontSize: 12, color: C.main, fontFamily: fm }}>{walletShort}</span>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px', background: C.goldBg,
                    border: `1px solid ${C.border}`, borderRadius: 6,
                    fontSize: 10, color: C.gold, fontFamily: fm, letterSpacing: 0.5,
                  }}>
                    🔒 LOCKED
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => openTask('wallet')}
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: C.goldBg, border: `1px solid ${C.border}`,
                    borderRadius: 8, cursor: 'pointer', touchAction: 'manipulation',
                    fontSize: 11, color: C.gold, fontFamily: fm, letterSpacing: 0.5, textAlign: 'left',
                  }}
                >
                  + Submit wallet via bot →
                </button>
              )}
            </div>
            <div style={{ maxWidth: 140, textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.6 }}>
                Wallet address is permanent and cannot be changed.
              </div>
              <div style={{ fontSize: 11, color: C.dimmer, marginTop: 4 }}>Used for token distribution.</div>
            </div>
          </div>
        </div>

        {/* ── TOKEN + REFERRAL ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>

          {/* Tokens */}
          <div style={{
            background: C.panel, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '16px 14px', position: 'relative', overflow: 'hidden',
          }}>
            {/* Coin badge */}
            <div style={{
              position: 'absolute', right: -10, bottom: -10,
              width: 60, height: 60, borderRadius: '50%',
              background: `radial-gradient(circle, rgba(200,169,110,0.12) 0%, transparent 70%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: ff, fontSize: 22, color: 'rgba(200,169,110,0.2)',
            }}>影</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: C.gold }}>◎</span>
              <span style={{ fontFamily: ff, fontSize: 13, color: C.gold, letterSpacing: 0.5 }}>Tokens</span>
            </div>
            <div style={{ fontSize: 10, color: C.dim, fontFamily: fm, letterSpacing: 0.5, marginBottom: 6 }}>
              ALLOCATED TOKENS
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 12 }}>
              <span style={{ fontFamily: ff, fontSize: 28, color: C.gold, fontWeight: 700, lineHeight: 1 }}>
                {fmt(tokens)}
              </span>
              <span style={{ fontFamily: ff, fontSize: 11, color: C.goldDim }}>$KOKO</span>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'token' }))}
              style={{
                width: '100%', padding: '8px',
                background: 'transparent', border: `1px solid ${C.border}`,
                borderRadius: 7, cursor: 'pointer', touchAction: 'manipulation',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 9, color: C.dim, fontFamily: fm, letterSpacing: 0.5,
              }}
            >
              <span>📊</span> VIEW TOKEN DETAILS
            </button>
          </div>

          {/* Referral link */}
          <div style={{
            background: C.panel, border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '16px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: C.gold }}>🔗</span>
              <span style={{ fontFamily: ff, fontSize: 11, color: C.gold, letterSpacing: 0.5, lineHeight: 1.3 }}>Your Referral Link</span>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
              borderRadius: 7, padding: '8px 10px', marginBottom: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4,
            }}>
              <span style={{
                fontSize: 10, color: C.main, fontFamily: fm,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
              }}>
                {refLink}
              </span>
              <button onClick={copyRef} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: copied ? '#6fcf97' : C.gold,
                flexShrink: 0, touchAction: 'manipulation',
              }}>
                {copied ? '✓' : '📋'}
              </button>
            </div>
            <div style={{ fontSize: 11, color: C.dim, marginBottom: 6, lineHeight: 1.5 }}>
              Invite more villagers. Earn more KP.
            </div>
            <div style={{ fontSize: 11, color: C.gold, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>🎁</span> +1,000 KP per referral
            </div>
          </div>
        </div>

        {/* ── TASK PROGRESS ── */}
        <div style={{
          background: C.panel, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: '16px 18px', marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14, color: C.gold }}>✅</span>
            <span style={{ fontFamily: ff, fontSize: 14, color: C.gold, letterSpacing: 0.5 }}>Task Progress</span>
          </div>

          <TaskRow icon="✈️" label="Join Telegram"   pts={500} done={user.joined_telegram}  onGo={() => TG.openUrl('https://t.me/KokoKairoku')} />
          <TaskRow icon="✖️" label="Follow on X"     pts={500} done={user.followed_x}       onGo={() => TG.openUrl('https://x.com/KokoKairoku')} />
          <TaskRow icon="🔁" label="Retweet Post"    pts={300} done={user.retweeted}         onGo={() => TG.openUrl('https://x.com/i/status/2047342243153932580')} />
          <TaskRow icon="📖" label="Lore Question"   pts={250} done={user.lore_answered}     onGo={() => openTask('lore')} />
          <TaskRow icon="💳" label="Wallet Submitted" pts={0}  done={!!user.wallet_address}  onGo={() => openTask('wallet')} />

          <button
            onClick={() =
