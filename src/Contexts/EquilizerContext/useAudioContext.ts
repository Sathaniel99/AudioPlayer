export const getAudioContext = (): AudioContext | null => {
    try {
        if (typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || 
                (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            
            if (AudioContextClass) {
                return new AudioContextClass();
            }
        }
        return null;
    } catch (error) {
        console.error('Error creating AudioContext:', error);
        return null;
    }
};