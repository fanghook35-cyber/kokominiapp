import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY
const EDGE_FN_URL  = import.meta.env.VITE_EDGE_FN_URL   // e.g. https://xxx.supabase.co/functions/v1/miniapp-auth

let _supabase = null

/**
 * Authenticate via Telegram WebApp.initData → Edge Function → JWT
 * Returns an authenticated Supabase client.
 */
export async function initSupabase(initData) {
  let token = null

  try {
    const res = await fetch(EDGE_FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData })
    })
    const json = await res.json()
    token = json.token
  } catch (e) {
    console.warn('[Auth] Edge function unavailable — using anon key (dev mode)')
  }

  _supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : {}
  })

  return _supabase
}

export function getSupabase() {
  if (!_supabase) throw new Error('Supabase not initialized — call initSupabase first')
  return _supabase
}

// ── Query helpers ──────────────────────────────────────────────────────────

export async function fetchUser(telegramId) {
  const { data, error } = await getSupabase()
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single()
  if (error) throw error
  return data
}

export async function fetchLeaderboard() {
  const { data, error } = await getSupabase()
    .from('leaderboard_public')
    .select('telegram_id, username, first_name, points, tokens_allocated, rank')
    .order('rank', { ascending: true })
    .limit(100)
  if (error) throw error
  return data || []
}

export async function fetchReferralCount(referralCode) {
  const { count } = await getSupabase()
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('referred_by', referralCode)
  return count || 0
}

export function subscribeToUser(telegramId, onUpdate) {
  return getSupabase()
    .channel(`user-${telegramId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'users',
      filter: `telegram_id=eq.${telegramId}`
    }, (payload) => onUpdate(payload.new))
    .subscribe()
}
