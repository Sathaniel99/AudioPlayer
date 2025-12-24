import type { SongProps } from "@/hooks/usePlayer";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Dar formato de milisegundos a 00:00:00(horas:minutos:segundos)
export const formatTime = (seconds: number | undefined): string => {
  if (seconds === undefined) return "00:00:00";

  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const secs = Math.floor(remainingSeconds % 60);

  const time = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':')

  return time.slice(0, 3) == "00:" ? time.slice(3) : time;
};

// Obtener el porcentaje de un tiempo determinado
export const getTimePercentage = (currentTime: number | undefined, duration: number | undefined): number => {
  if (currentTime === undefined || duration === undefined || duration === 0) {
    return 0;
  }
  return (currentTime / duration) * 100;
};

// Obtener el tiempo de un porcentaje dado
export const getTimeFromPercentage = (percentage: number, duration: number | undefined): number => {
  if (duration === undefined || duration === 0) {
    return 0;
  }
  return (percentage / 100) * duration;
};

// Aleatorizar un array
export function shuffleArray(array: SongProps[]) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}