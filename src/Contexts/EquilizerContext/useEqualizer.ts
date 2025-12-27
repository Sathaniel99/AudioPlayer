// Hooks
import { createContext, useContext } from "react";

export type EqualizerContextType = {
    // Estados
    lowGain: number;
    lowMidDownGain: number;
    lowMidUpGain: number;
    midGain: number;
    midHighDownGain: number;
    midHighUpGain: number;
    highGain: number;

    // Funciones
    setLowGain: (value: number) => void;
    setLowMidDownGain: (value: number) => void;
    setLowMidUpGain: (value: number) => void;
    setMidGain: (value: number) => void;
    setMidHighDownGain: (value: number) => void;
    setMidHighUpGain: (value: number) => void;
    setHighGain: (value: number) => void;
    applyPreset: (presets: number[]) => void;
};

export const EqualizerContext = createContext<EqualizerContextType | undefined>(undefined);

export const useEqualizer = () => {
    const context = useContext(EqualizerContext);
    if (!context) {
        throw new Error('useEqualizer debe usarse dentro de un EqualizerProvider');
    }
    return context;
};
