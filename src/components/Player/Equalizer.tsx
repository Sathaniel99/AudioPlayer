// Hooks
import { useState } from "react"
// Componentes
import { Button } from "../ui/index"
import { VerticalSlider } from "../index";
import { useEqualizer } from "@/Contexts/EquilizerContext/useEqualizer";

export function Equalizer() {
    const {
        lowGain,
        lowMidDownGain,
        lowMidUpGain,
        midGain,
        midHighDownGain,
        midHighUpGain,
        highGain,
        setLowGain,
        setLowMidDownGain,
        setLowMidUpGain,
        setMidGain,
        setMidHighDownGain,
        setMidHighUpGain,
        setHighGain,
        applyPreset,
    } = useEqualizer();
    const [configEQ, setConfigEQ] = useState<number[]>([lowGain, lowMidDownGain, lowMidUpGain, midGain, midHighDownGain, midHighUpGain, highGain]);
    const [selectConfigEQ, setSelectConfigEQ] = useState<number>();

    const freq = [
        { label: '60', eq: lowGain },
        { label: '230', eq: lowMidDownGain },
        { label: '350', eq: lowMidUpGain },
        { label: '1k', eq: midGain },
        { label: '6k', eq: midHighDownGain },
        { label: '10k', eq: midHighUpGain },
        { label: '20k', eq: highGain },
    ];

    const presets = [
        { genre: "Classical", config: [-2.5, 1.2, 0.0, 1.5, 3.0, 2.5, 2.0] },
        { genre: "Dance", config: [5.0, 4.0, -1.5, 0.0, 2.5, 3.5, 2.0] },
        { genre: "Folk", config: [1.5, 2.2, 1.0, 0.5, 1.5, 2.0, 1.0] },
        { genre: "Heavy Metal", config: [5.0, 3.5, -2.0, 1.0, 3.5, 4.0, 3.0] },
        { genre: "Hip-Hop", config: [5.0, 4.5, -0.5, 1.0, 2.5, 3.0, 2.0] },
        { genre: "Jazz", config: [3.0, 2.5, 1.0, 0.5, 1.5, 2.0, 1.5] },
        { genre: "Pop", config: [3.5, 2.5, 0.0, 1.2, 2.0, 2.5, 1.5] },
        { genre: "Rock", config: [2.5, 3.5, -1.0, 1.5, 3.0, 3.5, 2.5] },
        { genre: "Reggaeton", config: [4, 5.0, -0.5, 1.0, 2.5, 3.5, 2.5] }
    ];

    const handleSetConfig = (config: number[], i: number) => {
        applyPreset([config[0], config[1], config[2], config[3], config[4], config[5], config[6]]);
        setSelectConfigEQ(i);
    };

    const handleGainChange = (index: number, value: number[]) => {
        const newValue = value[0];
        const newConfigEQ = [...configEQ];
        newConfigEQ[index] = newValue;
        setConfigEQ(newConfigEQ);
        setSelectConfigEQ(-1);

        // Actualizar el estado correspondiente en el contexto
        switch (index) {
            case 0:
                setLowGain(newValue);
                break;
            case 1:
                setLowMidDownGain(newValue);
                break;
            case 2:
                setLowMidUpGain(newValue);
                break;
            case 3:
                setMidGain(newValue);
                break;
            case 4:
                setMidHighDownGain(newValue);
                break;
            case 5:
                setMidHighUpGain(newValue);
                break;
            case 6:
                setHighGain(newValue);
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 max-w-80 mx-auto my-2">
            {/* Selector de presets */}
            <div className="flex gap-2 max-md:w-100 px-1 py-2 hide-scrollbar bg-radial from-black to-neutral-900/5 backdrop-blur-3xl shadow shadow-neutral-950 overflow-x-scroll">
                <Button className="bg-purple-900/40 hover:bg-purple-900/60 text-white/80 border border-purple-700/50" onClick={() => handleSetConfig([0, 0, 0, 0, 0, 0, 0], -1)}>
                    Restablecer
                </Button>
                {presets.map((button, index) => (
                    <Button variant={selectConfigEQ === index ? 'default' : 'ghost'} key={index} onClick={() => handleSetConfig(button.config, index)}>
                        {button.genre}
                    </Button>
                ))}
            </div>

            {/* Contenedor de sliders verticales */}
            <div className="flex flex-row justify-between gap-2 w-full px-2">
                {freq.map((element, index) => (
                    <VerticalSlider
                        key={index}
                        index={index}
                        dB={element.eq}
                        freq={element.label}
                        change={(value: number[]) => handleGainChange(index, value)}
                    />
                ))}
            </div>
        </div>
    );
}
