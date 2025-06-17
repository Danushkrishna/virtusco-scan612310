
export interface HealthScoreEntry {
  id: string;
  productId: string;
  productName: string;
  score: number; // -50 to +50 points per product
  scannedAt: Date;
  category: 'excellent' | 'good' | 'neutral' | 'poor' | 'harmful';
}

export interface DailyHealthScore {
  date: string;
  totalScore: number;
  scansCount: number;
  averageScore: number;
}

export interface WeeklyHealthScore {
  weekStart: string;
  weekEnd: string;
  totalScore: number;
  averageScore: number;
  scansCount: number;
  dailyScores: DailyHealthScore[];
}

export interface MonthlyHealthScore {
  month: string;
  year: number;
  totalScore: number;
  averageScore: number;
  scansCount: number;
  weeklyScores: WeeklyHealthScore[];
}

export interface UserHealthStats {
  currentScore: number; // Out of 100
  weeklyChange: number;
  monthlyChange: number;
  totalScans: number;
  streak: number; // Days with positive scores
  bestScore: number;
  rank: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  type: 'streak' | 'score' | 'scans' | 'improvement';
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  currentScore: number;
  rank: number;
  streak: number;
}

export interface SocialShareData {
  score: number;
  streak: number;
  achievement?: Achievement;
  message: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'direct';
}
