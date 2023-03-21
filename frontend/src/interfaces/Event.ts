import { LatLngExpression } from "leaflet";

export interface Event {
  id: number,
  buskerId: number;
  title: string;
  type: string;
  coordinates: LatLngExpression;
}
