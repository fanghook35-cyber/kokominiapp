import { useState } from "react";
import VillageBadge from "../components/VillageBadge";

const C = {
  bg:        "#0a0a0c",
  bg2:       "#0f0f13",
  panel:     "#141418",
  panel2:    "#1a1a20",
  border:    "rgba(200,169,110,0.10)",
  border2:   "rgba(200,169,110,0.20)",
  gold:      "#c8a96e",
  goldDim:   "rgba(200,169,110,0.50)",
  goldFaint: "rgba(200,169,110,0.10)",
  text:      "#eeeef5",
  textDim:   "#8888a0",
  textMuted: "#52526a",
  green:     "#4a9a6a",
  greenDim:  "rgba(74,154,106,0.18)",
};

const s = {
  app: {
    maxWidth: 420,
    margin: "0 auto",
    minHeight: "100vh",
    background: C.bg,
    fontFamily: "'Space Mono', monospace",
    paddingBottom: 80,
    color: C.text,
    WebkitFontSmoothing: "antialiased",
  },
  card: {
    margin: "0 16px 10px",
    background: C.panel,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: 18,
  },
};

// ── Icons ────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, fill = false, stroke = "currentColor", vb = "0 0 24 24", children }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill ? "currentColor" : "none"}
    stroke={fill ? "none" : stroke} strokeWidth={1.8} style={{ flexShrink: 0 }}>
    {d ? <path d={d} /> : children}
  </svg>
);

