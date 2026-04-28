# Koko Mini App

Telegram Mini App frontend for the Kairoku World airdrop system.
Pairs with `koko_bot_v13.js` — bot remains the core engine, Mini App is read-only display.

## Stack

- **Frontend**: React 18 + Vite
- **Telegram SDK**: @twa-dev/sdk
- **Database**: Supabase (shared with bot)
- **Auth**: Telegram WebApp.initData → Edge Function → JWT
- **Deploy**: Vercel / Cloudflare Pages

## Project structure

```
koko-miniapp/
├── src/
│   ├── components/
│   │   ├── UI.jsx           # Shared components (Card, Button, TaskRow, etc.)
│   │   └── BottomNav.jsx    # 5-tab bottom navigation
│   ├── screens/
│   │   ├── HomeScreen.jsx   # Points, Shadow Mode, quick task status
│   │   ├── TasksScreen.jsx  # Full task list with CTAs back to bot
│   │   ├── LeaderboardScreen.jsx
│   │   ├── TokenScreen.jsx  # Token estimate + wallet CTA
│   │   └── ProfileScreen.jsx
│   ├── hooks/
│   │   ├── useUser.js       # Fetch + Realtime subscribe to user row
│   │   └── useLeaderboard.js
│   ├── lib/
│   │   ├── supabase.js      # Supabase client + query helpers
│   │   └── tg.js            # Telegram WebApp wrapper + constants
│   ├── App.jsx              # Root + tab routing
│   ├── main.jsx
│   └── index.css            # Global styles + Koko dark gold theme
├── supabase/
│   ├── functions/miniapp-auth/index.ts   # Edge Function: verify initData
│   └── migrations/001_miniapp_upgrade.sql
├── .env.example
└── index.html
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Fill in your Supabase URL, anon key, edge function URL, and bot username
```

### 3. Run DB migration

In Supabase SQL Editor, run:
```
supabase/migrations/001_miniapp_upgrade.sql
```

### 4. Deploy Edge Function

```bash
supabase functions deploy miniapp-auth
supabase secrets set TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### 5. Add Mini App button to existing bot

In `koko_bot_v13.js`, in `sendTaskDashboard()`, append to the inline keyboard:

```js
[{ text: '⚡ Open Koko App', web_app: { url: 'https://your-app.vercel.app' } }]
```

### 6. Register with BotFather

```
/newapp → select @KokoBot → set URL to your deployment
```

### 7. Deploy frontend

```bash
npm run build
# Deploy dist/ to Vercel or Cloudflare Pages
# HTTPS is required by Telegram
```

## Architecture decisions

### Mini App never writes to DB directly
All mutations (task verification, wallet submit, check-in) happen through the existing bot handlers via deep links:
```
t.me/KokoBot?start=wallet
t.me/KokoBot?start=lore
t.me/KokoBot?start=checkin
```

This ensures zero risk of duplicating bot logic or creating race conditions.

### Real-time sync via Supabase Realtime
When the bot awards points, Supabase broadcasts the row change. The Mini App subscribes and updates the UI instantly — no polling needed.

### Auth flow
```
Telegram.WebApp.initData
  → POST /functions/v1/miniapp-auth
  → HMAC verification
  → return telegram_id
  → Supabase client initialized with telegram_id claim
  → RLS: users can only read their own row
```

## Anti-farm notes

The Mini App UI intentionally:
- Shows **0 KP/min** (no passive income display)
- Locks Shadow Mode until all tasks + wallet are complete
- Shows energy/daily action counter
- Deep-links to bot for all earning actions (no Mini App-side point awards)
- Leaderboard excludes suspicious users and zero-task users
