import { MapContainer, TileLayer } from "react-leaflet";
import "./Map.css";
import { LocationMarker } from "./LocationMarker";
import { EventMarker } from "./EventMarker";
import { Coordinates } from "./interfaces/Coordinates";

interface MapParams {
  events: Event[];
  isAddingEvent: boolean;
}

interface Event {
  buskerId: number;
  title: string,
  type: string,
  coordinates: Coordinates
}

export function Map({events, isAddingEvent}:MapParams) {
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
      
      {events.map(event => <EventMarker
        key={event.title}
        location={event.coordinates} />)}
      {isAddingEvent ? <LocationMarker /> : undefined}
    </MapContainer>
  );
}

