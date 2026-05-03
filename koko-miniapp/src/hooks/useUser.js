import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchUser, fetchReferralCount, subscribeToUser } from '../lib/supabase'
import { TG, DEV_USER, KP_PER_MIN } from '../lib/tg'

const LS_KEY = 'koko_user_state'
const FARMING_KEY = 'koko_farming_ts'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) } catch { return null }
}
function saveLocal(u) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(u)) } catch {}
}
function getFarmingTs() {
  try { return parseInt(localStorage.getItem(FARMING_KEY) || '0', 10) } catch { return 0 }
}
function setFarmingTs(ts) {
  try { localStorage.setItem(FARMING_KEY, String(ts)) } catch {}
}

export function useUser() {
  const [user, setUser]         = useState(null)
  const [refCount, setRefCount] = useState(0)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const farmRef                 = useRef(null)

  const telegramId = TG.userId ?? DEV_USER.telegram_id

  // Persist + update user, accumulating farmed KP
  const updateUser = useCallback((u) => {
    if (!u) return
    setUser(u)
    saveLocal(u)
  }, [])

  // ── Farming ticker ────────────────────────────────────────────────────
  const startFarming = useCallback((basePoints) => {
    clearInterval(farmRef.current)
    const lastTs = getFarmingTs()
    const now    = Date.now()
    // Catch up missed KP (max 1 hour of offline farming)
    const missedSecs = Math.min((now - lastTs) / 1000, 3600)
    const catchUp    = lastTs > 0 ? Math.floor((missedSecs * KP_PER_MIN) / 60) : 0
    let pts = basePoints + catchUp
    setFarmingTs(now)

    setUser(prev => {
      if (!prev) return prev
      const next = { ...prev, points: pts }
      saveLocal(next)
      return next
    })

    farmRef.current = setInterval(() => {
      const perTick = Math.floor(KP_PER_MIN / 60)
      pts += perTick
      setFarmingTs(Date.now())
      setUser(prev => {
        if (!prev) return prev
        const next = { ...prev, points: pts }
        saveLocal(next)
        return next
      })
    }, 1000)
  }, [])

  // ── Load ──────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (!TG.isAvailable) {
        const cached = loadLocal()
        const base   = cached ?? DEV_USER
        updateUser(base)
        setRefCount(cached?.refCount ?? 12)
        startFarming(base.points)
        return
      }

      const u  = await fetchUser(telegramId)
      const rc = await fetchReferralCount(u.referral_code)
      updateUser(u)
      setRefCount(rc)
      startFarming(u.points)
    } catch (e) {
      // Fall back to localStorage if network fails
      const cached = loadLocal()
      if (cached) {
        updateUser(cached)
        startFarming(cached.points)
      }
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [telegramId, updateUser, startFarming])

  useEffect(() => {
    load()
    return () => clearInterval(farmRef.current)
  }, [load])

  // Real-time subscription (Supabase)
  useEffect(() => {
    if (!TG.isAvailable) return
    const channel = subscribeToUser(telegramId, (updated) => {
      updateUser(updated)
    })
    return () => { channel.unsubscribe() }
  }, [telegramId, updateUser])

  // ── Task completion (idempotent, persisted locally) ───────────────────
  const completeTask = useCallback((taskKey, bonusPoints = 0) => {
    setUser(prev => {
      if (!prev || prev[taskKey]) return prev // already done
      const next = { ...prev, [taskKey]: true, points: prev.points + bonusPoints }
      saveLocal(next)
      return next
    })
  }, [])

  // ── Wallet submission (one-time, locked) ──────────────────────────────
  const submitWallet = useCallback((address) => {
    setUser(prev => {
      if (!prev || prev.wallet_address) return prev // locked
      const next = { ...prev, wallet_address: address }
      saveLocal(next)
      return next
    })
  }, [])

  // ── Shadow mode activation ────────────────────────────────────────────
  const activateShadowMode = useCallback(() => {
    setUser(prev => {
      if (!prev || prev.shadow_mode_active) return prev
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      const next = { ...prev, shadow_mode_active: true, shadow_mode_expires: expires }
      saveLocal(next)
      return next
    })
  }, [])

  // ── Daily check-in ────────────────────────────────────────────────────
  const doCheckin = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    setUser(prev => {
      if (!prev || prev.last_checkin === today) return prev
      const next = { ...prev, last_checkin: today, points: prev.points + 100 }
      saveLocal(next)
      return next
    })
  }, [])

  return {
    user,
    refCount,
    loading,
    error,
    reload: load,
    completeTask,
    submitWallet,
    activateShadowMode,
    doCheckin,
  }
}
