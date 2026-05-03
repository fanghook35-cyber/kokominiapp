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

const SCREENS = {
  home:        HomeScreen,
  tasks:       AirdropDashboard,
  leaderboard: LeaderboardScreen,
  token:       TokenScreen,
  profile:     ProfileScreen,
}

export default function App() {
  const [tab, setTab]     = useState('home')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function boot() {
      try {
        TG.ready()
        TG.expand()
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
        await initSupabase(TG.initData)
        window.addEventListener('navigate', (e) => setTab(e.detail))
      } catch(e) {
        console.error(e)
      } finally {
        setReady(true)
      }
    }
    boot()
  }, [])

  function handleTabChange(id) {
    try { TG.haptic('selection') } catch(e) {}
    setTab(id)
  }

  if (!ready) {
    return (
      <div style={{ height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'var(--ink)' }}>
        <KatakanaLoader />
      </div>
    )
  }

  const Screen = SCREENS[tab]

  return (
    <div style={{
      height: '100vh',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--ink)',
      overflow: 'hidden',
      position: 'relative',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <Screen key={tab} />
      </div>
      <BottomNav active={tab} onChange={handleTabChange} />
    </div>
  )
}
