import React from "react";


interface Coordinates {
    lat: number|null;
    lng: number|null;
  }
  
  interface LocationContextType {
    coordinates: Coordinates | null;
  }
  
  const LocationContext = React.createContext<LocationContextType | null>({
    coordinates: {
      lat:null,
      lng:null
    }
  });

export default LocationContext;