import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '../hooks/useUser'
import { SuspiciousBanner } from '../components/UI'
import { TG, REFERRAL_CAP, fmtCompact, allTasksDone, TWITTER_URL, RETWEET_URL, TG_GROUP } from '../lib/tg'

const KOKO_IMG    = 'https://i.postimg.cc/tgTkS4ML/8e5af09c-41df-471c-9e17-d6ae16b23ae9.png'
const KP_PER_MIN  = 2780
const ENERGY_MAX  = 5700
const BOOSTER_PCT = 20

function MissionRow({ icon, label, pts, done, claimed, onClaim, onGo, delay=0 }) {
  return (
    <div className="animate-in" style={{
      display:'flex', alignItems:'center', gap:8,
      padding:'8px 0', borderBottom:'0.5px solid rgba(42,31,14,0.5)',
      animationDelay:`${delay}ms`,
    }}>
      <div style={{
        width:30, height:30, borderRadius:7, flexShrink:0,
        background:'rgba(42,31,14,0.8)', border:'0.5px solid rgba(58,46,20,0.6)',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:13,
      }}>{icon}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:11, color: done ? 'var(--smoke)' : 'var(--paper)', lineHeight:1.2 }}>{label}</div>
        <div style={{ fontSize:9, color:'var(--gold)', marginTop:1, fontFamily:'monospace' }}>+{pts} KP</div>
      </div>
      {done && !claimed && (
        <button onClick={onClaim} style={{
          padding:'4px 10px', background:'linear-gradient(90deg,#b8891e,#c9a227)',
          border:'none', borderRadius:5, fontFamily:'var(--font-display)',
          fontSize:9, fontWeight:600, color:'#0d0a05', cursor:'pointer',
          letterSpacing:0.5, flexShrink:0, touchAction:'manipulation',
        }}>CLAIM</button>
      )}
      {(done && claimed) || (done && pts === 0) ? (
        <span style={{ fontSize:9, color:'var(--smoke)', flexShrink:0 }}>✓ DONE</span>
      ) : null}
      {!done && (
        <button onClick={onGo} style={{
          padding:'4px 12px', background:'transparent',
          border:'0.5px solid rgba(58,46,20,0.8)', borderRadius:5,
          fontFamily:'var(--font-display)', fontSize:9, color:'var(--mist)',
          cursor:'pointer', flexShrink:0, letterSpacing:0.3, touchAction:'manipulation',
        }}>GO</button>
      )}
    </div>
  )
}

function StreakDot({ day, active }) {
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{
        width:26, height:26, borderRadius:'50%',
        border:`1.5px solid ${active ? 'var(--gold)' : 'rgba(42,31,14,0.8)'}`,
        background: active ? 'rgba(201,162,39,0.12)' : 'transparent',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:10, color: active ? 'var(--gold)' : 'var(--ash)',
        margin:'0 auto 3px',
      }}>
        {active ? '✓' : ''}
      </div>
      <div style={{ fontSize:7, color:'var(--smoke)' }}>{day}</div>
    </div>
  )
}

