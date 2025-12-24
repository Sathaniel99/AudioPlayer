import './App.css'
import { Player, Playlist } from './components/index'

function App() {
  return (
    <div className='flex h-130 g-radial from-purple-950/90 to-black border border-neutral-900 backdrop-blur-2xl bg-neutral-900/25 rounded-lg overflow-hidden'>
      <Playlist />
      <Player />
    </div>
  )
}

export default App
