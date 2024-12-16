export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  licensePlate?: string;
  vin?: string;
  mileage?: number;
  serviceHistory: ServiceHistory[];
  lastService?: string;
}