const CheckIcon = ({ size = 9 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CircleIcon = ({ size = 9 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
  </svg>
);

// ── Koko Cat Avatar SVG ──────────────────────────────────────────────
const KokoAvatar = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56">
    <ellipse cx="40" cy="48" rx="22" ry="24" fill="#1a1a2a" />
    <ellipse cx="40" cy="32" rx="18" ry="17" fill="#1e1e2e" />
    <polygon points="25,20 18,6 32,16" fill="#1e1e2e" />
    <polygon points="55,20 62,6 48,16" fill="#1e1e2e" />
    <polygon points="26,19 20,9 30,17" fill="#2a2040" />
    <polygon points="54,19 60,9 50,17" fill="#2a2040" />
    <ellipse cx="33" cy="30" rx="4" ry="4.5" fill="#0a0a14" />
    <ellipse cx="47" cy="30" rx="4" ry="4.5" fill="#0a0a14" />
    <circle cx="33" cy="29" r="1.5" fill="rgba(200,169,110,0.6)" />
    <circle cx="47" cy="29" r="1.5" fill="rgba(200,169,110,0.6)" />
    <line x1="38" y1="26" x2="35" y2="34" stroke="rgba(200,169,110,0.4)" strokeWidth="1" />
    <ellipse cx="40" cy="36" rx="2" ry="1.2" fill="#2a2040" />
    <path d="M18 58 Q40 50 62 58 L66 80 H14 Z" fill="#141420" />
    <rect x="56" y="36" width="2" height="28" rx="1" fill="rgba(200,169,110,0.3)"
      transform="rotate(-15 57 48)" />
  </svg>
);

const BadgeKoko = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <ellipse cx="20" cy="18" rx="10" ry="9" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <polygon points="14,13 10,5 17,11" fill="currentColor" opacity="0.7" />
    <polygon points="26,13 30,5 23,11" fill="currentColor" opacity="0.7" />
    <ellipse cx="16" cy="16" rx="2.5" ry="2.8" fill="currentColor" opacity="0.8" />
    <ellipse cx="24" cy="16" rx="2.5" ry="2.8" fill="currentColor" opacity="0.8" />
    <path d="M10 26 Q20 22 30 26 L32 36 H8 Z" fill="currentColor" opacity="0.5" />
  </svg>
);

// ── Sub-components ───────────────────────────────────────────────────
const StatBar = ({ pct }) => (
  <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1, overflow: "hidden", marginTop: 8 }}>
    <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, rgba(200,169,110,0.45), rgba(200,169,110,0.8))`, borderRadius: 1 }} />
  </div>
);

const CardTitle = ({ icon, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
    <span style={{ color: C.goldDim }}>{icon}</span>
    <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 500, color: C.gold, letterSpacing: "0.06em" }}>{label}</span>
  </div>
);

const TaskRow = ({ icon, name, kp, done }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", borderBottom: `1px solid rgba(200,169,110,0.06)` }}>
    <div style={{ width: 28, height: 28, borderRadius: 6, background: C.bg2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: C.textMuted }}>
      {icon}
    </div>
    <div style={{ flex: 1, fontSize: 11, color: C.textDim, letterSpacing: "0.02em" }}>{name}</div>
    <div style={{ fontSize: 10, color: C.goldDim, letterSpacing: "0.06em", flexShrink: 0 }}>{kp}</div>
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      borderRadius: 5, padding: "5px 10px", fontSize: 8, letterSpacing: "0.12em",
      textTransform: "uppercase", flexShrink: 0,
      background: done ? C.greenDim : C.goldFaint,
      border: `1px solid ${done ? "rgba(74,154,106,0.25)" : "rgba(200,169,110,0.18)"}`,
      color: done ? "#5ab87a" : C.goldDim,
    }}>
      {done ? <CheckIcon /> : <CircleIcon />}
      {done ? "Completed" : "Pending"}
    </div>
  </div>
);

const NavItem = ({ icon, label, active }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", position: "relative" }}>
    <span style={{ color: active ? C.gold : C.textMuted }}>{icon}</span>
    <span style={{ fontSize: 8, letterSpacing: "0.12em", color: active ? C.gold : C.textMuted, textTransform: "uppercase" }}>{label}</span>
    {active && <div style={{ position: "absolute", bottom: -10, width: 24, height: 2, background: C.gold, borderRadius: 1 }} />}
  </div>
);

// ── Main Component ───────────────────────────────────────────────────
export default function ProfileScreen() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("kairoku.world/ref/Momoverse01");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Space+Mono:wght@400;700&family=Noto+Serif+JP:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0c; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(200,169,110,0.2); border-radius: 2px; }
      `}</style>

      <div style={s.app}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "20px 20px 16px" }}>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 500, color: C.gold, letterSpacing: "0.06em", marginBottom: 4 }}>Profile</div>
            <div style={{ fontSize: 10, color: C.textDim, letterSpacing: "0.08em" }}>Your village record</div>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 8, background: C.panel, border: `1px solid ${C.border2}`, borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.18em", color: C.goldDim, textTransform: "uppercase" }}>
            <Icon size={14} vb="0 0 24 24">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </Icon>
            Settings
          </button>
        </div>

        {/* ── IDENTITY CARD ── */}
        <div style={{ ...s.card, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "flex-start", position: "relative", overflow: "hidden" }}>
          {/* Kanji watermark */}
          <div style={{ position: "absolute", top: 12, left: 14, fontFamily: "'Noto Serif JP', serif", fontSize: 38, color: "rgba(200,169,110,0.06)", lineHeight: 1, pointerEvents: "none" }}>影</div>

          {/* Avatar */}
          <div style={{ position: "relative", width: 90, flexShrink: 0 }}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", border: `2px solid rgba(200,169,110,0.35)`, background: "radial-gradient(circle at 35% 35%, #2a2a38, #0f0f18)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 4px rgba(200,169,110,0.06), inset 0 0 20px rgba(0,0,0,0.5)`, overflow: "hidden" }}>
              <KokoAvatar />
            </div>
            <div style={{ position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)", background: "#1a1508", border: `1px solid rgba(200,169,110,0.4)`, borderRadius: 6, padding: "2px 10px", textAlign: "center", minWidth: 52 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: C.gold, fontWeight: 600, lineHeight: 1 }}>18</div>
              <div style={{ fontSize: 7, letterSpacing: "0.16em", color: C.goldDim, textTransform: "uppercase" }}>Level</div>
            </div>
          </div>

          {/* Info */}
          <div style={{ paddingTop: 4 }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 500, color: C.text, letterSpacing: "0.04em", marginBottom: 3 }}>Jason</div>
            <div style={{ fontSize: 10, color: C.textDim, letterSpacing: "0.06em", marginBottom: 10 }}>@Momoverse01</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(200,169,110,0.08)", border: `1px solid rgba(200,169,110,0.22)`, borderRadius: 6, padding: "5px 12px", marginBottom: 10 }}>
              <Icon size={12} vb="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></Icon>
              <span style={{ fontSize: 10, letterSpacing: "0.14em", color: C.gold, textTransform: "uppercase", fontWeight: 700 }}>Rank #142</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: C.textDim, letterSpacing: "0.06em" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, boxShadow: "0 0 6px rgba(74,154,106,0.5)" }} />
                Active
              </div>
              <div style={{ width: 1, height: 14, background: C.border2 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: C.textDim }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(200,169,110,0.5)"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                Farming
              </div>
            </div>
          </div>

          {/* Village Badge */}
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
  <VillageBadge level={18} />
</div>

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "0 16px 10px" }}>
          {[
            { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(200,169,110,0.5)"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>, label: "Total KP", value: "3,900", sub: "Kairoku Points", pct: 65 },
            { icon: <Icon size={12} vb="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>, label: "Referrals", value: "1", sub: "Next reward: 5", pct: 20 },
            { icon: <Icon size={12} vb="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>, label: "Tasks", value: "3/4", sub: "In progress", pct: 75 },
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.12em", color: C.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Connected Wallet</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ background: C.bg2, border: `1px solid ${C.border2}`, borderRadius: 6, padding: "10px 14px", fontSize: 11, color: C.textDim, letterSpacing: "0.04em", flex: 1 }}>F48NUFEW...b7jemX</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(200,169,110,0.07)", border: `1px solid rgba(200,169,110,0.2)`, borderRadius: 6, padding: "10px 12px", fontSize: 9, letterSpacing: "0.14em", color: C.goldDim, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  <Icon size={11} vb="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>
                  Locked
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Icon size={22} vb="0 0 24 24" stroke="rgba(200,169,110,0.3)"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>
              <div style={{ fontSize: 10, color: C.textDim, lineHeight: 1.7, marginTop: 6 }}>Wallet address is permanent<br />and cannot be changed.</div>
              <div style={{ fontSize: 9, color: C.goldDim, marginTop: 3 }}>Used for token distribution.</div>
            </div>
          </div>
        </div>

        {/* ── TOKENS + REFERRAL ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "0 16px 10px" }}>
          {/* Tokens */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, position: "relative", overflow: "hidden" }}>
            <CardTitle label="Tokens" icon={<Icon size={15} vb="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></Icon>} />
            {/* Coin */}
            <div style={{ position: "absolute", right: 14, top: 14, width: 42, height: 42, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #3a2e10, #1a1508)", border: `1px solid rgba(200,169,110,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Serif JP', serif", fontSize: 17, color: "rgba(200,169,110,0.7)" }}>影</div>
            <div style={{ fontSize: 8, letterSpacing: "0.12em", color: C.textMuted, textTransform: "uppercase", marginBottom: 6 }}>Allocated Tokens</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 14 }}>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 30, fontWeight: 600, color: C.gold, lineHeight: 1 }}>380</span>
              <span style={{ fontSize: 11, color: C.goldDim, letterSpacing: "0.08em" }}>$KOKO</span>
            </div>
            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(200,169,110,0.06)", border: `1px solid rgba(200,169,110,0.16)`, borderRadius: 6, padding: 9, fontSize: 8, letterSpacing: "0.12em", color: C.goldDim, textTransform: "uppercase", cursor: "pointer", width: "100%", fontFamily: "'Space Mono', monospace" }}>
              <Icon size={11} vb="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></Icon>
              View Token Details
            </button>
          </div>

          {/* Referral */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
            <CardTitle label="Your Referral Link" icon={<Icon size={14} vb="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></Icon>} />
            <div style={{ display: "flex", alignItems: "center", background: C.bg2, border: `1px solid ${C.border2}`, borderRadius: 6, paddingLeft: 10, marginBottom: 10, overflow: "hidden" }}>
              <span style={{ flex: 1, fontSize: 9, color: C.textDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>kairoku.world/ref/Momoverse01</span>
              <button onClick={handleCopy} style={{ background: copied ? "rgba(74,154,106,0.12)" : "rgba(200,169,110,0.08)", border: "none", borderLeft: `1px solid ${C.border2}`, padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s", color: copied ? C.green : C.goldDim }}>
                {copied
                  ? <CheckIcon size={13} />
                  : <Icon size={13} vb="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></Icon>
                }
              </button>
            </div>
            <div style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.06em", marginBottom: 10 }}>Invite more villagers. Earn more KP.</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, letterSpacing: "0.08em", color: C.goldDim }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(200,169,110,0.5)"><path d="M20 12v-2h-2V8a2 2 0 0 0-2-2h-2V4h-4v2H8a2 2 0 0 0-2 2v2H4v2h2v2H4v2h2v2a2 2 0 0 0 2 2h2v2h4v-2h2a2 2 0 0 0 2-2v-2h2v-2h-2v-2h2z" /></svg>
              +100 KP per referral
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

          <TaskRow done icon={<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" /></svg>} name="Join Telegram" kp="+100 KP" />
          <TaskRow done icon={<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>} name="Follow on X" kp="+100 KP" />
          <TaskRow done icon={<Icon size={14} vb="0 0 24 24"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></Icon>} name="Retweet Post" kp="+100 KP" />
          <TaskRow icon={<Icon size={14} vb="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></Icon>} name="Lore Question" kp="+100 KP" />
          <TaskRow done icon={<Icon size={14} vb="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></Icon>} name="Wallet Submitted" kp="+200 KP" />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderTop: `1px solid ${C.border}`, fontSize: 9, letterSpacing: "0.16em", color: C.goldDim, textTransform: "uppercase", cursor: "pointer", background: "rgba(200,169,110,0.02)" }}>
            View All Tasks
            <Icon size={12} vb="0 0 24 24"><polyline points="9 18 15 12 9 6" /></Icon>
          </div>
        </div>

        {/* ── BOTTOM NAV ── */}
        <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: "#0f0f14", borderTop: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "repeat(5,1fr)", padding: "10px 0 16px", zIndex: 100 }}>
          <NavItem label="Home" icon={<Icon size={20} vb="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></Icon>} />
          <NavItem label="Missions" icon={<Icon size={20} vb="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>} />
          <NavItem label="Rank" icon={<Icon size={20} vb="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></Icon>} />
          <NavItem label="Token" icon={<Icon size={20} vb="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></Icon>} />
          <NavItem active label="Profile" icon={<Icon size={20} vb="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>} />
        </nav>

      </div>
    </>
  );
}
