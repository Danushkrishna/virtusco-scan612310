
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { HealthScoreEntry } from '@/types/healthScore';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface HealthTrendsChartProps {
  entries: HealthScoreEntry[];
}

const HealthTrendsChart: React.FC<HealthTrendsChartProps> = ({ entries }) => {
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');

  const generateChartData = () => {
    const days = viewType === 'weekly' ? 7 : 30;
    const startDate = subDays(new Date(), days - 1);
    const dateRange = eachDayOfInterval({ start: startDate, end: new Date() });

    return dateRange.map(date => {
      const dayEntries = entries.filter(entry => 
        format(new Date(entry.scannedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );

      const dailyScore = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + entry.score, 0) / dayEntries.length
        : 0;

      return {
        date: format(date, 'MMM dd'),
        score: Math.round(dailyScore + 50), // Convert to 0-100 scale
        scans: dayEntries.length,
        rawScore: dailyScore
      };
    });
  };

  const chartData = generateChartData();
  const averageScore = chartData.reduce((sum, day) => sum + day.score, 0) / chartData.length;

  const chartConfig = {
    score: {
      label: "Health Score",
      color: "#10b981",
    },
    scans: {
      label: "Daily Scans",
      color: "#3b82f6",
    },
  };

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-center space-x-2">
        <Button 
          variant={viewType === 'weekly' ? 'default' : 'outline'}
          onClick={() => setViewType('weekly')}
          size="sm"
        >
          7 Days
        </Button>
        <Button 
          variant={viewType === 'monthly' ? 'default' : 'outline'}
          onClick={() => setViewType('monthly')}
          size="sm"
        >
          30 Days
        </Button>
      </div>

      {/* Health Score Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Health Score Trend</CardTitle>
          <CardDescription>
            Average score: {Math.round(averageScore)} | 
            Showing last {viewType === 'weekly' ? '7' : '30'} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  `${value}${name === 'score' ? '/100' : ''}`,
                  name === 'score' ? 'Health Score' : 'Scans'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Daily Scans Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity</CardTitle>
          <CardDescription>Number of food items scanned per day</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-48">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value) => [`${value}`, 'Scans']}
              />
              <Bar 
                dataKey="scans" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Food Choices</CardTitle>
          <CardDescription>Your latest scanned items and their health impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{entry.productName}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(entry.scannedAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${
                    entry.score > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {entry.score > 0 ? '+' : ''}{entry.score}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    entry.category === 'excellent' ? 'bg-green-100 text-green-700' :
                    entry.category === 'good' ? 'bg-blue-100 text-blue-700' :
                    entry.category === 'neutral' ? 'bg-gray-100 text-gray-700' :
                    entry.category === 'poor' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {entry.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthTrendsChart;
