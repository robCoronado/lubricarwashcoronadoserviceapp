import React from 'react';
import { Car, Calendar, Tool, Trash2, Edit2 } from 'lucide-react';
import type { Vehicle } from '../../../types/customer';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: () => void;
}

export function VehicleCard({ vehicle, onEdit, onDelete }: VehicleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Car className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h4>
            <div className="mt-1 space-y-1">
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
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-500"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {vehicle.serviceHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
            <Tool className="h-4 w-4" />
            Recent Services
          </h5>
          <div className="space-y-2">
            {vehicle.serviceHistory.map((service) => (
              <div
                key={service.id}
                className="flex justify-between items-start text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {service.serviceType}
                  </p>
                  <p className="text-gray-500">{service.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900">${service.cost.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(service.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}