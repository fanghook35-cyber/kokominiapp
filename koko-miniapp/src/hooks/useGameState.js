import { useState, useEffect, useRef, useCallback } from 'react'
import { TASK_POINTS, REFERRAL_CAP, CORE_TASKS, allTasksDone, calcTokens } from '../lib/tg'

const KP_PER_TICK   = Math.floor(2780 / 60)   // per second
const SHADOW_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours
const SHADOW_REQ_REFS    = 5
const SHADOW_MULTIPLIER  = 2.0
const STORAGE_KEY        = 'koko_game_state'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

const DEFAULT_STATE = {
  points:          0,
  tasks:           {},       // { taskId: true }
  referrals:       0,
  wallet:          null,
  farming:         false,
  farmingStarted:  null,
  shadowExpires:   null,
  multiplier:      1.0,
}

export function useGameState(serverUser) {
  const [state, setStateRaw] = useState(() => {
    const saved = loadState()
    if (saved) return saved
    return {
      ...DEFAULT_STATE,
      points:  serverUser?.points    ?? 0,
      wallet:  serverUser?.wallet_address ?? null,
      tasks: CORE_TASKS.reduce((acc, t) => {
        if (serverUser?.[t]) acc[t] = true
        return acc
      }, {}),
    }
  })

  const farmRef = useRef(null)
  const stateRef = useRef(state)
  stateRef.current = state

  // Persist on every change
  useEffect(() => { saveState(state) }, [state])

  // Merge server user on first load
  useEffect(() => {
    if (!serverUser) return
    setStateRaw(prev => ({
      ...prev,
      points: Math.max(prev.points, serverUser.points ?? 0),
      wallet: prev.wallet ?? serverUser.wallet_address ?? null,
      tasks:  {
        ...CORE_TASKS.reduce((acc, t) => { if (serverUser[t]) acc[t] = true; return acc }, {}),
        ...prev.tasks,
      },
    }))
  }, [serverUser?.telegram_id])

  function setState(updater) {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      return next
    })
  }

  // ── Derived ──────────────────────────────────────────────────────────
  const shadowActive = state.shadowExpires && new Date(state.shadowExpires) > new Date()
  const multiplier   = shadowActive
    ? SHADOW_MULTIPLIER
    : state.referrals >= 10 ? 1.6
    : state.referrals >= 5  ? 1.4
    : 1.0

  const tasksCount  = Object.keys(state.tasks).length
  const coreDone    = CORE_TASKS.every(t => state.tasks[t])
  const canShadow   = coreDone && state.referrals >= SHADOW_REQ_REFS

  // ── Farming ──────────────────────────────────────────────────────────
  const startFarming = useCallback(() => {
    if (stateRef.current.farming) return
    setState(prev => ({ ...prev, farming: true, farmingStarted: Date.now() }))

    farmRef.current = setInterval(() => {
      const mult = stateRef.current.shadowExpires && new Date(stateRef.current.shadowExpires) > new Date()
        ? SHADOW_MULTIPLIER : 1.0
      setState(prev => ({
        ...prev,
        points: prev.points + Math.round(KP_PER_TICK * mult),
      }))
    }, 1000)
  }, [])

  const stopFarming = useCallback(() => {
    clearInterval(farmRef.current)
    setState(prev => ({ ...prev, farming: false }))
  }, [])

  // Auto-start farming on mount if it was running
  useEffect(() => {
    if (state.farming && !farmRef.current) startFarming()
    return () => clearInterval(farmRef.current)
  }, [])

  // ── Tasks ─────────────────────────────────────────────────────────────
  const completeTask = useCallback((taskId) => {
    if (stateRef.current.tasks[taskId]) return  // already done
    const pts = TASK_POINTS[taskId] ?? 0
    setState(prev => ({
      ...prev,
      points: prev.points + pts,
      tasks:  { ...prev.tasks, [taskId]: true },
    }))
  }, [])

  // ── Referral ──────────────────────────────────────────────────────────
  const addReferral = useCallback(() => {
    setState(prev => ({
      ...prev,
      referrals: Math.min(prev.referrals + 1, REFERRAL_CAP),
      points:    prev.points + TASK_POINTS.referral,
    }))
  }, [])

  // ── Wallet ────────────────────────────────────────────────────────────
  const submitWallet = useCallback((address) => {
    if (stateRef.current.wallet) return  // locked
    setState(prev => ({ ...prev, wallet: address }))
  }, [])

  // ── Shadow Mode ───────────────────────────────────────────────────────
  const activateShadowMode = useCallback(() => {
    const s = stateRef.current
    const alreadyActive = s.shadowExpires && new Date(s.shadowExpires) > new Date()
    if (alreadyActive) return
    if (!CORE_TASKS.every(t => s.tasks[t])) return
    if (s.referrals < SHADOW_REQ_REFS) return

    setState(prev => ({
      ...prev,
      shadowExpires: new Date(Date.now() + SHADOW_DURATION_MS).toISOString(),
    }))
  }, [])

  return {
    state,
    // derived
    multiplier,
    shadowActive,
    tasksCount,
    coreDone,
    canShadow,
    // actions
    startFarming,
    stopFarming,
    completeTask,
    addReferral,
    submitWallet,
    activateShadowMode,
  }
}
