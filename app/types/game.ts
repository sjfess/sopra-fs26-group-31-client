
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface PlayerSummary {
    id: number;
    username: string;
    online?:boolean;
}

import Navbar from "@/profile/[id]/components/Navbar";
import UserProfileCard from "@/profile/[id]/components/UserProfileCard";
import FriendsPanel from "@/profile/[id]/components/FriendsPanel";
import GameHub from "@/profile/[id]/components/GameHub";
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