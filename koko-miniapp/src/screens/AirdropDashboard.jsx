import { useState, useEffect, useCallback, useRef } from 'react';

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const STREAK_PTS = [10, 15, 20, 30, 50, 75, 100];
const POOL = 133_333_332;
const TOTAL_PTS = 26_400_000;

const DEFAULT_USER = {
  points: 0,
  referrals: 0,
  rank: 391,
  multiplier: 1.0,
  completedTasks: [],
  streak: 0,
  lastCheckin: null,
};

const LEADERBOARD = [
  { rank: 1, name: 'shadow_koko.sol', pts: 48200, mult: '2×', cls: 'top1', symbol: '⬡' },
  { rank: 2, name: 'nihonkai_wolf',   pts: 39750, mult: '1.5×', cls: 'top2' },
  { rank: 3, name: 'empress_vault',   pts: 31100, mult: '1.25×', cls: 'top3' },
  { rank: 4, name: 'taisei_breaker',  pts: 28440, mult: '', cls: '' },
  { rank: 5, name: 'kokovillage_x',   pts: 24810, mult: '', cls: '' },
];

const ALL_TASKS = [
  // basic
  { id: 'follow_x',      icon: '𝕏', name: 'Follow @KokoKairoku on X',          meta: 'basic · one-time',               pts: 50,   cat: 'basic',    preCompleted: true },
  { id: 'join_tg',       icon: '✈', name: 'Join Telegram Community',            meta: 'basic · one-time',               pts: 30,   cat: 'basic',    preCompleted: true },
  { id: 'connect_wallet',icon: '◎', name: 'Connect Solana Wallet',              meta: 'Sign message to verify',         pts: 20,   cat: 'basic',    preCompleted: false },
  { id: 'read_gitbook',  icon: '⊞', name: 'Read Kairoku GitBook',               meta: 'Visit tracked via bot',          pts: 30,   cat: 'basic',    preCompleted: false },
  // daily
  { id: 'checkin',       icon: '◉', name: 'Daily Check-in',                    meta: 'Streak bonus: day 5 = +50',      pts: 50,   cat: 'daily',    preCompleted: false },
  { id: 'retweet',       icon: '↺', name: 'Retweet pinned post',               meta: 'daily · resets 00:00 UTC',       pts: 75,   cat: 'daily',    preCompleted: false },
  { id: 'post_koko',     icon: '✎', name: 'Post about $KOKO (tag @KokoKairoku)',meta: 'content · daily · 500 pt limit', pts: 100,  cat: 'content',  preCompleted: false },
  // referral
  { id: 'ref_1',         icon: '⊕', name: 'Refer 1 user (active)',             meta: 'Referral must complete 1+ task', pts: 60,   cat: 'referral', preCompleted: true },
  { id: 'ref_7',         icon: '⊕', name: 'Referral Bonus (×7)',               meta: '7 active referrals · 1.4×',      pts: 420,  cat: 'referral', preCompleted: true },
  { id: 'ref_more',      icon: '◆', name: 'Refer 3 more users',                meta: 'Unlock 1.6× multiplier at 10',   pts: 180,  cat: 'referral', preCompleted: false },
  // purchase
  { id: 'buy_25',        icon: '▣', name: 'Buy $25 worth of $KOKO',            meta: '500 pts · +30% Shadow Phase',    pts: 500,  cat: 'purchase', preCompleted: false },
  { id: 'buy_100',       icon: '◈', name: 'Buy $100+ worth of $KOKO',          meta: '2000 pts · whale bonus tier',    pts: 2000, cat: 'purchase', preCompleted: false },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────
function calcMultiplier(refs) {
  if (refs >= 25) return 2.0;
  if (refs >= 10) return 1.5;
  if (refs >= 5)  return 1.2;
  return 1.0;
}

function loadUser() {
  try {
    const saved = localStorage.getItem('kairoku_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_USER, ...parsed };
    }
  } catch {}
  return { ...DEFAULT_USER };
}

function saveUser(u) {
  localStorage.setItem('kairoku_user', JSON.stringify(u));
}

// ── STYLES (injected once) ───────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;700&family=Cinzel:wght@400;600;900&family=JetBrains+Mono:wght@300;400&display=swap');

.kk-root {
  --ink: #0a0a0c;
  --shadow: #111118;
  --paper: #14141e;
  --panel: #1a1a28;
  --border: #2a2a3e;
  --muted: #3a3a55;
  --dim: #6b6b88;
  --fog: #9898b8;
  --light: #c8c8e0;
  --white: #eeeef5;
  --gold: #c8a96e;
  --gold-glow: #e8c98e;
  --red: #c84444;
  --jade: #4a9a7a;
  --jade-bright: #6abf9a;
  --accent: #7a5af8;
  background: var(--ink);
  color: var(--light);
  font-family: 'Noto Serif JP', serif;
  min-height: 100%;
  overflow-x: hidden;
  position: relative;
}

.kk-root * { box-sizing: border-box; margin: 0; padding: 0; }

.kk-grain {
  position: fixed; inset: 0; pointer-events: none; z-index: 9999; opacity: 0.4;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}
.kk-ambient {
  position: fixed; top: -30%; right: -20%; width: 60vw; height: 60vw; pointer-events: none; z-index: 0;
  background: radial-gradient(circle, rgba(122,90,248,0.04) 0%, transparent 70%);
}

/* NAV */
.kk-nav {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(10,10,12,0.85); backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.kk-nav-brand { display: flex; align-items: center; gap: 0.75rem; }
.kk-kanji-lg { font-size: 1.5rem; color: var(--gold); font-weight: 700; }
.kk-nav-title { font-family: 'Cinzel', serif; font-size: 0.85rem; letter-spacing: 0.2em; color: var(--fog); }
.kk-nav-sub { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--dim); }
.kk-nav-tabs { display: flex; gap: 0.25rem; }

.kk-tab {
  background: none; border: 1px solid transparent;
  color: var(--dim); font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem; letter-spacing: 0.1em;
  padding: 0.5rem 1rem; cursor: pointer; transition: all 0.2s; text-transform: uppercase;
}
.kk-tab:hover { color: var(--light); border-color: var(--muted); }
.kk-tab.active { color: var(--gold); border-color: var(--gold); background: rgba(200,169,110,0.06); }

/* CONTAINER */
.kk-container { max-width: 1280px; margin: 0 auto; padding: 2rem; position: relative; z-index: 1; }

/* PAGE ANIM */
.kk-page { animation: kkFadeIn 0.3s ease; }
@keyframes kkFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* SECTION HEAD */
.kk-section-head {
  display: flex; align-items: baseline; gap: 1rem;
  margin-bottom: 2rem; padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}
.kk-section-kanji { font-size: 2.5rem; color: var(--gold); opacity: 0.3; font-weight: 700; }
.kk-section-title { font-family: 'Cinzel', serif; font-size: 1.1rem; letter-spacing: 0.2em; color: var(--white); text-transform: uppercase; }
.kk-section-sub { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--dim); letter-spacing: 0.08em; }

