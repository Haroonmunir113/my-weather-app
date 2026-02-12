export interface Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  updatedAt: Date;
}

export interface City {
  id: number;
  name: string;
  country: string;
  weather?: Weather | null;
}
