// Componentes
import { Slider } from '@/components/ui/index';
import { DownloadButton, ButtonToggleReproMode, Controles, CoverSongs } from '@/components/index';
// Hooks
import { usePlayer } from '@/hooks/usePlayer';
import { useEffect } from 'react';

export function Player() {
  const {
    // ESTADOS
    audioRef,
    timeSong,
    totalTimeSong,
    timeSongPercent,
    isSelectedMusic,
    currentSong,
    // FUNCIONES
    getSongs,
    handlerPlay,
    handlerLoadedMetadata,
    handledMoveTime,
    handleCanPlay,
    handleSiguienteSong,
  } = usePlayer();

  useEffect(() => {
    getSongs();
  }, []);

  return (
    <div className='px-15 py-10 flex flex-col justify-center relative'>
      {/* Botones superiores */}
      <DownloadButton fileName={`${currentSong.artist} - ${currentSong.name}`} songUrl={currentSong.url}></DownloadButton>
      <ButtonToggleReproMode />

      {/* Imagen o Cover de la Canción */}
      <div className='flex justify-center items-center'>
        <CoverSongs artist={currentSong.artist} name={currentSong.name} variant='player' />
      </div>

      {/* Nombre de la canción y Artista */}
      <div className='my-2 text-center'>
        <h1 className='text-xl h-7'>{currentSong.artist ? currentSong.artist : 'Seleccione una canción.'}</h1>
        <h2 className='text-3xl h-9'>{currentSong.name ? currentSong.name :
          <span className='flex gap-3'>
            <div className='flex'>
              <p className='m-0 text-red-600'>A</p>
              <p className='m-0 text-yellow-600'>u</p>
              <p className='m-0 text-blue-600'>d</p>
              <p className='m-0 text-orange-600'>i</p>
              <p className='m-0 text-pink-600'>o</p>
              <p className='m-0 text-purple-600'>-</p>
              <p className='m-0 text-red-600'>P</p>
              <p className='m-0 text-yellow-600'>l</p>
              <p className='m-0 text-blue-600'>a</p>
              <p className='m-0 text-orange-600'>y</p>
              <p className='m-0 text-pink-600'>e</p>
              <p className='m-0 text-purple-600'>r</p>
            </div>
            <div className='flex'>
              <p className='m-0 text-yellow-600'>W</p>
              <p className='m-0 text-blue-600'>e</p>
              <p className='m-0 text-orange-600'>b</p>
            </div>
            <div className='flex'>
              <p className='m-0'>v</p>
              <p className='m-0 text-'>1</p>
              <p className='m-0 text-'>.</p>
              <p className='m-0 text-'>0</p>
            </div>
          </span>}</h2>
      </div>

      {/* Tiempo transcurrido, slider y Tiempo total del audio */}
      <audio className='hidden' ref={audioRef} onCanPlay={handleCanPlay} onEnded={handleSiguienteSong} onTimeUpdate={handlerPlay} onLoadedMetadata={handlerLoadedMetadata} src={currentSong.url} ></audio>
      <div className='flex justify-between gap-3 my-2'>
        <h2>{timeSong}</h2>
        <Slider
          defaultValue={[0]}
          value={[timeSongPercent]}
          onValueChange={handledMoveTime}
          max={100}
          disabled={!isSelectedMusic}
          step={0.1}
          className='cursor-pointer'
        />
        <h2>{totalTimeSong}</h2>
      </div>

      {/* Botones de control */}
      <div className='flex gap-3 justify-center my-3 items-center'>
        <Controles />
      </div>
    </div>
  )
}