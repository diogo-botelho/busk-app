import { createContext } from "react";

interface Coordinates {
  lat: number | null;
  lng: number | null;
}

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
