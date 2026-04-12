import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LeaderboardProps {
  data: { city: string; score: number }[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>City</TableHead>
        <TableHead>Score</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((item, i) => (
        <TableRow key={i}>
          <TableCell>{item.city}</TableCell>
          <TableCell>{item.score}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
