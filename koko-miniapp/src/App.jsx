import React, { useState, useEffect } from 'react'
import { KatakanaLoader } from './components/UI'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import TasksScreen from './screens/TasksScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import TokenScreen from './screens/TokenScreen'
import ProfileScreen from './screens/ProfileScreen'
import { initSupabase } from './lib/supabase'
import { TG } from './lib/tg'

const SCREENS = {
  home:        HomeScreen,
  tasks:       TasksScreen,
  leaderboard: LeaderboardScreen,
  token:       TokenScreen,
  profile:     ProfileScreen,
}

export default function App() {
  const [tab, setTab]       = useState('home')
  const [ready, setReady]   = useState(false)
  const [error, setError]   = useState(null)

  useEffect(() => {
    async function boot() {
      try {
        TG.ready()
        TG.expand()
        await initSupabase(TG.initData)
        setReady(true)
      } catch(e) {
        console.error(e)
        setError(e.message)
        setReady(true) // show app anyway (dev mode)
      }
    }
    boot()
  }, [])

  function handleTabChange(id) {
    TG.haptic('selection')
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
      height:'100vh', height:'100dvh',
      display:'flex', flexDirection:'column',
      background:'var(--ink)',
      overflow:'hidden',
    }}>
      {/* Screen area */}
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <Screen key={tab} />
      </div>

      {/* Bottom nav */}
      <BottomNav active={tab} onChange={handleTabChange} />
    </div>
  )
}
