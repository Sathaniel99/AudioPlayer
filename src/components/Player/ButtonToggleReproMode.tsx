// Hooks
import { usePlayer } from "@/Contexts/PlayerContext/usePlayer";
// Componentes
import { Tooltip, TooltipTrigger, TooltipContent, Button } from "../ui/index";
// Iconos
import { BiListPlus, BiRepeat, BiShuffle } from "react-icons/bi";

export function ButtonToggleReproMode() {
    const {
        // ESTADOS
        reproMode,
        // FUNCIONES
        changeReproMode,
    } = usePlayer();


    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button className='absolute top-0 start-0 ms-6 mt-3 min-[30rem]:m-3 border border-purple-950! active:border-purple-950/25! bg-purple-900/15! hover:bg-purple-950! active:bg-purple-950/50!' variant={'outline'} size={'sm'} onClick={() => changeReproMode()}>
                        {reproMode == 'shuffle' ? <BiShuffle size={'20'} /> : reproMode == 'repeat' ? <BiRepeat size={'20'} /> : <BiListPlus size={'20'} />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    Cambiado a {reproMode == 'shuffle' ? 'reproducción aleatoria' : reproMode == 'repeat' ? 'bucle único' : 'bucle de lista'}
                </TooltipContent>
            </Tooltip>
        </>
    )
}