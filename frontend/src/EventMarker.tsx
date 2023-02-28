import { Marker, Popup } from "react-leaflet";
import { Event } from "./interfaces/Event";

interface LocationMarkerParams {
  key: string;
  event: Event;
}

export function EventMarker({ key, event }: LocationMarkerParams) {
  
  const {title, type} = event;
  const { lat, lng } = event.coordinates;
  // const lat = event.coordinates.lat;
  // const lng = event.coordinates.lng;

  const position = [];
  if (lat && lng) {
    position.push( lat);
    position.push(lng);
  }

  return lat && lng ? (
    <Marker key={key} position={[lat, lng]}>
      <Popup>
      Title: {title} <br />
      Type: {type} <br />
      </Popup>
    </Marker>
  ) : null;
}
