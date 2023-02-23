import { Marker, Popup, useMapEvents } from "react-leaflet";
import { useContext } from "react";
import { LocationContext } from "./LocationContext";

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationContextType {
  coordinates: Coordinates | null;
  updateCoordinates: (coordinates: Coordinates) => void;
}

export function LocationMarker() {
  let { coordinates, updateCoordinates } = useContext<any | null>(
    LocationContext
  );

  useMapEvents({
    click(e) {
      updateCoordinates(e.latlng);

      console.log(coordinates, e.latlng);
    },
  });

  return coordinates === null ? null : (
    <Marker position={coordinates}>
      <Popup>`${coordinates.lat}`</Popup>
    </Marker>
  );
}
