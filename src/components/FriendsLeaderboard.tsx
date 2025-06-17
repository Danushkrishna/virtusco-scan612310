
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Friend } from '@/types/healthScore';
import { Trophy, Medal, Award, UserPlus, Crown } from 'lucide-react';

interface FriendsLeaderboardProps {
  currentUserScore: number;
}

const FriendsLeaderboard: React.FC<FriendsLeaderboardProps> = ({ currentUserScore }) => {
  // Mock friends data - in a real app, this would come from a backend
  const [friends] = useState<Friend[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: '',
      currentScore: 92,
      rank: 1,
      streak: 14
    },
    {
      id: '2',
      name: 'Mike Johnson',
      avatar: '',
      currentScore: 87,
      rank: 2,
      streak: 8
    },
    {
      id: '3',
      name: 'You',
      avatar: '',
      currentScore: currentUserScore,
      rank: 3,
      streak: 5
    },
    {
      id: '4',
      name: 'Emma Davis',
      avatar: '',
      currentScore: 78,
      rank: 4,
      streak: 12
    },
    {
      id: '5',
      name: 'Alex Kim',
      avatar: '',
      currentScore: 74,
      rank: 5,
      streak: 3
    },
    {
      id: '6',
      name: 'Lisa Wang',
      avatar: '',
      currentScore: 68,
      rank: 6,
      streak: 7
    }
  ]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const currentUser = friends.find(f => f.name === 'You');
  const otherFriends = friends.filter(f => f.name !== 'You').sort((a, b) => b.currentScore - a.currentScore);

  return (
    <div className="space-y-6">
      {/* Your Rank Card */}
      <Card className="border-emerald-200 bg-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-emerald-600" />
            <span>Your Ranking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getRankIcon(currentUser?.rank || 0)}
                <span className="text-lg font-semibold">Rank #{currentUser?.rank}</span>
              </div>
              <Badge variant="secondary">{currentUser?.currentScore}/100</Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-lg font-semibold text-emerald-600">{currentUser?.streak} days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Friends Leaderboard</CardTitle>
          <CardDescription>Compete with friends for the healthiest choices!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {friends.map((friend, index) => (
              <div 
                key={friend.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  friend.name === 'You' 
                    ? 'bg-emerald-100 border border-emerald-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 w-12">
                    {getRankIcon(friend.rank)}
                  </div>
                  
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-blue-500 text-white">
                      {friend.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className={`font-medium ${friend.name === 'You' ? 'text-emerald-700' : ''}`}>
                      {friend.name}
                    </p>
                    <p className="text-sm text-gray-600">{friend.streak} day streak</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-xl font-bold ${getScoreColor(friend.currentScore)}`}>
                    {friend.currentScore}
                  </div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Challenge Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {otherFriends.filter(f => f.currentScore < currentUserScore).length}
              </div>
              <div className="text-sm text-gray-600">Friends Behind You</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {otherFriends.filter(f => f.currentScore > currentUserScore).length}
              </div>
              <div className="text-sm text-gray-600">Friends Ahead</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Friends */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Invite More Friends</h3>
            <p className="text-sm text-gray-600 mb-4">
              Challenge friends to join your healthy eating journey!
            </p>
            <Button variant="outline" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Friends
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsLeaderboard;
