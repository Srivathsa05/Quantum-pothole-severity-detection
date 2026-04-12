import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

interface GamifyData {
  points: number;
  badges: string[];
  leaderboard: { city: string; score: number }[];
  mission: { description: string; target: number; found: number; severity: string };
}

export const useGamification = () => {
  const [userId] = useState(() => localStorage.getItem('userId') || 'user1');
  const [data, setData] = useState<GamifyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pointsRes, badgesRes, leaderboardRes, missionRes] = await Promise.all([
          api.getPoints(userId),
          api.getBadges(userId),
          api.getLeaderboard(),
          api.getCurrentMission(),
        ]);
        setData({
          points: pointsRes.points,
          badges: badgesRes,
          leaderboard: leaderboardRes,
          mission: missionRes,
        });
      } catch (e) {
        console.error('Failed to fetch gamification data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s

    return () => clearInterval(interval);
  }, [userId]);

  return { userId, data, loading };
};
