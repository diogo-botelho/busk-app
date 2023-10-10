import { NewCoordinatesContextInterface } from "../map/NewCoordinatesContext";

export interface EventFormData {
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  coordinates: NewCoordinatesContextInterface["newCoordinates"];
}
