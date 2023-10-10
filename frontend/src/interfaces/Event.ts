import { LatLngExpression } from "leaflet";

export interface Event {
  id: number;
  buskerId: number;
  buskerName: string;
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  coordinates: LatLngExpression;
}
