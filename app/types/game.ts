
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface PlayerSummary {
    id: number;
    username: string;
    online?:boolean;
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
    gameMode: string;
    difficulty: Difficulty;
    maxPlayers: number;
}

export type ChatMessageGetDTO = {
    playerId: number;
    username: string;
    message: string;
    timestamp: string;
}