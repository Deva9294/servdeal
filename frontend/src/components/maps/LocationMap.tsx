'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DefaultIcon = (L as any).Icon.Default;
if (DefaultIcon && DefaultIcon.prototype) {
  DefaultIcon.prototype.options.iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
  DefaultIcon.prototype.options.iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
  DefaultIcon.prototype.options.shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
}

export default function LocationMap({ position }: { position: [number, number] }) {
  return (
    <MapContainer center={position} zoom={13} className="h-64 w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Your current location</Popup>
      </Marker>
    </MapContainer>
  );
}
