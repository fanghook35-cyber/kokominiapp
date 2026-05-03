import { useMemo } from "react";

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

// Diamond ornament
const Diamond = ({ size = 7, color }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" fill={color}>
    <polygon points="5,0 10,5 5,10 0,5" />
  </svg>
);

// Corner notch decoration (4 corners)
const CornerAccents = ({ color }) => {
  const c = { position: "absolute", width: 10, height: 10 };
  const line = { position: "absolute", background: color, borderRadius: 1 };
  const Corner = ({ top, bottom, left, right, flipX, flipY }) => (
    <div style={{ ...c, top, bottom, left, right }}>
      <div style={{ ...line, width: 10, height: 1.5, top: 0, left: 0 }} />
      <div style={{ ...line, width: 1.5, height: 10, top: 0, left: 0 }} />
    </div>
  );
  return (
    <>
      <Corner top={8} left={8} />
      <Corner top={8} right={8} style={{ transform: "scaleX(-1)" }} />
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

export default function VillageBadge({ level = 18 }) {
  const tier = useMemo(() => getTier(level), [level]);
  const gold = tier.color;
  const goldFaint = `rgba(${hexToRgb(gold)},0.12)`;
  const goldMid   = `rgba(${hexToRgb(gold)},0.35)`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Noto+Serif+JP:wght@400;700&display=swap');
      `}</style>

      {/* Outer badge card */}
      <div style={{
        position: "relative",
        width: 140,
        background: tier.bg,
        border: `1px solid ${goldMid}`,
        borderRadius: 10,
        padding: "18px 14px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        boxShadow: `
          inset 0 0 0 1px rgba(0,0,0,0.5),
          0 0 30px rgba(0,0,0,0.6),
          0 0 1px 1px rgba(0,0,0,0.8)
        `,
        userSelect: "none",
      }}>

        {/* Corner L-brackets */}
        <CornerAccents color={goldMid} />

        {/* Top diamond */}
        <div style={{ marginBottom: 10 }}>
          <Diamond size={8} color={goldMid} />
        </div>

        {/* Symbol circle */}
        <div style={{
          position: "relative",
          width: 82,
          height: 82,
          marginBottom: 14,
        }}>
          {/* Outer ring */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            border: `1.5px solid ${goldMid}`,
            background: `radial-gradient(circle at 40% 35%, rgba(${hexToRgb(gold)},0.08), rgba(0,0,0,0.6))`,
          }} />
          {/* Inner ring */}
          <div style={{
            position: "absolute", inset: 6,
            borderRadius: "50%",
            border: `1px solid rgba(${hexToRgb(gold)},0.18)`,
          }} />
          {/* Cardinal diamonds */}
          {[
            { top: -5, left: "50%", transform: "translateX(-50%)" },
            { bottom: -5, left: "50%", transform: "translateX(-50%)" },
            { left: -5, top: "50%", transform: "translateY(-50%)" },
            { right: -5, top: "50%", transform: "translateY(-50%)" },
          ].map((pos, i) => (
            <div key={i} style={{ position: "absolute", ...pos }}>
              <Diamond size={10} color={gold} />
            </div>
          ))}
          {/* 影 kanji */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 36,
            fontWeight: 700,
            color: gold,
            textShadow: `0 0 20px ${tier.glow}`,
            lineHeight: 1,
          }}>
            影
          </div>
        </div>

        {/* Tier name */}
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: tier.name.length > 12 ? 10 : 12,
          fontWeight: 500,
          color: gold,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 8,
          lineHeight: 1.3,
        }}>
          {tier.name}
        </div>

        {/* Divider with side diamonds */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, width: "100%" }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${goldMid})` }} />
          <Diamond size={5} color={goldMid} />
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${goldMid}, transparent)` }} />
        </div>

        {/* Level */}
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 11,
          color: `rgba(${hexToRgb(gold)},0.65)`,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}>
          LV {level}
        </div>

        {/* Bottom diamond */}
        <div style={{ marginTop: 10 }}>
          <Diamond size={8} color={goldMid} />
        </div>

      </div>
    </>
  );
}

// Helper: hex → "r,g,b" string for rgba()
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}
