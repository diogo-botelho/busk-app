import React from "react";


interface Coordinates {
    lat: number;
    lng: number;
  }
  
  interface LocationContextType {
    position: Coordinates | null;
  }
  
  const LocationContext = React.createContext<LocationContextType | null>({
    position: {
      lat:0,
      lng:0
    }
  });

export default LocationContext;