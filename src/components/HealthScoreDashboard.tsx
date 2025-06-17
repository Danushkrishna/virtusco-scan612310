
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HealthScoreEntry, UserHealthStats } from '@/types/healthScore';
import { ScannedProduct } from '@/types/health';
import HealthTrendsChart from './HealthTrendsChart';
import FriendsLeaderboard from './FriendsLeaderboard';
import SocialShareDialog from './SocialShareDialog';
import { calculateProductScore, calculateOverallHealthScore, calculateStreak, checkAchievements, generateMotivationalMessage } from '@/utils/healthScoring';
import { TrendingUp, Trophy, Target, Share2, Calendar, Award } from 'lucide-react';

interface HealthScoreDashboardProps {
  scannedProducts: ScannedProduct[];
  userProfile: any;
}

const HealthScoreDashboard: React.FC<HealthScoreDashboardProps> = ({
  scannedProducts,
  userProfile
}) => {
  const [healthEntries, setHealthEntries] = useState<HealthScoreEntry[]>([]);
  const [userStats, setUserStats] = useState<UserHealthStats | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    // Convert scanned products to health score entries
    const entries: HealthScoreEntry[] = scannedProducts.map(product => {
      const score = calculateProductScore(product, userProfile);
      let category: 'excellent' | 'good' | 'neutral' | 'poor' | 'harmful';
      
      if (score >= 30) category = 'excellent';
      else if (score >= 10) category = 'good';
      else if (score >= -10) category = 'neutral';
      else if (score >= -30) category = 'poor';
      else category = 'harmful';

      return {
        id: `${product.id}-score`,
        productId: product.id,
        productName: product.name,
        score,
        scannedAt: product.scannedAt,
        category
      };
    });

    setHealthEntries(entries);

    // Calculate user stats
    const currentScore = calculateOverallHealthScore(entries);
    const streak = calculateStreak(entries);
    const totalScans = entries.length;
    
    // Calculate weekly change (mock for now)
    const weeklyChange = Math.floor(Math.random() * 20) - 10;
    const monthlyChange = Math.floor(Math.random() * 30) - 15;
    const bestScore = Math.max(currentScore, 85);
    const rank = Math.floor(Math.random() * 50) + 1;

    const stats: UserHealthStats = {
      currentScore,
      weeklyChange,
      monthlyChange,
      totalScans,
      streak,
      bestScore,
      rank,
      achievements: []
    };

    stats.achievements = checkAchievements(stats, entries);
    setUserStats(stats);
    setMotivationalMessage(generateMotivationalMessage(stats));
  }, [scannedProducts, userProfile]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (!userStats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header with motivational message */}
      <Card className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Health Score</h2>
              <p className="text-emerald-100">{motivationalMessage}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{userStats.currentScore}</div>
              <div className="text-sm opacity-90">out of 100</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Weekly Change</p>
                <p className={`text-lg font-semibold ${userStats.weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {userStats.weeklyChange >= 0 ? '+' : ''}{userStats.weeklyChange}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-lg font-semibold text-orange-600">{userStats.streak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Leaderboard Rank</p>
                <p className="text-lg font-semibold text-purple-600">#{userStats.rank}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Milestone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progress to 100</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={userStats.currentScore} className="h-3 mb-2" />
          <p className="text-sm text-gray-600">
            {100 - userStats.currentScore} points away from perfect score!
          </p>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="leaderboard">Friends</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <HealthTrendsChart entries={healthEntries} />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <FriendsLeaderboard currentUserScore={userStats.currentScore} />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Unlock more by maintaining healthy choices!</CardDescription>
            </CardHeader>
            <CardContent>
              {userStats.achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userStats.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Keep scanning healthy foods to unlock achievements!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Share Button */}
      <div className="flex justify-center">
        <Button 
          onClick={() => setShowShareDialog(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Your Score
        </Button>
      </div>

      {/* Social Share Dialog */}
      <SocialShareDialog 
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        score={userStats.currentScore}
        streak={userStats.streak}
        achievements={userStats.achievements}
      />
    </div>
  );
};

export default HealthScoreDashboard;
