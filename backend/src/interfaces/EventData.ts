export interface EventData {
  buskerId?: number;
  title?: string;
  type?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
