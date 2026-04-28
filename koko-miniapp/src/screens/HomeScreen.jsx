import React, { useState } from 'react'
import { useUser } from '../hooks/useUser'
import { Card, GoldButton, TaskRow, EnergyBar, KanjiStamp, SuspiciousBanner, PointsCounter } from '../components/UI'
import { TG, TASK_POINTS, CORE_TASKS, REFERRAL_CAP, TOKEN_RATE, calcTokens, fmt, fmtCompact, allTasksDone, GITBOOK_URL, TWITTER_URL, RETWEET_URL, TG_GROUP } from '../lib/tg'

const DAILY_ACTION_CAP = 10

export default function HomeScreen() {
  const { user, refCount, loading, reload } = useUser()
  const [shadowMsg, setShadowMsg] = useState(null)

  if (loading) return null
  if (!user) return <div style={{padding:20,color:'var(--smoke)',textAlign:'center'}}>The village does not recognize you.<br/><small>Open via the bot.</small></div>

  const tokens       = calcTokens(user.points)
  const done         = allTasksDone(user)
  const refLink      = `https://t.me/${import.meta.env.VITE_BOT_USERNAME ?? 'KokoBot'}?start=${user.referral_code}`
  const actionsLeft  = DAILY_ACTION_CAP - (user.daily_actions_count ?? 0)
  const shadowActive = user.shadow_mode_active
  const shadowExp    = user.shadow_mode_expires ? new Date(user.shadow_mode_expires) : null
  const shadowOn     = shadowActive && shadowExp && shadowExp > new Date()

  function openTask(startParam) {
    TG.haptic('impact', 'light')
    TG.openBot(startParam)
  }

  function handleShadow() {
    TG.haptic('impact', 'medium')
    if (!done) {
      setShadowMsg('Complete all tasks to unlock Shadow Mode.')
      setTimeout(() => setShadowMsg(null), 3000)
      return
    }
    if (!user.wallet_address) {
      setShadowMsg('Submit your wallet first.')
      setTimeout(() => setShadowMsg(null), 3000)
      return
    }
    TG.openBot('shadow_mode')
  }

  function copyRefLink() {
    TG.haptic('notification', 'success')
    if (navigator.clipboard) navigator.clipboard.writeText(refLink).catch(() => {})
  }

  return (
    <div style={{ paddingBottom: 80, overflow:'auto', height:'100%' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        position:'relative', overflow:'hidden',
        background:'linear-gradient(160deg, #100c04 0%, #1a1209 60%, #2a1f0e 100%)',
        padding:'24px 20px 20px',
        borderBottom:'0.5px solid rgba(201,162,39,0.15)',
      }}>
        <KanjiStamp char="影" size={96} style={{ right:-8, top:-16 }} />
        <KanjiStamp char="猫" size={48} style={{ right:70, top:12, fontSize:48, opacity:0.04 }} />

        <div style={{
  position:'relative', overflow:'hidden',
  background:'linear-gradient(160deg, #100c04 0%, #1a1209 60%, #2a1f0e 100%)',
  padding:'24px 20px 20px',
  borderBottom:'0.5px solid rgba(201,162,39,0.15)',
  minHeight: 160,
}}>
  <KanjiStamp char="影" size={96} style={{ right:-8, top:-16 }} />

  {/* Koko character image */}
  <img
    src="https://i.ibb.co/YOUR_IMAGE_ID/koko.png"
    alt="Koko"
    style={{
      position:'absolute', right:0, bottom:0,
      height:'140px', width:'auto',
      objectFit:'contain',
      pointerEvents:'none',
    }}
  />
        </div>

        {user.is_suspicious && <SuspiciousBanner />}

        {/* Points */}
        <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:4 }}>
          <span style={{ fontFamily:'var(--font-display)', fontSize:34, color:'var(--paper)', fontWeight:600, lineHeight:1 }}>
            <PointsCounter value={user.points} />
          </span>
          <span style={{ fontFamily:'var(--font-display)', fontSize:16, color:'var(--gold)', fontWeight:400 }}>KP</span>
        </div>

        <div style={{ fontSize:12, color:'var(--smoke)', marginBottom:16 }}>
          {done ? `≈ ${fmt(tokens)} $KOKO at TGE` : 'Complete tasks to earn $KOKO'}
        </div>

        <GoldButton onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'tasks' }))} style={{ marginBottom:0 }}>
          Continue Tasks
        </GoldButton>
      </div>

      <div style={{ padding:'16px 16px 0' }}>

        {/* ── Shadow Mode ── */}
        <Card glow={shadowOn} style={{ marginBottom:12, position:'relative', overflow:'hidden' }}>
          <KanjiStamp char="影" size={72} style={{ right:8, top:4 }} />
          <div style={{ padding:'14px 16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <span style={{ fontSize:16 }}>🔥</span>
              <span style={{ fontFamily:'var(--font-display)', fontSize:13, color: shadowOn ? 'var(--gold)' : 'var(--mist)', letterSpacing:0.5 }}>
                Shadow Mode {shadowOn ? '— ACTIVE' : ''}
              </span>
            </div>
            <p style={{ fontSize:12, color:'var(--smoke)', marginBottom:10, lineHeight:1.5 }}>
              {shadowOn
                ? `2× task multiplier active. Expires ${shadowExp?.toLocaleTimeString()}.`
                : 'Unleash Koko\'s full potential. 2× task points. 24 hours.'}
            </p>
            {shadowMsg && (
              <div style={{ fontSize:11, color:'#c05050', marginBottom:8 }}>{shadowMsg}</div>
            )}
            <GoldButton
              variant={shadowOn ? 'ghost' : (done && user.wallet_address ? 'primary' : 'ghost')}
              onClick={handleShadow}
              style={{ padding:'8px 16px', fontSize:12 }}
            >
              {shadowOn ? 'Active' : done && user.wallet_address ? 'Enable' : 'Locked — Complete tasks first'}
            </GoldButton>
          </div>
        </Card>

        {/* ── Tasks ── */}
        <Card style={{ marginBottom:12 }}>
          <div style={{ padding:'12px 16px 0', borderBottom:'0.5px solid rgba(58,46,20,0.5)', paddingBottom:8 }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:11, color:'var(--mist)', letterSpacing:1, textTransform:'uppercase' }}>
              Tasks
            </span>
          </div>
          <div style={{ padding:'0 16px 8px' }}>
            <TaskRow label="Join Telegram"    pts={TASK_POINTS.joined_telegram} done={user.joined_telegram} onAction={() => TG.openUrl(TG_GROUP)}    actionLabel="Join →"   delay={0}   />
            <TaskRow label="Follow on X"      pts={TASK_POINTS.followed_x}      done={user.followed_x}      onAction={() => TG.openUrl(TWITTER_URL)}  actionLabel="Follow →" delay={40}  />
            <TaskRow label="Retweet post"     pts={TASK_POINTS.retweeted}        done={user.retweeted}       onAction={() => TG.openUrl(RETWEET_URL)}  actionLabel="RT →"     delay={80}  />
            <TaskRow label="Answer lore question" pts={TASK_POINTS.lore_answered} done={user.lore_answered} onAction={() => openTask('lore')}         actionLabel="Answer →" delay={120} />
            <TaskRow label="Submit wallet"    pts={0}                            done={!!user.wallet_address} onAction={() => openTask('wallet')}     actionLabel="Submit →" delay={160} />
            <TaskRow
              label={`Daily check-in${user.last_checkin === new Date().toISOString().split('T')[0] ? ' ✓' : ''}`}
              pts={TASK_POINTS.daily_checkin}
              done={user.last_checkin === new Date().toISOString().split('T')[0]}
              onAction={() => openTask('checkin')}
              actionLabel="Check in →"
              delay={200}
            />
          </div>
        </Card>

        {/* ── Energy ── */}
        <Card style={{ marginBottom:12, padding:'14px 16px' }}>
          <EnergyBar current={actionsLeft} max={DAILY_ACTION_CAP} />
          <p style={{ fontSize:11, color:'var(--ash)', marginTop:8, lineHeight:1.5 }}>
            {actionsLeft > 0
              ? `${actionsLeft} action${actionsLeft !== 1 ? 's' : ''} remaining today.`
              : 'Energy depleted. Return tomorrow — the forest restores in silence.'}
          </p>
        </Card>

        {/* ── Referral ── */}
        <Card style={{ marginBottom:12 }}>
          <div style={{ padding:'14px 16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:11, color:'var(--mist)', letterSpacing:1, textTransform:'uppercase' }}>
                Referrals
              </span>
              <span style={{ fontSize:11, color:'var(--smoke)', fontFamily:'monospace' }}>
                {refCount} / {REFERRAL_CAP}
              </span>
            </div>
            {!done && (
              <p style={{ fontSize:12, color:'var(--smoke)', marginBottom:10, lineHeight:1.5 }}>
                ⚠ Complete all tasks before referral rewards are active.
              </p>
            )}
            <div style={{
              background:'rgba(42,31,14,0.6)', border:'0.5px solid rgba(58,46,20,0.8)',
              borderRadius:6, padding:'8px 12px', marginBottom:10,
              fontSize:11, color:'var(--mist)', wordBreak:'break-all', fontFamily:'monospace',
            }}>
              {refLink}
            </div>
            <GoldButton variant="ghost" onClick={copyRefLink} style={{ fontSize:12, padding:'8px 16px' }}>
              Copy referral link
            </GoldButton>
          </div>
        </Card>

        {/* ── Lore footer ── */}
        <div style={{
          textAlign:'center', padding:'8px 20px 16px',
          fontSize:12, color:'var(--ash)', fontStyle:'italic', lineHeight:1.6,
        }}>
          "Koko doesn't chase power. Power follows Koko."
        </div>

      </div>
    </div>
  )
}
