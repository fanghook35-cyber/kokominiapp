import React from "react";

const C = {
  ink:       "#0a0a0c",
  panel:     "#111118",
  panel2:    "#161620",
  border:    "#2a2a3e",
  gold:      "#c8a96e",
  gold2:     "#e2c98a",
  goldDim:   "rgba(200,169,110,0.12)",
  goldBorder:"rgba(200,169,110,0.22)",
  text:      "#e8e2d6",
  smoke:     "#9a9088",
  muted:     "#6b6b88",
  success:   "#5a9e72",
  dim:       "#3a3a52",
};

// ── Icons ─────────────────────────────────────────────────────────────

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

// ── Allocation Seal SVG ───────────────────────────────────────────────

const AllocSeal = () => (
  <div style={{ width: 80, height: 80, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
    <svg viewBox="0 0 80 80" fill="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <circle cx="40" cy="40" r="36" stroke="rgba(200,169,110,0.3)" strokeWidth="1"/>
      <circle cx="40" cy="40" r="30" stroke="rgba(200,169,110,0.15)" strokeWidth="0.5"/>
      <line x1="40" y1="5"  x2="40" y2="11" stroke="rgba(200,169,110,0.4)" strokeWidth="1"/>
      <line x1="40" y1="69" x2="40" y2="75" stroke="rgba(200,169,110,0.4)" strokeWidth="1"/>
      <line x1="5"  y1="40" x2="11" y2="40" stroke="rgba(200,169,110,0.4)" strokeWidth="1"/>
      <line x1="69" y1="40" x2="75" y2="40" stroke="rgba(200,169,110,0.4)" strokeWidth="1"/>
      <line x1="14.4" y1="14.4" x2="18.7" y2="18.7" stroke="rgba(200,169,110,0.25)" strokeWidth="0.7"/>
      <line x1="61.3" y1="61.3" x2="65.6" y2="65.6" stroke="rgba(200,169,110,0.25)" strokeWidth="0.7"/>
      <line x1="65.6" y1="14.4" x2="61.3" y2="18.7" stroke="rgba(200,169,110,0.25)" strokeWidth="0.7"/>
      <line x1="18.7" y1="61.3" x2="14.4" y2="65.6" stroke="rgba(200,169,110,0.25)" strokeWidth="0.7"/>
    </svg>
    <span style={{ fontFamily: "'Cinzel', serif", fontSize: 28, color: C.gold, position: "relative", zIndex: 1, lineHeight: 1 }}>影</span>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────

export default function TokenScreen() {

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=JetBrains+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0c; color: #e8e2d6; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 430, margin: "0 auto", minHeight: "100vh",
        display: "flex", flexDirection: "column", background: C.ink,
        position: "relative", overflowX: "hidden",
      }}>

        {/* ── SCREEN HEADER ── */}
        <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 600, color: C.text, letterSpacing: "0.3px" }}>
              Token &amp; Presale
            </div>
            <div style={{ fontSize: 12, color: C.smoke, marginTop: 2 }}>$KOKO — Shadow Phase Open</div>
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 38, color: "rgba(200,169,110,0.35)", lineHeight: 1, fontWeight: 400 }}>影</div>
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 100px", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* HERO CARD */}
          <div style={{
            borderRadius: 14, border: `0.5px solid ${C.goldBorder}`,
            overflow: "hidden", position: "relative",
            background: "#0c0c10", minHeight: 280,
          }}>
            {/* Hero image */}
            <img
              src="https://i.postimg.cc/G3B36vzc/file-00000000bfc872438160d3182fb17087.png"
              alt=""
              style={{
                position: "absolute", top: 0, right: 0,
                height: "100%", width: "65%",
                objectFit: "cover", objectPosition: "center right",
                opacity: 0.55, pointerEvents: "none",
                maskImage: "linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)",
              }}
            />
            <div style={{ position: "relative", zIndex: 1, padding: "18px 16px 16px" }}>
              {/* Presale pill */}
              <div style={{
                display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9, letterSpacing: "1.5px", color: C.gold,
                border: `0.5px solid ${C.goldBorder}`, borderRadius: 20,
                padding: "3px 10px", textTransform: "uppercase", marginBottom: 12,
              }}>
                Presale — Now Live
              </div>

              {/* Title */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>🌙</span>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 600, color: C.text, letterSpacing: "0.5px" }}>
                  Shadow Phase
                </span>
              </div>

              {/* Bonus badge */}
              <div style={{
                display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, fontWeight: 500, color: "#0a0804",
                background: C.gold, borderRadius: 6,
                padding: "4px 12px", marginBottom: 14, letterSpacing: "0.5px",
              }}>
                +30% BONUS
              </div>

              {/* Price */}
              <div style={{ fontSize: 14, marginBottom: 3 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 500, color: C.text }}>~1,875,000</span>
                {" "}<span style={{ color: C.gold, fontSize: 16 }}>$KOKO</span>
                {" "}<span style={{ color: C.smoke, fontSize: 13 }}>per 1 SOL</span>
              </div>

              {/* Min/max */}
              <div style={{ fontSize: 12, color: C.smoke, marginBottom: 16, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span>Min: 0.2 SOL</span>
                <span style={{ color: C.dim }}>•</span>
                <span>Max: 5 SOL</span>
                <span style={{ color: C.dim }}>•</span>
                <span>Target: 80 SOL</span>
              </div>

              {/* CTA */}
              <button
                onClick={() => window.open("http://moonpay.hel.io/x/Kairokuworld", "_blank")}
                style={{
                  display: "block", width: "100%", padding: "13px 0",
                  background: "linear-gradient(135deg, #c8a96e, #a8893e)",
                  color: "#060401", fontFamily: "'Cinzel', serif",
                  fontSize: 12, fontWeight: 700, letterSpacing: "1px",
                  textTransform: "uppercase", border: "none", borderRadius: 9,
                  cursor: "pointer", marginBottom: 8,
                }}
              >
                BUY $KOKO — SHADOW PHASE →
              </button>

              {/* Warning */}
              <div style={{ fontSize: 10, color: C.muted, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                🔒 Only send from a wallet you control. Not from a CEX.
              </div>
            </div>
          </div>

          {/* ALLOCATION CARD */}
          <div style={{
            background: C.panel, border: `0.5px solid ${C.goldBorder}`,
            borderRadius: 14, padding: 16,
            display: "flex", alignItems: "center", gap: 14,
            position: "relative", overflow: "hidden",
          }}>
            <AllocSeal />

            {/* Center */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "2px", color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>
                Your Allocation
              </div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 40, fontWeight: 500, color: C.gold, lineHeight: 1, marginBottom: 2 }}>
                380
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: C.smoke, marginBottom: 8 }}>
                $KOKO
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                border: `0.5px solid ${C.border}`, borderRadius: 20,
                padding: "3px 10px", fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, color: C.smoke,
              }}>
                <span style={{ color: C.success, fontSize: 10 }}>✓</span>
                F48NUFEW...b7jemX
              </div>
            </div>

            {/* Right */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              <LockIcon />
              <div style={{ fontSize: 10, color: C.smoke, textAlign: "right", lineHeight: 1.4 }}>
                Allocation Locked
                <span style={{ color: C.gold, fontSize: 10, display: "block" }}>Wallet Submitted</span>
              </div>
            </div>
          </div>

          {/* KP + CONVERSION CARD */}
          <div style={{
            background: C.panel, border: `0.5px solid rgba(200,169,110,0.1)`,
            borderRadius: 14, padding: 16,
            display: "grid", gridTemplateColumns: "1fr 1.5px 1fr",
            gap: 0, alignItems: "stretch",
          }}>
            {/* Left: KP */}
            <div style={{ paddingRight: 14 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "2px", color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>
                Your KP
              </div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 36, fontWeight: 500, color: C.text, lineHeight: 1, marginBottom: 4 }}>
                4,052
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "1.5px", color: C.muted, textTransform: "uppercase" }}>
                Kairoku Power
              </div>
            </div>

            {/* Divider */}
            <div style={{ background: C.dim, margin: "0 14px" }} />

            {/* Right: Conversion */}
            <div style={{ paddingLeft: 14, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "2px", color: C.muted, textTransform: "uppercase", marginBottom: 6 }}>
                  Conversion Rate
                </div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: C.gold, marginBottom: 6 }}>
                  10 KP = 1 <span style={{ color: C.text }}>$KOKO</span>
                </div>
                <div style={{ fontSize: 11, color: C.smoke, marginBottom: 8, lineHeight: 1.4 }}>
                  Keep earning KP. Increase your allocation.
                </div>
              </div>
              <div>
                {/* Progress bar */}
                <div style={{ height: 5, background: "rgba(200,169,110,0.1)", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ height: "100%", width: "14%", background: "linear-gradient(90deg, #c8a96e, #e2c98a)", borderRadius: 3 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.gold }}>0.0002%</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: C.muted, letterSpacing: "0.5px" }}>of Airdrop Pool</span>
                </div>
              </div>
            </div>
          </div>

          {/* TOKEN INFO CARD */}
          <div style={{
            background: C.panel, border: `0.5px solid rgba(200,169,110,0.1)`,
            borderRadius: 14, padding: "14px 16px",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "2px", color: C.gold, textTransform: "uppercase", marginBottom: 12 }}>
              Token Info
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[
                { icon: "👥", sub: "Airdrop Pool",        val: "266,666,666", ticker: "$KOKO" },
                { icon: "🪙", sub: "Presale Allocation",  val: "150,000,000", ticker: "$KOKO" },
                { icon: "🎯", sub: "Presale Target",      val: "80 SOL",      ticker: null },
              ].map(({ icon, sub, val, ticker }) => (
                <div key={sub} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 16, color: C.muted, marginBottom: 2 }}>{icon}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "1px", color: C.muted, textTransform: "uppercase" }}>{sub}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: C.gold, lineHeight: 1.1, wordBreak: "break-all" }}>{val}</div>
                  {ticker && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: C.smoke }}>{ticker}</div>}
                </div>
              ))}
            </div>

            <div style={{ borderTop: `0.5px solid ${C.dim}`, paddingTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: C.smoke }}>More details on our official channels.</span>
              <ArrowRight />
            </div>
          </div>

        </div>{/* /scroll */}
      </div>
    </>
  );
}