/* GRIDS */
.kk-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.kk-grid-auto { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
.kk-stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }

/* CARD */
.kk-card {
  background: var(--panel); border: 1px solid var(--border);
  padding: 1.5rem; position: relative; overflow: hidden;
}
.kk-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  opacity: 0; transition: opacity 0.3s;
}
.kk-card:hover::before { opacity: 0.5; }
.kk-card-label { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.15em; color: var(--dim); text-transform: uppercase; margin-bottom: 0.5rem; }
.kk-card-value { font-family: 'Cinzel', serif; font-size: 2rem; color: var(--white); font-weight: 600; line-height: 1; }
.kk-card-value.gold { color: var(--gold); }
.kk-card-value.jade { color: var(--jade-bright); }
.kk-card-sub { font-size: 0.75rem; color: var(--dim); margin-top: 0.4rem; }

/* BADGE */
.kk-badge {
  display: inline-block; font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase;
  padding: 0.2rem 0.6rem; border: 1px solid currentColor;
}
.kk-badge.gold { color: var(--gold); }
.kk-badge.jade { color: var(--jade-bright); }
.kk-badge.red { color: var(--red); }
.kk-badge.dim { color: var(--dim); }
.kk-badge.pulse { color: var(--jade-bright); animation: kkPulse 2s infinite; }
@keyframes kkPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

/* PROGRESS */
.kk-progress-wrap { height: 3px; background: var(--shadow); border: 1px solid var(--border); overflow: hidden; margin-top: 0.6rem; }
.kk-progress-bar { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold-glow)); transition: width 0.6s ease; }
.kk-progress-bar.jade { background: linear-gradient(90deg, var(--jade), var(--jade-bright)); }

/* TASKS */
.kk-task-list { display: flex; flex-direction: column; gap: 0.5rem; }
.kk-task {
  display: flex; align-items: center; gap: 1rem;
  padding: 0.9rem 1.2rem; background: var(--shadow);
  border: 1px solid var(--border); transition: all 0.2s; cursor: pointer;
}
.kk-task:hover { border-color: var(--muted); background: var(--panel); }
.kk-task.done { opacity: 0.45; pointer-events: none; cursor: default; }
.kk-task-icon { font-size: 1.1rem; width: 2rem; text-align: center; flex-shrink: 0; }
.kk-task-info { flex: 1; }
.kk-task-name { font-size: 0.85rem; color: var(--white); margin-bottom: 0.2rem; }
.kk-task-meta { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--dim); }
.kk-task-pts { font-family: 'Cinzel', serif; font-size: 0.9rem; color: var(--gold); white-space: nowrap; }
.kk-task-check {
  width: 1.2rem; height: 1.2rem; border: 1px solid var(--muted);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; color: var(--jade-bright); flex-shrink: 0;
}
.kk-task.done .kk-task-check { background: rgba(74,154,122,0.15); border-color: var(--jade); }

/* LEADERBOARD */
.kk-lb-row {
  display: flex; align-items: center; gap: 1rem;
  padding: 0.8rem 1rem; border-bottom: 1px solid var(--border); transition: background 0.2s;
}
.kk-lb-row:hover { background: rgba(255,255,255,0.02); }
.kk-lb-row.me { background: rgba(200,169,110,0.06); border-left: 2px solid var(--gold); }
.kk-lb-row:last-child { border-bottom: none; }
.kk-lb-rank { font-family: 'Cinzel', serif; font-size: 0.8rem; color: var(--dim); width: 2rem; text-align: center; flex-shrink: 0; }
.kk-lb-rank.top1 { color: var(--gold); font-size: 1rem; }
.kk-lb-rank.top2 { color: #c0c0c0; }
.kk-lb-rank.top3 { color: #cd7f32; }
.kk-lb-name { flex: 1; font-size: 0.85rem; color: var(--light); }
.kk-lb-pts { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--gold); }
.kk-lb-mult { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--jade-bright); margin-left: 0.5rem; }

