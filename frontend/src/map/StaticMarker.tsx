import { Marker, Popup } from "react-leaflet";

import { Event } from "../interfaces/Event";

interface StaticMarkerParams {
  event: Event;
}

export function StaticMarker({ event }: StaticMarkerParams) {
  const { title, type } = event;
  const { lat, lng } = event.coordinates;

  return lat && lng ? (
    <Marker position={[lat, lng]}>
      <Popup>
        Title: {title} <br />
        Type: {type} <br />
      </Popup>
    </Marker>
  ) : null;
}
