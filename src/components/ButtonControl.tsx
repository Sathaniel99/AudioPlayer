// Componentes
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/index";

interface ButtonControlProps{
    text: string,
    icon: React.ReactNode,
    handled?: ()=>void
}

export function ButtonControl({text, icon, handled}:ButtonControlProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button className='rounded-full w-10 h-10 border border-purple-950 active:border-purple-950/25 bg-purple-900/15 hover:bg-purple-950 active:bg-purple-950/50 transition-all flex justify-center items-center' onClick={handled}>{icon}</button>
            </TooltipTrigger>
            <TooltipContent>
                {text}
            </TooltipContent>
        </Tooltip>
    )
}