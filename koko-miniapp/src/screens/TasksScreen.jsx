import React from 'react'
import { useUser } from '../hooks/useUser'
import { Card, ScreenHeader, GoldButton } from '../components/UI'
import { TG, TASK_POINTS, REFERRAL_CAP, fmt, allTasksDone, TWITTER_URL, RETWEET_URL, TG_GROUP, GITBOOK_URL } from '../lib/tg'

function TaskCard({ icon, title, pts, done, desc, onAction, actionLabel, delay=0 }) {
  return (
    <div
      className="animate-in"
      style={{
        animationDelay: `${delay}ms`,
        background: done ? 'rgba(26,18,9,0.5)' : 'rgba(26,18,9,0.9)',
        border: `0.5px solid ${done ? 'rgba(42,31,14,0.4)' : 'rgba(58,46,20,0.8)'}`,
        borderLeft: `3px solid ${done ? 'rgba(201,162,39,0.3)' : 'var(--gold)'}`,
        borderRadius:10, padding:'14px 16px', marginBottom:8,
        opacity: done ? 0.65 : 1,
        transition:'all 0.2s',
      }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
        <div style={{ fontSize:20, flexShrink:0, marginTop:1 }}>{icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:12, color: done ? 'var(--mist)' : 'var(--gold2)', letterSpacing:0.3 }}>
              {title}
            </span>
            <span style={{
              fontSize:11, fontFamily:'monospace',
              color: done ? 'var(--ash)' : 'var(--gold)',
              background: done ? 'rgba(42,31,14,0.4)' : 'rgba(201,162,39,0.1)',
              border: `0.5px solid ${done ? 'rgba(42,31,14,0.6)' : 'rgba(201,162,39,0.3)'}`,
              padding:'1px 6px', borderRadius:10,
            }}>
              {done ? '✓ Done' : `+${fmt(pts)} KP`}
            </span>
          </div>
          <p style={{ fontSize:12, color:'var(--smoke)', lineHeight:1.5, marginBottom: done ? 0 : 10 }}>
            {desc}
          </p>
          {!done && (
            <GoldButton onClick={onAction} style={{ fontSize:11, padding:'7px 14px' }}>
              {actionLabel}
            </GoldButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TasksScreen() {
  const { user, refCount, loading } = useUser()
  if (loading || !user) return null
  const done = allTasksDone(user)
  const refLink = `https://t.me/${import.meta.env.VITE_BOT_USERNAME ?? 'KokoBot'}?start=${user.referral_code}`

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <ScreenHeader
        title="Tasks"
        subtitle={done ? 'All core tasks complete' : `${[user.joined_telegram,user.followed_x,user.retweeted,user.lore_answered].filter(Boolean).length}/4 core tasks done`}
      />
      <div style={{ flex:1, overflowY:'auto', padding:16 }}>

        {/* Core tasks */}
        <div style={{ fontSize:10, color:'var(--ash)', letterSpacing:2, textTransform:'uppercase', marginBottom:10, fontFamily:'var(--font-display)' }}>
          Core Tasks
        </div>

        <TaskCard
          icon="📱" title="Join Telegram" pts={TASK_POINTS.joined_telegram}
          done={user.joined_telegram} delay={0}
          desc="Join the official KokoKairoku Telegram group. The village gathers in shadow."
          onAction={() => TG.openUrl(TG_GROUP)} actionLabel="Open Telegram →"
        />
        <TaskCard
          icon="🐦" title="Follow on X" pts={TASK_POINTS.followed_x}
          done={user.followed_x} delay={50}
          desc="Follow @KokoKairoku on X. The signal must reach further."
          onAction={() => TG.openUrl(TWITTER_URL)} actionLabel="Open X →"
        />
        <TaskCard
          icon="🔁" title="Retweet" pts={TASK_POINTS.retweeted}
          done={user.retweeted} delay={100}
          desc="Retweet the pinned post. Spread the lore to new villagers."
          onAction={() => TG.openUrl(RETWEET_URL)} actionLabel="Open post →"
        />
        <TaskCard
          icon="📜" title="Lore Question" pts={TASK_POINTS.lore_answered}
          done={user.lore_answered} delay={150}
          desc="Prove your knowledge of Kairoku World. Only true believers know the answer."
          onAction={() => TG.openBot('lore')} actionLabel="Answer in bot →"
        />

        {/* Daily */}
        <div style={{ fontSize:10, color:'var(--ash)', letterSpacing:2, textTransform:'uppercase', margin:'16px 0 10px', fontFamily:'var(--font-display)' }}>
          Daily
        </div>

        <TaskCard
          icon="🗓" title="Daily Check-in" pts={TASK_POINTS.daily_checkin}
          done={user.last_checkin === new Date().toISOString().split('T')[0]} delay={200}
          desc="Check in daily to maintain your streak. The village rewards consistency."
          onAction={() => TG.openBot('checkin')} actionLabel="Check in →"
        />

        {/* Referral */}
        <div style={{ fontSize:10, color:'var(--ash)', letterSpacing:2, textTransform:'uppercase', margin:'16px 0 10px', fontFamily:'var(--font-display)' }}>
          Referrals
        </div>

        <div
          className="animate-in"
          style={{
            animationDelay:'250ms',
            background:'rgba(26,18,9,0.9)',
            border:`0.5px solid ${done ? 'rgba(58,46,20,0.8)' : 'rgba(42,31,14,0.4)'}`,
            borderLeft:`3px solid ${done ? 'var(--gold)' : 'rgba(42,31,14,0.8)'}`,
            borderRadius:10, padding:'14px 16px', marginBottom:8,
            opacity: done ? 1 : 0.5,
          }}
        >
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:12, color: done ? 'var(--gold2)' : 'var(--ash)', letterSpacing:0.3 }}>
              👥 Referral Program
            </span>
            <span style={{ fontSize:11, fontFamily:'monospace', color:'var(--gold)', background:'rgba(201,162,39,0.1)', border:'0.5px solid rgba(201,162,39,0.3)', padding:'1px 6px', borderRadius:10 }}>
              +{fmt(TASK_POINTS.referral)} KP / ref
            </span>
          </div>
          <p style={{ fontSize:12, color:'var(--smoke)', lineHeight:1.5, marginBottom: done ? 10 : 0 }}>
            {done
              ? `${refCount}/${REFERRAL_CAP} referrals. Earn 1,000 KP per referral. Cap: ${REFERRAL_CAP}.`
              : 'Complete all core tasks first. The village does not reward those who have not proven themselves.'}
          </p>
          {done && (
            <GoldButton
              variant="ghost"
              onClick={() => { if(navigator.clipboard) navigator.clipboard.writeText(refLink).catch(()=>{}); TG.haptic('notification','success') }}
              style={{ fontSize:11, padding:'7px 14px' }}
            >
              Copy referral link
            </GoldButton>
          )}
        </div>

        {/* Wallet */}
        <div style={{ fontSize:10, color:'var(--ash)', letterSpacing:2, textTransform:'uppercase', margin:'16px 0 10px', fontFamily:'var(--font-display)' }}>
          Wallet
        </div>

        <TaskCard
          icon="💳" title="Submit Solana Wallet" pts={0}
          done={!!user.wallet_address} delay={300}
          desc="Lock in your $KOKO allocation. Provide a valid Solana address. One wallet per account — permanent."
          onAction={() => TG.openBot('wallet')} actionLabel="Submit in bot →"
        />

        <div style={{ height:8 }} />
      </div>
    </div>
  )
}
