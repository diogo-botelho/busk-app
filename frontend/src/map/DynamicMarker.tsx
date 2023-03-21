import { useContext, useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import { LatLngExpression, latLng } from "leaflet";

import {
  NewCoordinatesContext,
  NewCoordinatesContextInterface,
} from "./NewCoordinatesContext";

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
  let { updateNewCoordinates } = useContext<NewCoordinatesContextInterface>(
    NewCoordinatesContext
  );
  const [position, setPositon] = useState<LatLngExpression | null>(null);

  useMapEvents({
    click(e) {
      const coordinates = latLng({ lat: e.latlng.lat, lng: e.latlng.lng });
      updateNewCoordinates(coordinates);
      setPositon(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}
