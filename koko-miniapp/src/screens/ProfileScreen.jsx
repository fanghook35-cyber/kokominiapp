import React from 'react'
import { useUser } from '../hooks/useUser'
import { Card, GoldButton, ScreenHeader, SuspiciousBanner } from '../components/UI'
import { fmt, calcTokens, REFERRAL_CAP, CORE_TASKS, allTasksDone, GITBOOK_URL, TG } from '../lib/tg'

function InfoRow({ label, value, mono, accent }) {
  return (
    <div style={{
      display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'9px 0', borderBottom:'0.5px solid rgba(42,31,14,0.5)',
    }}>
      <span style={{ fontSize:12, color:'var(--smoke)' }}>{label}</span>
      <span style={{
        fontSize:12,
        color: accent ? 'var(--gold)' : 'var(--mist)',
        fontFamily: mono ? 'monospace' : 'var(--font-body)',
        maxWidth:'60%', textAlign:'right', wordBreak:'break-all',
      }}>
        {value}
      </span>
    </div>
  )
}

export default function ProfileScreen() {
  const { user, refCount, loading } = useUser()
  if (loading || !user) return null

  const tokens   = calcTokens(user.points)
  const done     = allTasksDone(user)
  const tasksCompleted = CORE_TASKS.filter(t => user[t]).length

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <ScreenHeader title="Profile" subtitle="Your village record" />

      <div style={{ flex:1, overflowY:'auto', padding:16 }}>

        {/* Avatar + name */}
        <div className="animate-rise" style={{
          textAlign:'center', marginBottom:20,
          padding:'24px 16px',
          background:'linear-gradient(160deg,#100c04,#1a1209)',
          borderRadius:12, border:'0.5px solid rgba(58,46,20,0.6)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{
            position:'absolute', top:-20, left:-10,
            fontFamily:'var(--font-display)', fontSize:100, color:'rgba(201,162,39,0.04)',
            lineHeight:1, pointerEvents:'none',
          }}>村</div>

          {/* Avatar circle */}
          <div style={{
            width:64, height:64, borderRadius:'50%', margin:'0 auto 12px',
            background:'rgba(58,46,20,0.8)',
            border: `2px solid ${user.is_suspicious ? '#8b1a1a' : 'var(--gold)'}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'var(--font-display)', fontSize:24,
            color: user.is_suspicious ? '#c05050' : 'var(--gold)',
            boxShadow: user.is_suspicious ? 'none' : '0 0 16px rgba(201,162,39,0.2)',
          }}>
            {(user.username ?? user.first_name ?? '?')[0]?.toUpperCase()}
          </div>

          <div style={{ fontFamily:'var(--font-display)', fontSize:15, color:'var(--gold2)', marginBottom:2 }}>
            {user.first_name}
          </div>
          {user.username && (
            <div style={{ fontSize:12, color:'var(--smoke)' }}>@{user.username}</div>
          )}

          <div style={{
            display:'flex', justifyContent:'center', gap:24, marginTop:16,
          }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--gold)' }}>{fmt(user.points)}</div>
              <div style={{ fontSize:9, color:'var(--smoke)', textTransform:'uppercase', letterSpacing:1 }}>KP</div>
            </div>
            <div style={{ width:'0.5px', background:'rgba(58,46,20,0.8)' }} />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--gold)' }}>{refCount}</div>
              <div style={{ fontSize:9, color:'var(--smoke)', textTransform:'uppercase', letterSpacing:1 }}>Referrals</div>
            </div>
            <div style={{ width:'0.5px', background:'rgba(58,46,20,0.8)' }} />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--gold)' }}>{tasksCompleted}/{CORE_TASKS.length}</div>
              <div style={{ fontSize:9, color:'var(--smoke)', textTransform:'uppercase', letterSpacing:1 }}>Tasks</div>
            </div>
          </div>
        </div>

        {user.is_suspicious && <SuspiciousBanner />}

        {/* Account details */}
        <Card style={{ marginBottom:12 }}>
          <div style={{ padding:'4px 16px' }}>
            <div style={{ padding:'10px 0 6px', fontFamily:'var(--font-display)', fontSize:10, color:'var(--ash)', letterSpacing:1, textTransform:'uppercase' }}>
              Account
            </div>
            <InfoRow label="Telegram ID"    value={user.telegram_id}      mono />
            <InfoRow label="Referral code"  value={user.referral_code}    mono accent />
            <InfoRow label="Referred by"    value={user.referred_by ?? '—'} mono />
            <InfoRow label="Status"         value={user.is_suspicious ? '⚠ Flagged' : '✓ Clear'} accent={!user.is_suspicious} />
          </div>
        </Card>

        {/* Wallet */}
        <Card style={{ marginBottom:12 }}>
          <div style={{ padding:'4px 16px' }}>
            <div style={{ padding:'10px 0 6px', fontFamily:'var(--font-display)', fontSize:10, color:'var(--ash)', letterSpacing:1, textTransform:'uppercase' }}>
              Wallet & Tokens
            </div>
            <InfoRow
              label="Solana wallet"
              value={user.wallet_address
                ? `${user.wallet_address.slice(0,8)}...${user.wallet_address.slice(-6)}`
                : 'Not submitted'}
              mono
              accent={!!user.wallet_address}
            />
            <InfoRow
              label="Tokens allocated"
              value={user.wallet_address ? `${fmt(user.tokens_allocated)} $KOKO` : `≈${fmt(tokens)} $KOKO (estimate)`}
              accent={!!user.wallet_address}
            />
          </div>
        </Card>

        {/* Task checklist */}
        <Card style={{ marginBottom:12 }}>
          <div style={{ padding:'4px 16px' }}>
            <div style={{ padding:'10px 0 6px', fontFamily:'var(--font-display)', fontSize:10, color:'var(--ash)', letterSpacing:1, textTransform:'uppercase' }}>
              Task progress
            </div>
            {[
              { key:'joined_telegram', label:'Join Telegram' },
              { key:'followed_x',      label:'Follow on X' },
              { key:'retweeted',       label:'Retweet post' },
              { key:'lore_answered',   label:'Lore question' },
            ].map(t => (
              <InfoRow key={t.key} label={t.label} value={user[t.key] ? '✓ Done' : 'Pending'} accent={user[t.key]} />
            ))}
            <InfoRow label="Wallet submitted" value={user.wallet_address ? '✓ Done' : 'Pending'} accent={!!user.wallet_address} />
          </div>
        </Card>

        {/* Lore link */}
        <GoldButton variant="ghost" onClick={() => TG.openUrl(GITBOOK_URL)} style={{ marginBottom:8, fontSize:12 }}>
          Read the Kairoku World lore ↗
        </GoldButton>

        <div style={{ textAlign:'center', padding:'12px 20px 20px', fontSize:11, color:'var(--ash)', fontStyle:'italic' }}>
          "The Nihonkai Forest does not forget."
        </div>
      </div>
    </div>
  )
}
