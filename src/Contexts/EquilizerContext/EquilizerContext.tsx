// Hooks
import React, { useState, useEffect, useRef, useCallback } from 'react';
// Types
import type { EqualizerContextType } from './useEqualizer';
import { EqualizerContext } from './useEqualizer';
// Context
import { usePlayer } from '../PlayerContext/usePlayer';
// Utils
import { getAudioContext } from './useAudioContext';

export const EqualizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { audioRef, currentSong } = usePlayer();

    // Estados de filtros
    const [lowGain, setLowGain] = useState<number>(0);
    const [lowMidDownGain, setLowMidDownGain] = useState<number>(0);
    const [lowMidUpGain, setLowMidUpGain] = useState<number>(0);
    const [midGain, setMidGain] = useState<number>(0);
    const [midHighDownGain, setMidHighDownGain] = useState<number>(0);
    const [midHighUpGain, setMidHighUpGain] = useState<number>(0);
    const [highGain, setHighGain] = useState<number>(0);

    // Referencia del contexto de audio y fuente
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaElementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    // Referencias de los filtros
    const Low_Filter = useRef<BiquadFilterNode | null>(null);
    const LowMid_L_Filter = useRef<BiquadFilterNode | null>(null);
    const LowMid_H_Filter = useRef<BiquadFilterNode | null>(null);
    const Mid_Filter = useRef<BiquadFilterNode | null>(null);
    const MidHigh_L_Filter = useRef<BiquadFilterNode | null>(null);
    const MidHigh_H_Filter = useRef<BiquadFilterNode | null>(null);
    const High_Filter = useRef<BiquadFilterNode | null>(null);

    // Track del elemento de audio actual para detectar cambios
    const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);

    // Limpiar todo el grafo de audio
    const cleanupAudioGraph = useCallback(() => {

        // Desconectar todos los filtros
        const filters = [
            Low_Filter,
            LowMid_L_Filter,
            LowMid_H_Filter,
            Mid_Filter,
            MidHigh_L_Filter,
            MidHigh_H_Filter,
            High_Filter
        ];

        filters.forEach(filterRef => {
            if (filterRef.current) {
                try {
                    filterRef.current.disconnect();
                } catch (e) {
                    console.log(e);
                }
                filterRef.current = null;
            }
        });

        // Desconectar la fuente si existe
        if (mediaElementSourceRef.current) {
            try {
                mediaElementSourceRef.current.disconnect();
            } catch (e) {
                console.warn('Error al desconectar mediaElementSource:', e);
            }
            mediaElementSourceRef.current = null;
        }
    }, []);

    // Recrea completamente el elemento de audio cuando cambia la canción
    useEffect(() => {
        const audioElement = audioRef.current;

        // Si no hay elemento de audio, limpiar y salir
        if (!audioElement) {
            cleanupAudioGraph();
            currentAudioElementRef.current = null;
            return;
        }

        // Si el elemento de audio cambió o es la primera vez
        if (currentAudioElementRef.current !== audioElement) {
            cleanupAudioGraph();
            currentAudioElementRef.current = audioElement;
        }

        // Si no hay canción, solo limpiar
        if (currentSong.url === "") {
            cleanupAudioGraph();
            return;
        }

        // Configurar AudioContext si no existe
        if (!audioContextRef.current) {
            const context = getAudioContext();
            if (!context) {
                console.warn('AudioContext no disponible en este navegador');
                return;
            }
            audioContextRef.current = context;
        }

        const audioContext = audioContextRef.current;

        // Reanudar el contexto si está suspendido
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        // IMPORTANTE: Crea una NUEVA fuente de audio
        // Cada vez que cambia la canción, necesitamos una nueva fuente
        if (!mediaElementSourceRef.current) {

            try {
                mediaElementSourceRef.current = audioContext.createMediaElementSource(audioElement);
            } catch (error) {
                console.error('Error creating MediaElementSource:', error);

                // Si falla la creación, intentar resetear el elemento de audio
                if (audioElement.src) {
                    const currentSrc = audioElement.src;
                    const currentTime = audioElement.currentTime;
                    const isPlaying = !audioElement.paused;

                    // Resetear el elemento de audio
                    audioElement.src = '';
                    audioElement.src = currentSrc;
                    audioElement.currentTime = currentTime;

                    if (isPlaying) {
                        audioElement.play().catch(e => console.warn('Error al reanudar:', e));
                    }

                    // Intentar crear la fuente nuevamente
                    try {
                        mediaElementSourceRef.current = audioContext.createMediaElementSource(audioElement);
                        console.log('Created MediaElementSource after reset');
                    } catch (retryError) {
                        console.error('Failed to create MediaElementSource after reset:', retryError);
                        return;
                    }
                }
                return;
            }
        }

        // Crear filtros (si no existen)
        if (!Low_Filter.current) Low_Filter.current = audioContext.createBiquadFilter();
        if (!LowMid_L_Filter.current) LowMid_L_Filter.current = audioContext.createBiquadFilter();
        if (!LowMid_H_Filter.current) LowMid_H_Filter.current = audioContext.createBiquadFilter();
        if (!Mid_Filter.current) Mid_Filter.current = audioContext.createBiquadFilter();
        if (!MidHigh_L_Filter.current) MidHigh_L_Filter.current = audioContext.createBiquadFilter();
        if (!MidHigh_H_Filter.current) MidHigh_H_Filter.current = audioContext.createBiquadFilter();
        if (!High_Filter.current) High_Filter.current = audioContext.createBiquadFilter();

        // Configurar filtros
        Low_Filter.current.type = 'lowshelf';
        LowMid_L_Filter.current.type = 'peaking';
        LowMid_H_Filter.current.type = 'peaking';
        Mid_Filter.current.type = 'peaking';
        MidHigh_L_Filter.current.type = 'peaking';
        MidHigh_H_Filter.current.type = 'peaking';
        High_Filter.current.type = 'highshelf';

        // Configurar frecuencias y Q
        Low_Filter.current.frequency.value = 60;
        LowMid_L_Filter.current.frequency.value = 230;
        LowMid_L_Filter.current.Q.value = 1;
        LowMid_H_Filter.current.frequency.value = 350;
        LowMid_H_Filter.current.Q.value = 1;
        Mid_Filter.current.frequency.value = 1000;
        Mid_Filter.current.Q.value = 1;
        MidHigh_L_Filter.current.frequency.value = 6000;
        MidHigh_L_Filter.current.Q.value = 1;
        MidHigh_H_Filter.current.frequency.value = 10000;
        MidHigh_H_Filter.current.Q.value = 1;
        High_Filter.current.frequency.value = 20000;

        // Configurar ganancias
        Low_Filter.current.gain.value = lowGain;
        LowMid_L_Filter.current.gain.value = lowMidDownGain;
        LowMid_H_Filter.current.gain.value = lowMidUpGain;
        Mid_Filter.current.gain.value = midGain;
        MidHigh_L_Filter.current.gain.value = midHighDownGain;
        MidHigh_H_Filter.current.gain.value = midHighUpGain;
        High_Filter.current.gain.value = highGain;

        // Conectar todo el grafo de audio
        if (mediaElementSourceRef.current) {
            mediaElementSourceRef.current.connect(Low_Filter.current);
            Low_Filter.current.connect(LowMid_L_Filter.current);
            LowMid_L_Filter.current.connect(LowMid_H_Filter.current);
            LowMid_H_Filter.current.connect(Mid_Filter.current);
            Mid_Filter.current.connect(MidHigh_L_Filter.current);
            MidHigh_L_Filter.current.connect(MidHigh_H_Filter.current);
            MidHigh_H_Filter.current.connect(High_Filter.current);
            High_Filter.current.connect(audioContext.destination);
        }

        // Limpiar al desmontar
        return () => {
            // Solo limpiar completamente si realmente estamos cambiando de canción
            // No limpiar si solo se actualizan las ganancias
            if (audioRef.current !== currentAudioElementRef.current) {
                cleanupAudioGraph();
                currentAudioElementRef.current = null;
            }
        };
        // IMPORTANTE: Solo dependemos de la URL de la canción y del audioRef
        // No incluimos las ganancias para evitar recreaciones innecesarias
    }, [currentSong.url, audioRef, cleanupAudioGraph]);

    // Efectos separados para actualizar ganancias (sin recrear el grafo)
    useEffect(() => {
        if (Low_Filter.current) {
            Low_Filter.current.gain.value = lowGain;
        }
    }, [lowGain]);

    useEffect(() => {
        if (LowMid_L_Filter.current) {
            LowMid_L_Filter.current.gain.value = lowMidDownGain;
        }
    }, [lowMidDownGain]);

    useEffect(() => {
        if (LowMid_H_Filter.current) {
            LowMid_H_Filter.current.gain.value = lowMidUpGain;
        }
    }, [lowMidUpGain]);

    useEffect(() => {
        if (Mid_Filter.current) {
            Mid_Filter.current.gain.value = midGain;
        }
    }, [midGain]);

    useEffect(() => {
        if (MidHigh_L_Filter.current) {
            MidHigh_L_Filter.current.gain.value = midHighDownGain;
        }
    }, [midHighDownGain]);

    useEffect(() => {
        if (MidHigh_H_Filter.current) {
            MidHigh_H_Filter.current.gain.value = midHighUpGain;
        }
    }, [midHighUpGain]);

    useEffect(() => {
        if (High_Filter.current) {
            High_Filter.current.gain.value = highGain;
        }
    }, [highGain]);

    // Funcion para aplicar los presets
    const applyPreset = (presets: number[]): void => {
        if (presets && presets.length === 7) {
            setLowGain(presets[0]);
            setLowMidDownGain(presets[1]);
            setLowMidUpGain(presets[2]);
            setMidGain(presets[3]);
            setMidHighDownGain(presets[4]);
            setMidHighUpGain(presets[5]);
            setHighGain(presets[6]);
        }
    };

    // Valor del contexto
    const contextValue: EqualizerContextType = {
        // Estados
        lowGain,
        lowMidDownGain,
        lowMidUpGain,
        midGain,
        midHighDownGain,
        midHighUpGain,
        highGain,

        // Funciones
        setLowGain,
        setLowMidDownGain,
        setLowMidUpGain,
        setMidGain,
        setMidHighDownGain,
        setMidHighUpGain,
        setHighGain,
        applyPreset,
    };

    return (
        <EqualizerContext.Provider value={contextValue}>
            {children}
        </EqualizerContext.Provider>
    );
};