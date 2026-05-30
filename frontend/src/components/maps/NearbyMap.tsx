'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

type MapPoint = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  meta?: string;
};

export function NearbyMap({
  points,
  center = [25.5941, 85.1376],
  zoom = 12,
}: {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
}) {
  return (
    <div className="h-72 overflow-hidden rounded-xl border border-slate-200">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point) => (
          <CircleMarker key={point.id} center={[point.lat, point.lng]} radius={8} pathOptions={{ color: '#ff7a00' }}>
            <Popup>
              <p className="font-semibold">{point.label}</p>
              {point.meta ? <p className="text-xs text-slate-600">{point.meta}</p> : null}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
