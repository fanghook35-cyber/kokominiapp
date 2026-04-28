import { useState, useEffect } from 'react'
import { fetchLeaderboard } from '../lib/supabase'
import { TG } from '../lib/tg'

const MOCK_BOARD = Array.from({ length: 20 }, (_, i) => ({
  rank: i + 1,
  telegram_id: 1000000 + i,
  username: ['shadow_walker', 'nihonkai_oni', 'koko_believer', 'exile_returns', 'forest_ghost',
             'ronin_coder', 'empress_guard', 'village_elder', 'kairoku_echo', 'silent_blade',
             'dark_blossom', 'tsuki_no_me', 'kage_no_ko', 'hana_exile', 'mugen_sama',
             'iron_lotus', 'void_dancer', 'oni_reborn', 'mist_walker', 'last_witness'][i],
  first_name: ['Shadow', 'Nihon', 'Believer', 'Exile', 'Ghost',
               'Ronin', 'Guard', 'Elder', 'Echo', 'Blade',
               'Blossom', 'Moon', 'Shadow', 'Hana', 'Mugen',
               'Iron', 'Void', 'Oni', 'Mist', 'Last'][i],
  points: Math.floor(50_000_000 / (i + 1)),
  tokens_allocated: Math.floor(5_000_000 / (i + 1)),
}))

export function useLeaderboard() {
  const [board, setBoard]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        if (!TG.isAvailable) {
          setBoard(MOCK_BOARD)
          return
        }
        const data = await fetchLeaderboard()
        setBoard(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { board, loading }
}
