import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getApiDomain } from "@/utils/domain";

export function useLeaveGame(gameId: string | null, game: { lobbyCode?: string } | null) {
    const router = useRouter();
    const hasLeft = useRef(false);

    const leaveGame = useCallback(async () => {
        if (hasLeft.current) return;
        hasLeft.current = true;

        const raw = sessionStorage.getItem("userId");
        const userId = raw ? JSON.parse(raw) : null;
        const lobbyCode = game?.lobbyCode;

        if (lobbyCode && userId) {
            try {
                await fetch(`${getApiDomain()}/games/leave/${lobbyCode}?userId=${userId}`, {
                    method: "DELETE",
                });
            } catch (e) {
                console.error("Leave game failed:", e);
            }
        }

        return userId;
    }, [game]);

    return { leaveGame, hasLeft };
}