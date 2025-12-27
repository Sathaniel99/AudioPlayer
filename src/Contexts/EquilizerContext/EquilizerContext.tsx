// Hooks
import React, { useState, useEffect, useRef } from 'react';
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

    // Referencia del contexto de audio
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaElementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    
    // Referencias de los filtros y contexto de audio
    const Low_Filter = useRef<BiquadFilterNode | null>(null);
    const LowMid_L_Filter = useRef<BiquadFilterNode | null>(null);
    const LowMid_H_Filter = useRef<BiquadFilterNode | null>(null);
    const Mid_Filter = useRef<BiquadFilterNode | null>(null);
    const MidHigh_L_Filter = useRef<BiquadFilterNode | null>(null);
    const MidHigh_H_Filter = useRef<BiquadFilterNode | null>(null);
    const High_Filter = useRef<BiquadFilterNode | null>(null);

    // Configuración de los filtros - se ejecuta cuando cambia la canción
    useEffect(() => {
        if (currentSong.url === "" || !audioRef.current) {
            // Limpiar conexiones si no hay canción
            if (mediaElementSourceRef.current) {
                mediaElementSourceRef.current.disconnect();
                mediaElementSourceRef.current = null;
            }
            return;
        }

        const audioElement = audioRef.current;

        // Crear o reutilizar el contexto de audio
        if (!audioContextRef.current) {
            const context = getAudioContext();
            if (!context) {
                console.warn('AudioContext no disponible en este navegador');
                return;
            }
            audioContextRef.current = context;
        }

        const audioContext = audioContextRef.current;

        // Reanudar el contexto de audio si está suspendido (requerido por navegadores)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        // Si ya existe una fuente, desconectarla
        if (mediaElementSourceRef.current) {
            mediaElementSourceRef.current.disconnect();
        }

        // Crear nueva fuente de audio desde el elemento <audio>
        mediaElementSourceRef.current = audioContext.createMediaElementSource(audioElement);

        // Crear filtros
        Low_Filter.current = audioContext.createBiquadFilter();
        LowMid_L_Filter.current = audioContext.createBiquadFilter();
        LowMid_H_Filter.current = audioContext.createBiquadFilter();
        Mid_Filter.current = audioContext.createBiquadFilter();
        MidHigh_L_Filter.current = audioContext.createBiquadFilter();
        MidHigh_H_Filter.current = audioContext.createBiquadFilter();
        High_Filter.current = audioContext.createBiquadFilter();

        // Configurar tipos de filtros
        if (Low_Filter.current) Low_Filter.current.type = 'lowshelf';
        if (LowMid_L_Filter.current) LowMid_L_Filter.current.type = 'peaking';
        if (LowMid_H_Filter.current) LowMid_H_Filter.current.type = 'peaking';
        if (Mid_Filter.current) Mid_Filter.current.type = 'peaking';
        if (MidHigh_L_Filter.current) MidHigh_L_Filter.current.type = 'peaking';
        if (MidHigh_H_Filter.current) MidHigh_H_Filter.current.type = 'peaking';
        if (High_Filter.current) High_Filter.current.type = 'highshelf';

        // Configurar frecuencias y Q
        if (Low_Filter.current) Low_Filter.current.frequency.value = 60;
        if (LowMid_L_Filter.current) {
            LowMid_L_Filter.current.frequency.value = 230;
            LowMid_L_Filter.current.Q.value = 1;
        }
        if (LowMid_H_Filter.current) {
            LowMid_H_Filter.current.frequency.value = 350;
            LowMid_H_Filter.current.Q.value = 1;
        }
        if (Mid_Filter.current) {
            Mid_Filter.current.frequency.value = 1000;
            Mid_Filter.current.Q.value = 1;
        }
        if (MidHigh_L_Filter.current) {
            MidHigh_L_Filter.current.frequency.value = 6000;
            MidHigh_L_Filter.current.Q.value = 1;
        }
        if (MidHigh_H_Filter.current) {
            MidHigh_H_Filter.current.frequency.value = 10000;
            MidHigh_H_Filter.current.Q.value = 1;
        }
        if (High_Filter.current) High_Filter.current.frequency.value = 20000;

        // Configurar ganancias iniciales
        if (Low_Filter.current) Low_Filter.current.gain.value = lowGain;
        if (LowMid_L_Filter.current) LowMid_L_Filter.current.gain.value = lowMidDownGain;
        if (LowMid_H_Filter.current) LowMid_H_Filter.current.gain.value = lowMidUpGain;
        if (Mid_Filter.current) Mid_Filter.current.gain.value = midGain;
        if (MidHigh_L_Filter.current) MidHigh_L_Filter.current.gain.value = midHighDownGain;
        if (MidHigh_H_Filter.current) MidHigh_H_Filter.current.gain.value = midHighUpGain;
        if (High_Filter.current) High_Filter.current.gain.value = highGain;

        // Conectar filtros en serie
        if (mediaElementSourceRef.current) {
            mediaElementSourceRef.current.connect(Low_Filter.current);
            Low_Filter.current.connect(LowMid_L_Filter.current!);
            LowMid_L_Filter.current!.connect(LowMid_H_Filter.current!);
            LowMid_H_Filter.current!.connect(Mid_Filter.current!);
            Mid_Filter.current!.connect(MidHigh_L_Filter.current!);
            MidHigh_L_Filter.current!.connect(MidHigh_H_Filter.current!);
            MidHigh_H_Filter.current!.connect(High_Filter.current!);
            High_Filter.current!.connect(audioContext.destination);
        }

        // Limpiar al desmontar o cambiar de canción
        return () => {
            if (mediaElementSourceRef.current) {
                mediaElementSourceRef.current.disconnect();
            }
            // No desconectamos los filtros individualmente porque ya están desconectados al desconectar la fuente
        };
    }, [currentSong.url, audioRef]);

    // Actualizar filtros cuando cambien las ganancias
    useEffect(() => {
        if (Low_Filter.current) Low_Filter.current.gain.value = lowGain;
    }, [lowGain]);

    useEffect(() => {
        if (LowMid_L_Filter.current) LowMid_L_Filter.current.gain.value = lowMidDownGain;
    }, [lowMidDownGain]);

    useEffect(() => {
        if (LowMid_H_Filter.current) LowMid_H_Filter.current.gain.value = lowMidUpGain;
    }, [lowMidUpGain]);

    useEffect(() => {
        if (Mid_Filter.current) Mid_Filter.current.gain.value = midGain;
    }, [midGain]);

    useEffect(() => {
        if (MidHigh_L_Filter.current) MidHigh_L_Filter.current.gain.value = midHighDownGain;
    }, [midHighDownGain]);

    useEffect(() => {
        if (MidHigh_H_Filter.current) MidHigh_H_Filter.current.gain.value = midHighUpGain;
    }, [midHighUpGain]);

    useEffect(() => {
        if (High_Filter.current) High_Filter.current.gain.value = highGain;
    }, [highGain]);

    // Funcion para aplicar los presets ( Classical - Dance - Folk - Heavy Metal - Hip-Hop - Jazz - Pop - Rock - Reggaeton )
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