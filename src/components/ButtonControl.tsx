// Componentes
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/index";

interface ButtonControlProps{
    text?: string,
    textTooltip?: string,
    icon: React.ReactNode,
    className?: string,
    handled?: ()=>void
}

export function ButtonControl({text, textTooltip, className, icon, handled}:ButtonControlProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button className={`${className} rounded-full w-10 h-10 border border-purple-950 active:border-purple-950/25 bg-purple-900/15 hover:bg-purple-950 active:bg-purple-950/50 transition-all flex justify-center items-center gap-1`} onClick={handled}>{text}{icon}</button>
            </TooltipTrigger>
            <TooltipContent>
                {textTooltip}
            </TooltipContent>
        </Tooltip>
    )
}