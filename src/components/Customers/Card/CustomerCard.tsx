import React, { useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import type { Customer, Vehicle, ServiceRecord } from '../../../types/customer';
import { CustomerHeader } from './CustomerHeader';
import { ContactInfo } from './ContactInfo';
import { VehicleList } from '../Vehicles/VehicleList';
import { ServiceHistory } from '../Services/ServiceHistory';
import { ExpandableCard } from './ExpandableCard';
import { VehicleForm } from '../Vehicles/VehicleForm';
import { ServiceForm } from '../Services/ServiceForm';

interface CustomerCardProps {
  customer: Customer;
  onEdit: () => void;
  onDelete: () => void;
}

export function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddService, setShowAddService] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const expandedContent = (
    <>
      {/* Vehicles Section */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium text-gray-900">
            Vehicles ({customer.vehicles.length})
          </h4>
          <button
            onClick={() => setShowAddVehicle(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Add Vehicle
          </button>
        </div>
        <VehicleList 
          vehicles={customer.vehicles}
          onEdit={setEditingVehicle}
        />
      </div>

      {/* Service History Section */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium text-gray-900">
            Service History
          </h4>
          <button
            onClick={() => setShowAddService(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Add Service
          </button>
        </div>
        <ServiceHistory 
          services={customer.serviceHistory}
          onEdit={setEditingService}
        />
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

      {/* Notes Section */}
      {customer.notes && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {customer.notes}
          </p>
        </div>
      )}
    </>
  );

  return (
    <>
      <ExpandableCard
        isExpanded={isExpanded}
        onClick={handleExpandClick}
        expandedContent={expandedContent}
      >
        <CustomerHeader
          firstName={customer.firstName}
          lastName={customer.lastName}
          profileImage={customer.profileImage}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <ContactInfo
          phone={customer.phone}
          email={customer.email}
          whatsappPhone={customer.whatsappPhone}
          preferredContact={customer.preferredContactMethod}
        />
      </ExpandableCard>

      {showAddVehicle && (
        <VehicleForm
          customerId={customer.id}
          onClose={() => setShowAddVehicle(false)}
        />
      )}

      {editingVehicle && (
        <VehicleForm
          customerId={customer.id}
          vehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
        />
      )}

      {showAddService && (
        <ServiceForm
          customerId={customer.id}
          onClose={() => setShowAddService(false)}
        />
      )}

      {editingService && (
        <ServiceForm
          customerId={customer.id}
          service={editingService}
          onClose={() => setEditingService(null)}
        />
      )}
    </>
  );
}