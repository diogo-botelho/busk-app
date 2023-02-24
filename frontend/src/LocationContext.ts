import { createContext } from "react";
import { Coordinates } from "./interfaces/Coordinates";

interface LocationContextType {
  coordinates: Coordinates | null;
  updateCoordinates: (coordinates: Coordinates) => void;
}

export const LocationContext = createContext<LocationContextType | null>({
  coordinates: {
    lat: null,
    lng: null,
  },
  updateCoordinates(coordinates: Coordinates) {},
});
