import { MapContainer, TileLayer } from "react-leaflet";

import "./Map.css";

import { Event } from "../interfaces/Event";

import { DynamicMarker } from "./DynamicMarker";
import { StaticMarker } from "./StaticMarker";

interface MapParams {
  events: Event[];
  enableDynamicMarker: boolean;
}

/** Map presentational component.
 * 
 * Renders React Leaflet MapContainer component, StaticMarker components for 
 * each event in events array prop, and renders DynamicMarker component if
 * enableDynamicMarker is true.
 * 
 * Props:
 *  - events: array of all events.
 *  - enableDynamicMarker: function that handles enabling/disabling
 *  DynamicMarker on Map.
 *
 * Context: N/A
 *
 * State: N/A
 *
 * EventList -> Map -> { StaticMarker, DynamicMarker }
 */

export function Map({ events, enableDynamicMarker }: MapParams) {
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
      {enableDynamicMarker ? <DynamicMarker /> : undefined}
    </MapContainer>
  );
}
