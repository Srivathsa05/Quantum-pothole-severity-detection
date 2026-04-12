import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeList } from '@/components/BadgeList';
import { Leaderboard } from '@/components/Leaderboard';
import { MissionPanel } from '@/components/MissionPanel';
import { useGamification } from '@/hooks/useGamification';

export default function Dashboard() {
  const { data, loading } = useGamification();

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Gamification Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{data.points}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <BadgeList badges={data.badges} />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>City Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Leaderboard data={data.leaderboard} />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <MissionPanel mission={data.mission} />
          </Card>
        </div>
      </div>
    </div>
  );
}
