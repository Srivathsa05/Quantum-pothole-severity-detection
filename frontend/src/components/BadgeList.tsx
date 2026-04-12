import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BadgeListProps {
  badges: string[];
}

export const BadgeList: React.FC<BadgeListProps> = ({ badges }) => (
  <div className="flex flex-wrap gap-2">
    {badges.map((badge, i) => (
      <Badge key={i} variant="secondary">{badge}</Badge>
    ))}
  </div>
);
