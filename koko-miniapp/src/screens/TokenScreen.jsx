import React from 'react'
import { useUser } from '../hooks/useUser'
import { Card, GoldButton, ScreenHeader } from '../components/UI'
import { fmt, calcTokens, AIRDROP_CAP, TOKEN_RATE, TASK_POINTS, allTasksDone } from '../lib/tg'
import { TG } from '../lib/tg'

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

  const tokens     = calcTokens(user.points)
  const pctOfPool  = ((tokens / AIRDROP_CAP) * 100).toFixed(4)
  const done       = allTasksDone(user)
  const remaining  = TASK_POINTS.joined_telegram * (!user.joined_telegram ? 1 : 0)
                   + TASK_POINTS.followed_x      * (!user.followed_x      ? 1 : 0)
                   + TASK_POINTS.retweeted       * (!user.retweeted       ? 1 : 0)
                   + TASK_POINTS.lore_answered   * (!user.lore_answered   ? 1 : 0)
  const maxPotential = user.points + remaining

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <ScreenHeader title="Token Estimate" subtitle="$KOKO allocation at TGE" />

      <div style={{ flex:1, overflowY:'auto', padding:16 }}>

        {/* Main figure */}
        <div
          className="animate-rise"
          style={{
            background:'linear-gradient(160deg,#100c04,#1a1209,#2a1f0e)',
            border:'0.5px solid rgba(201,162,39,0.2)',
            borderRadius:14, padding:'28px 20px',
            textAlign:'center', marginBottom:16, position:'relative', overflow:'hidden',
          }}
        >
          <div style={{
            position:'absolute', top:-20, right:-10,
            fontFamily:'var(--font-display)', fontSize:120, color:'rgba(201,162,39,0.05)',
            lineHeight:1, pointerEvents:'none',
          }}>¥</div>

          <div style={{ fontSize:11, color:'var(--smoke)', letterSpacing:3, textTransform:'uppercase', marginBottom:10 }}>
            Estimated allocation
          </div>

          {user.is_suspicious ? (
            <div style={{ fontSize:20, color:'#c05050', fontFamily:'var(--font-display)' }}>
              Account Flagged
            </div>
          ) : !user.wallet_address ? (
            <>
              <div style={{ fontFamily:'var(--font-display)', fontSize:40, color:'var(--gold)', lineHeight:1, marginBottom:6 }}>
                {fmt(tokens)}
              </div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--gold2)' }}>$KOKO</div>
              <div style={{ fontSize:11, color:'var(--ash)', marginTop:10 }}>
                Submit wallet to lock in allocation
              </div>
            </>
          ) : (
            <>
              <div style={{ fontFamily:'var(--font-display)', fontSize:40, color:'var(--gold)', lineHeight:1, marginBottom:6 }}>
                {fmt(user.tokens_allocated)}
              </div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--gold2)' }}>$KOKO</div>
              <div style={{ fontSize:11, color:'var(--success)', marginTop:10 }}>
                ✓ Allocation locked · Wallet submitted
              </div>
              <div style={{ fontSize:10, color:'var(--ash)', marginTop:4, wordBreak:'break-all', fontFamily:'monospace' }}>
                {user.wallet_address.slice(0,8)}...{user.wallet_address.slice(-6)}
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        <Card style={{ marginBottom:12, padding:'4px 16px' }}>
          <StatRow label="Your KP"              value={fmt(user.points)}       accent />
          <StatRow label="Conversion rate"       value={`${TOKEN_RATE} KP = 1 $KOKO`} />
          <StatRow label="% of airdrop pool"     value={`${pctOfPool}%`}       />
          <StatRow label="Airdrop pool"           value="266,666,666 $KOKO"    />
          <StatRow label="Total supply"           value="888,888,888 $KOKO"    />
        </Card>

        {/* Potential */}
        {!done && remaining > 0 && (
          <Card style={{ marginBottom:12 }}>
            <div style={{ padding:'14px 16px' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:11, color:'var(--mist)', letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>
                Potential with all tasks
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={{ fontSize:13, color:'var(--smoke)' }}>Complete remaining tasks</span>
                <span style={{ fontSize:13, color:'var(--gold)', fontFamily:'monospace' }}>+{fmt(remaining)} KP</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <span style={{ fontSize:13, color:'var(--smoke)' }}>Max potential tokens</span>
                <span style={{ fontSize:14, color:'var(--gold2)', fontFamily:'monospace', fontWeight:500 }}>{fmt(calcTokens(maxPotential))} $KOKO</span>
              </div>
              <GoldButton onClick={() => TG.openBot('tasks')} style={{ fontSize:12, padding:'9px 16px' }}>
                Complete remaining tasks
              </GoldButton>
            </div>
          </Card>
        )}

        {/* Submit wallet CTA */}
        {!user.wallet_address && !user.is_suspicious && (
          <Card glow style={{ marginBottom:12 }}>
            <div style={{ padding:'14px 16px' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:11, color:'var(--mist)', letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>
                Lock your allocation
              </div>
              <p style={{ fontSize:12, color:'var(--smoke)', lineHeight:1.6, marginBottom:12 }}>
                Submit a Solana wallet to lock in your $KOKO allocation. One wallet per account. Allocation is final.
              </p>
              <GoldButton onClick={() => TG.openBot('wallet')} style={{ fontSize:12, padding:'9px 16px' }}>
                Submit wallet via bot
              </GoldButton>
            </div>
          </Card>
        )}

        <div style={{ textAlign:'center', padding:'8px 20px 16px', fontSize:11, color:'var(--ash)', fontStyle:'italic', lineHeight:1.8 }}>
          "Tokens distributed at TGE.<br/>The village does not forget its believers."
        </div>
      </div>
    </div>
  )
}
