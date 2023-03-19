import { createContext } from "react";

import { Coordinates } from "../interfaces/Coordinates";

interface NewCoordinatesContextType {
  newCoordinates: Coordinates | undefined;
  updateNewCoordinates: (coordinates: Coordinates) => void;
}

/** Context: provides NewCoordinatesContext object and setter for it throughout
 * app.
*/

export const NewCoordinatesContext = createContext<
  NewCoordinatesContextType | undefined
>({
  newCoordinates: {
    lat: undefined,
    lng: undefined,
  },
  updateNewCoordinates(coordinates: Coordinates) {},
});
