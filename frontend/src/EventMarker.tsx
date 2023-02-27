import { Marker, Popup, useMapEvents } from "react-leaflet";
import { useContext } from "react";
import { LocationContext } from "./LocationContext";
import { Coordinates } from "./interfaces/Coordinates";

interface LocationMarkerParams {
  key: string,
  location:Coordinates
}


export function EventMarker({key, location}:LocationMarkerParams) {
  // let coordinates = {
  //   lat: location.lat,
  //   lng: location.lng
  // };

  const lat = location.lat;
  const lng = location.lng;

  const position = [];
  if(lat&&lng) {
  position.push(lat);
  position.push(lng);
  }


  return (lat && lng) ? (
    <Marker key={key} position={[lat,lng]}>
      <Popup>`${position[0]}`</Popup>
    </Marker>
  ) : null;
}