export default function HomeScreen() {
  const { user, refCount, loading } = useUser()
  const [claimed, setClaimed]       = useState({})
  const [kpCount, setKpCount]       = useState(0)
  const timerRef                    = useRef(null)

  useEffect(() => {
    if (!user) return
    setKpCount(user.points)
    timerRef.current = setInterval(() => {
      setKpCount(prev => prev + Math.floor(KP_PER_MIN / 60))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [user?.points])

  if (loading) return null
  if (!user) return (
    <div style={{ padding:40, textAlign:'center', color:'var(--smoke)', fontSize:13 }}>
      Open via the bot.
    </div>
  )

  const shadowOn   = user.shadow_mode_active && user.shadow_mode_expires && new Date(user.shadow_mode_expires) > new Date()
  const tasksCount = ['joined_telegram','followed_x','retweeted','lore_answered','wallet_address'].filter(t => user[t]).length
  const totalTasks = 5
  const progress   = Math.round((tasksCount / totalTasks) * 100)
  const refLink    = `https://t.me/${import.meta.env.VITE_BOT_USERNAME ?? 'KokoKairokuBot'}?start=${user.referral_code}`

  function openTask(param) {
    try { TG.haptic('impact','light') } catch(e) {}
    TG.openBot(param)
  }
  function handleClaim(key) {
    try { TG.haptic('notification','success') } catch(e) {}
    setClaimed(p => ({ ...p, [key]: true }))
  }

  const topRows = [
    { rank:1, name:'0xA12...7F3', pts:'120.5M KP' },
    { rank:2, name:'0xB45...8C9', pts:'98.7M KP'  },
    { rank:3, name:'0xC98...6D1', pts:'76.3M KP'  },
  ]

  const isCheckedIn = user.last_checkin === new Date().toISOString().split('T')[0]

  return (
    <div style={{
      height:'100%', overflowY:'auto', overflowX:'hidden',
      WebkitOverflowScrolling:'touch', paddingBottom:80,
    }}>

      {/* ── HERO ── */}
      <div style={{
        position:'relative', overflow:'hidden', minHeight:210,
        background:'radial-gradient(ellipse at 65% 35%, #2a1f0e 0%, #1a1209 45%, #0d0a05 100%)',
        borderBottom:'0.5px solid rgba(201,162,39,0.1)',
      }}>
        {/* Moon glow */}
        <div style={{
          position:'absolute', right:50, top:8,
          width:130, height:130, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(201,162,39,0.1) 0%, transparent 70%)',
          pointerEvents:'none',
        }} />
        {/* Kanji */}
        <div style={{
          position:'absolute', right:8, top:6,
          fontFamily:'var(--font-display)', fontSize:56,
          color:'rgba(201,162,39,0.1)', lineHeight:1, pointerEvents:'none',
        }}>影</div>
        {/* Koko image */}
        <img src={KOKO_IMG} alt="Koko" style={{
          position:'absolute', right:-8, bottom:0,
          height:195, width:'auto', objectFit:'contain', pointerEvents:'none',
          maskImage:'linear-gradient(to bottom, black 55%, transparent 100%)',
          WebkitMaskImage:'linear-gradient(to bottom, black 55%, transparent 100%)',
        }} />

        <div style={{ padding:'12px 14px 0', position:'relative', zIndex:2 }}>
          {user.is_suspicious && <SuspiciousBanner />}

          {/* Rank badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:7,
            background:'rgba(16,12,4,0.88)', border:'0.5px solid rgba(58,46,20,0.9)',
            borderRadius:8, padding:'5px 10px', marginBottom:10,
          }}>
            <div style={{
              width:26, height:26, borderRadius:6, overflow:'hidden', flexShrink:0,
              background:'rgba(42,31,14,0.9)',
            }}>
              <img src={KOKO_IMG} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.75)' }} />
            </div>
            <div>
              <div style={{ fontSize:11, color:'var(--paper)', fontFamily:'var(--font-display)', letterSpacing:0.3 }}>
                {user.username ? `@${user.username}` : user.first_name}
              </div>
              <div style={{ fontSize:9, color:'var(--gold)', marginTop:1 }}>RANK #—</div>
            </div>
          </div>

          {/* KP */}
          <div style={{ fontSize:8, color:'var(--smoke)', letterSpacing:2, textTransform:'uppercase', marginBottom:3 }}>TOTAL KP</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:3 }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:28, color:'var(--paper)', fontWeight:600, lineHeight:1 }}>
              {kpCount.toLocaleString()}
            </span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:13, color:'var(--gold)' }}>KP</span>
          </div>
          <div style={{ fontSize:10, color:'var(--smoke)', marginBottom:12, display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ color:'var(--gold)' }}>⚡</span>
            <span>+{KP_PER_MIN.toLocaleString()} KP/min</span>
          </div>

          {/* CTA buttons */}
          <div style={{ display:'flex', gap:8, marginBottom:14, paddingRight:120 }}>
            <button onClick={() => openTask('tasks')} style={{
              flex:1, padding:'9px 0',
              background:'linear-gradient(135deg,#b8891e,#c9a227)',
              border:'none', borderRadius:7,
              fontFamily:'var(--font-display)', fontSize:10, fontWeight:600,
              color:'#0d0a05', cursor:'pointer', letterSpacing:0.8,
              touchAction:'manipulation',
            }}>⚡ START FARMING</button>
            <button onClick={() => openTask('shadow_mode')} style={{
              flex:1, padding:'9px 0',
              background:'rgba(16,12,4,0.9)', border:'0.5px solid rgba(201,162,39,0.4)',
              borderRadius:7, fontFamily:'var(--font-display)', fontSize:10,
              color:'var(--gold)', cursor:'pointer', letterSpacing:0.5,
              touchAction:'manipulation',
            }}>◎ SHADOW MODE</button>
          </div>
        </div>
      </div>

      <div style={{ padding:'10px 12px 0' }}>

        {/* ── STAT ROW ── */}
        <div style={{ display:'flex', gap:8, marginBottom:10 }}>
          {/* Energy */}
          <div style={{ flex:1, background:'rgba(16,12,4,0.95)', border:'0.5px solid rgba(58,46,20,0.8)', borderRadius:9, padding:'9px 9px 7px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}>
              <span style={{ fontSize:10 }}>⚡</span>
              <span style={{ fontSize:8, color:'var(--smoke)', textTransform:'uppercase', letterSpacing:0.8, fontFamily:'var(--font-display)' }}>Energy</span>
            </div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:14, color:'var(--paper)', fontWeight:600, lineHeight:1, marginBottom:4 }}>
              {ENERGY_MAX.toLocaleString()} <span style={{ fontSize:9, color:'var(--smoke)' }}>/ {ENERGY_MAX.toLocaleString()}</span>
            </div>
            <div style={{ height:3, background:'rgba(42,31,14,0.8)', borderRadius:2, overflow:'hidden', marginBottom:3 }}>
              <div style={{ height:'100%', width:'100%', background:'linear-gradient(90deg,#8b6914,#c9a227)', borderRadius:2 }} />
            </div>
            <div style={{ fontSize:7, color:'var(--smoke)' }}>+50 energy / min</div>
          </div>

          {/* KP Booster */}
          <div style={{ flex:1, background:'rgba(16,12,4,0.95)', border:'0.5px solid rgba(58,46,20,0.8)', borderRadius:9, padding:'9px 9px 7px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}>
              <span style={{ fontSize:10 }}>🔥</span>
              <span style={{ fontSize:8, color:'var(--smoke)', textTransform:'uppercase', letterSpacing:0.8, fontFamily:'var(--font-display)' }}>KP Booster</span>
            </div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--gold)', fontWeight:600, lineHeight:1, marginBottom:3 }}>+{BOOSTER_PCT}%</div>
            <div style={{ fontSize:7, color:'var(--smoke)' }}>Active for 02:14:38</div>
          </div>

          {/* Referrals */}
          <div
            onClick={() => { try{TG.haptic('impact','light')}catch(e){}; navigator.clipboard?.writeText(refLink).catch(()=>{}) }}
            style={{ flex:1, background:'rgba(16,12,4,0.95)', border:'0.5px solid rgba(58,46,20,0.8)', borderRadius:9, padding:'9px 9px 7px', cursor:'pointer', touchAction:'manipulation' }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}>
              <span style={{ fontSize:10 }}>👥</span>
              <span style={{ fontSize:8, color:'var(--smoke)', textTransform:'uppercase', letterSpacing:0.8, fontFamily:'var(--font-display)' }}>Referrals</span>
            </div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--paper)', fontWeight:600, lineHeight:1, marginBottom:3 }}>{refCount}</div>
            <div style={{ fontSize:7, color:'var(--smoke)' }}>
              {refCount < REFERRAL_CAP ? `Next reward at ${Math.ceil((refCount+1)/5)*5}` : 'Cap reached'}
            </div>
          </div>
        </div>

        {/* ── MISSIONS + SHADOW MODE ROW ── */}
        <div style={{ display:'flex', gap:8, marginBottom:10 }}>

          {/* Daily Missions */}
          <div style={{
            flex:1.15, background:'rgba(16,12,4,0.95)',
            border:'0.5px solid rgba(58,46,20,0.7)', borderRadius:11, padding:'10px 10px 8px',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ fontSize:11 }}>🎯</span>
                <span style={{ fontFamily:'var(--font-display)', fontSize:10, color:'var(--gold2)', letterSpacing:0.5 }}>DAILY MISSIONS</span>
              </div>
              <span style={{ fontSize:8, color:'var(--smoke)', fontFamily:'monospace' }}>12:36:45</span>
            </div>

            <MissionRow icon="📱" label="Join Telegram"    pts={500} done={user.joined_telegram}  claimed={claimed.tg}   onClaim={()=>handleClaim('tg')}   onGo={()=>TG.openUrl(TG_GROUP)}    delay={0}  />
            <MissionRow icon="🐦" label="Follow on X"      pts={500} done={user.followed_x}       claimed={claimed.x}    onClaim={()=>handleClaim('x')}    onGo={()=>TG.openUrl(TWITTER_URL)} delay={30} />
            <MissionRow icon="🔁" label="Retweet Post"     pts={300} done={user.retweeted}         claimed={claimed.rt}   onClaim={()=>handleClaim('rt')}   onGo={()=>TG.openUrl(RETWEET_URL)} delay={60} />
            <MissionRow icon="📜" label="Lore Question"    pts={250} done={user.lore_answered}     claimed={claimed.lore} onClaim={()=>handleClaim('lore')} onGo={()=>openTask('lore')}        delay={90} />
            <MissionRow icon="💳" label="Submit Wallet"    pts={0}   done={!!user.wallet_address}  claimed={true}         onClaim={()=>{}}                  onGo={()=>openTask('wallet')}      delay={120}/>
            <MissionRow icon="🗓" label="Daily Check-in"   pts={100} done={isCheckedIn}            claimed={claimed.ci}   onClaim={()=>handleClaim('ci')}   onGo={()=>openTask('checkin')}     delay={150}/>

            {/* Bonus bar */}
            <div style={{ background:'rgba(42,31,14,0.5)', borderRadius:7, padding:'7px 8px', marginTop:7 }}>
              <div style={{ fontSize:8, color:'var(--gold)', fontFamily:'var(--font-display)', letterSpacing:0.3, marginBottom:5 }}>
                🎁 COMPLETE ALL → BONUS +2,000 KP
              </div>
              <div style={{ height:3, background:'rgba(16,12,4,0.8)', borderRadius:2, overflow:'hidden', marginBottom:3 }}>
                <div style={{ height:'100%', width:`${(tasksCount/totalTasks)*100}%`, background:'linear-gradient(90deg,#8b6914,#c9a227)', borderRadius:2 }} />
              </div>
              <div style={{ fontSize:7, color:'var(--smoke)', textAlign:'right' }}>{tasksCount} / {totalTasks}</div>
            </div>
          </div>

          {/* Shadow Mode */}
          <div style={{
            flex:0.85, background:'rgba(16,12,4,0.95)',
            border:'0.5px solid rgba(58,46,20,0.7)', borderRadius:11, padding:'10px 9px 9px',
            display:'flex', flexDirection:'column',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ fontSize:10 }}>◎</span>
                <span style={{ fontFamily:'var(--font-display)', fontSize:9, color:'var(--gold2)', letterSpacing:0.3 }}>SHADOW MODE</span>
              </div>
              <span style={{ fontSize:12 }}>🔒</span>
            </div>

            {/* Kanji orb */}
            <div style={{
              width:60, height:60, borderRadius:'50%', margin:'0 auto 8px',
              background:'radial-gradient(circle, rgba(42,31,14,0.9) 0%, rgba(16,12,4,0.9) 100%)',
              border:'1px solid rgba(201,162,39,0.18)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--font-display)', fontSize:26, color:'rgba(201,162,39,0.55)',
              boxShadow:'0 0 16px rgba(201,162,39,0.07)',
            }}>影</div>

            <div style={{ fontSize:9, color:'var(--smoke)', textAlign:'center', lineHeight:1.5, marginBottom:8 }}>
              Unleash Koko's full potential.<br/>2X KP. 2X Profit. 24 Hours.
            </div>

            <div style={{ marginBottom:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:8, marginBottom:4 }}>
                <span style={{ color: refCount >= 5 ? 'var(--gold)' : 'var(--smoke)' }}>
                  {refCount >= 5 ? '✓' : '○'} 5 Referrals
                </span>
                <span style={{ color:'var(--ash)', fontFamily:'monospace' }}>{Math.min(refCount,5)} / 5</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:8 }}>
                <span style={{ color: tasksCount >= 5 ? 'var(--gold)' : 'var(--smoke)' }}>
                  {tasksCount >= 5 ? '✓' : '○'} 5 Tasks
                </span>
                <span style={{ color:'var(--ash)', fontFamily:'monospace' }}>{tasksCount} / 5</span>
              </div>
            </div>

            <button onClick={() => openTask('shadow_mode')} style={{
              width:'100%', padding:'7px',
              background: shadowOn ? 'linear-gradient(135deg,#b8891e,#c9a227)' : 'rgba(42,31,14,0.8)',
              border: shadowOn ? 'none' : '0.5px solid rgba(58,46,20,0.8)',
              borderRadius:6, fontFamily:'var(--font-display)', fontSize:9,
              color: shadowOn ? '#0d0a05' : 'var(--mist)',
              cursor:'pointer', letterSpacing:0.5, marginBottom:6,
              touchAction:'manipulation',
            }}>
              {shadowOn ? 'ACTIVE' : 'LOCKED'}
            </button>
            <div style={{ fontSize:7, color:'var(--ash)', textAlign:'center' }}>
              Reward: 2X KP for 24 hours
            </div>
          </div>
        </div>

        {/* ── TOP SHADOWS ── */}
        <div style={{
          background:'rgba(16,12,4,0.95)', border:'0.5px solid rgba(58,46,20,0.7)',
          borderRadius:11, padding:'10px 12px', marginBottom:10,
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span>🏆</span>
              <span style={{ fontFamily:'var(--font-display)', fontSize:10, color:'var(--gold2)', letterSpacing:0.5 }}>TOP SHADOWS</span>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail:'leaderboard' }))}
              style={{ fontSize:8, color:'var(--gold)', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-display)', touchAction:'manipulation' }}
            >VIEW ALL &gt;</button>
          </div>

          {topRows.map((r,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:'0.5px solid rgba(42,31,14,0.4)' }}>
              <span style={{ fontSize:12, width:18, textAlign:'center', flexShrink:0 }}>
                {i===0?'🥇':i===1?'🥈':'🥉'}
              </span>
              <span style={{ flex:1, fontSize:10, color:'var(--mist)', fontFamily:'monospace' }}>{r.name}</span>
              <span style={{ fontSize:10, color:'var(--gold)', fontFamily:'monospace' }}>{r.pts}</span>
            </div>
          ))}

          {/* You row */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 4px', background:'rgba(201,162,39,0.04)', borderRadius:4, marginTop:3 }}>
            <span style={{ fontSize:9, width:18, textAlign:'center', color:'var(--gold)', fontFamily:'var(--font-display)', flexShrink:0 }}>—</span>
            <span style={{ flex:1, fontSize:10, color:'var(--gold2)' }}>
              {user.username ? `@${user.username}` : user.first_name}
              <span style={{ color:'var(--smoke)', fontSize:8, marginLeft:5 }}>YOU</span>
            </span>
            <span style={{ fontSize:10, color:'var(--gold)', fontFamily:'monospace' }}>{fmtCompact(user.points)} KP</span>
          </div>
        </div>

        {/* ── STREAK + PROGRESS ── */}
        <div style={{ display:'flex', gap:8, marginBottom:10 }}>
          {/* Streak */}
          <div style={{ flex:1, background:'rgba(16,12,4,0.95)', border:'0.5px solid rgba(58,46,20,0.7)', borderRadius:11, padding:'10px 10px 9px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:6 }}>
              <span>🔥</span>
              <span style={{ fontFamily:'var(--font-display)', fontSize:10, color:'var(--gold2)', letterSpacing:0.5 }}>STREAK</span>
            </div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:20, color:'var(--paper)', fontWeight:600, marginBottom:1 }}>7 Days</div>
            <div style={{ fontSize:8, color:'var(--smoke)', marginBottom:8 }}>Keep it up!</div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              {['M','T','W','F','S'].map((d,i) => <StreakDot key={i} day={d} active={i<4} />)}
            </div>
          </div>

          {/* Progress */}
          <div style={{ flex:1, background:'rgba(16,12,4,0.95)', border:'0.5px solid rgba(58,46,20,0.7)', borderRadius:11, padding:'10px 10px 9px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', right:-8, bottom:-8, fontSize:44, opacity:0.07, lineHeight:1 }}>🏆</div>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:6 }}>
              <span>📊</span>
              <span style={{ fontFamily:'var(--font-display)', fontSize:10, color:'var(--gold2)', letterSpacing:0.5 }}>YOUR PROGRESS</span>
            </div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:26, color:'var(--gold)', fontWeight:600, marginBottom:4 }}>{progress}%</div>
            <div style={{ height:3, background:'rgba(42,31,14,0.8)', borderRadius:2, overflow:'hidden', marginBottom:5 }}>
              <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#8b6914,#c9a227)', borderRadius:2, transition:'width 0.6s ease' }} />
            </div>
            <div style={{ fontSize:8, color:'var(--smoke)' }}>Keep completing missions!</div>
          </div>
        </div>

        <div style={{ textAlign:'center', padding:'4px 0 8px', fontSize:10, color:'rgba(58,46,20,0.7)', fontStyle:'italic' }}>
          "Koko doesn't chase power. Power follows Koko."
        </div>
      </div>
    </div>
  )
}
