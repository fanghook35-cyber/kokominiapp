import React from 'react'
import { useUser } from '../hooks/useUser'
import { Card, GoldButton, ScreenHeader } from '../components/UI'
import { fmt, calcTokens, AIRDROP_CAP, TOKEN_RATE, TASK_POINTS, allTasksDone, TG } from '../lib/tg'

const PRESALE_URL     = 'https://moonpay.hel.io/x/Kairokuworld'
const PRESALE_ALLOC   = 150_000_000
const TOTAL_SUPPLY    = 888_888_888
const TOTAL_RAISE_SOL = 80
const MIN_SOL         = 0.2
const MAX_SOL         = 5
const BASE_RATE       = 1_875_000  // $KOKO per 1 SOL
const BONUS_PCT       = 30         // Shadow Phase bonus

const PHASES = [
  { name: 'Shadow Phase',    bonus: 30, status: 'OPEN',     active: true  },
  { name: 'Emergence Phase', bonus: 20, status: 'UPCOMING', active: false },
  { name: 'Reckoning Phase', bonus: 10, status: 'UPCOMING', active: false },
  { name: 'Public',          bonus: 0,  status: 'UPCOMING', active: false },
]

function StatRow({ label, value, accent }) {
  return (
    <div style={{
      display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'10px 0', borderBottom:'0.5px solid rgba(42,31,14,0.6)',
    }}>
      <span style={{ fontSize:13, color:'var(--smoke)' }}>{label}</span>
      <span style={{ fontSize:14, color: accent ? 'var(--gold)' : 'var(--paper)', fontFamily:'monospace' }}>{value}</span>
    </div>
  )
}

