import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const center: [number, number] = [12.9716, 77.5946];

const potholeData = [
  { id: 1, location: "MG Road", lat: 12.9755, lng: 77.6065, severity: "critical", count: 7 },
  { id: 2, location: "Koramangala", lat: 12.9352, lng: 77.6245, severity: "high", count: 4 },
  { id: 3, location: "Whitefield", lat: 12.9698, lng: 77.7499, severity: "medium", count: 3 },
  { id: 4, location: "Indiranagar", lat: 12.9719, lng: 77.6412, severity: "high", count: 5 },
  { id: 5, location: "HSR Layout", lat: 12.9116, lng: 77.6474, severity: "critical", count: 6 },
  { id: 6, location: "Hebbal", lat: 13.0352, lng: 77.597, severity: "medium", count: 2 },
  { id: 7, location: "Jayanagar", lat: 12.925, lng: 77.5938, severity: "high", count: 4 },
  { id: 8, location: "BTM Layout", lat: 12.9166, lng: 77.6101, severity: "medium", count: 3 },
  { id: 9, location: "Electronic City", lat: 12.8458, lng: 77.6654, severity: "critical", count: 8 },
  { id: 10, location: "Yelahanka", lat: 13.1007, lng: 77.5963, severity: "medium", count: 2 },
  { id: 11, location: "Banashankari", lat: 12.9181, lng: 77.5734, severity: "high", count: 5 },
  { id: 12, location: "Marathahalli", lat: 12.9591, lng: 77.6974, severity: "critical", count: 7 },
  { id: 13, location: "Bellandur", lat: 12.9279, lng: 77.6762, severity: "high", count: 4 },
  { id: 14, location: "Rajajinagar", lat: 12.9915, lng: 77.5536, severity: "medium", count: 3 },
  { id: 15, location: "KR Puram", lat: 13.0087, lng: 77.6959, severity: "critical", count: 6 },
];

function severityColor(severity: string) {
  if (severity === "critical") return "#ef4444";
  if (severity === "high") return "#f59e0b";
  return "#22c55e";
}

export default function HeatMap() {
  const [viewMode, setViewMode] = useState("heat");
  const mapProps = {
    center,
    zoom: 13,
    style: { height: "320px", borderRadius: "10px" },
  } as any;

  const tileProps = {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "© OpenStreetMap contributors © CARTO",
  } as any;

  return (
    <div className="section-container py-4">
      <Card className="border-[#0f1e30] bg-[#08101f]">
        <CardHeader>
          <p className="section-label">Heatmap</p>
          <CardTitle className="text-base text-slate-100">Bengaluru Pothole Risk Intelligence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MapContainer {...mapProps}>
            <TileLayer {...tileProps} />
            {potholeData.map((point) => (
              <CircleMarker
                key={point.id}
                {...({
                  center: [point.lat, point.lng],
                  radius: point.severity === "critical" ? 14 : point.severity === "high" ? 10 : 6,
                  fillColor: severityColor(point.severity),
                  color: severityColor(point.severity),
                  fillOpacity: 0.5,
                  weight: 1.5,
                } as any)}
              >
                <Popup>
                  {point.location} - {point.severity} - {point.count} potholes
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
            <div className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-300">Critical Zones: 5</div>
            <div className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-300">High Risk Roads: 6</div>
            <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-cyan-300">KM Mapped: 142</div>
            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-300">Clear Roads: 41</div>
          </div>

          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value)}
            className="justify-start"
          >
            <ToggleGroupItem value="heat" className="border border-[#17374f] data-[state=on]:bg-[#00d4ff]/20">
              Heat view
            </ToggleGroupItem>
            <ToggleGroupItem value="cluster" className="border border-[#17374f] data-[state=on]:bg-[#00d4ff]/20">
              Cluster view
            </ToggleGroupItem>
            <ToggleGroupItem value="roads" className="border border-[#17374f] data-[state=on]:bg-[#00d4ff]/20">
              Roads-only view
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>
    </div>
  );
}
