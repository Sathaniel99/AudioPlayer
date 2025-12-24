// Componentes
import { ButtonControl, CoverSongs } from "./index";
// Iconos
import { BiShuffle } from "react-icons/bi";
// Hooks
import { usePlayer } from "@/hooks/usePlayer";


export function PlaylistElements() {
    const {
        currentSong,
        playlist,
        timeSong,
        totalTimeSong,
        // Funciones
        selectSong,
        handlePlayPause,
        getPlay_Pause,
        handleCreateShuffle,

    } = usePlayer();

    return (
        <>
            {/* Boton para seleccionar aleatorio */}
            <div className="flex justify-start p-1">
                <button className="flex items-center gap-1 py-1 px-2 border border-purple-950 active:border-purple-950/25 bg-purple-900/15 hover:bg-purple-950 active:bg-purple-950/50 transition-all rounded text-sm" onClick={() => handleCreateShuffle()}><BiShuffle /> Aleatorio</button>
            </div>
            {/* Lista de reproduccion */}
            <div className='flex-1 flex flex-col gap-1 px-1 overflow-y-auto'>
                {/* Elementos/Canciones */}
                {playlist.map((element, index) => (
                    <div
                        className={`grid grid-cols-[auto_1fr_auto] p-1 border transition-all select-none cursor-pointer rounded ${currentSong.url === element.url ? 'text-primary font-bold bg-linear-30 from-black to-purple-950/90 border-bt border-purple-950' : 'text-primary border-neutral-800 bg-neutral-950/50 backdrop-blur-2xl hover:bg-purple-950/45 active:bg-purple-950/25'}`}
                        role="button" key={index} onClick={() => selectSong(element)}>
                        {/* Minicuadro de Play/Pause o imagen de cover*/}
                        <div className="w-12 flex justify-center items-center">
                            {currentSong?.url === element.url ? (
                                <ButtonControl icon={getPlay_Pause().icon} text={getPlay_Pause().text} handled={handlePlayPause} />
                            ) : (
                                <CoverSongs name={element.name} artist={element.artist} variant="album" />
                            )}
                        </div>
                        {/* Nombre de la canción y del artista */}
                        <div className="text-start w-full py-1 px-2">
                            <h1 className="text-xl">
                                {element.name}
                            </h1>
                            <h2 className="text-xs">
                                {element.artist}
                            </h2>
                        </div>
                        <div className="text-sm h-full flex justify-center items-center px-1">
                            {currentSong.url === element.url ?
                                <div className="flex flex-col items-center">
                                    <span className="border-b border-cyan-600">{timeSong}</span>
                                    <span className="border-t border-cyan-600">{totalTimeSong}</span>
                                </div>
                                : ''}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}