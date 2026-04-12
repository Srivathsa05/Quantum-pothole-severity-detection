import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MissionPanelProps {
  mission: { description: string; target: number; found: number; severity: string };
}

export const MissionPanel: React.FC<MissionPanelProps> = ({ mission }) => (
  <Card>
    <CardHeader>
      <CardTitle>Current Mission</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="mb-2">{mission.description}</p>
      <Progress value={(mission.found / mission.target) * 100} />
      <p className="text-sm text-muted-foreground mt-1">
        {mission.found}/{mission.target} {mission.severity} potholes found
      </p>
    </CardContent>
  </Card>
);
