import { MapContainer, TileLayer } from "react-leaflet";
import "./Map.css";
import { LocationMarker } from "./LocationMarker";

interface MapParams {
  isAddingEvent: boolean;
}

export function Map({ isAddingEvent }: MapParams) {
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
      {isAddingEvent ? <LocationMarker /> : undefined}
    </MapContainer>
  );
}
