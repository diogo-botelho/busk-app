import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "./Map.css";
import { LocationMarker } from "./LocationMarker"

export function Map({isAddingEvent}:any) { //Can't get this to work with type:boolean? 
  return (
      <MapContainer className="map" center={[40.7826, -73.9656]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        { isAddingEvent ? <LocationMarker /> : undefined }
      </MapContainer>
  );
}
