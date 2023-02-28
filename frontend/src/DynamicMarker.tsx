import { Marker, useMapEvents } from "react-leaflet";
import { useContext } from "react";
import { TemporaryCoordinatesContext } from "./TemporaryCoordinatesContext";
import { Coordinates } from "./interfaces/Coordinates";

// interface TemporaryCoordinatesContextType {
//   temporaryCoordinates: Coordinates | null;
//   updatetemporaryCoordinates: (coordinates: Coordinates) => void;
// }

// interface DynamicMarkerParams {
//   key: string | null;
//   temporaryCoordinates: Coordinates | undefined;
// }

export function DynamicMarker() {
  let { temporaryCoordinates, updateTemporaryCoordinates } = useContext<
    any | null
  >(TemporaryCoordinatesContext);

  useMapEvents({
    click(e) {
      updateTemporaryCoordinates(e.latlng);
    },
  });

  return temporaryCoordinates === undefined ? null : (
    <Marker position={temporaryCoordinates}></Marker>
  );
}
