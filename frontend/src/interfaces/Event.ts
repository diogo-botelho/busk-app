import { Coordinates } from "./Coordinates";

export interface Event {
  id: number,
  buskerId: number;
  title: string;
  type: string;
  coordinates: Coordinates;
}
