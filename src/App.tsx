import './App.css'
import { Player, Playlist } from './components/index'

function App() {
  return (
    <div className='h-130 w-full min-[30rem]:w-auto flex justify-center overflow-hidden bg-radial from-purple-950/90 to-black bg-neutral-900/25 border border-neutral-900 rounded-lg backdrop-blur-2xl'>
      <Playlist />
      <Player />
    </div>
  )
}

export default App
