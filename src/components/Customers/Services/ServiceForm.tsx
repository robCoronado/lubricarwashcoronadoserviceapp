import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCustomerStore } from '../../../store/useCustomerStore';
import toast from 'react-hot-toast';
import type { ServiceRecord } from '../../../types/customer';
import { localToUTC } from '../../../utils/dateUtils';

interface ServiceFormProps {
  customerId: string;
  service?: ServiceRecord;
  onClose: () => void;
}

export function ServiceForm({ customerId, service, onClose }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    type: service?.type || 'carwash',
    date: service?.date ? new Date(service.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    cost: service?.cost || 0,
    notes: service?.notes || '',
  });

  const { addServiceRecord, updateServiceRecord } = useCustomerStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const serviceData = {
        ...formData,
        date: localToUTC(new Date(formData.date)),
        cost: Number(formData.cost),
      };

      if (service) {
        await updateServiceRecord(customerId, { ...service, ...serviceData });
        toast.success('Service updated successfully');
      } else {
        await addServiceRecord(customerId, serviceData);
        toast.success('Service added successfully');
      }
      onClose();
    } catch (error) {
      toast.error(service ? 'Failed to update service' : 'Failed to add service');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {service ? 'Edit Service' : 'Add Service'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'carwash' | 'oil_change' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="carwash">Car Wash</option>
              <option value="oil_change">Oil Change</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date and Time *
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cost *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
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
              {service ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}