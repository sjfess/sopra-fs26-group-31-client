
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface PlayerSummary {
    id: number;
    username: string;
    online?: boolean;
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

export interface EventCardGet {
    id: number;
    title: string;
    imageUrl: string;
}

export interface EventCardReveal {
    id: number;
    title: string;
    year: number;
    imageUrl: string;
}

export interface HandCard {
    deckIndex: number;
    title: string;
    imageUrl: string;
}

export interface PlacementResult {
    correct: boolean;
    title: string;
    year: number;
    imageUrl: string;
    timelineSize: number;
}

export interface GamePlayerScore {
    userId: number;
    username: string;
    score: number;
    turnOrder: number;
    activeTurn: boolean;
    correctStreak: number;
    bestStreak: number;
    currentCardIndex: number | null;
    cardsInHand: number;
}
