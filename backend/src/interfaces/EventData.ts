export interface EventData {
  buskerId?: number;
  title?: string;
  type?: string;
  date: string;
  startTime: string;
  endTime: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
