import { useState, useMemo } from "react";
import { useUser } from '../hooks/useUser'
import { calcTokens, fmt, TASK_POINTS, REFERRAL_CAP } from '../lib/tg'

// ── VillageBadge (inlined) ────────────────────────────────────────────

const TIERS = [
  { min: 1,  max: 10, name: "Initiate",       color: "#8a7a5a", glow: "rgba(138,122,90,0.15)",  bg: "linear-gradient(160deg,#1a1810 0%,#0f0e09 100%)" },
  { min: 11, max: 25, name: "Villager",        color: "#c8a96e", glow: "rgba(200,169,110,0.18)", bg: "linear-gradient(160deg,#1e1c10 0%,#111009 100%)" },
  { min: 26, max: 50, name: "Shadow Disciple", color: "#9eada8", glow: "rgba(158,173,168,0.15)", bg: "linear-gradient(160deg,#141c1a 0%,#0a100f 100%)" },
  { min: 51, max: 75, name: "Elite Shadow",    color: "#a892c8", glow: "rgba(168,146,200,0.18)", bg: "linear-gradient(160deg,#18141e 0%,#0e0a14 100%)" },
  { min: 76, max: 99, name: "Kairoku Master",  color: "#d4b870", glow: "rgba(212,184,112,0.22)", bg: "linear-gradient(160deg,#1e1a0a 0%,#130f06 100%)" },
];

function getTier(level) {
  return TIERS.find(t => level >= t.min && level <= t.max) || TIERS[0];
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

const Diamond = ({ size = 7, color }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill={color}>
    <polygon points="5,0 10,5 5,10 0,5" />
  </svg>
);

const CornerAccents = ({ color }) => {
  const c = { position: "absolute", width: 10, height: 10 };
  const line = { position: "absolute", background: color, borderRadius: 1 };
  return (
    <>
      <div style={{ ...c, top: 8, left: 8 }}>
        <div style={{ ...line, width: 10, height: 1.5, top: 0, left: 0 }} />
        <div style={{ ...line, width: 1.5, height: 10, top: 0, left: 0 }} />
      </div>
      <div style={{ ...c, top: 8, right: 8 }}>
        <div style={{ ...line, width: 10, height: 1.5, top: 0, right: 0 }} />
        <div style={{ ...line, width: 1.5, height: 10, top: 0, right: 0 }} />
      </div>
      <div style={{ ...c, bottom: 8, left: 8 }}>
        <div style={{ ...line, width: 10, height: 1.5, bottom: 0, left: 0 }} />
        <div style={{ ...line, width: 1.5, height: 10, bottom: 0, left: 0 }} />
      </div>
      <div style={{ ...c, bottom: 8, right: 8 }}>
        <div style={{ ...line, width: 10, height: 1.5, bottom: 0, right: 0 }} />
        <div style={{ ...line, width: 1.5, height: 10, bottom: 0, right: 0 }} />
      </div>
    </>
  );
};

function VillageBadge({ level = 18 }) {
  const tier = useMemo(() => getTier(level), [level]);
  const gold = tier.color;
  const goldMid = `rgba(${hexToRgb(gold)},0.35)`;
  return (
    <div style={{
      position: "relative", width: 140, background: tier.bg,
      border: `1px solid ${goldMid}`, borderRadius: 10, padding: "18px 14px 16px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
      boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.6)`,
      userSelect: "none",
    }}>
      <CornerAccents color={goldMid} />
      <div style={{ marginBottom: 10 }}><Diamond size={8} color={goldMid} /></div>
      <div style={{ position: "relative", width: 82, height: 82, marginBottom: 14 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1.5px solid ${goldMid}`, background: `radial-gradient(circle at 40% 35%, rgba(${hexToRgb(gold)},0.08), rgba(0,0,0,0.6))` }} />
        <div style={{ position: "absolute", inset: 6, borderRadius: "50%", border: `1px solid rgba(${hexToRgb(gold)},0.18)` }} />
        {[
          { top: -5, left: "50%", transform: "translateX(-50%)" },
          { bottom: -5, left: "50%", transform: "translateX(-50%)" },
          { left: -5, top: "50%", transform: "translateY(-50%)" },
          { right: -5, top: "50%", transform: "translateY(-50%)" },
        ].map((pos, i) => (
          <div key={i} style={{ position: "absolute", ...pos }}><Diamond size={10} color={gold} /></div>
        ))}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Noto Serif JP', serif", fontSize: 36, fontWeight: 700, color: gold,
          textShadow: `0 0 20px ${tier.glow}`, lineHeight: 1,
        }}>影</div>
      </div>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: tier.name.length > 12 ? 10 : 12, fontWeight: 500, color: gold, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center", marginBottom: 8, lineHeight: 1.3 }}>
        {tier.name}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, width: "100%" }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${goldMid})` }} />
        <Diamond size={5} color={goldMid} />
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${goldMid}, transparent)` }} />
      </div>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: `rgba(${hexToRgb(gold)},0.65)`, letterSpacing: "0.18em", textTransform: "uppercase" }}>LV {level}</div>
      <div style={{ marginTop: 10 }}><Diamond size={8} color={goldMid} /></div>
    </div>
  );
}

