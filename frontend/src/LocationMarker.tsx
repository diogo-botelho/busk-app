import { Marker, Popup, useMapEvents } from "react-leaflet";
import { useState, useContext } from "react";
import LocationContext from "./LocationContext";

interface Coordinates {
  lat: number;
  lng: number;
}

export function LocationMarker() {
  let { coordinates } = useContext<any|null>(LocationContext);
  const [position, setPosition] = useState<Coordinates | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      coordinates.lat = e.latlng.lat;
      coordinates.lng = e.latlng.lng;
    },
  });

  return position === null ? null : (
    <Marker position={coordinates}>
      <Popup>`${position.lat}`</Popup>
    </Marker>
  );
};