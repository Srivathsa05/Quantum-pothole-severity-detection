import React from 'react';
import { GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { colors } from '@/utils/colors';

interface HeatMapLayerProps {
  geoJson: any;
}

const HeatMapLayer: React.FC<HeatMapLayerProps> = ({ geoJson }) => {
  const getColor = (dominant: string) => colors[dominant as keyof typeof colors] || colors.no;

  const style = (feature: any) => ({
    fillColor: getColor(feature.properties.dominant),
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7,
  });

  return geoJson ? <GeoJSON data={geoJson} style={style} /> : null;
};

export { HeatMapLayer };
