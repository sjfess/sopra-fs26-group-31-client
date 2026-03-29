export interface User {
  id: string | null;
  name: string | null;
  username: string | null;
  token: string | null;
  status: string | null;
  totalGamesPlayed: number | null;
  totalWins: number | null;
  totalPoints: number | null;
}