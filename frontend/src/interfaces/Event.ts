import { Coordinates } from "./Coordinates";

export interface Event {
  buskerId: number;
  title: string;
  type: string;
  coordinates: Coordinates;
}
