// Componentes
import { Tooltip, TooltipTrigger, TooltipContent, Button, toast } from "./ui/index";
// Iconos
import { BiDownload } from "react-icons/bi";
// Hooks
import { usePlayer } from "@/hooks/usePlayer";

interface DownloadButtonProps {
    songUrl: string;
    fileName: string;
}

export function DownloadButton({ songUrl, fileName }: DownloadButtonProps) {
    const {
        // Estados
        currentSong
    } = usePlayer();

    const handleDownload = () => {
        if (currentSong.url != "") {
            toast.loading(`Descargando ${fileName}`);
            const link = document.createElement('a');
            link.href = songUrl;
            link.download = fileName;
            document.body.appendChild(link);
            try {
                link.click();
                setTimeout(() => {
                    toast.success("Descarga realizada con éxito.");
                }, 800);
            } catch {
                toast.error("¡Ha ocurrido un error!");
            }
            document.body.removeChild(link);
        }
        else {
            toast.info("No hay canción seleccionada.");
        }
    };

    return (
        <>
            {currentSong.url != "" &&
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button className='absolute top-0 end-0 m-3 border border-purple-950! active:border-purple-950/25! bg-purple-900/15! hover:bg-purple-950! active:bg-purple-950/50!' title={`Descargar ${fileName}`} variant={'outline'} onClick={handleDownload} size={'sm'}><BiDownload /></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Descargar
                    </TooltipContent>
                </Tooltip>
            }
        </>
    );
};