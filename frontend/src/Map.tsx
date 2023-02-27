import { MapContainer, TileLayer } from "react-leaflet";
import "./Map.css";
import { LocationMarker } from "./LocationMarker";
import { EventMarker } from "./EventMarker";

import { Event } from "./interfaces/Event";

interface MapParams {
  events: Event[];
  isAddingEvent: boolean;
}

export function Map({ events, isAddingEvent }: MapParams) {
  return (
    <MapContainer
      className="map"
      center={[40.7826, -73.9656]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {events.map((event) => (
        <EventMarker key={event.title} location={event.coordinates} />
      ))}
      {isAddingEvent ? <LocationMarker /> : undefined}
    </MapContainer>
  );
}
