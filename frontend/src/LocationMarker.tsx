import { Marker, Popup, useMapEvents } from "react-leaflet";
import { useState } from "react";

// const center = {
//     lat: 51.505,
//     lng: -0.09,
//   }

interface Coordinates {
  lat: number;
  lng: number;
}

export function LocationMarker() {
  const [position, setPosition] = useState<Coordinates | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>`${position.lat}`</Popup>
    </Marker>
  );
}
