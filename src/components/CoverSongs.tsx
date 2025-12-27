// Hooks
import { useState, useEffect } from 'react';
// Componentes
import { Spinner, toast } from './ui/index';
// Iconos
import { FaMusic } from "react-icons/fa6";

interface CoverSongsProps {
    name: string;
    artist: string;
    variant?: 'player' | 'album';
    size?: number | string;
}

export const CoverSongs = ({
    name,
    artist,
    variant = 'player',
    size
}: CoverSongsProps) => {
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCover = async () => {
            if (!name || !artist) return;

            setLoading(true);
            try {
                const query = encodeURIComponent(`${name} ${artist}`);
                const response = await fetch(
                    `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.results?.[0]?.artworkUrl100) {
                        const url = data.results[0].artworkUrl100
                            .replace('100x100bb', '300x300bb')
                            .replace('100x100', '300x300');
                        setCoverUrl(url);
                    }
                }
            } catch (error) {
                toast.error(`Error cargando portada: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchCover();
    }, [name, artist]);

    const containerClasses = variant === 'player'
        ? 'border border-purple-800/50 rounded shadow-2xl shadow-purple-900 overflow-hidden'
        : 'border border-purple-800/50 rounded relative overflow-hidden w-full h-full';

    const containerStyle = variant === 'player'
        ? {
            width: size ? `${size}px` : '240px',
            height: size ? `${size}px` : '240px'
        }
        : {
            width: size || '100%',
            height: size || '100%'
        };

    return (
        <div
            className={containerClasses}
            style={containerStyle}
        >
            {loading ? (
                <div className="w-full h-full flex justify-center items-center bg-black/80">
                    <Spinner />
                </div>
            ) : variant === 'player' ? (
                <img
                    className="object-cover w-full h-full"
                    src={coverUrl || '/AudioPlayer/notfound.jpg'}
                    alt={`${artist} - ${name}`}
                    onError={() => setCoverUrl(null)}
                />
            ) : (
                <>
                    {coverUrl ? (
                        <img
                            className="object-cover w-full h-full"
                            src={coverUrl}
                            alt={`${artist} - ${name}`}
                            onError={() => setCoverUrl(null)}
                        />
                    ) : (
                        <div className="absolute w-full h-full flex justify-center items-center bg-black/80">
                            <FaMusic className="text-gray-400" />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};