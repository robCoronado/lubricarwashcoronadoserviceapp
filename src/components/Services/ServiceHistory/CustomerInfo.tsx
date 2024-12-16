import React from 'react';
import { useCustomerStore } from '../../../store/useCustomerStore';
import { Phone, Mail } from 'lucide-react';

interface CustomerInfoProps {
  customerId: string;
}

export function CustomerInfo({ customerId }: CustomerInfoProps) {
  const { customers } = useCustomerStore();
  const customer = customers.find(c => c.id === customerId);
  
  if (!customer) return null;
  
  return (
    <div className="space-y-1">
      <div className="font-medium text-gray-900">
        {customer.firstName} {customer.lastName}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Phone className="h-3 w-3" />
        {customer.phone}
      </div>
      {customer.email && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail className="h-3 w-3" />
          {customer.email}
        </div>
      )}
    </div>
  );
}