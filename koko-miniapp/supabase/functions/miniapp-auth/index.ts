// supabase/functions/miniapp-auth/index.ts
// Deploy with: supabase functions deploy miniapp-auth

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'node:crypto'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { initData } = await req.json()

    // ── 1. Verify Telegram HMAC ──────────────────────────────────────────
    const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!
    if (!BOT_TOKEN) throw new Error('BOT_TOKEN not set')

    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    if (!hash) throw new Error('No hash in initData')
    params.delete('hash')

    const sorted = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n')

    const secretKey = createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest()

    const expected = createHmac('sha256', secretKey)
      .update(sorted)
      .digest('hex')

    if (expected !== hash) {
      return new Response(JSON.stringify({ error: 'Invalid initData' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check expiry (Telegram tokens expire after 24h for non-bots)
    const authDate = Number(params.get('auth_date'))
    if (Date.now() / 1000 - authDate > 86400) {
      return new Response(JSON.stringify({ error: 'initData expired' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // ── 2. Extract user ──────────────────────────────────────────────────
    const userStr = params.get('user')
    if (!userStr) throw new Error('No user in initData')
    const tgUser = JSON.parse(userStr)
    const telegramId = tgUser.id

    // ── 3. Ensure user exists in DB ──────────────────────────────────────
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Upsert to ensure the user row exists (won't overwrite existing data)
    const referralCode = `KOKO${telegramId.toString().slice(-6)}`
    await supabase.from('users').upsert({
      telegram_id: telegramId,
      username: tgUser.username ?? null,
      first_name: tgUser.first_name ?? 'Villager',
      points: 0,
      referral_code: referralCode,
      is_suspicious: !tgUser.username,
      suspicious_reason: !tgUser.username ? 'no_username' : null,
      tokens_allocated: 0,
    }, { onConflict: 'telegram_id', ignoreDuplicates: true })

    // ── 4. Issue JWT with telegram_id claim ──────────────────────────────
    // We use Supabase's service role to create a custom JWT
    // The JWT includes the telegram_id so RLS can use it
    const { data: { session }, error: authErr } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: `tg_${telegramId}@koko.internal`,
    })

    // Alternative: sign a custom JWT directly
    // For simplicity, return the telegram_id for the client to use
    // and rely on anon + RLS set via DB function
    return new Response(JSON.stringify({
      ok: true,
      telegram_id: telegramId,
      // token: signedJWT  ← add proper JWT signing if needed
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
