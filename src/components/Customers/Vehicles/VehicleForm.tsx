import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCustomerStore } from '../../../store/useCustomerStore';
import toast from 'react-hot-toast';
import type { Vehicle } from '../../../types/customer';

interface VehicleFormProps {
  customerId: string;
  vehicle?: Vehicle;
  onClose: () => void;
}

export function VehicleForm({ customerId, vehicle, onClose }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    type: vehicle?.type || '',
    licensePlate: vehicle?.licensePlate || '',
    vin: vehicle?.vin || '',
    mileage: vehicle?.mileage || 0,
  });

  const { addVehicle, updateVehicle } = useCustomerStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (vehicle) {
        await updateVehicle(customerId, { ...vehicle, ...formData });
        toast.success('Vehicle updated successfully');
      } else {
        await addVehicle(customerId, formData);
        toast.success('Vehicle added successfully');
      }
      onClose();
    } catch (error) {
      toast.error(vehicle ? 'Failed to update vehicle' : 'Failed to add vehicle');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {vehicle ? 'Edit Vehicle' : 'Add Vehicle'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Make *
            </label>
            <input
              type="text"
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model *
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Year *
            </label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              min="1900"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Mileage
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                className="block w-full pr-12 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">km</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              License Plate
            </label>
            <input
              type="text"
              value={formData.licensePlate}
              onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              VIN
            </label>
            <input
              type="text"
              value={formData.vin}
              onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}