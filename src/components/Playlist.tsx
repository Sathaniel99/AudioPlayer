// Hooks
import { usePlayer } from "@/hooks/usePlayer";
// Componentes
import { PlaylistElements } from "./index";


export function Playlist() {
    const {
        playlist,
        // Funciones
    } = usePlayer();

    return (
        <div className='hidden md:flex h-full flex-col w-sm backdrop-blur-2xl bg-purple-950/10 relative'>
            {/* Barra de titulo */}
            <div className="w-full flex justify-between items-center p-2 bg-linear-150 from-black to-purple-950/50 border-b border-purple-900">
                <h1>Lista de reproducción</h1>
                <span className="bg-neutral-950 text-neutral-400 font-bold w-auto text-xs px-2 py-1 rounded-lg">{playlist.length} Elemento{playlist.length != 1 && 's'}</span>
            </div>
            <PlaylistElements />
        </div>

    )
}