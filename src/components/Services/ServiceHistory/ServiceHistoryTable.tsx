import React from 'react';
import { format } from 'date-fns';
import { Package, Wrench, User, Receipt } from 'lucide-react';
import type { Service } from '../../../types/service';
import { useCustomerStore } from '../../../store/useCustomerStore';
import { formatReceiptNumber } from '../../../utils/receipt';

interface ServiceHistoryTableProps {
  services: Service[];
}

export function ServiceHistoryTable({ services }: ServiceHistoryTableProps) {
  const { customers } = useCustomerStore();

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return 'N/A';
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'N/A';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Receipt #
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service) => (
            <tr key={service.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {service.date ? format(new Date(service.date), 'MM/dd/yyyy HH:mm') : 'N/A'}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {getCustomerName(service.customerId)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {service.categoryId === '1' ? (
                    <Wrench className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Package className="h-4 w-4 text-purple-500" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {service.title}
                    </div>
                    {service.description && (
                      <div className="text-sm text-gray-500">
                        {service.description}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {service.receiptNumber ? formatReceiptNumber(service.receiptNumber) : 'N/A'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="text-sm font-medium text-gray-900">
                  ${service.price.toFixed(2)}
                </span>
                {service.addons.length > 0 && (
                  <div className="text-xs text-gray-500">
                    + ${service.addons
                      .filter(addon => !addon.isIncluded)
                      .reduce((sum, addon) => sum + addon.price, 0)
                      .toFixed(2)} in add-ons
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}