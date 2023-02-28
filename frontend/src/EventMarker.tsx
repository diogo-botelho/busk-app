import { Marker, Popup } from "react-leaflet";
import { Coordinates } from "./interfaces/Coordinates";

interface LocationMarkerParams {
  key: string;
  location: Coordinates;
}

export function EventMarker({ key, location }: LocationMarkerParams) {
  const lat = location.lat;
  const lng = location.lng;

  const position = [];
  if (lat && lng) {
    position.push(lat);
    position.push(lng);
  }

  return lat && lng ? (
    <Marker key={key} position={[lat, lng]}>
      <Popup>`${position[0]}`</Popup>
    </Marker>
  ) : null;
}