// ── ProfileScreen ─────────────────────────────────────────────────────

const C = {
  bg: "#0a0a0c", bg2: "#0f0f13", panel: "#141418", panel2: "#1a1a20",
  border: "rgba(200,169,110,0.10)", border2: "rgba(200,169,110,0.20)",
  gold: "#c8a96e", goldDim: "rgba(200,169,110,0.50)", goldFaint: "rgba(200,169,110,0.10)",
  text: "#eeeef5", textDim: "#8888a0", textMuted: "#52526a",
  green: "#4a9a6a", greenDim: "rgba(74,154,106,0.18)",
};

const s = {
  app: { maxWidth: 420, margin: "0 auto", background: C.bg, fontFamily: "'Space Mono', monospace", paddingBottom: 80, color: C.text, WebkitFontSmoothing: "antialiased" },
  card: { margin: "0 16px 10px", background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 },
};

const Icon = ({ size = 16, vb = "0 0 24 24", children }) => (
  <svg width={size} height={size} viewBox={vb} fill="none" stroke="currentColor" strokeWidth={1.8} style={{ flexShrink: 0 }}>{children}</svg>
);

const CheckIcon = ({ size = 9 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>
);

const CircleIcon = ({ size = 9 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /></svg>
);

const StatBar = ({ pct }) => (
  <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1, overflow: "hidden", marginTop: 8 }}>
    <div style={{ height: "100%", width: `${Math.min(100, pct)}%`, background: `linear-gradient(90deg, rgba(200,169,110,0.45), rgba(200,169,110,0.8))`, borderRadius: 1 }} />
  </div>
);

const CardTitle = ({ icon, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
    <span style={{ color: C.goldDim }}>{icon}</span>
    <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 500, color: C.gold, letterSpacing: "0.06em" }}>{label}</span>
  </div>
);

