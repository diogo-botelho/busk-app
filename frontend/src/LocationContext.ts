import { createContext } from "react";
import { Coordinates } from "./interfaces/Coordinates";

interface LocationContextType {
  coordinates: Coordinates | undefined;
  updateCoordinates: (coordinates: Coordinates) => void;
}

export const LocationContext = createContext<LocationContextType | undefined>({
  coordinates: {
    lat: undefined,
    lng: undefined,
  },
  updateCoordinates(coordinates: Coordinates) {},
});
