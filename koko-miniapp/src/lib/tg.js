// Thin wrapper around Telegram.WebApp
// Falls back gracefully in browser dev mode

const tg = typeof window !== 'undefined' && window.Telegram?.WebApp

export const TG = {
  ready()            { tg?.ready() },
  expand()           { tg?.expand() },
  close()            { tg?.close() },
  haptic(type = 'impact', style = 'light') {
    tg?.HapticFeedback?.[type](style)
  },

  get user()         { return tg?.initDataUnsafe?.user ?? null },
  get userId()       { return tg?.initDataUnsafe?.user?.id ?? null },
  get initData()     { return tg?.initData ?? '' },
  get colorScheme()  { return tg?.colorScheme ?? 'dark' },
  get isAvailable()  { return !!tg },

  /** Deep-link back into the bot */
  openBot(startParam = '') {
    const url = `https://t.me/${import.meta.env.VITE_BOT_USERNAME}${startParam ? `?start=${startParam}` : ''}`
    tg ? tg.openTelegramLink(url) : window.open(url, '_blank')
  },

  openUrl(url) {
    tg ? tg.openLink(url) : window.open(url, '_blank')
  },

  setMainButton(text, cb) {
    if (!tg) return
    tg.MainButton.setText(text)
    tg.MainButton.onClick(cb)
    tg.MainButton.show()
  },
  hideMainButton() { tg?.MainButton?.hide() }
}

// ── Constants ──
export const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME ?? 'KokoBot'
export const GITBOOK_URL  = 'https://kairokuworld.gitbook.io/kairokuworld-docs'
export const TWITTER_URL  = 'https://x.com/KokoKairoku'
export const RETWEET_URL  = 'https://x.com/i/status/2047342243153932580'
export const TG_GROUP     = 'https://t.me/KokoKairoku'
export const TOKEN_RATE   = 10   // points per 1 $KOKO
export const REFERRAL_CAP = 75
export const AIRDROP_CAP  = 266_666_666

export const TASK_POINTS = {
  joined_telegram: 500,
  followed_x:      500,
  retweeted:        300,
  lore_answered:    250,
  daily_checkin:    100,
  referral:       1_000,
}

export const CORE_TASKS = ['joined_telegram', 'followed_x', 'retweeted', 'lore_answered']

export function allTasksDone(user) {
  return CORE_TASKS.every(t => user?.[t])
}

export function calcTokens(points) {
  return Math.floor((points ?? 0) / TOKEN_RATE)
}

export function fmt(n) {
  return (n ?? 0).toLocaleString()
}

export function fmtCompact(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
  return String(n ?? 0)
}

// Mock user for dev/browser testing
export const DEV_USER = {
  telegram_id:       123456789,
  username:          'shadow_villager',
  first_name:        'Shadow',
  points:            28_887_017,
  referral_code:     'KOKO789017',
  referred_by:       null,
  joined_telegram:   true,
  followed_x:        true,
  retweeted:         true,
  lore_answered:     false,
  last_checkin:      null,
  wallet_address:    null,
  tokens_allocated:  0,
  is_suspicious:     false,
  shadow_mode_active: false,
  shadow_mode_expires: null,
  daily_actions_count: 3,
}