/* REFERRAL */
.kk-ref-box {
  display: flex; align-items: center; gap: 0.75rem;
  background: var(--shadow); border: 1px solid var(--border);
  padding: 0.9rem 1.2rem; margin-bottom: 1rem;
}
.kk-ref-text { flex: 1; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--fog); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.kk-btn {
  font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 0.6rem 1.2rem; border: 1px solid; cursor: pointer; transition: all 0.2s; background: none;
}
.kk-btn.gold { color: var(--gold); border-color: var(--gold); }
.kk-btn.gold:hover { background: rgba(200,169,110,0.12); }

/* DAY STRIP */
.kk-day-strip { display: flex; gap: 0.4rem; margin: 0.8rem 0; }
.kk-day-cell {
  flex: 1; height: 3rem; background: var(--shadow); border: 1px solid var(--border);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--dim);
}
.kk-day-cell.done { border-color: var(--jade); background: rgba(74,154,122,0.08); color: var(--jade-bright); }
.kk-day-cell.today { border-color: var(--gold); background: rgba(200,169,110,0.08); color: var(--gold); }
.kk-day-pts { font-size: 0.55rem; margin-top: 0.2rem; }

/* FORMULA */
.kk-formula {
  background: var(--shadow); border: 1px solid var(--border); border-left: 3px solid var(--gold);
  padding: 1.2rem 1.5rem; font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem; color: var(--fog); line-height: 1.8; margin-bottom: 1rem;
}
.kk-formula .hl { color: var(--gold); }
.kk-formula .cm { color: var(--muted); font-size: 0.7rem; }

/* CODE */
.kk-code {
  background: var(--shadow); border: 1px solid var(--border);
  padding: 1.5rem; font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem; color: var(--fog); line-height: 1.9;
  overflow-x: auto; margin-bottom: 1rem; position: relative; white-space: pre;
}
.kk-code-label { position: absolute; top: 0.6rem; right: 0.8rem; font-size: 0.6rem; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; }
.ck { color: var(--accent); }
.cs { color: var(--jade-bright); }
.cn { color: var(--gold); }
.cf { color: #c78af8; }
.cc { color: var(--muted); }

/* TABLE */
.kk-table { width: 100%; border-collapse: collapse; }
.kk-table th { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dim); padding: 0.6rem 1rem; text-align: left; border-bottom: 1px solid var(--border); }
.kk-table td { padding: 0.75rem 1rem; font-size: 0.82rem; border-bottom: 1px solid rgba(42,42,62,0.5); vertical-align: middle; }
.kk-table tr:last-child td { border-bottom: none; }
.kk-table tr:hover td { background: rgba(255,255,255,0.015); }
.kk-cat { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; padding: 0.15rem 0.5rem; border: 1px solid var(--border); text-transform: uppercase; letter-spacing: 0.08em; color: var(--fog); }

/* MULT GRID */
.kk-mult-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 1rem; }
.kk-mult-card { background: var(--shadow); border: 1px solid var(--border); padding: 1rem; text-align: center; }
.kk-mult-refs { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--dim); margin-bottom: 0.3rem; }
.kk-mult-val { font-family: 'Cinzel', serif; font-size: 1.4rem; color: var(--gold); font-weight: 600; }
.kk-mult-lbl { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--dim); margin-top: 0.3rem; }

/* NOTIF */
.kk-notif { display: flex; align-items: center; gap: 0.75rem; padding: 0.8rem 1rem; border: 1px solid var(--border); background: var(--shadow); margin-bottom: 0.5rem; font-size: 0.8rem; color: var(--fog); }
.kk-notif-icon { font-size: 1rem; flex-shrink: 0; }

/* DIVIDER */
.kk-divider { height: 1px; background: linear-gradient(90deg, transparent, var(--border), transparent); margin: 2rem 0; }

/* TOAST */
.kk-toast {
  position: fixed; bottom: 2rem; right: 2rem;
  background: var(--panel); border: 1px solid var(--gold);
  padding: 0.75rem 1.5rem; font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem; color: var(--gold); letter-spacing: 0.08em; z-index: 9998;
  transform: translateY(4rem); opacity: 0; transition: all 0.3s; pointer-events: none;
}
.kk-toast.show { transform: translateY(0); opacity: 1; }

