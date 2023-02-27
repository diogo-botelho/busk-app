import { Marker, Popup, useMapEvents } from "react-leaflet";
import { useContext } from "react";
import { LocationContext } from "./LocationContext";
import { Coordinates } from "./interfaces/Coordinates";


interface LocationContextType {
  coordinates: Coordinates | null;
  updateCoordinates: (coordinates: Coordinates) => void;
}

interface LocationMarkerParams {
  key: string|null,
  location:Coordinates|undefined
}
export function LocationMarker() {
  let { coordinates, updateCoordinates } = useContext<any | null>(
    LocationContext
  );

  useMapEvents({
    click(e) {
      updateCoordinates(e.latlng);
    },
  });

  return coordinates === undefined ? null : (
    <Marker position={coordinates}>
      <Popup>`${coordinates.lat}`</Popup>
    </Marker>
  );
}
