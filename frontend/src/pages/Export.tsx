import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangeExport } from '@/components/DateRangeExport';

export default function Export() {
  return (
    <div className="min-h-screen p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Export Pothole Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Select a date range to export pothole detection data as CSV.</p>
          <DateRangeExport />
        </CardContent>
      </Card>
    </div>
  );
}