/* RESPONSIVE */
@media (max-width: 900px) {
  .kk-stat-row { grid-template-columns: repeat(2, 1fr); }
  .kk-grid-2 { grid-template-columns: 1fr; }
  .kk-grid-auto { grid-template-columns: 1fr; }
  .kk-mult-grid { grid-template-columns: repeat(2, 1fr); }
  .kk-nav { padding: 1rem; }
  .kk-nav-tabs { gap: 0; }
  .kk-tab { padding: 0.5rem 0.6rem; font-size: 0.65rem; }
  .kk-container { padding: 1rem; }
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--ink); }
::-webkit-scrollbar-thumb { background: var(--muted); }
`;

// ── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function TaskItem({ task, completed, onComplete }) {
  const done = completed || task.preCompleted;
  return (
    <div className={`kk-task${done ? ' done' : ''}`} onClick={() => !done && onComplete(task)}>
      <div className="kk-task-icon">{task.icon}</div>
      <div className="kk-task-info">
        <div className="kk-task-name">{task.name}</div>
        <div className="kk-task-meta">{task.meta}</div>
      </div>
      <div className="kk-task-pts">+{task.pts}</div>
      <div className="kk-task-check">{done ? '✓' : ''}</div>
    </div>
  );
}

function DashboardPage({ user, onComplete, onCopyRef, onCheckin, onAddReferral, refLink }) {
  const base = Math.round((user.points / TOTAL_PTS) * POOL);
  const withMult = Math.round(base * user.multiplier);
  const todayStreakPts = STREAK_PTS[Math.min(user.streak, STREAK_PTS.length - 1)];
  const days = ['M','T','W','T','F','S','S'];
  const streakPts = [10,15,20,30,50,75,100];

  const dashTasks = ALL_TASKS.filter(t =>
    ['follow_x','join_tg','retweet','post_koko','buy_25'].includes(t.id)
  );

  return (
    <div className="kk-page">
      <div className="kk-container">
        <div className="kk-section-head">
          <span className="kk-section-kanji">村</span>
          <div>
            <div className="kk-section-title">Village Record</div>
            <div className="kk-section-sub">@KokoUser · Shadow Phase Active</div>
          </div>
          <span className="kk-badge pulse" style={{marginLeft:'auto'}}>● Live</span>
        </div>

        {/* STAT CARDS */}
        <div className="kk-stat-row">
          <div className="kk-card">
            <div className="kk-card-label">Total Points</div>
            <div className="kk-card-value gold">{user.points.toLocaleString()}</div>
            <div className="kk-card-sub">+{todayStreakPts} today</div>
            <div className="kk-progress-wrap">
              <div className="kk-progress-bar" style={{width:`${Math.min((user.points/10000)*100,100)}%`}} />
            </div>
          </div>
          <div className="kk-card">
            <div className="kk-card-label">Village Rank</div>
            <div className="kk-card-value" style={{fontSize:'1.4rem'}}>#{user.rank}</div>
            <div className="kk-card-sub">of 3,891 participants</div>
            <div style={{marginTop:'0.5rem'}}>
              <span className="kk-badge gold">Top {Math.max(1,Math.round((user.rank/3891)*100))}%</span>
            </div>
          </div>
          <div className="kk-card">
            <div className="kk-card-label">Referrals</div>
            <div className="kk-card-value jade">{user.referrals}</div>
            <div className="kk-card-sub">Multiplier active</div>
            <div className="kk-progress-wrap" style={{marginTop:'0.6rem'}}>
              <div className="kk-progress-bar jade" style={{width:`${Math.min((user.referrals/25)*100,100)}%`}} />
            </div>
          </div>
          <div className="kk-card">
            <div className="kk-card-label">Est. $KOKO</div>
            <div className="kk-card-value" style={{fontSize:'1.3rem',color:'var(--white)'}}>~{withMult.toLocaleString()}</div>
            <div className="kk-card-sub">based on current pool</div>
            <div style={{marginTop:'0.5rem'}}>
              <span className="kk-badge gold">{user.multiplier.toFixed(1)}× Multiplier</span>
            </div>
          </div>
        </div>

        <div className="kk-grid-auto">
          {/* LEFT */}
          <div>
            {/* Streak */}
            <div className="kk-card" style={{marginBottom:'1rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.8rem'}}>
                <div>
                  <div className="kk-card-label">Daily Check-in Streak</div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:'1rem',color:'var(--white)'}}>{user.streak} Days</div>
                </div>
                <button className="kk-btn gold" onClick={onCheckin}>
                  Check In · +{todayStreakPts}
                </button>
              </div>
              <div className="kk-day-strip">
                {days.map((d, i) => {
                  const cls = i < user.streak ? 'done' : i === user.streak ? 'today' : '';
                  return (
                    <div key={i} className={`kk-day-cell ${cls}`}>
                      <div>{d}</div>
                      <div className="kk-day-pts">+{streakPts[i]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Tasks */}
            <div className="kk-card" style={{marginBottom:'1rem'}}>
              <div className="kk-card-label" style={{marginBottom:'1rem'}}>Available Tasks</div>
              <div className="kk-task-list">
                {dashTasks.map(t => (
                  <TaskItem key={t.id} task={t} completed={user.completedTasks.includes(t.id)} onComplete={onComplete} />
                ))}
              </div>
            </div>

            {/* Referral */}
            <div className="kk-card">
              <div className="kk-card-label" style={{marginBottom:'0.8rem'}}>Referral Link</div>
              <div className="kk-ref-box">
                <div className="kk-ref-text">{refLink}</div>
                <button className="kk-btn gold" onClick={onCopyRef}>Copy</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.5rem',textAlign:'center'}}>
                {[
                  {val: user.referrals, label: 'Referrals', color: 'var(--gold)'},
                  {val: user.referrals * 60, label: 'Pts Earned', color: 'var(--jade-bright)'},
                  {val: `${user.multiplier.toFixed(1)}×`, label: 'Multiplier', color: 'var(--white)'},
                ].map(({val,label,color}) => (
                  <div key={label} style={{background:'var(--shadow)',border:'1px solid var(--border)',padding:'0.8rem'}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:'1.2rem',color}}>{val}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.6rem',color:'var(--dim)'}}>{label}</div>
                  </div>
                ))}
              </div>
              <button
                className="kk-btn gold"
                style={{marginTop:'0.75rem',width:'100%'}}
                onClick={onAddReferral}
              >
                + Simulate Referral (dev)
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {/* Leaderboard */}
            <div className="kk-card" style={{marginBottom:'1rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                <div className="kk-card-label">Leaderboard Preview</div>
                <span className="kk-badge dim">Snapshot at TGE</span>
              </div>
              {LEADERBOARD.map(r => (
                <div key={r.rank} className="kk-lb-row">
                  <div className={`kk-lb-rank ${r.cls}`}>{r.symbol || r.rank}</div>
                  <div className="kk-lb-name">{r.name}</div>
                  <div className="kk-lb-pts">{r.pts.toLocaleString()}</div>
                  <div className="kk-lb-mult">{r.mult}</div>
                </div>
              ))}
              <div style={{height:'1px',background:'var(--border)',margin:'0.5rem 0'}} />
              <div className="kk-lb-row me">
                <div className="kk-lb-rank" style={{color:'var(--gold)'}}>{user.rank}</div>
                <div className="kk-lb-name" style={{color:'var(--gold)'}}>You</div>
                <div className="kk-lb-pts">{user.points.toLocaleString()}</div>
                <div className="kk-lb-mult" />
              </div>
            </div>

            {/* Reward estimate */}
            <div className="kk-card">
              <div className="kk-card-label" style={{marginBottom:'0.8rem'}}>Your Reward Estimate</div>
              <div className="kk-formula" style={{fontSize:'0.68rem',padding:'1rem'}}>
                <div><span className="hl">user_reward</span> = (your_pts / total_pts) × pool</div>
                <div className="cm">= ({user.points.toLocaleString()} / 26,400,000) × 133,333,332</div>
                <div style={{marginTop:'0.3rem',color:'var(--gold)'}}>≈ {base.toLocaleString()} $KOKO (before multiplier)</div>
                <div style={{marginTop:'0.3rem',color:'var(--jade-bright)'}}>× {user.multiplier.toFixed(1)}× = ~{withMult.toLocaleString()} $KOKO</div>
              </div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.62rem',color:'var(--muted)'}}>
                * Estimate. Final snapshot at TGE. Pool = 133.3M $KOKO (Quest Pool).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TasksPage({ user, onComplete }) {
  const groups = [
    { label: 'Basic',    badgeCls: 'gold', sub: 'One-time · Verified on-chain/API', cat: 'basic' },
    { label: 'Daily',    badgeCls: 'pulse', sub: 'Resets 00:00 UTC · 500 pt daily cap', cat: 'daily' },
    { label: 'Referral', badgeCls: 'jade', sub: 'Passive · scales with activity', cat: 'referral' },
    { label: 'Purchase', badgeCls: 'red',  sub: 'Helio · Shadow Phase +30% bonus', cat: 'purchase' },
  ];
  // include content under daily display group
  const tasksForCat = (cat) => ALL_TASKS.filter(t => t.cat === cat || (cat === 'daily' && t.cat === 'content'));

  return (
    <div className="kk-page">
      <div className="kk-container">
        <div className="kk-section-head">
          <span className="kk-section-kanji">務</span>
          <div>
            <div className="kk-section-title">Task Scroll</div>
            <div className="kk-section-sub">Daily resets at 00:00 UTC · Anti-farm rules enforced</div>
          </div>
        </div>
        <div className="kk-grid-2">
          {groups.map(g => (
            <div key={g.cat}>
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.75rem'}}>
                <span className={`kk-badge ${g.badgeCls}`}>{g.label}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.65rem',color:'var(--dim)'}}>{g.sub}</span>
              </div>
              <div className="kk-task-list">
                {tasksForCat(g.cat).map(t => (
                  <TaskItem key={t.id} task={t} completed={user.completedTasks.includes(t.id)} onComplete={onComplete} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EconomyPage({ user }) {
  const tableRows = [
    ['Follow on X',       'basic',    '50',  'once'],
    ['Join Telegram',     'basic',    '30',  'once'],
    ['Connect Wallet',    'basic',    '20',  'once'],
    ['Read GitBook',      'basic',    '30',  'once'],
    ['Daily check-in',    'daily',    '10–100','1/day'],
    ['Retweet pinned',    'daily',    '75',  '1/day'],
    ['Post with tag',     'content',  '100', '500/day'],
    ['Refer active user', 'referral', '60',  'unlimited'],
    ['Buy $25+',          'purchase', '500', 'once'],
    ['Buy $100+',         'purchase', '2000','once'],
  ];
  const capRows = [
    ['Basic tasks',     'N/A (one-time)', 'var(--dim)'],
    ['Daily tasks',     '500 pts',        'var(--gold)'],
    ['Content tasks',   '500 pts',        'var(--gold)'],
    ['Referrals',       'No cap',         'var(--jade-bright)'],
    ['Purchase',        'One-time',       'var(--red)'],
    ['Global daily max','1,000 pts',      'var(--white)'],
  ];
  const multCards = [
    { refs:'0–2 refs',  val:'1.0×', lbl:'Base',         border:'var(--border)',      color:'var(--gold)' },
    { refs:'3–9 refs',  val:'1.2×', lbl:'Village Scout', border:'var(--muted)',      color:'var(--gold)' },
    { refs:'10–24 refs',val:'1.5×', lbl:'Village Elder', border:'var(--jade)',       color:'var(--jade-bright)' },
    { refs:'25+ refs',  val:'2.0×', lbl:'Shadow Heir',   border:'var(--gold)',       color:'var(--gold)' },
  ];
  const antiFarm = [
    'New accounts <7 days old = 50% point reduction',
    'Referral only valid if referee completes ≥1 task',
    'Same IP = referral flagged, points frozen',
    'Max 3 accounts/wallet address',
    'Duplicate Telegram IDs automatically rejected',
  ];

  return (
    <div className="kk-page">
      <div className="kk-container">
        <div className="kk-section-head">
          <span className="kk-section-kanji">経</span>
          <div>
            <div className="kk-section-title">Point Economy</div>
            <div className="kk-section-sub">Complete system design · 133.3M $KOKO Quest Pool</div>
          </div>
        </div>

        <div className="kk-formula">
          <div style={{color:'var(--dim)',fontSize:'0.65rem',marginBottom:'0.5rem'}}>// FINAL REWARD FORMULA</div>
          <div><span className="hl">user_reward</span> = (user_points / total_points) × reward_pool × multiplier</div>
          <br />
          <div className="cm">// reward_pool = 133,333,332 $KOKO (Quest Pool)</div>
          <div className="cm">// multiplier  = 1.0 to 2.0 (based on referrals + leaderboard rank)</div>
          <div className="cm">// snapshot    = taken at TGE announcement</div>
        </div>

        <div className="kk-grid-2" style={{marginBottom:'1.5rem'}}>
          <div className="kk-card">
            <div className="kk-card-label" style={{marginBottom:'1rem'}}>Task Categories & Points</div>
            <table className="kk-table">
              <thead><tr><th>Task</th><th>Cat</th><th>Pts</th><th>Limit</th></tr></thead>
              <tbody>
                {tableRows.map(([task,cat,pts,limit]) => (
                  <tr key={task}>
                    <td>{task}</td>
                    <td><span className="kk-cat">{cat}</span></td>
                    <td style={{color: cat === 'purchase' ? 'var(--red)' : cat === 'referral' ? 'var(--jade-bright)' : 'var(--gold)'}}>{pts}</td>
                    <td style={{color:'var(--dim)'}}>{limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="kk-card" style={{marginBottom:'1rem'}}>
              <div className="kk-card-label" style={{marginBottom:'0.8rem'}}>Daily Point Caps</div>
              <table className="kk-table">
                <thead><tr><th>Category</th><th>Max/Day</th></tr></thead>
                <tbody>
                  {capRows.map(([cat,max,color]) => (
                    <tr key={cat}><td>{cat}</td><td style={{color}}>{max}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="kk-card">
              <div className="kk-card-label" style={{marginBottom:'0.8rem'}}>Anti-Farm Rules</div>
              {antiFarm.map((r,i) => (
                <div key={i} className="kk-notif">
                  <span className="kk-notif-icon">—</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="kk-section-head" style={{marginTop:'2rem'}}>
          <span className="kk-section-kanji">×</span>
          <div>
            <div className="kk-section-title">Multiplier Logic</div>
            <div className="kk-section-sub">Referral count + leaderboard rank at snapshot</div>
          </div>
        </div>
        <div className="kk-mult-grid">
          {multCards.map(m => (
            <div key={m.refs} className="kk-mult-card" style={{borderColor:m.border}}>
              <div className="kk-mult-refs">{m.refs}</div>
              <div className="kk-mult-val" style={{color:m.color}}>{m.val}</div>
              <div className="kk-mult-lbl">{m.lbl}</div>
            </div>
          ))}
        </div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.65rem',color:'var(--dim)',marginTop:'0.5rem'}}>
          + Leaderboard bonus: #1 = 2×, #2 = 1.5×, #3 = 1.25× (applied at snapshot, stacks with referral mult)
        </div>
      </div>
    </div>
  );
}

function BotPage() {
  const codeBlocks = [
    { label: 'schema.js', code: `<span class="ck">const</span> User = {
  <span class="cs">telegramId</span>:    <span class="cn">String</span>,   <span class="cc">// unique</span>
  <span class="cs">username</span>:      <span class="cn">String</span>,
  <span class="cs">wallet</span>:        <span class="cn">String</span>,   <span class="cc">// Solana addr</span>
  <span class="cs">points</span>:        <span class="cn">0</span>,
  <span class="cs">dailyPoints</span>:   <span class="cn">0</span>,       <span class="cc">// resets daily</span>
  <span class="cs">referredBy</span>:    <span class="cn">String</span>,
  <span class="cs">referrals</span>:     <span class="cn">[]</span>,
  <span class="cs">streak</span>:        <span class="cn">0</span>,
  <span class="cs">lastCheckin</span>:   <span class="cn">Date</span>,
  <span class="cs">multiplier</span>:    <span class="cn">1.0</span>,
  <span class="cs">completedTasks</span>: <span class="cn">Set</span>,
  <span class="cs">joinedAt</span>:      <span class="cn">Date</span>,
  <span class="cs">ipHash</span>:        <span class="cn">String</span>,
  <span class="cs">flagged</span>:       <span class="cn">false</span>,
}` },
    { label: 'bot.js', code: `bot.<span class="cf">onText</span>(<span class="cs">/\\/start(?:\\s+(.+))?/</span>, <span class="ck">async</span> (msg, match) => {
  <span class="ck">const</span> tgId    = msg.from.id
  <span class="ck">const</span> refCode = match[<span class="cn">1</span>]

  <span class="ck">let</span> user = <span class="ck">await</span> <span class="cf">getUser</span>(tgId)
  <span class="ck">if</span> (!user) {
    user = <span class="cf">createUser</span>(tgId, msg.from)
    <span class="ck">if</span> (refCode) {
      <span class="ck">const</span> referrer = <span class="ck">await</span> <span class="cf">getUserByRef</span>(refCode)
      <span class="ck">if</span> (referrer && !<span class="cf">sameIP</span>(referrer, user)) {
        user.referredBy = referrer.telegramId
        <span class="cf">scheduleReferralReward</span>(referrer.telegramId, tgId)
      }
    }
    <span class="ck">await</span> <span class="cf">saveUser</span>(user)
  }
  <span class="cf">sendWelcome</span>(tgId, user)
})` },
    { label: 'tasks.js', code: `<span class="ck">async function</span> <span class="cf">completeTask</span>(userId, taskId) {
  <span class="ck">const</span> user = <span class="ck">await</span> <span class="cf">getUser</span>(userId)
  <span class="ck">const</span> task = TASKS[taskId]

  <span class="ck">if</span> (user.flagged)                    <span class="ck">return</span> <span class="cs">'FLAGGED'</span>
  <span class="ck">if</span> (user.completedTasks.<span class="cf">has</span>(taskId)) <span class="ck">return</span> <span class="cs">'DONE'</span>
  <span class="ck">if</span> (user.dailyPoints >= <span class="cn">1000</span>)        <span class="ck">return</span> <span class="cs">'CAP'</span>
  <span class="ck">if</span> (!<span class="ck">await</span> <span class="cf">verifyTask</span>(user, task))    <span class="ck">return</span> <span class="cs">'UNVERIFIED'</span>

  <span class="ck">const</span> pts = <span class="cf">calcPoints</span>(task, user)
  user.points      += pts
  user.dailyPoints += pts
  user.completedTasks.<span class="cf">add</span>(taskId)
  <span class="ck">await</span> <span class="cf">saveUser</span>(user)
  <span class="cf">updateMultiplier</span>(user)
  <span class="ck">return</span> { pts, total: user.points }
}` },
    { label: 'referral.js', code: `<span class="ck">async function</span> <span class="cf">activateReferral</span>(referrerId, newUserId) {
  <span class="ck">const</span> newUser = <span class="ck">await</span> <span class="cf">getUser</span>(newUserId)
  <span class="ck">if</span> (newUser.completedTasks.size === <span class="cn">0</span>) <span class="ck">return</span>

  <span class="ck">const</span> ref = <span class="ck">await</span> <span class="cf">getUser</span>(referrerId)
  ref.referrals.<span class="cf">push</span>(newUserId)
  ref.points += <span class="cn">60</span>
  <span class="cf">updateMultiplier</span>(ref)
  <span class="ck">await</span> <span class="cf">saveUser</span>(ref)
}

