import { createContext } from "react";
import { LatLngExpression } from "leaflet";

export interface NewCoordinatesContextInterface {
  newCoordinates: LatLngExpression | undefined;
  updateNewCoordinates: (coordinates: LatLngExpression | undefined) => void;
}

/** Context: provides NewCoordinatesContext object and setter for it throughout
 * app.
 */

export const NewCoordinatesContext =
  createContext<NewCoordinatesContextInterface>({
    newCoordinates: undefined,
    updateNewCoordinates(coordinates: LatLngExpression | undefined) {},
  });
