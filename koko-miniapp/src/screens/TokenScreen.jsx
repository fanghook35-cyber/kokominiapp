
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=JetBrains+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0a0a0c;--panel:#111118;--panel2:#161620;--border:#2a2a3e;
  --gold:#c8a96e;--gold2:#e2c98a;--gold-dim:rgba(200,169,110,0.12);
  --gold-border:rgba(200,169,110,0.22);--text:#e8e2d6;--smoke:#9a9088;
  --muted:#6b6b88;--success:#5a9e72;--dim:#3a3a52;
}
body{background:var(--ink);color:var(--text);font-family:'DM Sans',sans-serif;margin:0}
.screen{width:100%;max-width:430px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;background:var(--ink);position:relative}

/* TELEGRAM BAR */
.tg-bar{background:#1a1a24;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:0.5px solid var(--border)}
.tg-bar-title{font-family:'Cinzel',serif;font-size:13px;font-weight:600;color:var(--text);letter-spacing:0.3px}
.tg-bar-x{color:var(--smoke);font-size:16px;cursor:pointer;line-height:1}
.tg-bar-right{display:flex;align-items:center;gap:10px;color:var(--smoke);font-size:13px}

/* SCREEN HEADER */
.screen-header{padding:14px 16px 10px;display:flex;align-items:flex-start;justify-content:space-between}
.screen-header-left .title{font-family:'Cinzel',serif;font-size:18px;font-weight:600;color:var(--text);letter-spacing:0.3px}
.screen-header-left .sub{font-size:12px;color:var(--smoke);margin-top:2px}
.kanji-mark{font-family:'Cinzel',serif;font-size:38px;color:rgba(200,169,110,0.35);line-height:1;font-weight:400}

/* SCROLL AREA */
.scroll{flex:1;overflow-y:auto;padding:0 12px 100px;display:flex;flex-direction:column;gap:10px}
.scroll::-webkit-scrollbar{display:none}

/* HERO CARD */
.hero{border-radius:14px;border:0.5px solid var(--gold-border);overflow:hidden;position:relative;background:#0c0c10;min-height:280px}
.hero-img{position:absolute;top:0;right:0;height:100%;width:65%;object-fit:cover;object-position:center right;opacity:0.55;pointer-events:none;mask-image:linear-gradient(to left,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.5) 50%,rgba(0,0,0,0) 100%);-webkit-mask-image:linear-gradient(to left,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.5) 50%,rgba(0,0,0,0) 100%)}
.hero-inner{position:relative;z-index:1;padding:18px 16px 16px}
.presale-pill{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1.5px;color:var(--gold);border:0.5px solid var(--gold-border);border-radius:20px;padding:3px 10px;text-transform:uppercase;margin-bottom:12px}
.shadow-title{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.shadow-title .moon{font-size:22px}
.shadow-title .name{font-family:'Cinzel',serif;font-size:26px;font-weight:600;color:var(--text);letter-spacing:0.5px}
.bonus-badge{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;color:#0a0804;background:var(--gold);border-radius:6px;padding:4px 12px;margin-bottom:14px;letter-spacing:0.5px}
.price-line{font-size:14px;margin-bottom:3px}
.price-line strong{font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:500;color:var(--text)}
.price-line .koko{color:var(--gold);font-size:16px}
.price-line .per{color:var(--smoke);font-size:13px}
.min-max{font-size:12px;color:var(--smoke);margin-bottom:16px;display:flex;align-items:center;gap:6px}
.min-max .dot{color:var(--dim)}
.cta-btn{display:block;width:100%;padding:13px 0;background:linear-gradient(135deg,#c8a96e,#a8893e);color:#060401;font-family:'Cinzel',serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;border-radius:9px;cursor:pointer;text-align:center;margin-bottom:8px}
.cta-warn{font-size:10px;color:var(--muted);text-align:center;display:flex;align-items:center;justify-content:center;gap:4px}

/* ALLOCATION CARD */
.alloc-card{background:var(--panel);border:0.5px solid var(--gold-border);border-radius:14px;padding:16px;display:flex;align-items:center;gap:14px;position:relative;overflow:hidden}
.alloc-seal{width:80px;height:80px;flex-shrink:0;display:flex;align-items:center;justify-content:center;position:relative}
.alloc-seal svg{position:absolute;inset:0}
.alloc-seal-char{font-family:'Cinzel',serif;font-size:28px;color:var(--gold);position:relative;z-index:1;line-height:1}
.alloc-center{flex:1}
.alloc-label{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;margin-bottom:4px}
.alloc-amount{font-family:'Cinzel',serif;font-size:40px;font-weight:500;color:var(--gold);line-height:1;margin-bottom:2px}
.alloc-ticker{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--smoke);margin-bottom:8px}
.alloc-wallet{display:inline-flex;align-items:center;gap:5px;border:0.5px solid var(--border);border-radius:20px;padding:3px 10px;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--smoke)}
.alloc-wallet .check{color:var(--success);font-size:10px}
.alloc-right{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0}
.alloc-locked{font-size:10px;color:var(--smoke);text-align:right;line-height:1.4}
.alloc-locked .status-gold{color:var(--gold);font-size:10px;display:block}
.lock-icon{font-size:18px;color:var(--muted);margin-bottom:4px}

/* KP CARD */
.kp-card{background:var(--panel);border:0.5px solid rgba(200,169,110,0.1);border-radius:14px;padding:16px;display:grid;grid-template-columns:1fr 1.5px 1fr;gap:0;align-items:stretch}
.kp-divider{background:var(--dim);margin:0 14px}
.kp-left{padding-right:14px}
.kp-sub{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;margin-bottom:6px}
.kp-value{font-family:'Cinzel',serif;font-size:36px;font-weight:500;color:var(--text);line-height:1;margin-bottom:4px}
.kp-label{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1.5px;color:var(--muted);text-transform:uppercase}
.kp-right{padding-left:14px;display:flex;flex-direction:column;justify-content:space-between}
.conv-label{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;margin-bottom:6px}
.conv-rate{font-family:'Cinzel',serif;font-size:16px;color:var(--gold);margin-bottom:6px}
.conv-rate span{color:var(--text)}
.conv-hint{font-size:11px;color:var(--smoke);margin-bottom:8px;line-height:1.4}
.progress-bg{height:5px;background:rgba(200,169,110,0.1);border-radius:3px;overflow:hidden;margin-bottom:4px}
.progress-fill{height:100%;background:linear-gradient(90deg,#c8a96e,#e2c98a);border-radius:3px;width:14%}
.progress-stats{display:flex;justify-content:space-between;align-items:baseline}
.progress-pct{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--gold)}
.progress-of{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--muted);letter-spacing:0.5px}

/* TOKEN INFO */
.token-info{background:var(--panel);border:0.5px solid rgba(200,169,110,0.1);border-radius:14px;padding:14px 16px}
.token-info-label{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--gold);text-transform:uppercase;margin-bottom:12px}
.token-cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px}
.token-col{display:flex;flex-direction:column;gap:4px}
.token-col-icon{font-size:16px;color:var(--muted);margin-bottom:2px}
.token-col-sub{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:1px;color:var(--muted);text-transform:uppercase}
.token-col-val{font-family:'Cinzel',serif;font-size:15px;color:var(--gold);line-height:1.1}
.token-col-ticker{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--smoke)}
.token-more{border-top:0.5px solid var(--dim);padding-top:10px;display:flex;align-items:center;justify-content:space-between}
.token-more span{font-size:11px;color:var(--smoke)}
.token-more-arrow{color:var(--gold);font-size:14px}

