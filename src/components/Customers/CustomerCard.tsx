import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Calendar,
  Car,
  Wrench,
  Star,
  Edit2,
  Trash2,
  Plus,
} from 'lucide-react';
import type { Customer, Vehicle, ServiceRecord } from '../../types/customer';
import { useCustomerStore } from '../../store/useCustomerStore';
import toast from 'react-hot-toast';

interface CustomerCardProps {
  customer: Customer;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);
  const { addVehicle, updateVehicle, addServiceRecord, updateServiceRecord } = useCustomerStore();

  const handleAddVehicle = async (vehicle: Omit<Vehicle, 'id'>) => {
    try {
      await addVehicle(customer.id, vehicle);
      toast.success('Vehicle added successfully');
    } catch (error) {
      toast.error('Failed to add vehicle');
    }
  };

  const handleUpdateVehicle = async (vehicle: Vehicle) => {
    try {
      await updateVehicle(customer.id, vehicle);
      setEditingVehicle(null);
      toast.success('Vehicle updated successfully');
    } catch (error) {
      toast.error('Failed to update vehicle');
    }
  };

  const handleAddService = async (service: Omit<ServiceRecord, 'id'>) => {
    try {
      await addServiceRecord(customer.id, service);
      toast.success('Service record added successfully');
    } catch (error) {
      toast.error('Failed to add service record');
    }
  };

  const handleUpdateService = async (service: ServiceRecord) => {
    try {
      await updateServiceRecord(customer.id, service);
      setEditingService(null);
      toast.success('Service record updated successfully');
    } catch (error) {
      toast.error('Failed to update service record');
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
        isExpanded ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
      }`}
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {customer.profileImage ? (
                <img
                  src={customer.profileImage}
                  alt={`${customer.firstName} ${customer.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {customer.firstName} {customer.lastName}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <Phone className="h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 text-gray-400 hover:text-blue-500"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-4 flex flex-wrap gap-4">
          {customer.email && (
            <div className="flex items-center gap-2 text-sm text-gray-500 max-w-[250px]">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate" title={customer.email}>
                {customer.email}
              </span>
            </div>
          )}

          {customer.whatsappPhone && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MessageCircle className="h-4 w-4" />
              <span>{customer.whatsappPhone}</span>
            </div>
          )}
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 space-y-6"
            >
              {/* Vehicles */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Vehicles ({customer.vehicles.length})
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddVehicle({
                        make: '',
                        model: '',
                        year: new Date().getFullYear(),
                        type: '',
                        serviceHistory: []
                      });
                    }}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-4 w-4" />
                    Add Vehicle
                  </button>
                </div>

                <div className="space-y-3">
                  {customer.vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="bg-gray-50 rounded-lg p-3"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </p>
                          {vehicle.licensePlate && (
                            <p className="text-sm text-gray-500 mt-1">
                              License: {vehicle.licensePlate}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingVehicle(vehicle);
                          }}
                          className="text-gray-400 hover:text-blue-500"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service History */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Service History
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddService({
                        type: 'carwash',
                        date: new Date().toISOString(),
                        cost: 0,
                      });
                    }}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-4 w-4" />
                    Add Service
                  </button>
                </div>

                <div className="space-y-3">
                  {customer.serviceHistory.map((service) => (
                    <div
                      key={service.id}
                      className="bg-gray-50 rounded-lg p-3"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {service.type === 'carwash' ? 'Car Wash' : 'Oil Change'}
                          </p>
                          {service.notes && (
                            <p className="text-sm text-gray-500 mt-1">{service.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${service.cost.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(service.date), 'PP')}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingService(service);
                            }}
                            className="mt-1 text-gray-400 hover:text-blue-500"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-t pt-4 text-sm text-gray-600">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Member since:</span>
                    <span className="ml-2">
                      {format(new Date(customer.joinDate), 'PP')}
                    </span>
                  </div>
                  {customer.lastVisit && (
                    <div>
                      <span className="font-medium">Last visit:</span>
                      <span className="ml-2">
                        {format(new Date(customer.lastVisit), 'PP')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {customer.notes && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {customer.notes}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Forms */}
      {editingVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Edit Vehicle</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateVehicle(editingVehicle);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Make</label>
                <input
                  type="text"
                  value={editingVehicle.make}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, make: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <input
                  type="text"
                  value={editingVehicle.model}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  value={editingVehicle.year}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, year: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Edit Service Record</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateService(editingService);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={editingService.type}
                  onChange={(e) => setEditingService({ ...editingService, type: e.target.value as 'carwash' | 'oil_change' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="carwash">Car Wash</option>
                  <option value="oil_change">Oil Change</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cost</label>
                <input
                  type="number"
                  value={editingService.cost}
                  onChange={(e) => setEditingService({ ...editingService, cost: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={editingService.notes || ''}
                  onChange={(e) => setEditingService({ ...editingService, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}