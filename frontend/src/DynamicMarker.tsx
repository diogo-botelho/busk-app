import { Marker, useMapEvents } from "react-leaflet";
import { useContext } from "react";
import { NewCoordinatesContext } from "./NewCoordinatesContext";

// interface NewCoordinatesContextType {
//   NewCoordinates: Coordinates | null;
//   updateNewCoordinates: (coordinates: Coordinates) => void;
// }

// interface DynamicMarkerParams {
//   key: string | null;
//   NewCoordinates: Coordinates | undefined;
// }

export function DynamicMarker() {
  let { newCoordinates, updateNewCoordinates } = useContext<any | null>(
    NewCoordinatesContext
  );

  useMapEvents({
    click(e) {
      updateNewCoordinates(e.latlng);
    },
  });

  return newCoordinates === undefined ? null : (
    <Marker position={newCoordinates}></Marker>
  );
}
