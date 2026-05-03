import React, { useState, useEffect } from 'react'
import { KatakanaLoader } from './components/UI'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import AirdropDashboard from './screens/AirdropDashboard'
import LeaderboardScreen from './screens/LeaderboardScreen'
import TokenScreen from './screens/TokenScreen'
import ProfileScreen from './screens/ProfileScreen'
import { initSupabase } from './lib/supabase'
import { TG } from './lib/tg'
import { useGameState } from './hooks/useGameState'
import { useUser } from './hooks/useUser'

export default function App() {
  const [tab, setTab]     = useState('home')
  const [ready, setReady] = useState(false)

  const { user, refCount, loading } = useUser()

  const game = useGameState(user)

  useEffect(() => {
    async function boot() {
      try {
        TG.ready()
        TG.expand()
        document.body.style.overflow  = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        document.body.style.position  = 'fixed'
        document.body.style.width     = '100%'
        await initSupabase(TG.initData)
        window.addEventListener('navigate', (e) => setTab(e.detail))
      } catch (e) {
        console.error(e)
      } finally {
        setReady(true)
      }
    }
    boot()
  }, [])

  function navigate(id) {
    try { TG.haptic('selection') } catch (e) {}
    setTab(id)
  }

  if (!ready || loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--ink)' }}>
        <KatakanaLoader />
      </div>
    )
  }

  const sharedProps = { user, refCount, game, navigate }

  const screens = {
    home:        <HomeScreen        {...sharedProps} />,
    tasks:       <AirdropDashboard  {...sharedProps} />,
    leaderboard: <LeaderboardScreen {...sharedProps} />,
    token:       <TokenScreen       {...sharedProps} />,
    profile:     <ProfileScreen     {...sharedProps} />,
  }

  return (
    <div style={{
      height: '100vh',
      // eslint-disable-next-line no-dupe-keys
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--ink)',
      overflow: 'hidden',
      position: 'relative',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', WebkitOverflowScrolling: 'touch' }}>
        {screens[tab] ?? screens.home}
      </div>
      <BottomNav active={tab} onChange={navigate} />
    </div>
  )
}
