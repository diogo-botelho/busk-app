import { NewCoordinatesContextInterface } from "../map/NewCoordinatesContext";

export interface EventFormData {
  title: string;
  type: string;
  date: any;
  startTime: any;
  endTime: any;
  coordinates: NewCoordinatesContextInterface["newCoordinates"];
}
