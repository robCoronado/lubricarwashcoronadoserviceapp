import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search, Filter } from 'lucide-react';
import { useServiceStore } from '../../../store/useServiceStore';
import { useCustomerStore } from '../../../store/useCustomerStore';
import { formatReceiptNumber } from '../../../utils/receipt';
import { CustomerInfo } from './CustomerInfo';
import { ServiceDetails } from './ServiceDetails';

export default function ServiceHistoryList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { services, categories } = useServiceStore();
  const { customers } = useCustomerStore();

  const filteredServices = services.filter(service => {
    if (searchQuery.length < 2) return true;

    const searchLower = searchQuery.toLowerCase();
    const matchesTitle = service.title.toLowerCase().includes(searchLower);
    const matchesType = service.type.toLowerCase().includes(searchLower);
    
    if (matchesTitle || matchesType) return true;

    // Search by customer name
    if (service.customerId) {
      const customer = customers.find(c => c.id === service.customerId);
      if (customer) {
        const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
        if (fullName.includes(searchLower)) return true;
      }
    }

    // Search by receipt number
    if (service.receiptNumber && 
        formatReceiptNumber(service.receiptNumber).toLowerCase().includes(searchLower)) {
      return true;
    }

    return false;
  }).filter(service => 
    selectedCategory === 'all' || service.categoryId === selectedCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by service, customer, or receipt number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt #
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <ServiceDetails service={service} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.customerId && (
                      <CustomerInfo customerId={service.customerId} />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.receiptNumber && formatReceiptNumber(service.receiptNumber)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    ${service.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.date ? format(new Date(service.date), 'MM/dd/yyyy HH:mm') : 'No Date'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No services found matching your search criteria
        </div>
      )}
    </div>
  );
}