import React from 'react';
import { DatePicker } from 'antd';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { csvDownloader } from '@/utils/csvDownloader';

const { RangePicker } = DatePicker;

export const DateRangeExport: React.FC = () => {
  const handleExport = async (dates: any) => {
    if (!dates) return;
    const [start, end] = dates;
    const startStr = start.toISOString();
    const endStr = end.toISOString();
    const res = await api.exportPotholes(startStr, endStr);
    const blob = await res.blob();
    csvDownloader(blob, 'pothole_export.csv');
  };

  return (
    <div className="space-y-4">
      <RangePicker onChange={handleExport} />
      <Button onClick={() => handleExport}>Download CSV</Button>
    </div>
  );
};
