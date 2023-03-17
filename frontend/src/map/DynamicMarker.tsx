import { Marker, useMapEvents } from "react-leaflet";
import { useContext } from "react";

import { NewCoordinatesContext } from "./NewCoordinatesContext";

export function DynamicMarker() {
  let { newCoordinates, updateNewCoordinates } = useContext<any | undefined>(
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
