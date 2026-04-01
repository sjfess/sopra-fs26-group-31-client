

export interface PlayerSummary {
    id: number;
    username: string;
}

export interface Game {
    id: number;
    lobbyCode: string;
    era: string;
    status: string;
    deckSize: number;
    cardsRemaining: number;
    hostId: number;
    players: PlayerSummary[];
    timelineSize: number;
}