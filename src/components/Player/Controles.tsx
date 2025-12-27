// Iconos
import { BiSkipPrevious, BiStop, BiSkipNext } from "react-icons/bi"
import { RiEqualizerLine } from "react-icons/ri";
// Componentes
import { ButtonControl, Equalizer, SideBar } from "../index"
import { Tooltip, TooltipTrigger, TooltipContent, NavigationMenu, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, Slider, Skeleton, Button, Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerTitle } from "../ui/index"
// Hooks
import { usePlayer } from "@/Contexts/PlayerContext/usePlayer"
import { useRef } from "react";

export function Controles() {
    const EQ = useRef<HTMLButtonElement>(null);

    const {
        // ESTADOS
        volume,
        currentSong,
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
            {currentSong.url != "" ?
                (
                    <>
                        <Drawer>
                            <DrawerTrigger ref={EQ}>
                            </DrawerTrigger>
                            <DrawerContent className="flex justify-center bg-radial pb-5 to-black from-purple-900/50">
                                <DrawerTitle className="w-full text-center mt-5 text-4xl font-bold font-sans" aria-describedby="Ecualizador titulo">ECUALIZADOR</DrawerTitle>
                                <Equalizer />
                                <DrawerClose asChild>
                                    <Button className="mx-auto">Cerrar</Button>
                                </DrawerClose>
                            </DrawerContent>
                        </Drawer>
                        {buttons.map((button, index) => (
                            <ButtonControl key={index} icon={button.icon} textTooltip={button.text} handled={button.handled} />
                        ))}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <NavigationMenu className='hidden md:block gap-3'>
                                    <NavigationMenuItem className='hide-second-child list-none'>
                                        <NavigationMenuTrigger className='border border-purple-950 active:border-purple-950/25 bg-purple-900/15! hover:bg-purple-950! active:bg-purple-950/50!' onClick={toggleMute}>
                                            {getVolumeIcon()}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="bg-radial to-black/50 from-purple-950">
                                            <Slider defaultValue={[1]} value={[volume]} onValueChange={changeVolume} max={1} step={0.01} className="w-25 cursor-pointer" />
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenu>
                            </TooltipTrigger>
                            <TooltipContent>
                                Volumen
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="rounded-full w-10 h-10 border border-purple-950 active:border-purple-950/25 bg-purple-900/15 hover:bg-purple-950 active:bg-purple-950/50 transition-all flex justify-center items-center" onClick={() => (EQ.current?.click())}>
                                    <RiEqualizerLine className="text-purple-300" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ecualizador</p>
                            </TooltipContent>
                        </Tooltip>
                    </>
                ) :
                (<>
                    {[...Array(4).fill('h-10 w-10 rounded-full'), 'h-9 w-16 rounded'].map((classE, index) => (
                        <Skeleton className={`${classE} border border-purple-950 bg-purple-900/15`} key={index} />
                    ))}
                </>)
            }
        </>
    )
}