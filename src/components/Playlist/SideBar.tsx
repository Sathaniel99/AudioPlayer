// Componentes
import { PlaylistElements } from "../index";
import { Button, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/index";
// Hooks
import { usePlayer } from "@/Contexts/PlayerContext/usePlayer";
// Iconos
import { BiListUl } from "react-icons/bi";

export function SideBar() {
    const {
        playlist,
    } = usePlayer();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className='rounded-full w-10 h-10 border border-purple-950 active:border-purple-950/25 bg-purple-900/15 hover:bg-purple-950 active:bg-purple-950/50 transition-all flex md:hidden justify-center items-center' ><BiListUl /></button>
            </SheetTrigger>
            <SheetContent className="bg-linear-120 from-black to-purple-950/50 px-2" side="left">
                <SheetHeader className="px-1 py-5">
                    <SheetTitle className="flex justify-between">Lista de reproducción <span className="bg-neutral-900 text-neutral-400 font-bold w-auto text-xs px-2 py-1 rounded-lg">{playlist.length} Elemento{playlist.length != 1 && 's'}</span></SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                </SheetHeader>

                <PlaylistElements />

                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline">Cerrar</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
