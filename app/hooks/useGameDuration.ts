import { useEffect, useState } from "react";

export function useGameDuration(gameId: string, fallback?: number) {
    const [duration, setDuration] = useState<number | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem(`game_start_${gameId}`);

        if (!stored) {
            if (fallback !== undefined) setDuration(fallback);
            return;
        }

        const start = Number(stored);

        if (!isNaN(start)) {
            const elapsed = Math.round((Date.now() - start) / 60000);
            setDuration(elapsed);
        } else if (fallback !== undefined) {
            setDuration(fallback);
        }
    }, [gameId, fallback]);

    return duration;
}