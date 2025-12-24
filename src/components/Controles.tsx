// Iconos
import { BiSkipPrevious, BiStop, BiSkipNext } from "react-icons/bi"
// Componentes
import { ButtonControl, SideBar } from "./index"
import { Tooltip, TooltipTrigger, TooltipContent, NavigationMenu, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, Slider } from "./ui/index"
// Hooks
import { usePlayer } from "@/hooks/usePlayer"

export function Controles() {
    const {
        // ESTADOS
        volume,
        // FUNCIONES
        toggleMute,
        handleStop,
        getPlay_Pause,
        handlePlayPause,
        handleAnteriorSong,
        handleSiguienteSong,
        changeVolume,
        getVolumeIcon,
     } = usePlayer();

    const ax = getPlay_Pause();
    
    const buttons = [
        {
            icon: <BiSkipPrevious />,
            handled: () => handleAnteriorSong(),
            text: 'Anterior'
        },
        {
            icon: ax.icon,
            handled: () => handlePlayPause(),
            text: ax.text,
        },
        {
            icon: <BiStop />,
            handled: () => handleStop(),
            text: 'Detener'
        },
        {
            icon: <BiSkipNext />,
            handled: () => handleSiguienteSong(),
            text: 'Siguiente'
        },
    ]

    return (
        <>
            <SideBar />
            {buttons.map((button, index) => (
                <ButtonControl key={index} icon={button.icon} text={button.text} handled={button.handled} />
            ))}
            <Tooltip>
                <TooltipTrigger asChild>
                    <NavigationMenu className='hidden md:block gap-3'>
                        <NavigationMenuItem className='hide-second-child list-none'>
                            <NavigationMenuTrigger className='border border-purple-950 active:border-purple-950/25 bg-purple-900/15! hover:bg-purple-950! active:bg-purple-950/50!' onClick={toggleMute}>
                                {getVolumeIcon()}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <Slider defaultValue={[1]} value={[volume]} onValueChange={changeVolume} max={1} step={0.01} className="w-25 cursor-pointer" />
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenu>
                </TooltipTrigger>
                <TooltipContent>
                    Volumen
                </TooltipContent>
            </Tooltip>
        </>
    )
}