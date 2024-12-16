import React from 'react';
import { Phone, Mail, MessageCircle, Calendar } from 'lucide-react';
import type { Customer } from '../../../types/customer';
import { CustomerAvatar } from './CustomerAvatar';
import { CustomerVehicles } from './CustomerVehicles';
import { format } from 'date-fns';

interface CustomerCardProps {
  customer: Customer;
  onClose: () => void;
}

export function CustomerCard({ customer, onClose }: CustomerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <CustomerAvatar customer={customer} size="lg" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {customer.firstName} {customer.lastName}
            </h3>
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.whatsappPhone && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MessageCircle className="h-4 w-4" />
                  <span>{customer.whatsappPhone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Change
        </button>
      </div>

      <div className="space-y-4">
        <CustomerVehicles vehicles={customer.vehicles} />

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Member since {format(new Date(customer.joinDate), 'MMM d, yyyy')}</span>
          </div>
          {customer.lastVisit && (
            <div className="mt-1 text-sm text-gray-500">
              Last visit: {format(new Date(customer.lastVisit), 'MMM d, yyyy')}
            </div>
          )}
        </div>

        {customer.notes && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {customer.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}