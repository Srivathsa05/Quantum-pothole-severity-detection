import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

export const useFeatures = () => {
  const [features, setFeatures] = useState<{ gamification: boolean }>({ gamification: false });

  useEffect(() => {
    api.getFeatures().then(setFeatures).catch(() => {});
  }, []);

  return features;
};
