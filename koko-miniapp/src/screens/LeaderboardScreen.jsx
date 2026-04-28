import React, { useState } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { useUser } from '../hooks/useUser'
import { ScreenHeader } from '../components/UI'
import { fmt, fmtCompact, TOKEN_RATE } from '../lib/tg'

const MEDAL = ['🥇', '🥈', '🥉']

function LeaderRow({ entry, isMe, index }) {
  const rank = entry.rank ?? index + 1
  return (
    <div
      className="animate-in"
      style={{
        display:'flex', alignItems:'center', gap:12,
        padding:'10px 16px',
        borderBottom:'0.5px solid rgba(42,31,14,0.6)',
        background: isMe ? 'rgba(201,162,39,0.05)' : 'transparent',
        borderLeft: isMe ? '2px solid var(--gold)' : '2px solid transparent',
        animationDelay: `${Math.min(index * 20, 400)}ms`,
        transition:'background 0.2s',
      }}
    >
      {/* Rank */}
      <div style={{
        width:28, textAlign:'center', flexShrink:0,
        fontFamily:'var(--font-display)', fontSize:11,
        color: rank <= 3 ? 'var(--gold)' : 'var(--ash)',
      }}>
        {rank <= 3 ? MEDAL[rank-1] : `#${rank}`}
      </div>

      {/* Avatar */}
      <div style={{
        width:32, height:32, borderRadius:'50%', flexShrink:0,
        background:'rgba(58,46,20,0.8)',
        border: isMe ? '1px solid var(--gold)' : '0.5px solid rgba(58,46,20,1)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'var(--font-display)', fontSize:11,
        color: isMe ? 'var(--gold)' : 'var(--mist)',
      }}>
        {(entry.username ?? entry.first_name ?? '?')[0]?.toUpperCase()}
      </div>

      {/* Name */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{
          fontSize:13, color: isMe ? 'var(--gold2)' : 'var(--paper)',
          fontWeight: isMe ? 500 : 400,
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
        }}>
          {entry.username ? `@${entry.username}` : entry.first_name}
          {isMe && <span style={{ fontSize:10, color:'var(--gold)', marginLeft:6 }}>YOU</span>}
        </div>
        <div style={{ fontSize:10, color:'var(--smoke)', marginTop:1 }}>
          ≈ {fmtCompact(Math.floor(entry.points / TOKEN_RATE))} $KOKO
        </div>
      </div>

      {/* Points */}
      <div style={{ textAlign:'right', flexShrink:0 }}>
        <div style={{ fontSize:13, color:'var(--gold)', fontFamily:'monospace' }}>
          {fmtCompact(entry.points)}
        </div>
        <div style={{ fontSize:9, color:'var(--smoke)', textTransform:'uppercase', letterSpacing:0.5 }}>KP</div>
      </div>
    </div>
  )
}

export default function LeaderboardScreen() {
  const { board, loading } = useLeaderboard()
  const { user } = useUser()
  const [tab, setTab] = useState('top')

  const myEntry = board.find(e => e.telegram_id === user?.telegram_id)
  const myRank  = myEntry?.rank ?? null

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <ScreenHeader
        title="Leaderboard"
        subtitle="Only true believers. No farmers."
        right={myRank ? (
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:16, color:'var(--gold)' }}>#{myRank}</div>
            <div style={{ fontSize:10, color:'var(--smoke)' }}>your rank</div>
          </div>
        ) : null}
      />

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, padding:'8px 16px', borderBottom:'0.5px solid rgba(42,31,14,0.6)' }}>
        {['top','mine'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'5px 14px', borderRadius:20, fontSize:11,
            fontFamily:'var(--font-body)', cursor:'pointer',
            background: tab===t ? 'var(--gold)' : 'transparent',
            color: tab===t ? 'var(--ink)' : 'var(--smoke)',
            border: tab===t ? 'none' : '0.5px solid var(--ash)',
            transition:'all 0.2s',
          }}>
            {t==='top' ? 'Top 100' : 'My rank'}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:'auto' }}>
        {loading ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--smoke)', fontSize:12 }}>
            The village counts its warriors...
          </div>
        ) : tab === 'top' ? (
          board.map((entry, i) => (
            <LeaderRow
              key={entry.telegram_id}
              entry={entry}
              isMe={entry.telegram_id === user?.telegram_id}
              index={i}
            />
          ))
        ) : (
          <div style={{ padding:20 }}>
            {myEntry ? (
              <>
                <div style={{
                  background:'rgba(201,162,39,0.06)', border:'0.5px solid rgba(201,162,39,0.25)',
                  borderRadius:10, padding:'20px 16px', textAlign:'center', marginBottom:16,
                }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:11, color:'var(--smoke)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>
                    Village Rank
                  </div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:48, color:'var(--gold)', lineHeight:1 }}>
                    #{myEntry.rank}
                  </div>
                  <div style={{ fontSize:12, color:'var(--smoke)', marginTop:8 }}>
                    Top {Math.round(myEntry.rank / board.length * 100)}% of the village
                  </div>
                </div>
                <LeaderRow entry={myEntry} isMe index={myEntry.rank - 1} />
              </>
            ) : (
              <div style={{ textAlign:'center', padding:40, fontSize:12, color:'var(--smoke)', lineHeight:2 }}>
                Your name is not yet on the board.<br/>
                Complete tasks to enter the village records.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
