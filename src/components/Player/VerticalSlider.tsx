// Componentes
import { Slider } from "@/components/ui/index";

interface VerticalSliderProps {
    change?: (value: number[]) => void;
    freq: string;
    dB: number;
    index: number;
}

export function VerticalSlider({ change, freq, dB }: VerticalSliderProps) {
    // Convertir el valor del slider a dB
    const toDB = (value: number[]): number => {
        return ((value[0] - 50) / 50) * 10;
    };

    // Convertir dB al valor del slider
    const toSliderValue = (db: number): number => {
        return ((db / 10) * 50) + 50;
    };

    // Limitar el valor del slider que esté entre 0 y 100
    const sliderValue = Math.min(100, Math.max(0, toSliderValue(dB)));

    return (
        <div className="flex flex-col items-center justify-center h-full w-8.5">
            <span className="text-xs text-neutral-400 mb-1">{freq}Hz</span>
            <Slider
                orientation="vertical"
                value={[sliderValue]}
                onValueChange={(value) => change && change([toDB(value)])}
                min={0}
                max={100}
                step={1}
                className="h-32 w-6 cursor-pointer"
            />
            <span className="text-xs text-neutral-400 mt-1">{dB.toFixed(1)}dB</span>
        </div>
    );
}