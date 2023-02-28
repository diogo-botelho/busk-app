import { createContext } from "react";
import { Coordinates } from "./interfaces/Coordinates";

interface TemporaryCoordinatesContextType {
  temporaryCoordinates: Coordinates | undefined;
  updateTemporaryCoordinates: (coordinates: Coordinates) => void;
}

export const TemporaryCoordinatesContext = createContext<
  TemporaryCoordinatesContextType | undefined
>({
  temporaryCoordinates: {
    lat: undefined,
    lng: undefined,
  },
  updateTemporaryCoordinates(coordinates: Coordinates) {},
});