const TaskRow = ({ icon, name, kp, done }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderBottom: `1px solid rgba(200,169,110,0.06)` }}>
    <div style={{ width: 28, height: 28, borderRadius: 6, background: C.bg2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: C.textMuted }}>{icon}</div>
    <div style={{ flex: 1, fontSize: 11, color: C.textDim, letterSpacing: "0.02em", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
    <div style={{ fontSize: 10, color: C.goldDim, letterSpacing: "0.04em", flexShrink: 0 }}>{kp}</div>
    <div style={{
      display: "flex", alignItems: "center", gap: 4, borderRadius: 5, padding: "5px 8px",
      fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0,
      background: done ? C.greenDim : C.goldFaint,
      border: `1px solid ${done ? "rgba(74,154,106,0.25)" : "rgba(200,169,110,0.18)"}`,
      color: done ? "#5ab87a" : C.goldDim,
    }}>
      {done ? <CheckIcon /> : <CircleIcon />}
      {done ? "Done" : "Pending"}
    </div>
  </div>
);

function navigate(tab) {
  window.dispatchEvent(new CustomEvent('navigate', { detail: { tab } }))
}

export default function ProfileScreen() {
  const { user, refCount, loading } = useUser()
  const [copied, setCopied] = useState(false)

  if (loading || !user) return (
    <div style={{ ...s.app, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 32, color: C.gold, opacity: 0.4 }}>影</div>
    </div>
  )

  // Derive live values from user state
  const tasksCompleted = ['joined_telegram','followed_x','retweeted','lore_answered'].filter(t => user[t]).length
  const totalTasks     = 4
  const tokens         = calcTokens(user.points)
  const userLevel      = Math.min(99, Math.max(1, Math.floor(user.points / 500_000) + 1))
  const refLink        = `https://t.me/${import.meta.env.VITE_BOT_USERNAME ?? 'KokoBot'}?start=${user.referral_code}`

  function handleCopy() {
    try { navigator.clipboard?.writeText(refLink).catch(() => {}) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={s.app}>
      {/* ── HEADER ── */}
      <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#12100a 0%,#0a0a0c 100%)", borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.22em", color: C.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Shadow Villager</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 600, color: C.gold, letterSpacing: "0.04em", lineHeight: 1.2 }}>
                {user.username ? `@${user.username}` : user.first_name}
              </div>
              <div style={{ fontSize: 9, color: C.textMuted, marginTop: 5, letterSpacing: "0.06em" }}>
                ID: {user.telegram_id}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, fontSize: 9, color: C.textDim, letterSpacing: "0.1em" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4a9a6a", boxShadow: "0 0 6px rgba(74,154,106,0.6)" }} />
                  Active
                </div>
                <div style={{ width: 1, height: 14, background: C.border }} />
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(200,169,110,0.5)"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                  Farming
                </div>
              </div>
            </div>
            <div style={{ flexShrink: 0, transform: "scale(0.78)", transformOrigin: "top right", marginBottom: "-22%" }}>
              <VillageBadge level={userLevel} />
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "10px 16px 10px" }}>
        {[
          {
            icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(200,169,110,0.5)"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
            label: "Total KP",
            value: user.points >= 1_000_000 ? `${(user.points/1_000_000).toFixed(1)}M` : user.points >= 1_000 ? `${(user.points/1_000).toFixed(1)}K` : String(user.points),
            sub: "Kairoku Points",
            pct: Math.min(100, (user.points / 30_000_000) * 100),
          },
          {
            icon: <Icon size={12} vb="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>,
            label: "Referrals",
            value: String(refCount),
            sub: refCount < 5 ? `Next bonus: 5` : 'Bonus active',
            pct: (refCount / REFERRAL_CAP) * 100,
          },
          {
            icon: <Icon size={12} vb="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>,
            label: "Tasks",
            value: `${tasksCompleted}/${totalTasks}`,
            sub: tasksCompleted >= totalTasks ? 'All done' : 'In progress',
            pct: (tasksCompleted / totalTasks) * 100,
          },
        ].map(({ icon, label, value, sub, pct }) => (
          <div key={label} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 12px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, color: C.goldDim }}>
              {icon}
              <span style={{ fontSize: 8, letterSpacing: "0.14em", color: C.textMuted, textTransform: "uppercase" }}>{label}</span>
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: value.includes("/") ? 20 : 24, fontWeight: 600, color: C.text, lineHeight: 1, marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", color: C.textMuted, textTransform: "uppercase" }}>{sub}</div>
            <StatBar pct={pct} />
          </div>
        ))}
      </div>

      {/* ── WALLET ── */}
      <div style={s.card}>
        <CardTitle label="Wallet" icon={<Icon size={16} vb="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></Icon>} />
        <div style={{ fontSize: 9, letterSpacing: "0.12em", color: C.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Connected Wallet</div>
        {user.wallet_address ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ background: C.bg2, border: `1px solid ${C.border2}`, borderRadius: 6, padding: "10px 14px", fontSize: 11, color: C.textDim, letterSpacing: "0.04em", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.wallet_address.slice(0, 8)}…{user.wallet_address.slice(-6)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(200,169,110,0.07)", border: `1px solid rgba(200,169,110,0.2)`, borderRadius: 6, padding: "10px 12px", fontSize: 9, letterSpacing: "0.14em", color: C.goldDim, textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0 }}>
                <Icon size={11} vb="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>
                Locked
              </div>
            </div>
            <div style={{ fontSize: 9, color: C.textDim, lineHeight: 1.7 }}>Wallet address is permanent and cannot be changed.</div>
            <div style={{ fontSize: 9, color: C.goldDim, marginTop: 3 }}>Used for token distribution.</div>
          </>
        ) : (
          <div
            onClick={() => navigate('tasks')}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", background: C.bg2, border: `1px solid ${C.border2}`, borderRadius: 8, fontSize: 11, color: C.goldDim }}
          >
            <Icon size={13} vb="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
            Submit wallet in Tasks →
          </div>
        )}
      </div>

      {/* ── TOKENS + REFERRAL ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "0 16px 10px" }}>
        {/* Tokens */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.goldDim }}>
              <Icon size={15} vb="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></Icon>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 500, color: C.gold, letterSpacing: "0.06em" }}>Tokens</span>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #3a2e10, #1a1508)", border: `1px solid rgba(200,169,110,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Serif JP', serif", fontSize: 15, color: "rgba(200,169,110,0.7)", flexShrink: 0 }}>影</div>
          </div>
          <div style={{ fontSize: 8, letterSpacing: "0.12em", color: C.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Allocated Tokens</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 14 }}>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 30, fontWeight: 600, color: C.gold, lineHeight: 1 }}>{tokens.toLocaleString()}</span>
            <span style={{ fontSize: 11, color: C.goldDim, letterSpacing: "0.08em" }}>$KOKO</span>
          </div>
          <button
            onClick={() => navigate('token')}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(200,169,110,0.06)", border: `1px solid rgba(200,169,110,0.16)`, borderRadius: 6, padding: 9, fontSize: 8, letterSpacing: "0.12em", color: C.goldDim, textTransform: "uppercase", cursor: "pointer", width: "100%", fontFamily: "'Space Mono', monospace", boxSizing: "border-box" }}
          >
            <Icon size={11} vb="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></Icon>
            View Token Details
          </button>
        </div>

        {/* Referral */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
          <CardTitle label="Your Referral Link" icon={<Icon size={14} vb="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></Icon>} />
          <div style={{ display: "flex", alignItems: "center", background: C.bg2, border: `1px solid ${C.border2}`, borderRadius: 6, paddingLeft: 10, marginBottom: 10, overflow: "hidden" }}>
            <span style={{ flex: 1, fontSize: 9, color: C.textDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {refLink}
            </span>
            <button
              onClick={handleCopy}
              style={{ background: copied ? "rgba(74,154,106,0.12)" : "rgba(200,169,110,0.08)", border: "none", borderLeft: `1px solid ${C.border2}`, padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s", color: copied ? C.green : C.goldDim }}
            >
              {copied
                ? <CheckIcon size={13} />
                : <Icon size={13} vb="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></Icon>
              }
            </button>
          </div>
          <div style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.06em", marginBottom: 10 }}>Invite more villagers. Earn more KP.</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, letterSpacing: "0.08em", color: C.goldDim }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(200,169,110,0.5)"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            +{fmt(TASK_POINTS.referral)} KP per referral
          </div>
        </div>
      </div>

      {/* ── TASKS ── */}
      <div style={{ margin: "0 16px 10px", background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 18px 14px", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ color: C.goldDim }}>
            <Icon size={16} vb="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Icon>
          </span>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 500, color: C.gold, letterSpacing: "0.06em" }}>Task Progress</span>
        </div>

        <TaskRow
          done={user.joined_telegram}
          icon={<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" /></svg>}
          name="Join Telegram" kp={`+${fmt(TASK_POINTS.joined_telegram)} KP`}
        />
        <TaskRow
          done={user.followed_x}
          icon={<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>}
          name="Follow on X" kp={`+${fmt(TASK_POINTS.followed_x)} KP`}
        />
        <TaskRow
          done={user.retweeted}
          icon={<Icon size={14} vb="0 0 24 24"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></Icon>}
          name="Retweet Post" kp={`+${fmt(TASK_POINTS.retweeted)} KP`}
        />
        <TaskRow
          done={user.lore_answered}
          icon={<Icon size={14} vb="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></Icon>}
          name="Lore Question" kp={`+${fmt(TASK_POINTS.lore_answered)} KP`}
        />
        <TaskRow
          done={!!user.wallet_address}
          icon={<Icon size={14} vb="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></Icon>}
          name="Wallet Submitted" kp="Permanent"
        />

        <div
          onClick={() => navigate('tasks')}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderTop: `1px solid ${C.border}`, fontSize: 9, letterSpacing: "0.16em", color: C.goldDim, textTransform: "uppercase", cursor: "pointer", background: "rgba(200,169,110,0.02)" }}
        >
          View All Tasks
          <Icon size={12} vb="0 0 24 24"><polyline points="9 18 15 12 9 6" /></Icon>
        </div>
      </div>

    </div>
  );
}