export default function TokenScreen() {
  const { user, loading } = useUser()
  if (loading || !user) return null

  const tokens      = calcTokens(user.points)
  const pctOfPool   = ((tokens / AIRDROP_CAP) * 100).toFixed(4)
  const done        = allTasksDone(user)
  const remaining   = TASK_POINTS.joined_telegram * (!user.joined_telegram ? 1 : 0)
                    + TASK_POINTS.followed_x      * (!user.followed_x      ? 1 : 0)
                    + TASK_POINTS.retweeted       * (!user.retweeted       ? 1 : 0)
                    + TASK_POINTS.lore_answered   * (!user.lore_answered   ? 1 : 0)
  const maxPotential = user.points + remaining

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <ScreenHeader title="Token & Presale" subtitle="$KOKO — Shadow Phase open" />

      <div style={{ flex:1, overflowY:'auto', padding:16 }}>

        {/* ── Presale Banner ── */}
        <div
          className="animate-rise"
          style={{
            background:'linear-gradient(135deg,#100c04,#1e1508,#2a1f0e)',
            border:'0.5px solid rgba(201,162,39,0.35)',
            borderRadius:14, padding:'18px 16px 14px',
            marginBottom:12, position:'relative', overflow:'hidden',
            boxShadow:'0 0 24px rgba(201,162,39,0.07)',
          }}
        >
          <div style={{ position:'absolute', top:-16, right:-8, fontFamily:'var(--font-display)', fontSize:100, color:'rgba(201,162,39,0.05)', lineHeight:1, pointerEvents:'none' }}>月</div>

          <div style={{ fontSize:9, letterSpacing:3, color:'var(--smoke)', textTransform:'uppercase', marginBottom:6 }}>
            Presale — Now Live
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:16, color:'var(--gold2)', marginBottom:4, fontWeight:600 }}>
            🌙 Shadow Phase  <span style={{ fontSize:11, color:'var(--gold)', background:'rgba(201,162,39,0.15)', border:'0.5px solid rgba(201,162,39,0.3)', borderRadius:10, padding:'1px 8px', marginLeft:6 }}>+30% BONUS</span>
          </div>
          <div style={{ fontSize:12, color:'var(--mist)', lineHeight:1.6, marginBottom:12 }}>
            ~1,875,000 $KOKO per 1 SOL<br/>
            Min: {MIN_SOL} SOL · Max: {MAX_SOL} SOL · Target: {TOTAL_RAISE_SOL} SOL
          </div>
          <GoldButton
            onClick={() => TG.openUrl(PRESALE_URL)}
            style={{ fontSize:12, padding:'10px 16px' }}
          >
            Buy $KOKO — Shadow Phase →
          </GoldButton>
          <div style={{ fontSize:10, color:'var(--ash)', marginTop:8, textAlign:'center' }}>
            Only send from a wallet you control. Not from a CEX.
          </div>
        </div>

        {/* ── Phase tracker ── */}
        <Card style={{ marginBottom:12, padding:'12px 16px' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:10, color:'var(--ash)', letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>
            Presale Phases
          </div>
          {PHASES.map((p, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'7px 0',
              borderBottom: i < PHASES.length - 1 ? '0.5px solid rgba(42,31,14,0.5)' : 'none',
              opacity: p.active ? 1 : 0.45,
            }}>
              <div style={{
                width:7, height:7, borderRadius:'50%', flexShrink:0,
                background: p.active ? 'var(--gold)' : 'rgba(58,46,20,0.8)',
                boxShadow: p.active ? '0 0 6px rgba(201,162,39,0.5)' : 'none',
              }} />
              <span style={{ flex:1, fontSize:12, color: p.active ? 'var(--paper)' : 'var(--smoke)' }}>{p.name}</span>
              {p.bonus > 0 && (
                <span style={{ fontSize:10, color:'var(--gold)', fontFamily:'monospace' }}>+{p.bonus}%</span>
              )}
              <span style={{
                fontSize:9, padding:'1px 7px', borderRadius:10,
                background: p.active ? 'rgba(201,162,39,0.15)' : 'rgba(42,31,14,0.6)',
                border: `0.5px solid ${p.active ? 'rgba(201,162,39,0.4)' : 'rgba(58,46,20,0.8)'}`,
                color: p.active ? 'var(--gold)' : 'var(--ash)',
                letterSpacing: 0.5,
              }}>
                {p.status}
              </span>
            </div>
          ))}
        </Card>

        {/* ── Airdrop allocation ── */}
        <div
          style={{
            background:'linear-gradient(160deg,#100c04,#1a1209,#2a1f0e)',
            border:'0.5px solid rgba(201,162,39,0.15)',
            borderRadius:14, padding:'20px 16px',
            textAlign:'center', marginBottom:12, position:'relative', overflow:'hidden',
          }}
        >
          <div style={{ position:'absolute', top:-16, right:-8, fontFamily:'var(--font-display)', fontSize:100, color:'rgba(201,162,39,0.04)', lineHeight:1, pointerEvents:'none' }}>¥</div>
          <div style={{ fontSize:10, color:'var(--smoke)', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>
            Airdrop Allocation
          </div>
          {user.is_suspicious ? (
            <div style={{ fontSize:18, color:'#c05050', fontFamily:'var(--font-display)' }}>Account Flagged</div>
          ) : !user.wallet_address ? (
            <>
              <div style={{ fontFamily:'var(--font-display)', fontSize:36, color:'var(--gold)', lineHeight:1, marginBottom:4 }}>{fmt(tokens)}</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:16, color:'var(--gold2)', marginBottom:8 }}>$KOKO</div>
              <div style={{ fontSize:11, color:'var(--ash)' }}>Submit wallet to lock in allocation</div>
            </>
          ) : (
            <>
              <div style={{ fontFamily:'var(--font-display)', fontSize:36, color:'var(--gold)', lineHeight:1, marginBottom:4 }}>{fmt(user.tokens_allocated)}</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:16, color:'var(--gold2)', marginBottom:8 }}>$KOKO</div>
              <div style={{ fontSize:11, color:'var(--success)', marginBottom:4 }}>✓ Allocation locked · Wallet submitted</div>
              <div style={{ fontSize:10, color:'var(--ash)', fontFamily:'monospace' }}>
                {user.wallet_address.slice(0,8)}...{user.wallet_address.slice(-6)}
              </div>
            </>
          )}
        </div>

        {/* ── Stats ── */}
        <Card style={{ marginBottom:12, padding:'4px 16px' }}>
          <StatRow label="Your KP"           value={fmt(user.points)}            accent />
          <StatRow label="Conversion rate"    value={`${TOKEN_RATE} KP = 1 $KOKO`} />
          <StatRow label="% of airdrop pool"  value={`${pctOfPool}%`}             />
          <StatRow label="Airdrop pool"        value="266,666,666 $KOKO"           />
          <StatRow label="Presale allocation"  value="150,000,000 $KOKO"           />
          <StatRow label="Total supply"        value="888,888,888 $KOKO"           />
        </Card>

        {/* ── Potential ── */}
        {!done && remaining > 0 && (
          <Card style={{ marginBottom:12 }}>
            <div style={{ padding:'14px 16px' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:10, color:'var(--mist)', letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>
                Potential with all tasks
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:13, color:'var(--smoke)' }}>Remaining tasks</span>
                <span style={{ fontSize:13, color:'var(--gold)', fontFamily:'monospace' }}>+{fmt(remaining)} KP</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ fontSize:13, color:'var(--smoke)' }}>Max tokens</span>
                <span style={{ fontSize:14, color:'var(--gold2)', fontFamily:'monospace' }}>{fmt(calcTokens(maxPotential))} $KOKO</span>
              </div>
              <GoldButton onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'tasks' }))} style={{ fontSize:12, padding:'9px 16px' }}>
                Complete remaining tasks
              </GoldButton>
            </div>
          </Card>
        )}

        {/* ── Submit wallet CTA ── */}
        {!user.wallet_address && !user.is_suspicious && (
          <Card glow style={{ marginBottom:12 }}>
            <div style={{ padding:'14px 16px' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:10, color:'var(--mist)', letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>
                Lock your airdrop allocation
              </div>
              <p style={{ fontSize:12, color:'var(--smoke)', lineHeight:1.6, marginBottom:12 }}>
                Submit a Solana wallet to lock in your $KOKO airdrop. One wallet per account. Allocation is final at TGE.
              </p>
              <GoldButton onClick={() => TG.openBot('wallet')} style={{ fontSize:12, padding:'9px 16px' }}>
                Submit wallet via bot
              </GoldButton>
            </div>
          </Card>
        )}

        <div style={{ textAlign:'center', padding:'8px 20px 20px', fontSize:11, color:'var(--ash)', fontStyle:'italic', lineHeight:1.8 }}>
          "The earliest believers always remember where they stood."
        </div>
      </div>
    </div>
  )
}