<span class="ck">function</span> <span class="cf">updateMultiplier</span>(user) {
  <span class="ck">const</span> r = user.referrals.length
  <span class="ck">if</span>      (r >= <span class="cn">25</span>) user.multiplier = <span class="cn">2.0</span>
  <span class="ck">else if</span> (r >= <span class="cn">10</span>) user.multiplier = <span class="cn">1.5</span>
  <span class="ck">else if</span> (r >=  <span class="cn">3</span>) user.multiplier = <span class="cn">1.2</span>
  <span class="ck">else</span>              user.multiplier = <span class="cn">1.0</span>
}` },
    { label: 'purchase.js', code: `<span class="cc">// Called via Helio webhook</span>
<span class="ck">async function</span> <span class="cf">onPurchase</span>(telegramId, usdAmount) {
  <span class="ck">const</span> user = <span class="ck">await</span> <span class="cf">getUser</span>(telegramId)

  <span class="ck">let</span> pts = <span class="cn">0</span>
  <span class="ck">if</span>      (usdAmount >= <span class="cn">100</span>) pts = <span class="cn">2000</span>
  <span class="ck">else if</span> (usdAmount >=  <span class="cn">25</span>) pts = <span class="cn">500</span>
  <span class="ck">else if</span> (usdAmount >=   <span class="cn">5</span>) pts = <span class="cn">100</span>

  <span class="ck">if</span> (PHASE === <span class="cs">'shadow'</span>) pts = Math.<span class="cf">floor</span>(pts * <span class="cn">1.3</span>)
  user.points += pts
  user.completedTasks.<span class="cf">add</span>(<span class="cs">'purchase'</span>)
  <span class="ck">await</span> <span class="cf">saveUser</span>(user)
  bot.<span class="cf">sendMessage</span>(telegramId, \`⬡ +\${pts} $KOKO points awarded.\`)
}` },
    { label: 'checkin.js', code: `<span class="ck">const</span> STREAK_PTS = [<span class="cn">10</span>,<span class="cn">15</span>,<span class="cn">20</span>,<span class="cn">30</span>,<span class="cn">50</span>,<span class="cn">75</span>,<span class="cn">100</span>]

<span class="ck">async function</span> <span class="cf">dailyCheckin</span>(userId) {
  <span class="ck">const</span> user = <span class="ck">await</span> <span class="cf">getUser</span>(userId)
  <span class="ck">const</span> now  = <span class="ck">new</span> <span class="cf">Date</span>()

  <span class="ck">if</span> (<span class="cf">sameDay</span>(user.lastCheckin, now)) <span class="ck">return</span> <span class="cs">'ALREADY_DONE'</span>

  <span class="ck">const</span> consecutive = <span class="cf">isYesterday</span>(user.lastCheckin)
  user.streak = consecutive ? user.streak + <span class="cn">1</span> : <span class="cn">1</span>

  <span class="ck">const</span> pts = STREAK_PTS[Math.<span class="cf">min</span>(user.streak - <span class="cn">1</span>, <span class="cn">6</span>)]
  user.points      += pts
  user.dailyPoints += pts
  user.lastCheckin  = now
  <span class="ck">await</span> <span class="cf">saveUser</span>(user)
  <span class="ck">return</span> { pts, streak: user.streak }
}` },
  ];

  const commands = [
    ['/start [ref_code]', '/stats', '/checkin'],
    ['/tasks', '/referral', '/leaderboard'],
    ['/wallet [address]', '/estimate', '/help'],
  ];

  return (
    <div className="kk-page">
      <div className="kk-container">
        <div className="kk-section-head">
          <span className="kk-section-kanji">影</span>
          <div>
            <div className="kk-section-title">Bot Logic</div>
            <div className="kk-section-sub">Node.js · @KokoKairokuBot · Pseudocode + Structure</div>
          </div>
        </div>
        <div className="kk-grid-2">
          {codeBlocks.map(b => (
            <div key={b.label}>
              <div className="kk-code">
                <span className="kk-code-label">{b.label}</span>
                <div dangerouslySetInnerHTML={{__html: b.code}} />
              </div>
            </div>
          ))}
        </div>
        <div className="kk-divider" />
        <div className="kk-card">
          <div className="kk-card-label" style={{marginBottom:'1rem'}}>Bot Command Map</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.5rem'}}>
            {commands.map((col, ci) => (
              <div key={ci} style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                {col.map(cmd => (
                  <div key={cmd} className="kk-notif">
                    <span className="kk-notif-icon">›</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.72rem'}}>{cmd}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AirdropDashboard() {
  const [user, setUser] = useState(() => {
    const u = loadUser();
    const pre = ALL_TASKS.filter(t => t.preCompleted).map(t => t.id);
    const merged = [...new Set([...u.completedTasks, ...pre])];
    return { ...u, completedTasks: merged };
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState({ msg: '', show: false });
  const toastTimer = useRef(null);

  // Stable referral link per session
  const refLink = useRef(
    `t.me/KokoKairokuBot/Koko?start=ref_${Math.random().toString(36).slice(2,10).toUpperCase()}`
  ).current;

  // Inject CSS once
  useEffect(() => {
    if (!document.getElementById('kk-styles')) {
      const el = document.createElement('style');
      el.id = 'kk-styles';
      el.textContent = CSS;
      document.head.appendChild(el);
    }
  }, []);

  // Persist on change
  useEffect(() => { saveUser(user); }, [user]);

  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  }, []);

  const handleComplete = useCallback((task) => {
    setUser(prev => {
      if (prev.completedTasks.includes(task.id)) return prev;
      const earned = Math.round(task.pts * prev.multiplier);
      const newCompleted = [...prev.completedTasks, task.id];
      const newRank = Math.max(1, prev.rank - Math.floor(Math.random() * 3 + 1));
      showToast(`+${earned} pts earned · Awaiting verification`);
      return {
        ...prev,
        points: prev.points + earned,
        completedTasks: newCompleted,
        rank: newRank,
      };
    });
  }, [showToast]);

  const handleCopyRef = useCallback(() => {
    navigator.clipboard?.writeText(refLink).catch(() => {});
    showToast('Referral link copied ⬡');
  }, [showToast, refLink]);

  const handleAddReferral = useCallback(() => {
    setUser(prev => {
      const newRefs = prev.referrals + 1;
      const newMult = calcMultiplier(newRefs);
      showToast(`+100 pts · Referral #${newRefs} activated`);
      return {
        ...prev,
        referrals: newRefs,
        points: prev.points + 100,
        multiplier: newMult,
        rank: Math.max(1, prev.rank - 5),
      };
    });
  }, [showToast]);

  const handleCheckin = useCallback(() => {
    const today = new Date().toDateString();
    setUser(prev => {
      if (prev.lastCheckin === today) {
        showToast('Already checked in today');
        return prev;
      }
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const consecutive = prev.lastCheckin === yesterday.toDateString();
      const newStreak = consecutive ? prev.streak + 1 : 1;
      const pts = STREAK_PTS[Math.min(newStreak - 1, STREAK_PTS.length - 1)];
      showToast(`+${pts} pts · Day ${newStreak} streak`);
      return {
        ...prev,
        streak: newStreak,
        lastCheckin: today,
        points: prev.points + pts,
      };
    });
  }, [showToast]);

  const tabs = ['dashboard', 'tasks', 'economy', 'bot'];
  const tabLabels = { dashboard: 'Dashboard', tasks: 'Tasks', economy: 'Economy', bot: 'Bot Logic' };

  // Hide top nav inside Telegram webview
  const inTelegram = typeof window !== 'undefined' && !!window.Telegram?.WebApp?.initData;

  return (
    <div className="kk-root">
      <div className="kk-grain" />
      <div className="kk-ambient" />

      {/* TOP NAV — hidden inside Telegram */}
      {!inTelegram && (
        <nav className="kk-nav">
          <div className="kk-nav-brand">
            <span className="kk-kanji-lg">影</span>
            <div>
              <div className="kk-nav-title">Kairoku World</div>
              <div className="kk-nav-sub">$KOKO · Airdrop System</div>
            </div>
          </div>
          <div className="kk-nav-tabs">
            {tabs.map(t => (
              <button
                key={t}
                className={`kk-tab${activeTab === t ? ' active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {tabLabels[t]}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* INLINE TAB STRIP — shown only inside Telegram */}
      {inTelegram && (
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(10,10,12,0.95)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                borderBottom: activeTab === t ? '2px solid var(--gold)' : '2px solid transparent',
                color: activeTab === t ? 'var(--gold)' : 'var(--dim)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.75rem 0.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tabLabels[t]}
            </button>
          ))}
        </div>
      )}

      {/* PAGES */}
      {activeTab === 'dashboard' && <DashboardPage user={user} onComplete={handleComplete} onCopyRef={handleCopyRef} onCheckin={handleCheckin} onAddReferral={handleAddReferral} refLink={refLink} />}
      {activeTab === 'tasks'     && <TasksPage     user={user} onComplete={handleComplete} />}
      {activeTab === 'economy'   && <EconomyPage   user={user} />}
      {activeTab === 'bot'       && <BotPage />}

      {/* TOAST */}
      <div className={`kk-toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>
    </div>
  );
}
