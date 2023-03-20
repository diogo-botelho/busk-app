import { useContext } from "react";
import { Marker, useMapEvents } from "react-leaflet";

import { NewCoordinatesContext } from "./NewCoordinatesContext";

/** Dynamic Marker Component to add/update events.
 * 
 * On click, renders React Leaflet Marker component, tracks the marker's
 * coordinates on the map and updates newCoordinates context.
 *
 * Props: N/A
 *
 * Context:
 *  - newCoordinates: tracks coordinates of DynamicMarker for adding/updating
 *  events.
 *
 * State: N/A
 *
 * Map -> DynamicMarker
 */

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