/* BOTTOM NAV */
.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:var(--panel);border-top:1px solid var(--border);display:flex;padding-bottom:env(safe-area-inset-bottom,6px);z-index:100}
.nav-btn{flex:1;padding:10px 0 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:none;border:none;cursor:pointer;position:relative;opacity:0.38}
.nav-btn.active{opacity:1}
.nav-btn-bar{position:absolute;top:0;left:50%;transform:translateX(-50%);width:20px;height:1.5px;border-radius:1px;background:var(--gold)}
.nav-label{font-family:'JetBrains Mono',monospace;font-size:7px;letter-spacing:0.6px;text-transform:uppercase;color:var(--muted);line-height:1}
.nav-btn.active .nav-label{color:var(--gold)}
</style>

<div class="screen">
  <!-- TELEGRAM BAR -->
  <div class="tg-bar">
    <div class="tg-bar-x">✕</div>
    <div class="tg-bar-title">Koko | Kairoku World</div>
    <div class="tg-bar-right">
      <span>⌄</span>
      <span>⋮</span>
    </div>
  </div>

  <!-- SCREEN HEADER -->
  <div class="screen-header">
    <div class="screen-header-left">
      <div class="title">Token &amp; Presale</div>
      <div class="sub">$KOKO — Shadow Phase Open</div>
    </div>
    <div class="kanji-mark">影</div>
  </div>

  <!-- SCROLLABLE CONTENT -->
  <div class="scroll">

    <!-- HERO CARD -->
    <div class="hero">
      <img class="hero-img" src="https://i.postimg.cc/G3B36vzc/file-00000000bfc872438160d3182fb17087.png" alt="" />
      <div class="hero-inner">
        <div class="presale-pill">Presale — Now Live</div>
        <div class="shadow-title">
          <span class="moon">🌙</span>
          <span class="name">Shadow Phase</span>
        </div>
        <div class="bonus-badge">+30% BONUS</div>
        <div class="price-line">
          <strong>~1,875,000</strong> <span class="koko">$KOKO</span> <span class="per">per 1 SOL</span>
        </div>
        <div class="min-max">
          <span>Min: 0.2 SOL</span><span class="dot">•</span>
          <span>Max: 5 SOL</span><span class="dot">•</span>
          <span>Target: 80 SOL</span>
        </div>
        <button class="cta-btn">BUY $KOKO — SHADOW PHASE →</button>
        <div class="cta-warn">🔒 Only send from a wallet you control. Not from a CEX.</div>
      </div>
    </div>

    <!-- ALLOCATION CARD -->
    <div class="alloc-card">
      <!-- Seal SVG -->
      <div class="alloc-seal">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="36" stroke="rgba(200,169,110,0.3)" stroke-width="1"/>
          <circle cx="40" cy="40" r="30" stroke="rgba(200,169,110,0.15)" stroke-width="0.5"/>
          <!-- tick marks -->
          <line x1="40" y1="5" x2="40" y2="11" stroke="rgba(200,169,110,0.4)" stroke-width="1"/>
          <line x1="40" y1="69" x2="40" y2="75" stroke="rgba(200,169,110,0.4)" stroke-width="1"/>
          <line x1="5" y1="40" x2="11" y2="40" stroke="rgba(200,169,110,0.4)" stroke-width="1"/>
          <line x1="69" y1="40" x2="75" y2="40" stroke="rgba(200,169,110,0.4)" stroke-width="1"/>
          <line x1="14.4" y1="14.4" x2="18.7" y2="18.7" stroke="rgba(200,169,110,0.25)" stroke-width="0.7"/>
          <line x1="61.3" y1="61.3" x2="65.6" y2="65.6" stroke="rgba(200,169,110,0.25)" stroke-width="0.7"/>
          <line x1="65.6" y1="14.4" x2="61.3" y2="18.7" stroke="rgba(200,169,110,0.25)" stroke-width="0.7"/>
          <line x1="18.7" y1="61.3" x2="14.4" y2="65.6" stroke="rgba(200,169,110,0.25)" stroke-width="0.7"/>
        </svg>
        <span class="alloc-seal-char">影</span>
      </div>

      <!-- Center: allocation data -->
      <div class="alloc-center">
        <div class="alloc-label">Your Allocation</div>
        <div class="alloc-amount">380</div>
        <div class="alloc-ticker">$KOKO</div>
        <div class="alloc-wallet">
          <span class="check">✓</span>
          F48NUFEW...b7jemX
        </div>
      </div>

      <!-- Right: status -->
      <div class="alloc-right">
        <div class="lock-icon">🔒</div>
        <div class="alloc-locked">
          Allocation Locked
          <span class="status-gold">Wallet Submitted</span>
        </div>
      </div>
    </div>

    <!-- KP + CONVERSION -->
    <div class="kp-card">
      <div class="kp-left">
        <div class="kp-sub">Your KP</div>
        <div class="kp-value">4,052</div>
        <div class="kp-label">Kairoku Power</div>
      </div>
      <div class="kp-divider"></div>
      <div class="kp-right">
        <div class="conv-label">Conversion Rate</div>
        <div class="conv-rate">10 KP = 1 <span>$KOKO</span></div>
        <div class="conv-hint">Keep earning KP. Increase your allocation.</div>
        <div>
          <div class="progress-bg">
            <div class="progress-fill"></div>
          </div>
          <div class="progress-stats">
            <span class="progress-pct">0.0002%</span>
            <span class="progress-of">of Airdrop Pool</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TOKEN INFO -->
    <div class="token-info">
      <div class="token-info-label">Token Info</div>
      <div class="token-cols">
        <div class="token-col">
          <div class="token-col-icon">👥</div>
          <div class="token-col-sub">Airdrop Pool</div>
          <div class="token-col-val">266,666,666</div>
          <div class="token-col-ticker">$KOKO</div>
        </div>
        <div class="token-col">
          <div class="token-col-icon">🪙</div>
          <div class="token-col-sub">Presale Allocation</div>
          <div class="token-col-val">150,000,000</div>
          <div class="token-col-ticker">$KOKO</div>
        </div>
        <div class="token-col">
          <div class="token-col-icon">🎯</div>
          <div class="token-col-sub">Presale Target</div>
          <div class="token-col-val">80 SOL</div>
        </div>
      </div>
      <div class="token-more">
        <span>More details on our official channels.</span>
        <span class="token-more-arrow">→</span>
      </div>
    </div>

  </div><!-- /scroll -->

  <!-- BOTTOM NAV -->
  <nav class="bottom-nav">
    <!-- HOME -->
    <button class="nav-btn">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M3 9L10 3L17 9V17H13V13H7V17H3V9Z" stroke="#6b6b88" stroke-width="1.3" stroke-linejoin="round"/>
      </svg>
      <span class="nav-label">HOME</span>
    </button>
    <!-- QUESTS -->
    <button class="nav-btn">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="#6b6b88" stroke-width="1.3"/>
        <path d="M7 10L9 12L13 8" stroke="#6b6b88" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="nav-label">QUESTS</span>
    </button>
    <!-- RANK -->
    <button class="nav-btn">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="13" width="4" height="4" rx="1" stroke="#6b6b88" stroke-width="1.3"/>
        <rect x="8" y="9" width="4" height="8" rx="1" stroke="#6b6b88" stroke-width="1.3"/>
        <rect x="13" y="5" width="4" height="12" rx="1" stroke="#6b6b88" stroke-width="1.3"/>
      </svg>
      <span class="nav-label">RANK</span>
    </button>
    <!-- TOKEN (ACTIVE) -->
    <button class="nav-btn active">
      <div class="nav-btn-bar"></div>
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="#c8a96e" stroke-width="1.3" fill="rgba(200,169,110,0.08)"/>
        <path d="M7.5 10C7.5 8.62 8.62 7.5 10 7.5C11.38 7.5 12.5 8.62 12.5 10" stroke="#c8a96e" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M8 13L12 7" stroke="#c8a96e" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
      <span class="nav-label">TOKEN</span>
    </button>
    <!-- PROFILE -->
    <button class="nav-btn">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3" stroke="#6b6b88" stroke-width="1.3"/>
        <path d="M4 17C4 14.24 6.69 12 10 12C13.31 12 16 14.24 16 17" stroke="#6b6b88" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
      <span class="nav-label">PROFILE</span>
    </button>
  </nav>

</div>
