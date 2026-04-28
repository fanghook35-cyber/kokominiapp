import { useState, useEffect, useCallback } from 'react'
import { fetchUser, fetchReferralCount, subscribeToUser } from '../lib/supabase'
import { TG, DEV_USER } from '../lib/tg'

export function useUser() {
  const [user, setUser]         = useState(null)
  const [refCount, setRefCount] = useState(0)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const telegramId = TG.userId ?? DEV_USER.telegram_id

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (!TG.isAvailable) {
        // Dev mode: use mock data
        setUser(DEV_USER)
        setRefCount(12)
        return
      }

      const u = await fetchUser(telegramId)
      setUser(u)
      const rc = await fetchReferralCount(u.referral_code)
      setRefCount(rc)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [telegramId])

  useEffect(() => {
    load()
  }, [load])

  // Real-time subscription
  useEffect(() => {
    if (!TG.isAvailable) return
    const channel = subscribeToUser(telegramId, (updated) => {
      setUser(updated)
    })
    return () => { channel.unsubscribe() }
  }, [telegramId])

  return { user, refCount, loading, error, reload: load }
}
