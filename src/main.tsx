import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PlayerProvider } from './Contexts/PlayerContext/PlayerContext.tsx'
import { Toaster } from "@/components/ui/index"

createRoot(document.getElementById('root')!).render(
  <>
    <Toaster position='top-right' closeButton duration={1}/>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </>
)
