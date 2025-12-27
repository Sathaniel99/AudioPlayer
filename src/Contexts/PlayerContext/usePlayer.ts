// Hooks
import { useContext, createContext, type ReactNode } from 'react';

export type ReproModeProps = 'shuffle' | 'repeat' | 'list';

export interface SongProps {
  url: string;
  name: string;
  artist: string;
  cover?: string
}

export interface PlayerProviderProps {
  children: ReactNode;
}

export interface PlayerContextType {
  // Estados
  audioRef: React.RefObject<HTMLAudioElement | null>,
  timeSong: string,
  totalTimeSong: string,
  timeSongPercent: number,
  volume: number,
  reproMode: ReproModeProps,
  currentSong: SongProps,
  isMuted: boolean,
  isPlaying: boolean,
  isLoadingSongs: boolean,
  isSelectedMusic: boolean,
  playlist: SongProps[],
  shuffleHistory: SongProps[],

  // Funciones
  getSongs: () => void;
  handlerPlay: () => void;
  handledMoveTime: (value: number[]) => void;
  handlerLoadedMetadata: () => void;
  changeVolume: (actualVolume: number[]) => void;
  getVolumeIcon: () => React.ReactNode;
  toggleMute: () => void;
  handlePlayPause: () => void;
  getPlay_Pause: () => { icon: React.ReactNode, text: string };
  handleAnteriorSong: () => void;
  handleSiguienteSong: () => void;
  handleStop: () => void;
  changeReproMode: () => void;
  selectSong: (song: SongProps) => void;
  handleCanPlay: () => void;
  handleCreateShuffle: () => void;
  // Funciones sin utilizar aun
  handlePlaylistState: (song: SongProps, cmd: 'add' | 'delete' | 'clear' | 'check') => void;
  handleShuffleHistory: (song: SongProps, cmd: 'add' | 'delete' | 'clear' | 'check') => void;
  handleSetPlaylist: (songs: SongProps[]) => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer debe usarse dentro de un PlayerProvider');
  }
  return context;
};