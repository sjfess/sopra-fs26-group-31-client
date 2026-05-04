export interface User {
  id: string | null;
  name: string | null;
  username: string | null;
  token: string | null;
  status: string | null;
  totalGamesPlayed: number | null;
  totalWins: number | null;
  totalPoints: number | null;
  totalCorrectPlacements?: number;
  totalIncorrectPlacements?: number;
}

export interface FriendRequest {
  id: number;
  senderId: number;
  senderUsername: string;
  receiverId: number;
  receiverUsername: string;
  status: string;
}

export interface Friend {
  id: number;
  username: string;
  status: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  totalPoints: number;
  totalWins: number;
  totalGamesPlayed: number;
  totalCorrectPlacements: number;
  totalIncorrectPlacements: number;
}