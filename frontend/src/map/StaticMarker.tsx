import { Marker, Popup } from "react-leaflet";

import { Event } from "../interfaces/Event";

interface StaticMarkerParams {
  event: Event;
}

/** Static Marker Component.
 * 
 * Renders React Leaflet Marker component on Map, located at the event 
 * coordinates.
 *
 * Props:
 *  - event: event object {eventId, buskerId, title, type, coordinates{lat,lng}}
 *
 * Context: N/A
 *
 * State: N/A
 *
 * Map -> StaticMarker
 */
export function StaticMarker({ event }: StaticMarkerParams) {
  const { title, type } = event;
  const lat = Object.values(event.coordinates)[0]
  const lng = Object.values(event.coordinates)[1]

  return lat && lng ? (
    <Marker position={[lat, lng]}>
      <Popup>
        Title: {title} <br />
        Type: {type} <br />
      </Popup>
    </Marker>
  ) : null;
}
