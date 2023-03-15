import { MapContainer, TileLayer } from "react-leaflet";
import "./Map.css";
import { DynamicMarker } from "./DynamicMarker";
import { StaticMarker } from "./StaticMarker";

import { Event } from "./interfaces/Event";

interface MapParams {
  events: Event[];
  isAddingEvent: boolean;
}

export function Map({ events, isAddingEvent }: MapParams) {
  return (
    <MapContainer
      className="map"
      style={{ 
        height: `800px`, 
      }}
      center={[40.7826, -73.9656]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {events.map((event) => (
        <StaticMarker key={event.title} event={event} />
      ))}
      {isAddingEvent ? <DynamicMarker /> : undefined}
    </MapContainer>
  );
}
