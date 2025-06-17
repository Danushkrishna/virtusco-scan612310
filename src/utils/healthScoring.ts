
import { ScannedProduct, UserProfile } from '@/types/health';
import { HealthScoreEntry, UserHealthStats, Achievement } from '@/types/healthScore';

export const calculateProductScore = (product: ScannedProduct, userProfile: UserProfile): number => {
  let score = 0;
  
  // Base score from compatibility
  score = Math.round((product.compatibilityScore - 50) * 0.8); // -40 to +40
  
  // Penalty for high severity warnings
  const highSeverityWarnings = product.warnings.filter(w => w.severity === 'high').length;
  const mediumSeverityWarnings = product.warnings.filter(w => w.severity === 'medium').length;
  
  score -= (highSeverityWarnings * 15);
  score -= (mediumSeverityWarnings * 8);
  
  // Bonus for good nutrition facts
  if (product.nutritionFacts) {
    const nutrition = product.nutritionFacts;
    
    // Low sodium bonus
    if (nutrition.sodium < 100) score += 5;
    
    // Low sugar bonus
    if (nutrition.sugar < 5) score += 5;
    
    // High protein bonus
    if (nutrition.protein > 10) score += 3;
    
    // Low saturated fat bonus
    if (nutrition.saturatedFat < 2) score += 3;
  }
  
  // Dietary alignment bonus
  if (product.warnings.length === 0) {
    score += 10; // Perfect alignment bonus
  }
  
  return Math.max(-50, Math.min(50, score));
};

export const calculateOverallHealthScore = (entries: HealthScoreEntry[]): number => {
  if (entries.length === 0) return 50; // Starting score
  
  const last30Days = entries.filter(entry => 
    new Date(entry.scannedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  
  if (last30Days.length === 0) return 50;
  
  const averageScore = last30Days.reduce((sum, entry) => sum + entry.score, 0) / last30Days.length;
  const baseScore = 50 + averageScore;
  
  // Consistency bonus (more scans = more reliable score)
  const consistencyBonus = Math.min(10, last30Days.length * 0.5);
  
  return Math.max(0, Math.min(100, Math.round(baseScore + consistencyBonus)));
};

export const calculateStreak = (entries: HealthScoreEntry[]): number => {
  const sortedEntries = [...entries]
    .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.scannedAt);
    const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= streak + 1 && entry.score > 0) {
      streak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }
  
  return streak;
};

export const checkAchievements = (stats: UserHealthStats, entries: HealthScoreEntry[]): Achievement[] => {
  const achievements: Achievement[] = [];
  const now = new Date();
  
  // First scan achievement
  if (stats.totalScans === 1) {
    achievements.push({
      id: 'first-scan',
      title: 'Health Journey Begins!',
      description: 'Completed your first food scan',
      icon: '🎯',
      unlockedAt: now,
      type: 'scans'
    });
  }
  
  // Streak achievements
  if (stats.streak === 7) {
    achievements.push({
      id: 'week-streak',
      title: 'Week Warrior',
      description: '7 days of healthy choices!',
      icon: '🔥',
      unlockedAt: now,
      type: 'streak'
    });
  }
  
  if (stats.streak === 30) {
    achievements.push({
      id: 'month-streak',
      title: 'Health Champion',
      description: '30 days of consistent healthy eating!',
      icon: '👑',
      unlockedAt: now,
      type: 'streak'
    });
  }
  
  // Score achievements
  if (stats.currentScore >= 80) {
    achievements.push({
      id: 'high-score',
      title: 'Health Master',
      description: 'Achieved 80+ health score!',
      icon: '⭐',
      unlockedAt: now,
      type: 'score'
    });
  }
  
  return achievements;
};

export const generateMotivationalMessage = (stats: UserHealthStats): string => {
  const messages = {
    excellent: [
      "🌟 You're crushing it! Keep up the amazing work!",
      "🏆 Health champion status unlocked!",
      "💪 Your dedication is inspiring!"
    ],
    good: [
      "👏 Great job maintaining healthy choices!",
      "🎯 You're on the right track!",
      "🌱 Your health journey is flourishing!"
    ],
    improving: [
      "📈 Every scan makes you healthier!",
      "🔥 Building that streak, one choice at a time!",
      "💚 Small steps lead to big changes!"
    ],
    encouraging: [
      `🎯 Just ${100 - stats.currentScore} points to reach 100!`,
      `🔥 ${stats.streak} day streak - don't break it now!`,
      "🌟 Your next healthy choice could be your best yet!"
    ]
  };
  
  let category: keyof typeof messages;
  
  if (stats.currentScore >= 80) category = 'excellent';
  else if (stats.currentScore >= 60) category = 'good';
  else if (stats.weeklyChange > 0) category = 'improving';
  else category = 'encouraging';
  
  const categoryMessages = messages[category];
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
};
