import React from 'react';
import { Car } from 'lucide-react';
import type { Vehicle } from '../../../types/customer';

interface CustomerVehiclesProps {
  vehicles: Vehicle[];
}

export function CustomerVehicles({ vehicles }: CustomerVehiclesProps) {
  if (vehicles.length === 0) return null;

  return (
    <div className="border-t pt-4">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Vehicles</h4>
      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="flex items-start gap-3 bg-gray-50 rounded-lg p-3"
          >
            <div className="p-2 bg-blue-50 rounded-lg">
              <Car className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
              {vehicle.licensePlate && (
                <p className="text-sm text-gray-500">
                  License: {vehicle.licensePlate}
                </p>
              )}
              {vehicle.mileage !== undefined && (
                <p className="text-sm text-gray-500">
                  Mileage: {vehicle.mileage.toLocaleString()} km
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}