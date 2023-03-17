import { MapContainer, TileLayer } from "react-leaflet";

import "./Map.css";

import { Event } from "../interfaces/Event";

import { DynamicMarker } from "./DynamicMarker";
import { StaticMarker } from "./StaticMarker";

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
        <StaticMarker key={event.id} event={event} />
      ))}
      {isAddingEvent ? <DynamicMarker /> : undefined}
    </MapContainer>
  );
}
