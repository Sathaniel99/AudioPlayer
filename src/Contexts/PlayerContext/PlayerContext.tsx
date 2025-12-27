// Hooks
import React, { useState, useRef } from "react";
// Types
import type { PlayerProviderProps, SongProps, PlayerContextType } from './usePlayer';
import { PlayerContext } from "./usePlayer";
// Iconos
import { BiPause, BiPlay } from "react-icons/bi";
import { IoVolumeMute, IoVolumeLow, IoVolumeMedium, IoVolumeHigh } from "react-icons/io5";
// Librerias
import axios from 'axios';
// Componentes
import { toast } from "@/components/ui";
// Utiles
import { formatTime, getTimePercentage, getTimeFromPercentage, shuffleArray } from "@/lib/utils";


export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
    {/* ESTADOS DEL CONTEXTO */ }
    // Referencia de audio
    const audioRef = useRef<HTMLAudioElement>(null);
    
    // Estados para el tiempo y el transcurso de la canción
    const [timeSong, setTimeSong] = useState<string>("00:00");
    const [totalTimeSong, setTotalTimeSong] = useState<string>("00:00");
    const [timeSongPercent, setTimeSongPercent] = useState<number>(0);
    
    // Estados del reproductor
    const [volume, setVolume] = useState<number>(1);
    const [reproMode, setReproMode] = useState<'shuffle' | 'repeat' | 'list'>('list');
    const [currentSong, setCurrentSong] = useState<SongProps>({ url: '', name: '', artist: '', cover: '' });
    
    // Estados para evaluar
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isSelectedMusic, setIsSelectedMusic] = useState<boolean>(false);
    const [isLoadingSongs, setIsLoadingSongs] = useState<boolean>(false);

    // Estados para la playlist
    const [playlist, setPlaylist] = useState<SongProps[]>([]);
    const [shuffleHistory, setShuffleHistory] = useState<SongProps[]>([]);


    {/* FUNCIONES DEL CONTEXTO */ }
    // Obtener las canciones listadas en 'songs.json'
    // creo que seria mejor con un useEffect
    const getSongs = async () => {
        setIsLoadingSongs(true);
        try {
            const source = '/AudioPlayer/songs.json';
            const response = (await axios.get<SongProps[]>(source)).data;
            if (Array.isArray(response)) {
                setPlaylist(response);
                setShuffleHistory(shuffleArray(response));
                setTimeout(async () => {
                    setIsLoadingSongs(false);
                }, 2000);
            }
            else {
                toast.error('Formato de datos inválidos.')
            }
        } catch (error) {
            toast.error(`Error cargando canciones: ${error}`);
            setPlaylist([]);
        }
    };
    // Actualiza el tiempo de reproducción mientras se reproduce la canción
    const handlerPlay = () => {
        if (audioRef.current) {
            const currentTime = audioRef.current?.currentTime;
            const duration = audioRef.current?.duration;
            setTimeSong(formatTime(currentTime));
            setTimeSongPercent(getTimePercentage(currentTime, duration));
        }
    };
    // Actualizar el tiempo de la canción mientras se reproduce (usado para simular en el slider)
    const handledMoveTime = (value: number[]) => {
        const percentage = value[0];
        const duration = audioRef.current?.duration;

        if (duration) {
            const seekTime = getTimeFromPercentage(percentage, duration);
            if (audioRef.current) {
                audioRef.current.currentTime = seekTime;
            }
        }

        setTimeSongPercent(percentage);
    };
    // Para cuando se cargue una canción
    const handlerLoadedMetadata = () => {
        if (audioRef.current) {
            setTotalTimeSong(formatTime(audioRef.current?.duration))
        }
    }
    // Cambiar volumen
    const changeVolume = (actualVolume: number[]) => {
        const volumeValue = actualVolume[0];
        if (audioRef.current) {
            audioRef.current.volume = volumeValue;
            setVolume(volumeValue);
        }
    }
    // Obtener el icono de volumen de acuerdo al nivel de volumen
    const getVolumeIcon = (): React.ReactNode => {
        if (isMuted || volume == 0) {
            return <IoVolumeMute />;
        } else if (volume > 0 && volume < 0.5) {
            return <IoVolumeLow />;
        } else if (volume > 0.4 && volume < 0.8) {
            return <IoVolumeMedium />;
        } else {
            return <IoVolumeHigh />;
        }
    };
    // Intercambiar entre Mute y Unmute
    const toggleMute = () => {
        if (audioRef.current) {
            const newMutedState = !audioRef.current.muted;
            audioRef.current.muted = newMutedState;
            setIsMuted(newMutedState);
        }
    };
    // Reproducir/Pausar canción
    const handlePlayPause = () => {
        if (audioRef.current && audioRef.current.src == '') {
            toast.error("No hay musica seleccionada");
        }
        if (audioRef.current && currentSong && !isPlaying) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(error => {
                    toast.error(`Error al reproducir: ${error}`);
                    setIsPlaying(false);
                });
        }
        else if (audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(false);
        };
    };
    // Obtener icono y texto de acuerdo a la reproducción
    const getPlay_Pause = (): { icon: React.ReactNode, text: string } => {
        return {
            icon: isPlaying ? <BiPause /> : <BiPlay />,
            text: isPlaying ? 'Pausa' : 'Reproducir',
        }
    }
    // Anterior canción
    const handleAnteriorSong = () => {
        if (!currentSong?.url || playlist.length === 0) {
            return;
        }
        switch (reproMode) {
            case 'list':
                if (playlist.find(song => song.url === currentSong.url) != undefined) {
                    const index_actual = playlist.findIndex(song => song.url === currentSong.url);
                    if (playlist[index_actual - 1] && index_actual != 0) {
                        selectSong(playlist[index_actual - 1])
                    }
                    else {
                        toast.info('Primera canción de la lista.');
                    }
                }
                break;
            case 'repeat':
                selectSong(currentSong);
                break;
            case 'shuffle':
                if (shuffleHistory.find(song => song.url === currentSong.url) != undefined) {
                    const index_actual = shuffleHistory.findIndex(song => song.url === currentSong.url);
                    if (shuffleHistory[index_actual - 1] && index_actual != 0) {
                        selectSong(shuffleHistory[index_actual - 1])
                    }
                    else {
                        selectSong(shuffleHistory[shuffleHistory.length - 1])
                    }
                }
                break;

        }
    }
    // Siguiente canción
    const handleSiguienteSong = () => {
        switch (reproMode) {
            case 'list':
                if (playlist.find(song => song.url === currentSong.url) != undefined) {
                    const index_actual = playlist.findIndex(song => song.url === currentSong.url);
                    if (playlist[index_actual + 1]) {
                        selectSong(playlist[index_actual + 1])
                    }
                    else {
                        toast.info('Última canción de la lista.');
                    }
                }
                break;
            case 'repeat':
                selectSong(currentSong);
                break;
            case 'shuffle':
                if (shuffleHistory.find(song => song.url === currentSong.url) != undefined) {
                    const index_actual = shuffleHistory.findIndex(song => song.url === currentSong.url);
                    if (shuffleHistory[index_actual + 1]) {
                        selectSong(shuffleHistory[index_actual + 1])
                    }
                    else {
                        selectSong(shuffleHistory[0]);
                    }
                }
                break;

        }
    }
    // Detener canción
    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            setTimeSong("00:00");
            setTimeSongPercent(0);
        }
    };
    // Cambiar el modo de reproducir ( aleatorio - lista - repetir )
    const changeReproMode = () => {
        const types: ('shuffle' | 'repeat' | 'list')[] = ['shuffle', 'repeat', 'list'];
        const currentIndex = types.indexOf(reproMode);
        const nextIndex = (currentIndex + 1) % types.length;
        setReproMode(types[nextIndex]);
        if (reproMode == 'shuffle') {
            setShuffleHistory(shuffleArray(playlist));
        }
    };
    // Selecciona la canción y reinicia el reproductor estableciendo la canción por parametros
    // como la que se está ejecutando, establece que hay una canción seleccionada el porciento
    // de reproducción a 0 y el tiempo de canción
    const selectSong = async (song: SongProps) => {
        setCurrentSong(song);
        setIsSelectedMusic(true);
        setTimeSongPercent(0);
        setTimeSong("00:00");

        if (audioRef.current) {
            try {
                audioRef.current.src = song.url;
                audioRef.current.load();
            } catch (error) {
                toast.error(`Error al reproducir la canción: ${error}`);
                setIsPlaying(false);
            }

        }
    };
    // Para el evento onCanPlay cuando la canción esté disponible evaluar si (isPlaying) se mantuvo la canción anterior en reproduccion o pausa/stop
    const handleCanPlay = async () => {
        try {
            if (isPlaying) {
                await audioRef.current!.play();
            }
        } catch (error) {
            toast.error(`Error al reproducir después de cargar: ${error}`);
            setIsPlaying(false);
        }
    };
    // Crea una lista de reproducción aleatoria basandose en la lista principal
    const handleCreateShuffle = () => {
        setShuffleHistory(shuffleArray(playlist));
        setCurrentSong(shuffleHistory[0]);
        setTimeout(async () => {
            await audioRef.current?.play();
            setIsPlaying(true);
        }, 20);
    }

    // Funciones sin usar por ahora
    // son para añadir , eliminar , limpiar o buscar en la lista 
    // ( add - delete - clear - check ) de modo lista de reproducción
    const handlePlaylistState = (song: SongProps, cmd: 'add' | 'delete' | 'clear' | 'check') => {
        const newPlaylist = new Set(playlist);
        switch (cmd) {
            case 'add':
                newPlaylist.add(song);
                break;
            case 'delete':
                newPlaylist.delete(song);
                break;
            case 'clear':
                newPlaylist.clear();
                break;
            case 'check':
                newPlaylist.has(song);
                break;
        }
        setPlaylist(Array.from(newPlaylist));
    }
    // ( add - delete - clear - check ) de modo lista aleatoria
    const handleShuffleHistory = (song: SongProps, cmd: 'add' | 'delete' | 'clear' | 'check') => {
        const newShuffleHistory = new Set(shuffleHistory);
        switch (cmd) {
            case 'add':
                newShuffleHistory.add(song);
                break;
            case 'delete':
                newShuffleHistory.delete(song);
                break;
            case 'clear':
                newShuffleHistory.clear();
                break;
            case 'check':
                newShuffleHistory.has(song);
                break;
        }
        setShuffleHistory(Array.from(newShuffleHistory));
    }
    // Añade las canciones obtenidas a la playlist vacía (no está siendo usada aún pero actualiza la playlist completa)
    const handleSetPlaylist = (songs: SongProps[]) => {
        setPlaylist(songs);
    }
    

    {/* VALOR DEL CONTEXTO */ }
    const contextValue: PlayerContextType = {
        // Estados
        audioRef,
        timeSong,
        totalTimeSong,
        timeSongPercent,
        volume,
        reproMode,
        currentSong,
        isMuted,
        isPlaying,
        isLoadingSongs,
        isSelectedMusic,
        playlist,
        shuffleHistory,

        // Funciones
        getSongs,
        handlerPlay,
        handledMoveTime,
        handlerLoadedMetadata,
        changeVolume,
        getVolumeIcon,
        toggleMute,
        handlePlayPause,
        getPlay_Pause,
        handleAnteriorSong,
        handleSiguienteSong,
        handleStop,
        changeReproMode,
        selectSong,
        handleCanPlay,
        handleCreateShuffle,
        // Funciones sin utilizar aun
        handlePlaylistState,
        handleShuffleHistory,
        handleSetPlaylist,
    };
    return (
        <PlayerContext.Provider value={contextValue}>
            {children}
        </PlayerContext.Provider >
    );
}