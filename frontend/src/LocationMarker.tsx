import { Marker, Popup, useMapEvents } from "react-leaflet";
import { useState, useContext } from "react";
import LocationContext from "./LocationContext";


// const center = {
//     lat: 51.505,
//     lng: -0.09,
//   }

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationContextType {
  position: Coordinates | null;
}

export function LocationMarker() {
  let { position, setLocation } = useContext<LocationContextType|null>(LocationContext);

  // const { position, setPosition } = useContext<Coordinates | null>(LocationContext);
  // const [position, setPosition] = useState<Coordinates | null>(null);

  useMapEvents({
    click(e) {
      setLocation(e.latlng);
      // position = e.latlng;
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>`${position.lat}`</Popup>
    </Marker>
  );
}
